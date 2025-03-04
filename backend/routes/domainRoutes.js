const express = require("express");
const OpenAI = require("openai");
const { getDomainDetails } = require("../utils/domainAPIService");

const router = express.Router();
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

const generateNames = async (
  description,
  keywords,
  numberOfSuggestions = 10
) => {
  const prompt = `Generate ${numberOfSuggestions} simple, short, creative, catchy and unique domain name suggestions for the following project:
    Project Description: ${description}.
    Keywords: ${keywords.join(", ")}.
    Dont add any extension to the domain name.
    Ensure the domain names align with a modern, professional, and memorable branding style. 
    Provide suggestions as a clean list with no numbering or additional formatting.
    `;

  try {
    // const response = await openai.chat.completions.create({
    //   model: "gpt-4", // or 'gpt-4' if you have access
    //   messages: [{ role: "user", content: prompt }],
    //   temperature: 0.7, // Adjust for more/less creativity
    //   max_tokens: 200, // Should be enough tokens for ~10 suggestions
    // });

    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "deepseek-chat",
    });

    const rawResponse = response.choices[0].message.content.trim();

    // Parse the response into an array of names
    const suggestions = rawResponse
      .split("\n") // Split by lines
      .map((line) => line.replace(/^\d+\.\s*/, "").trim()) // Remove numbering
      .map((name) => name.replace(/^"|"$|'/g, "")) // Remove extra quotes
      .filter((name) => name.length > 0); // Remove empty lines

    return suggestions;
  } catch (error) {
    console.error("Error generating domain names:", error);
    return null;
  }
};

router.post("/generate-names", async (req, res) => {
  const { description, keywords } = req.body;

  if (!description || !keywords) {
    return res.status(400).json({
      error: "Please provide project description and keywords.",
    });
  }

  try {
    const names = await generateNames(description, keywords);
    // console.log("Domain suggestions...", names);
    res.json({ names });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to generate names. Try again later." });
  }
});

router.post("/check-availability", async (req, res) => {
  const { domains } = req?.body;

  if (!domains || !Array.isArray(domains) || domains.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide an array of domains." });
  }

  try {
    const domainList = domains.map((name) =>
      name.toLowerCase().replace(/ /g, "")
    ); // Create a comma-separated string of domain domains

    // Call Namecheap API once with the domain list
    const response = await getDomainDetails(domainList);

    const groupedResults = {};

    response?.map((result) => {
      const [baseName, extension] = result.domain.split(".");

      if (!groupedResults[baseName]) {
        groupedResults[baseName] = {};
      }

      groupedResults[baseName][extension] = {
        available: result.available,
        registrationPrice: result.registrationPrice,
        currency: result.currency || "$",
      };
    });

    res.json({ availability: groupedResults });
  } catch (error) {
    console.error("Error in domain checking availability:", error.message);
    res.status(500).json({ error: "Failed to check domain availability" });
  }
});

module.exports = router;

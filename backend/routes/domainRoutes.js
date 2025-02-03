const express = require("express");
const OpenAI = require("openai");
const { getDomainDetails } = require("../utils/domainAPIService");

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or 'gpt-4' if you have access
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7, // Adjust for more/less creativity
      max_tokens: 200, // Should be enough tokens for ~10 suggestions
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

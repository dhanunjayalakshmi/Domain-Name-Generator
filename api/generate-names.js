const OpenAI = require("openai");
const rateLimit = require("./utils/rateLimiter");

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY,
});

async function generateNames(description, keywords, numberOfSuggestions = 10) {
  const prompt = `Generate ${numberOfSuggestions} simple, short, creative, catchy and unique domain name suggestions for the following project:
    Project Description: ${description}.
    Keywords: ${keywords.join(", ")}.
    Dont add any extension to the domain name.
    Ensure the domain names align with fresh, modern, professional, and memorable branding style. 
    Provide suggestions as a clean list with no numbering or additional formatting.`;

  try {
    const response = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "deepseek-chat",
    });

    const rawResponse = response.choices[0].message.content.trim();
    return rawResponse
      .split("\n")
      .map((line) => line.trim())
      .filter((name) => name.length > 0);
  } catch (error) {
    console.error("Error generating domain names:", error);
    throw error;
  }
}

module.exports = async (req, res) => {
  const limitStatus = rateLimit(req);

  if (!limitStatus.ok) {
    return res.status(429).send(limitStatus.message);
  }

  const { description, keywords } = req.body;
  if (!description || !keywords) {
    return res
      .status(400)
      .json({ error: "Please provide project description and keywords." });
  }

  try {
    const names = await generateNames(description, keywords);
    res.json({ names });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to generate names. Try again later." });
  }
};

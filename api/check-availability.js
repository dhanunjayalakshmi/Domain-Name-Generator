const { getDomainDetails } = require("./utils/domainAPIService"); // Adjust path as necessary

module.exports = async (req, res) => {
  const { domains } = req.body;
  if (!domains || !Array.isArray(domains) || domains.length === 0) {
    return res
      .status(400)
      .json({ error: "Please provide an array of domains." });
  }

  try {
    const domainList = domains.map((name) =>
      name.toLowerCase().replace(/ /g, "")
    );
    const response = await getDomainDetails(domainList);
    const groupedResults = {};

    response.forEach((result) => {
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
};

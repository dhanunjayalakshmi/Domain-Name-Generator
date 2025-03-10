const axios = require("axios");
const xml2js = require("xml2js");
const fs = require("fs");
const parser = new xml2js.Parser();

const API_KEY = process.env.NAMECHEAP_API_KEY;
const IP_ADDRESS = process.env.CLIENT_IP_ADDRESS;
const USERNAME = process.env.NAMECHEAP_USERNAME;
const NAMECHEAP_API_URL = process.env.NAMECHEAP_API_URL;
const CACHE_FILE = "pricingCache.json";

const extensions = [".com", ".net", ".ai", ".io", ".tech"];

const generateFullDomainNames = (domainList) => {
  let fullDomainList = [];

  domainList.forEach((base) => {
    extensions.forEach((ext) => {
      fullDomainList.push(`${base.toLowerCase()}${ext}`);
    });
  });

  return fullDomainList.join(",");
};

const checkDomainAvailability = async (domainList) => {
  try {
    const response = await axios.get(NAMECHEAP_API_URL, {
      params: {
        ApiUser: USERNAME,
        ApiKey: API_KEY,
        UserName: USERNAME,
        Command: "namecheap.domains.check",
        ClientIp: IP_ADDRESS,
        DomainList: domainList,
      },
    });

    const result = await parser.parseStringPromise(response?.data);

    const domainCheckResults =
      result?.ApiResponse?.CommandResponse[0]?.DomainCheckResult;

    const processedResults = domainCheckResults?.map((domain) => ({
      domain: domain.$.Domain,
      available: domain.$.Available === "true",
      isPremium: domain.$.IsPremiumName === "true",
      premiumPrice: domain.$.PremiumRegistrationPrice || null,
      registrationPrice: domain.$.Price || null,
      currency: domain.$.Currency || null,
    }));

    return processedResults;
  } catch (error) {
    console.error("Error checking domain availability:", error?.message);
  }
};

const readCachedPricingData = () => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      console.log("Loading pricing data from cache...");
      return JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8"));
    } else {
      console.log("No cached pricing data found.");
      return null;
    }
  } catch (error) {
    console.error("Error reading cached pricing data:", error.message);
    return null;
  }
};

// Fetch pricing data from Namecheap API
const fetchPricingDataFromAPI = async () => {
  try {
    console.log("Fetching pricing data from Namecheap API...");
    const response = await axios.get(NAMECHEAP_API_URL, {
      params: {
        ApiUser: USERNAME,
        ApiKey: API_KEY,
        UserName: USERNAME,
        Command: "namecheap.users.getPricing",
        ClientIp: IP_ADDRESS,
        ProductType: "DOMAIN",
        ProductCategory: "register",
      },
    });

    // Parse XML response
    const result = await parser.parseStringPromise(response.data);

    // Extract pricing information
    const pricingResults =
      result.ApiResponse.CommandResponse[0].UserGetPricingResult[0]
        .ProductType[0].ProductCategory[0].Product;

    // Map relevant pricing data for each TLD
    const pricingData = pricingResults.map((product) => {
      const tld = product.$.Name.toLowerCase();
      const prices = product.Price[0];

      const priceDetails = parsePriceDetails(prices);

      return {
        tld,
        registrationPrice: priceDetails.price,
        additionalCost: priceDetails.additionalCost,
        totalPrice: priceDetails.totalPrice,
        promotionPrice: priceDetails.promotionPrice,
        duration: priceDetails.duration,
        currency: priceDetails.currency,
      };
    });

    return pricingData;
  } catch (error) {
    console.error("Error fetching pricing data:", error.message);
    throw error;
  }
};

// Save pricing data to cache
const cachePricingData = async (pricingData) => {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(pricingData, null, 2), "utf-8");
    console.log("Pricing data cached successfully.");
  } catch (error) {
    console.error("Error caching pricing data:", error.message);
  }
};

const getDomainDetails = async (domainList) => {
  const fullDomainList = generateFullDomainNames(domainList);

  try {
    const availability = await checkDomainAvailability(fullDomainList);

    // Fetch pricing data from cache or API
    let pricingData = readCachedPricingData();
    if (!pricingData) {
      pricingData = await fetchPricingDataFromAPI();
      await cachePricingData(pricingData);
    }

    const domainAvailabilityResults = availability?.map((availableDomain) => {
      const tld = availableDomain?.domain.split(".").pop().toLowerCase();
      const tldPricing = pricingData.find((item) => item.tld === tld);

      return {
        domain: availableDomain?.domain,
        available: availableDomain?.available,
        isPremium: availableDomain?.isPremium,
        registrationPrice: availableDomain?.isPremium
          ? availableDomain?.premiumPrice
          : tldPricing?.registrationPrice || "N/A",
        renewalPrice: tldPricing?.renewalPrice || "N/A",
        currency: tldPricing?.currency,
      };
    });

    return domainAvailabilityResults;
  } catch (error) {
    console.error("Error fetching domain details:", error?.message);
  }
};

module.exports = { getDomainDetails };

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

const getDomainDetails = async (domainList) => {
  const fullDomainList = generateFullDomainNames(domainList);
  try {
    const availability = await checkDomainAvailability(fullDomainList);

    const domainAvailabilityResults = availability?.map((availableDomain) => {
      // Combine domain availability with pricing details
      return {
        domain: availableDomain?.domain,
        available: availableDomain?.available,
        isPremium: availableDomain?.isPremium,
        registrationPrice: availableDomain?.isPremium
          ? availableDomain?.premiumPrice
          : availableDomain?.registrationPrice || "N/A",
        renewalPrice: availableDomain?.renewalPrice || "N/A",
        currency: availableDomain?.currency,
      };
    });

    return domainAvailabilityResults;
  } catch (error) {
    console.error("Error fetching domain details:", error?.message);
  }
};

module.exports = { getDomainDetails };

const RATE_LIMIT = 15; // Max number of requests per hour
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds

let visitors = {}; // This will reset when the function cold starts

function rateLimit(req) {
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const currentTime = Date.now();
  const visitorData = visitors[ip];

  if (visitorData) {
    const { lastRequestTime, requestCount } = visitorData;
    if (currentTime - lastRequestTime < RATE_LIMIT_WINDOW) {
      if (requestCount > RATE_LIMIT) {
        return {
          ok: false,
          message: "Too many requests. Please try again later.",
        };
      }
      visitors[ip] = {
        lastRequestTime: currentTime,
        requestCount: requestCount + 1,
      };
    } else {
      // Reset count after 1 hour has passed
      visitors[ip] = {
        lastRequestTime: currentTime,
        requestCount: 1,
      };
    }
  } else {
    // New visitor
    visitors[ip] = {
      lastRequestTime: currentTime,
      requestCount: 1,
    };
  }

  return { ok: true };
}

module.exports = rateLimit;

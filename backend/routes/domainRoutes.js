const express = require("express");
const router = express.Router();
const generateNamesAPI = require("../../api/generate-names");
const checkAvailabilityAPI = require("../../api/check-availability");
// const rateLimiter = require("../../api/utils/rateLimiter");

router.post("/generate-names", (req, res) => {
  generateNamesAPI(req, res);
});

router.post("/check-availability", (req, res) => {
  checkAvailabilityAPI(req, res);
});

module.exports = router;

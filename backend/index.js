const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const domainRoutes = require("./routes/domainRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message: "Too many requests from this IP, please try again after an hour",
});

app.use(limiter);

// Domain routes
app.use("/", domainRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

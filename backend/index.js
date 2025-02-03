const express = require("express");
const cors = require("cors");
require("dotenv").config();

const domainRoutes = require("./routes/domainRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Domain routes
app.use("/", domainRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

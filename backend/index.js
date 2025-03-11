const express = require("express");
const cors = require("cors");
require("dotenv").config();

const domainRoutes = require("./routes/domainRoutes");

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(
    `API Request - ${req.method} ${req.path} from IP: ${
      req.ip
    } at ${new Date().toISOString()}`
  );
  next();
});

// Domain routes
app.use("/", domainRoutes);

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

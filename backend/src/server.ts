const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    name: "ProMark API",
    status: "running",
  });
});

app.listen(PORT, () => {
  console.log(`ProMark API running on http://localhost:${PORT}`);
});
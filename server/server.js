require("dotenv").config();

const express = require("express");
const BINANCE_REST_BASE =
  process.env.BINANCE_REST_BASE || "https://data-api.binance.vision/api/v3";

const app = require("./app");
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Using Binance base: ${BINANCE_REST_BASE}`);
});

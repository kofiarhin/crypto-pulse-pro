const express = require("express");
const { getMarkets } = require("../controllers/marketController");

const buildMarketRoutes = () => {
  const router = express.Router();

  router.get("/", getMarkets);

  return router;
};

module.exports = {
  buildMarketRoutes,
};

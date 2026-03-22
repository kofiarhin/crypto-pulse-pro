const express = require("express");
const {
  getPreferences,
  updatePreferences,
} = require("../controllers/userController");
const { requireAuth } = require("../middleware/requireAuth");

const buildUserRoutes = (env) => {
  const router = express.Router();

  router.use(requireAuth(env));

  router.get("/preferences", getPreferences);
  router.patch("/preferences", updatePreferences);

  return router;
};

module.exports = {
  buildUserRoutes,
};

const express = require("express");
const {
  register,
  login,
  logout,
  refresh,
  me,
} = require("../controllers/authController");
const { requireAuth } = require("../middleware/requireAuth");

const buildAuthRoutes = (env) => {
  const router = express.Router();

  router.post("/register", register(env));
  router.post("/login", login(env));
  router.post("/logout", logout(env));
  router.post("/refresh", refresh(env));
  router.get("/me", requireAuth(env), me());

  return router;
};

module.exports = {
  buildAuthRoutes,
};

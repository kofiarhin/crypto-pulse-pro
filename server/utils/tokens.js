const jwt = require("jsonwebtoken");

const createAccessToken = ({ userId, env }) =>
  jwt.sign({ sub: userId, type: "access" }, env.jwtAccessSecret, {
    expiresIn: env.accessTokenExpiresIn,
  });

const createRefreshToken = ({ userId, env }) =>
  jwt.sign({ sub: userId, type: "refresh" }, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  });

const verifyAccessToken = ({ token, env }) =>
  jwt.verify(token, env.jwtAccessSecret, {
    algorithms: ["HS256"],
  });

const verifyRefreshToken = ({ token, env }) =>
  jwt.verify(token, env.jwtRefreshSecret, {
    algorithms: ["HS256"],
  });

const refreshCookieOptions = (env) => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: "/",
});

const setRefreshCookie = ({ res, token, env }) => {
  res.cookie(env.refreshCookieName, token, refreshCookieOptions(env));
};

const clearRefreshCookie = ({ res, env }) => {
  res.clearCookie(env.refreshCookieName, refreshCookieOptions(env));
};

module.exports = {
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshCookie,
  clearRefreshCookie,
};

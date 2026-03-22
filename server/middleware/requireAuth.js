const { verifyAccessToken } = require("../utils/tokens");

const requireAuth = (env) => (req, _res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return next({ status: 401, message: "Authentication required." });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (!token) {
    return next({ status: 401, message: "Authentication required." });
  }

  try {
    const payload = verifyAccessToken({ token, env });
    req.auth = { userId: payload.sub };
    return next();
  } catch (_error) {
    return next({ status: 401, message: "Invalid or expired access token." });
  }
};

module.exports = {
  requireAuth,
};

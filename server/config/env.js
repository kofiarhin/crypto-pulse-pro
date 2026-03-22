const requiredEnvVars = [
  "PORT",
  "NODE_ENV",
  "MONGODB_URI",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
  "CLIENT_URL",
];

const getEnvConfig = () => {
  const missing = requiredEnvVars.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return {
    port: Number(process.env.PORT) || 5000,
    nodeEnv: process.env.NODE_ENV,
    mongodbUri: process.env.MONGODB_URI,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    clientUrl: process.env.CLIENT_URL,
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    refreshCookieName: "cpp_refresh_token",
  };
};

module.exports = {
  getEnvConfig,
};

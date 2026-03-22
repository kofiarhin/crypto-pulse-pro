require("dotenv").config();

const { getEnvConfig } = require("./config/env");
const { connectDb } = require("./config/db");
const { createApp } = require("./app");

const startServer = async () => {
  const env = getEnvConfig();
  await connectDb(env.mongodbUri);

  const app = createApp(env);

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error("Fatal startup error", error);
  process.exit(1);
});

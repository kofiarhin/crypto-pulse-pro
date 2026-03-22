const mongoose = require("mongoose");

// coonnect to databasse
const connectDb = async (mongodbUri) => {
  try {
    await mongoose.connect(mongodbUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    throw error;
  }
};

module.exports = {
  connectDb,
};

// config/db.js
const mongoose = require("mongoose");

/**
 * Chooses which MongoDB URI to use based on USE_LOCAL_DB.
 * USE_LOCAL_DB = "true"  -> LOCAL_MONGO_URI
 * USE_LOCAL_DB = "false" -> ATLAS_MONGO_URI
 */
function pickMongoUri() {
  const useLocal = String(process.env.USE_LOCAL_DB).toLowerCase() === "true";
  const local = process.env.LOCAL_MONGO_URI;
  const atlas = process.env.ATLAS_MONGO_URI;

  if (useLocal) {
    if (!local) {
      throw new Error("LOCAL_MONGO_URI is not defined in .env");
    }
    return { uri: local, label: "LOCAL" };
  } else {
    if (!atlas) {
      throw new Error("ATLAS_MONGO_URI is not defined in .env");
    }
    return { uri: atlas, label: "ATLAS" };
  }
}

/**
 * Connects to MongoDB using Mongoose 8+.
 * Throws on failure so caller can handle startup errors.
 */
async function connectDB() {
  const { uri, label } = pickMongoUri();

  const options = {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10_000,
  };

  try {
    await mongoose.connect(uri, options);
    console.log(`✅ MongoDB connected (${label})`);
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err?.message || err);
    throw err;
  }
}

module.exports = { connectDB };

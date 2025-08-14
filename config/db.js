// config/db.js
const mongoose = require("mongoose");

// Optional verbose logs when DEBUG_DB=true
const DEBUG = String(process.env.DEBUG_DB || "").toLowerCase() === "true";

/** Safely redact secrets in logs */
function redact(uri) {
	if (!uri) return "";
	try {
		// Hide credentials between '//' and '@'
		return uri.replace(/\/\/.*?@/, "//***:***@");
	} catch {
		return "***";
	}
}

/**
 * Decide which MongoDB URI to use based on env flags.
 * USE_LOCAL_DB = "true" -> LOCAL_MONGO_URI
 * else                  -> ATLAS_MONGO_URI
 */
function pickMongoUri() {
	const useLocal = String(process.env.USE_LOCAL_DB).toLowerCase() === "true";
	const local = process.env.LOCAL_MONGO_URI;

	// Aceita aliases comuns no PaaS
	const atlas =
		process.env.ATLAS_MONGO_URI ||
		process.env.MONGO_URL ||
		process.env.MONGODB_URI ||
		process.env.DATABASE_URL;

	if (useLocal) {
		if (!local) {
			const found = Object.keys(process.env).filter((k) => /MONGO/i.test(k));
			throw new Error(`LOCAL_MONGO_URI is not defined. Found: ${found.join(", ") || "none"}`);
		}
		return { uri: local, label: "LOCAL" };
	}

	if (!atlas) {
		const found = Object.keys(process.env).filter((k) => /MONGO/i.test(k));
		throw new Error(`ATLAS_MONGO_URI is not defined. Found: ${found.join(", ") || "none"}`);
	}
	return { uri: atlas, label: "ATLAS" };
}

async function connectDB() {
	const { uri, label } = pickMongoUri();

	if (!uri || typeof uri !== "string") {
		throw new Error(`Resolved Mongo URI is invalid: ${String(uri)}`);
	}


	if (DEBUG) {
		console.log("🔎 DEBUG_DB=on");
		console.log("🔎 NODE_ENV:", process.env.NODE_ENV);
		console.log("🔎 USE_LOCAL_DB:", process.env.USE_LOCAL_DB);
		console.log("🔎 Picked DB:", label);
		console.log("🔎 URI (redacted):", redact(uri));
	}

	// You can enable Mongoose command-level logs by setting DEBUG_DB=trace
	if (String(process.env.DEBUG_DB).toLowerCase() === "trace") {
		mongoose.set("debug", true);
	}

	const options = {
		maxPoolSize: 10,
		serverSelectionTimeoutMS: 10000, // fail fast if cannot reach cluster
		// If your PaaS prefers IPv4 first (some DNS setups), set: NODE_OPTIONS=--dns-result-order=ipv4first
	};

	// Attach listeners for extra visibility
	mongoose.connection.on("connected", () => {
		console.log(`✅ Mongoose connected (${label})`);
	});
	mongoose.connection.on("error", (err) => {
		console.error("❌ Mongoose connection error:", err?.message || err);
	});
	mongoose.connection.on("disconnected", () => {
		console.warn("⚠️  Mongoose disconnected");
	});

	try {
		await mongoose.connect(uri, options);
		return mongoose.connection;
	} catch (err) {
		console.error("❌ Failed initial connect():", err?.message || err);
		throw err;
	}
}

module.exports = { connectDB };

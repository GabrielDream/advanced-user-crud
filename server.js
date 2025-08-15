// Main server script
require("dotenv").config();

// Default imports:
const path = require("path");
const express = require("express");
const cors = require("cors");

// ✅ Unified DB connector (decides local vs Atlas via .env)
const { connectDB } = require("./config/db");

const app = express();

// Middlewares & utilities
const successHandler = require("./middlewares/successHandler");
const errorHandler = require("./middlewares/errorHandler");
const { logInfo, logError, logBanner } = require("./utils/logger");
const { delay, beep, animateBox } = require("./utils/spyConsole");

// Routes
const userRoutes = require("./routes/userRoutes");
const emailCheckRoutes = require("./routes/emailCheckRoutes");

// App config
const PORT = process.env.PORT || 3051;

// Global middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(successHandler); // adds res.success()

// Mount routes under the same /api prefix
app.use("/api", userRoutes);
app.use("/api", emailCheckRoutes);

// Error middleware must be last
app.use(errorHandler);

// Catch unhandled promise rejections
process.on("unhandledRejection", (err) => {
	logError("❌ Unhandled Rejection detected:");
	console.error(err);
	process.exit(1);
});

// DB connection and server bootstrap
(async () => {
	try {
		await connectDB();
		logInfo("✅ Connected to MongoDB");
		await beep();

		await delay(300);
		await beep("🔍 Verifying systems...");
		await delay(600);
		logInfo("Database verified!");

		await delay(600);
		await beep("💾 Initializing auth modules...");
		await delay(600);
		logInfo("Modules ready.");

		await delay(500);
		await beep("🛡️  Security protocols enabled.");
		await delay(600);
		logInfo("Realtime monitoring enabled.");

		// Keep console clear only when running locally
		if (!process.env.RENDER_EXTERNAL_URL) {
			await delay(800);
			console.clear();
		}

		const banner = `
╔══════════════════════════════════════════════╗
║  🕵️  NEUROCODING PROJECT - ACTIVE AND OPERANT
╠══════════════════════════════════════════════╣
║  📡 PORT: ${PORT}
║  🌐 API Base: http://localhost:${PORT}/api
║  ✅ Status: Operational and monitored
╚══════════════════════════════════════════════╝
    `;
		await animateBox(banner, 150);
		logBanner("NEUROCODING ONLINE");

		app.listen(PORT, () => {
			logInfo(`🚀 Server running on http://localhost:${PORT}`);
		});
	} catch (err) {
		logError("❌ Failed to connect to MongoDB on startup!");
		console.error(err);
		process.exit(1);
	}
})();

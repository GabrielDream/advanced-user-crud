// Main server script
require('dotenv').config();

// Default imports
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares & utilities
const successHandler = require('./middlewares/successHandler');
const errorHandler = require('./middlewares/errorHandler');
const { logInfo, logError, logBanner } = require('./utils/logger');
const { delay, beep, animateBox } = require('./utils/spyConsole');

// Routes
const userRoutes = require('./routes/userRoutes');
const emailCheckRoutes = require('./routes/emailCheckRoutes');

// ---------- App config ----------
const PORT = process.env.PORT || 3051;
const { MONGO_URL } = process.env;


const PUBLIC_URL = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
const API_BASE = `${PUBLIC_URL}/api`;

// Confia no proxy (útil em plataformas PaaS)
app.set('trust proxy', 1);

// ---------- Global middlewares ----------
const corsOrigin = process.env.CORS_ORIGIN || process.env.RENDER_EXTERNAL_URL || '*';
app.use(cors({ origin: corsOrigin }));

app.use(express.json());

// Servir frontend estático (pasta /public)
app.use(express.static('public'));

// Sucesso custom middleware (adiciona res.success)
app.use(successHandler);

// ---------- Healthcheck ----------
app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    env: process.env.NODE_ENV || 'development',
    publicUrl: PUBLIC_URL,
    apiBase: API_BASE,
    time: new Date().toISOString(),
  });
});

// ---------- API routes ----------
app.use('/api', userRoutes);
app.use('/api', emailCheckRoutes);

// Error middleware por último
app.use(errorHandler);

// Unhandled rejections -> loga e encerra
process.on('unhandledRejection', (err) => {
  logError('❌ Unhandled Rejection detected:');
  console.error(err);
  process.exit(1);
});

// ---------- DB connection & bootstrap ----------
mongoose.set('strictQuery', false);

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    logInfo('✅ Connected to MongoDB');
    await beep();

    // Pequena “animação” (mantida) — mas sem limpar logs no Render
    await delay(300);
    await beep('🔍 Verifying systems...');
    await delay(600);
    logInfo('Database verified!');

    await delay(600);
    await beep('💾 Initializing auth modules...');
    await delay(600);
    logInfo('Modules ready.');

    await delay(500);
    await beep('🛡️  Security protocols enabled.');
    await delay(600);
    logInfo('Realtime monitoring enabled.');

    // Evita sumir com logs no Render
    if (!process.env.RENDER_EXTERNAL_URL) {
      console.clear();
    }

    const banner = `
╔══════════════════════════════════════════════════════════╗
║  🕵️  NEUROCODING PROJECT - ACTIVE AND OPERANT
╠══════════════════════════════════════════════════════════╣
║  📡 PORT: ${PORT}
║  🌐 PUBLIC URL: ${PUBLIC_URL}
║  🌐 API Base: ${API_BASE}
║  ✅ Status: Operational and monitored
╚══════════════════════════════════════════════════════════╝
`;
    await animateBox(banner, 150);
    logBanner('NEUROCODING ONLINE');

    app.listen(PORT, () => {
      logInfo(`🚀 Server running at ${PUBLIC_URL}`);
    });
  })
  .catch((err) => {
    logError('❌ Failed to connect to MongoDB!');
    console.error(err);
  });

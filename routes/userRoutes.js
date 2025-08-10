const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

// Importations:
const User = require('../model/User');
const {
	logInfo,
	logWarn,
	logError,
	logDebug,
	logSuccess,
	logData,
	logTimeStamp
} = require('../utils/logger');
const sanitizeFunction = require('../utils/sanitize');
const AppError = require('../middlewares/AppError');

// -------------------------
// REGISTER USER
// -------------------------

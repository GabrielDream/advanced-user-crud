const express = require('express');

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
const AppError = require('../middlewares/AppError');

// -------------------------
// CHECK EMAIL
// -------------------------
router.get('/checkEmail/:email', async (req, res, next) => {
  try {
    // Normalize incoming param: ensure string, trim spaces, lower case
    const raw = req.params.email || '';
    const email = String(raw).trim().toLowerCase();

    logDebug(`🔍--CHECKING EMAIL ${email}`);

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      logError('❌ EMAIL IS INVALID!');
      throw new AppError(
        'EMAIL IS INVALID!',
        400,
        'email',
        'ERR_INVALID_EMAIL'
      );
    }

    const exists = await User.findOne({ email });

    if (exists) {
      logWarn(`🚫 IN USE: ${email}`);
    } else {
      logSuccess(`✅ AVAILABLE: ${email}`);
    }

    // Uniform success payload for the frontend
    return res.success({
      success: true,
      message: `${email} checked successfully.`,
      data: {
        exists: Boolean(exists)
      }
    });
  } catch (err) {
    logWarn('❌ Error to check Email!');
    logError(err);

    //preserves already thrown AppError (e.g. 400)
    if (err instanceof AppError) return next(err);

    //Encapsulate only unknown errors in 500
    return next(
      new AppError(
        'ERROR TO CHECK EMAIL!',
        500,
        'EMAIL',
        'ERR_EMAIL_CHECK_FAILED',
        err
      )
    );
  }
});

module.exports = router;

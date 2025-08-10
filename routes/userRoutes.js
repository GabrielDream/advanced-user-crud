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
router.post('/register', async (req, res, next) => {
	try {
		const sanitizedBody = sanitizeFunction(req.body);

		let {
			name, age, email, password
		} = sanitizedBody;
		email = String(email || '').trim().toLowerCase();
		sanitizedBody.email = email;

		logDebug('📥 REGISTER REQUEST BODY: ', sanitizedBody);
		if (!name || !age || !email || !password) {
			logWarn('ALL FIELDS ARE REQUIRED!');
			throw new AppError(
				'ALL FIELDS NEED TO BE FILLED!',
				400,
				'all',
				'ERR_MISSING_FIELDS'
			);
		}

		if (typeof name !== 'string' || /\d/.test(name) || name.trim().length < 1) {
			throw new AppError(
				'ADD FUNCTION: INVALID NAME!',
				400,
				'NAME',
				'ERR_INVALID_NAME'
			);
		}

		const convertedAgeNumber = Number(age);
		if (!Number.isInteger(convertedAgeNumber) || Number.isNaN(convertedAgeNumber) || convertedAgeNumber < 1 || convertedAgeNumber > 100) {
			logWarn('INVALID AGE!');
			throw new AppError(
				'ADD FUNCTION: INVALID AGE!',
				400,
				'age',
				'ERR_INVALID_AGE'
			);
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			logWarn('EMAIL IN USE!');
			throw new AppError(
				'EMAIL ALREADY IN USE!',
				400,
				'EMAIL',
				'ERR_EMAIL_IN_USE'
			);
		}

		// Password has validated in User's schema.

		// Creating user:
		const newUser = new User(sanitizedBody);
		const { _id } = newUser;
		logDebug(`SANITIZED BODY => ${sanitizedBody}`);

		await newUser.save();

		logSuccess(`✅ NEW USER REGISTERED: Name: ${name}, Email: ${email}, Age: ${age}`);

		return res.success({
			statusCode: 201,
			message: 'SUCCESSFULLY REGISTERED!',
			data: {
				_id, name, email, age
			},
		});
	} catch (err) {
		logError('ERROR IN REGISTER FUNCTION!');
		logError(err);
		console.error(err.stack);

		if (err instanceof AppError) return next(err);

		if (err.name === 'ValidationError') {
			const validationMessages = Object.values(err.errors).map(
				(e) => e.message
			);

			const validationError = new AppError(
				'VALIDATION FAILED!',
				400,
				'REGISTER',
				'ERR_MONGOOSE_VALIDATION',
				validationMessages
			);

			return next(validationError);
		}

		return next(
			new AppError(
				'UNEXPECTED ERROR IN REGISTER FUNCTION!',
				500,
				'REGISTER',
				'ERR_REGISTER_FAILED'
			)
		);
	}
});

module.exports = router;

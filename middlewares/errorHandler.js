// Middleware to hanndle AppError in aplication
const chalk = require('chalk');
const AppError = require('./AppError');

const {
	logInfo, logDebug, logError, logWarn
} = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
	logError('🚨 INTERCEPTED ERROR! ');
	logWarn('🚩 HANDLER ACTING NOW! 🚩');
	logDebug('[ INTERCEPTED BY errorHendler.js ]');
	logError(err);

	if (err instanceof AppError) {
		// Confirm if its a trully AppError:
		logDebug(`Kind of error: ${err.constructor.name}`);
		logWarn('⚠️  Software Error Detected! ⚠️');

		return res.status(err.statusCode).json({
			success: false,
			status: 'Error',
			message: err.message,
			field: err.field,
			code: err.code,
			errors: err.errors || [],
		});
	}

	// MONGO ERROR:
	if (err.name === 'ValidationError') {
		logWarn('MONGO ERROR REPORTED!');
		// Taking the objects value Error to modify myself
		const messages = Object.values(err.errors).map((e) => e.message);

		messages.forEach((message) => console.log(chalk.yellow(`- ${message}`))
		);
		// Diferença do for com of e do foreach
		return res.status(400).json({
			status: 'error',
			message: 'VALIDATION ERROR',
			errors: messages,
		});
	}

	// Fields Duplication Errors of Mongoose:
	if (err.code === 11000) {
		// error code that says to dev what kind of error has ocurred in MONGODB
		logWarn('ERROR OF DUPLICATED FIELD!');

		const field = Object.keys(err.keyPattern)[0];
		const value = err.keyValue[field];

		logDebug(`${field} - ${value}`);

		return res.status(400).json({
			status: 'error',
			message: `${field.toUpperCase()} IS ALREADY IN USE!`,
			field,
			value,
			code: `ERR_${field.toUpperCase()}_IN_USE`,
		});
	}

	// UNKNOWN ERROR:
	logError('☠️ UNKNOWN ERROR!');
	return res.status(500).json({
		success: false,
		status: 'Unknown error',
		message: 'INTERNAL SERVER ERROR!',
		error: err.message,
	});
};

module.exports = errorHandler;

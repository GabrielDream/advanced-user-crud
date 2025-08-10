// Making a costumized and global error class

class AppError extends Error {
	constructor(message, statusCode = 500, field = null, code = 'ERR_GENERIC', errors = null) {
		super(message);
		this.statusCode = statusCode;
		this.field = field;
		this.code = code;
		this.errors = errors; // Parametro novo
		Error.captureStackTrace(this, this.constructor);
	}
}
module.exports = AppError;

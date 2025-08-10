// Middleware to put success inside the aplication (res.success)

const success = require('./success');

module.exports = (req, res, next) => {
	res.success = (options = {}) => {
		const {
			statusCode = 200, message = 'Success', data = {}, meta = {}
		} = options;
		return success({
			res, statusCode, message, data, meta
		});
	};
	next();
};

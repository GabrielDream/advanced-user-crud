// A helper function of success
const {
	logInfo, logSuccess, logData, logTimeStamp
} = require('../utils/logger');

module.exports = ({
	res, statusCode = 200, message = 'Success', data = {}, meta = {}
}) => {
	const response = {
		success: true,
		status: 'Success',
		message,
		data,
		meta,
		timeStamp: new Date().toISOString()
	};

	logSuccess(`${message} (StatusCode: ${statusCode})`);
	logData(data);
	logTimeStamp(response.timeStamp);

	// response object to Json formater:
	return res.status(statusCode).json(response);
};

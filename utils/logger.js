//Script used to stylize messages and banners.

const chalk = require('chalk');

// Loggers:
const label = {
	info: chalk.greenBright('⚪  INFO: '),
	// logs for errors:
	debug: chalk.blueBright('🔵  DEBUG: '),
	warn: chalk.yellowBright('🟡  WARNING: '),
	error: chalk.redBright('🔴  ERROR: '),
	// Logs for sucess:
	sucess: chalk.greenBright('🟢  SUCCESS: '),
	data: chalk.blueBright('📦  DATA: '),
	timestamp: chalk.gray('🕒  Timestamp: ')
};

// Loggers function:
const logInfo = (msg) => console.log(`${label.info} - ${msg}`);
const logDebug = (msg) => console.log(`${label.debug} - ${msg}`);
const logWarn = (msg) => console.log(`${label.warn} - ${msg}`);
const logError = (msg) => console.log(`${label.error} - ${msg}`);
const logSuccess = (msg) => console.log(`${label.sucess} - ${msg}`);
const logData = (data) => console.log(`${label.data} -`, data);
const logTimestamp = (timestamp) => console.log(`${label.timestamp} -`, timestamp);

const logBanner = (msg, style = chalk.bgGreenBright.bold) => {
	const line = '='.repeat(msg.length + 10);
	console.log(style(`\n${line}\n ${msg.toUpperCase()}\n${line}\n`));
};

module.exports = {
	logInfo,
	logWarn,
	logError,
	logDebug,
	logBanner,
	logSuccess,
	logData,
	logTimestamp
};

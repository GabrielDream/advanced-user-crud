//Scripts for animations, delays

const { logInfo,
	logWarn,
	logError,
} = require('./logger');

const chalk = require('chalk');

//Animation starts with delays:
const delay = (miliseconds) => new Promise(finish => setTimeout(finish, miliseconds));

//BEEP: ONLY A STILIZATION IN TERMINAL:
const beep = async (msg = '📢 BEEEP!') => logWarn(msg);

//ERROR (RED) FUNTION:
const emergency = async (msg = '🚨 EMERGENCY!') => logError(msg);

const animateBox = async (text, lineDelay = 200, style = chalk.cyanBright) => {
	//split text in lines and filter empty lines:
	const lines = text.split('\n').filter((line) => line.trim() !== '');

	//to each line of text:
	for (const line of lines) {
		console.log(style(line)); //Show the line stilized
		await delay(lineDelay); //Awaiting delay...
	}
}

module.exports = {
	beep,
	emergency,
	animateBox
}

const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			silent: process.env.ENV === 'test',
			prettyPrint: true,
			colorize: true
		}),
		new winston.transports.File({ filename: 'logs/combined.log' })
	]
});


module.exports = logger;

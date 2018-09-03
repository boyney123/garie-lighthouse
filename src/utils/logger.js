const winston = require('winston');

const logger = winston.createLogger({
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'logs/combined.log' })
	]
});


module.exports = logger;

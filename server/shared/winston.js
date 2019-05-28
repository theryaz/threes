const winston = require('winston');
const LOG_LEVEL = process.env.LOG_LEVEL || 'silly';
const logger = new (winston.createLogger)({
	transports: [
		new (winston.transports.Console)({
			format: winston.format.combine(
				winston.format.colorize(),
				winston.format.simple(),
			),
			level: LOG_LEVEL
		})
	]
});

module.exports = logger;

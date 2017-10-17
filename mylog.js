const winston = require("winston");
// require("winston-daily-rotate-file");
require("winston-logrotate");
let logger;
// init();
// const transport = new winston.transports.DailyRotateFile({
// 	filename: "/home/pampa/loho_api_server/log/log",
// 	datePattern: "yyyy-MM-dd.",
// 	prepend: true,
// 	level: process.env.ENV === "development" ? "debug" : "info"
// });
// const logger = new winston.Logger({
// 	transports: [transport]
// });
function init(
	logPath,
	infoLogFileName,
	errorLogFileName,
	exceptionsLogFileName
) {
	var rotateTransport = new winston.transports.Rotate({
		file: logPath + errorLogFileName,
		colorize: true,
		timestamp: true,
		json: true,
		size: "100m",
		keep: 5,
		compress: true
	});

	logger = new winston.Logger({ transports: [rotateTransport] });
	// console.log("logger inited : ", logger);
}

// logger.info('Hello World!');

function error(error) {
	console.log("============= error : ", error);
	logger.error(error);
}

function info(info, data) {
	console.log("------------- info : ", info, data);
}
exports.init = init;
exports.error = error;
exports.info = info;

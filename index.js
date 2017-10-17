const WeChat = require("wechat");
const args = require("yargs").argv;
console.log(args.port);
const MyLog = require("./mylog.js");

const express = require("express");
const app = express();

const config = {
	token: "IK2l2L4o3uTpt58LAxsM7EgAntGrR9YW",
	appid: "wx49646136f945d3d4",
	encodingAESKey: "J1x0YwCotXSF2sI0tQL9Z9AGNXIzgfeYRdmo9WC8a2J",
	checkSignature: true
};

MyLog.init(logPath, infoLogFileName, errorLogFileName, exceptionsLogFileName);

app.listen(port, function() {
	console.log("app listening on port : ", port);
});

// =============================. backup =======================
// =======================================
// // for echostr only

// const Koa = require("koa");
// const sha1 = require("sha1");

// var app1 = new Koa();

// app1.use(function*(next) {
// 	var token = config.token;
// 	var signature = this.query.signature;
// 	var nonce = this.query.nonce;
// 	var timestamp = this.query.timestamp;
// 	var echostr = this.query.echostr;
// 	var str = [token, timestamp, nonce].sort().join("");
// 	var sha = sha1(str);
// 	this.body = sha === signature ? echostr + "" : "failed";
// });

// // const port = args[2];
// const port = args.port;
// console.log("__dirname is : ", __dirname);
// const logPath = __dirname + "/log/";
// const infoLogFileName = port + "_log_info.log";
// const errorLogFileName = port + "_log_error.log";
// const exceptionsLogFileName = port + "_exceptions.log";
// init for log settings

// const cookieParser = require("cookie-parser");
// // set for cookie name
// app.use(cookieParser(Config.cookieUid));
// app.use(cookieParser(Config.cookieOpenId));

// const bodyParser = require("body-parser");
// app.use(bodyParser.json());

// only for dev enable cors =======================================
// const cors = require("cors");
// app.use(cors());
// ==================================================================

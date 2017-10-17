const WeChat = require("wechat");
const WeChatAPI = require("wechat-api");
const args = require("yargs").argv;
console.log(args.port);
const MyConfig = require("./myconfig.js");
const MyLog = require("./mylog.js");
const MyHandle = require("./myhandle.js");
const MyWechat = require("./mywechat.js");
const express = require("express");
const app = express();

const config = {
	token: MyConfig.token,
	appid: MyConfig.appid,
	encodingAESKey: MyConfig.encodingAESKey,
	appsecret: MyConfig.appsecret,
	checkSignature: MyConfig.checkSignature
};

const api = new WeChatAPI(MyConfig.appid, MyConfig.appsecret);

// set menu
MyWechat.create(api);

app.use(express.query());
app.use(
	"/",
	WeChat(config, function(req, res, next) {
		var message = req.weixin;

		// pass wechat api for more control handle like video
		MyHandle.handle(message, req, res);
	})
);

// // const port = args[2];
const port = args.port;
console.log("__dirname is : ", __dirname);
const logPath = __dirname + "/log/";
const infoLogFileName = port + "_log_info.log";
const errorLogFileName = port + "_log_error.log";
const exceptionsLogFileName = port + "_exceptions.log";
// init for log settings
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

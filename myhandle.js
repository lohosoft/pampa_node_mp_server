const MyConfig = require("./myconfig.js");
const WeChatAPI = require("wechat-api");
const fs = require("fs");
const download = require("download");
const fetch = require("node-fetch");
const async = require("async");
const api = new WeChatAPI(MyConfig.appid, MyConfig.appsecret);
const MyLog = require("./mylog.js");

// all path things need handle before deploy =================================  TODO
const mediaUrlPrefix = "https://lohosoft.cn/pampa/mp/utit/";
const targetPageUrlPreifx = "https://lohosoft.cn/pampa/mp/index.html?";
const filePath = "/home/pampa/lohosoft_www/pampa/mp/utit/";

const GetMediaTryTimeLimit = 5;
const getTokenUrl =
	"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" +
	MyConfig.appid +
	"&secret=" +
	MyConfig.appsecret;

const urlMark = "fvvAiwthsZztYFz8fBaJ";
const store = {};

store.defaultImgMediaId = "IrPLJs0u5zbNUnkQQCAV1anJL3P5D71fQld2q5dzvxs";
store.oldImgMediaId = "";
store.newImgMediaId = "";

store.defaultVideoId = "default";
store.oldVideoId = "";
store.newVideoId = "";

store.defaultVoiceMediaId = "IrPLJs0u5zbNUnkQQCAV1d30AGA164qdikBDXNpkMEM";
store.oldVoiceMediaId = "";
store.newVoiceMediaId = "";

store.token = "";
// marking for deleting file running
store.deleting = false;

const uitiReplyPicUrl = "http://lohosoft.cn/pampa/mp/pics/eagle_utit.png"; // move to static path ================  TODO

// external api =====================================
function handle(message, req, res) {
	// MyLog.info("message : ", message);
	type = message.MsgType;
	switch (type) {
		case "text":
			res.reply("");
			break;
		case "image":
			let mediaIdImg = message.MediaId;
			MyLog.info("image id ", mediaIdImg);
			store.newImgMediaId = mediaIdImg;
			if (store.oldImgMediaId === "") {
				store.oldImgMediaId = store.defaultImgMediaId;
			}
			res.reply({
				type: "image",
				content: {
					mediaId: store.oldImgMediaId
				}
			});
			store.oldImgMediaId = store.newImgMediaId;
			break;
		case "voice":
			// ToUserName: 'gh_e96ffe097709',
			// 		FromUserName: 'oCUTPjgD7X7b_qVAilDcPG5WRPVw',
			// 		CreateTime: '1508202454',
			// 		MsgType: 'voice',
			// 		MediaId: '-Elk_n77-m8K75-0-_4w6HTtrFXXsV2fiZDljUiHVo3zGYvJmqm1Ot7TqJiJIq8g',
			// 		Format: 'amr',
			// 		MsgId: '6477680216100188962',
			// 		Recognition: ''
			let mediaIdVoice = message.MediaId;
			MyLog.info("voice id ", mediaIdVoice);
			store.newVoiceMediaId = mediaIdVoice;
			if (store.oldVoiceMediaId === "") {
				store.oldVoiceMediaId = store.defaultVoiceMediaId;
			}
			res.reply({
				type: "voice",
				content: {
					mediaId: store.oldVoiceMediaId
				}
			});
			store.oldVoiceMediaId = store.newVoiceMediaId;
			break;

		// handle video ===============================
		case "video":
			// just reply to finish this conversation and let kefu handle ==================
			res.reply("");
			// start from tryTime = 0
			handleVideo(message, 0);
			break;
		// ===================================================  loacation TODO
		// case "location":
		// 	let lX = message.Location_X;
		// 	let lY = message.Location_Y;
		// 	let label = message.Label;
		// 	let msgId = message.MsgId;
		// 	res.reply({ type: "text", content: label });
		// 	break;

		// handle menu click ===========================
		// ===========================================================================
		case "event":
			if (message.Event === "CLICK" && message.EventKey === "utitBtn") {
				res.reply([
					{
						title: "你拍一我拍一",
						description: "拍一张照片/一段视频，不知道谁会看到。\n看一张照片／一段视频，不知道是谁拍的。",
						picurl: uitiReplyPicUrl
					}
				]);
			} else {
				MyLog.info("error on menu click on other button");
			}
			break;
		default:
			res.reply({
				type: "text",
				content: "hola ~"
			});
			break;
	}
}

// ===========================================================================
// internal api
// =============================================================================
// get token with callback settoken
// getToken(setToken);

function getToken(callback) {
	fetch(getTokenUrl)
		.then(function(res) {
			return res.json();
		})
		.then(function(json) {
			// MyLog.info(json);
			let token = json["access_token"];
			callback(token);
		});
}

function setToken(token) {
	store.token = token;
	MyLog.info("set token : ", store.token);
}

//  video message template ===========================================
// ToUserName: 'gh_e96ffe097709',
// FromUserName: 'oCUTPjgD7X7b_qVAilDcPG5WRPVw',
// CreateTime: '1508201570',
// MsgType: 'video',
// MediaId: '2TCA78xOvDvsApANh3IbxflBvDoGwSSIOrmO-M4uiwTqMwFvyqDoWSXUNDwdMOPJ',
// ThumbMediaId: 'upPwJ1MS6xR5EAnjaRcYiGc3Ri3dZPf-TB0NeZsk6ZgIbgYrf1wB_H7Jojiy7YGF',
// MsgId: '6477676419349099087'
//  video message template ===========================================

function handleVideo(message, tryTime) {
	MyLog.info("try get video time : ", tryTime);
	if (tryTime >= GetMediaTryTimeLimit) {
		// over try time
		handleVideoError(message);
	} else {
		doHandleVideo(message, tryTime);
	}
}

function doHandleVideo(message, tryTime) {
	let thumbMediaId = message.ThumbMediaId;
	let mediaId = message.MediaId;

	let getVideoUrl =
		"https://api.weixin.qq.com/cgi-bin/media/get?access_token=" +
		store.token +
		"&media_id=" +
		mediaId;

	let getThumbMediaUrl =
		"https://api.weixin.qq.com/cgi-bin/media/get?access_token=" +
		store.token +
		"&media_id=" +
		thumbMediaId;

	let videoFileId = Date.now();
	async.waterfall(
		[
			// download video
			function(callback) {
				download(getVideoUrl).then(data => {
					// MyLog.info("download reply data is ", data.toString());
					let maybeError = data.toString();
					if (maybeError.indexOf("errcode") !== -1) {
						// detect error for token
						callback(new Error(), "token_error");
					} else {
						let fileName = filePath + videoFileId + ".mp4";
						fs.writeFile(fileName, data, function(err) {
							// save video to new video file
							if (err) {
								MyLog.info("error in writeFile : ", err);
								callback(new Error(), "writefile_error");
							} else {
								callback(null);
							}
						});
					}
				});
			},
			// download thumb image
			function(callback) {
				download(getThumbMediaUrl).then(data => {
					// MyLog.info("download reply data is ", data.toString());

					let maybeError = data.toString();
					if (maybeError.indexOf("errcode") !== -1) {
						// detect error for token
						callback(new Error(), "token_error");
					} else {
						let fileName = filePath + videoFileId + ".jpg";
						fs.writeFile(fileName, data, function(err) {
							if (err) {
								MyLog.info("error in writeFile : ", err);
								callback(new Error(), err);
							} else {
								callback(null);
							}
						});
					}
				});
			}
		],
		function(err, results) {
			// handle video error ================  TODO
			if (err) {
				// reply handle video error message to openId
				if (results === "token_error") {
					MyLog.info("token error , restart after get new token ");

					// get new token
					getToken(setToken);

					setTimeout(function() {
						handleVideo(message, tryTime + 1);
					}, 1000 * tryTime + 1000);
				} else if (results === "writefile_error") {
					errorHandle("file io error", message);
				} else {
					errorHandle("unknown error", message);
				}
			} else {
				// update store record of video id
				store.newVideoId = videoFileId;
				handleVideoOk(message);
				removeOldVideoThumbFiles();
			}
		}
	);
}
// very bad things happend ... =========================  TODO
function errorHandle(reason, message) {
	MyLog.info("errorHandle for ", reason);
}
function handleVideoOk(message) {
	MyLog.info("handleVideoOk : ", message);
	let openId = message.FromUserName;

	// for the first time received video only =================================
	if (store.oldVideoId === "") {
		store.oldVideoId = store.defaultVideoId;
	}
	let thumbUrl = mediaUrlPrefix + store.oldVideoId + ".jpg";
	let targetPageUrl =
		targetPageUrlPreifx + urlMark + store.oldVideoId + urlMark;
	var articles = [
		{
			title: "",
			url: targetPageUrl,
			picurl: thumbUrl
		}
	];
	MyLog.info("reply news : ", articles);

	api.sendNews(openId, articles, handleVideoOkCB);
}

function handleVideoOkCB(e) {
	MyLog.info("handleVideoOkCB result : ", e);
	if (e === null) {
		store.oldVideoId = store.newVideoId;
	} else {
		MyLog.error("handleVideoOkCB error : ", e);
	}
}
function handleVideoError(message) {
	MyLog.info("handleVideoError : ", messagse);
	MyLog.error("handleVideoError over tryTime with message : " + message);
}

function removeOldVideoThumbFiles() {
	// according file name compare to Data.now() with expire limitation
	// remove all expired files =========================================  TODO
	// read files list
	// map to delete each expireds files on file list
	let oldFile = "";
	MyLog.info("deleting file : ", oldFile);

	if (!store.deleting) {
		// do delete =========================
		store.deleting = true;

		// fs.unlink(oldFile, function(error) {
		// 	if (!error) {
		// 		callback(null);
		// 	}
		// });

		// all deleted ========================
		store.deleting = false;
	}
}

exports.handle = handle;

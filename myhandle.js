const config = {
	token: "IK2l2L4o3uTpt58LAxsM7EgAntGrR9YW",
	appid: "wx49646136f945d3d4",
	encodingAESKey: "J1x0YwCotXSF2sI0tQL9Z9AGNXIzgfeYRdmo9WC8a2J",
	appsecret: "ccb0f0a4d2e8a0d3b82cdc1b8c4fe0ce"
};

const url = require("url");

const getTokenUrl =
	"https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" +
	config.appid +
	"&secret=" +
	config.appsecret;
const fetch = require("node-fetch");

const store = {};
store.oldImgMediaId = "";
store.newImgMediaId = "";
store.oldVoiceMediaId = "";
store.newVoiceMediaId = "";
store.token = "";
getToken(setToken);
function getToken(callback) {
	fetch(getTokenUrl)
		.then(function(res) {
			return res.json();
		})
		.then(function(json) {
			// console.log(json);
			let token = json["access_token"];
			callback(token);
		});
}

function setToken(token) {
	store.token = token;
	console.log("set token : ", store.token);
}

function handleVideo(message, myres) {
	let mediaId = message.MediaId;
	let getVideoUrl =
		"https://api.weixin.qq.com/cgi-bin/media/get?access_token=" +
		store.token +
		"&media_id=" +
		mediaId;

	fetch(getVideoUrl).then(function(res) {
		console.log("get video data :", res.url);
		let videUrl = res.url;
		myres.reply(getVideoUrl);
	});
}
function handle(message, req, res) {
	console.log("message : ", message);
	type = message.MsgType;
	switch (type) {
		case "text":
			res.reply(message.Content);
			break;
		case "image":
			let mediaIdImg = message.MediaId;
			store.newImgMediaId = mediaIdImg;
			res.reply({
				type: "image",
				content: {
					mediaId: store.oldImgMediaId
				}
			});
			store.oldImgMediaId = store.newImgMediaId;
			break;
		case "video":
			// ToUserName: 'gh_e96ffe097709',
			// FromUserName: 'oCUTPjgD7X7b_qVAilDcPG5WRPVw',
			// CreateTime: '1508201570',
			// MsgType: 'video',
			// MediaId: '2TCA78xOvDvsApANh3IbxflBvDoGwSSIOrmO-M4uiwTqMwFvyqDoWSXUNDwdMOPJ',
			// ThumbMediaId: 'upPwJ1MS6xR5EAnjaRcYiGc3Ri3dZPf-TB0NeZsk6ZgIbgYrf1wB_H7Jojiy7YGF',
			// MsgId: '6477676419349099087'
			// let mediaIdVideo = message.MediaId;
			// let thumbMediaId = message.ThumbMediaId;
			// res.reply({
			// 	type: "text",
			// 	content:
			// 		"由于微信服务器原因，暂不支持视频 / video is not available yet due to wechat server"
			// });
			let mediaIdVideo = message.MediaId;
			// res.reply("video handling");
			handleVideo(message, res);
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
			res.reply({ type: "voice", content: { mediaId: mediaIdVoice } });
			break;
		// case "location":
		// 	let lX = message.Location_X;
		// 	let lY = message.Location_Y;
		// 	let label = message.Label;
		// 	let msgId = message.MsgId;
		// 	res.reply({ type: "text", content: label });
		// 	break;

		// handle menu click ===========================

		case "event":
			if (message.Event === "CLICK" && message.EventKey === "utitBtn") {
				// res.reply("chinese desrption about u take i take");

				res.reply([
					{
						title: "你拍一我拍一",
						description: "拍一张照片，不知道谁会看到。\n看一张照片，不知道是谁拍的。",
						picurl:
							"http://lohosoft.cn/pampa/mp/pics/eagle_utit.png"
					}
				]);
			} else {
				console.log("error on menu click on other button");
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

exports.handle = handle;

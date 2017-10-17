const store = {};
store.oldImgMediaId = "";
store.newImgMediaId = "";
store.oldVoiceMediaId = "";
store.newVoiceMediaId = "";

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
			res.reply({
				type: "text",
				content:
					"由于微信服务器原因，暂不支持视频 / video is not available yet due to wechat server"
			});
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

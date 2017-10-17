// wechat menu and etc.

function create(api) {
	const menu = {
		button: [
			{ type: "click", name: "你拍一我拍一 / U TAKE I TAKE", key: "utitBtn" }
		]
	};

	api.createMenu(menu, createCB);
}

function createCB(e) {
	console.log(e);
}
exports.create = create;

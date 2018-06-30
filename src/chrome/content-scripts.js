//@@include('../core/saveAsText.js')
//@@include('../core/iconBase64.js')
//@@include('../core/addButtonToBody.js')

function handleSelectorAndSave(rule) {
	var fileName = "";
	var content = "";
	if (rule === undefined) {
		fileName = document.title + ".txt";
		content = document.body.innerText;
	} else {
		if (rule.titleSelector == "") {
			fileName = document.title;
		} else {
			var ele = $(rule.titleSelector)[0];
			if(ele!=undefined){
				fileName = ele.innerText;
			} else {
				fileName = document.title;
			}
		}
		fileName += ".txt";
		if (rule.contentSelector == "") {
			content = document.body.innerText;
		} else {
			if ($(rule.contentSelector).length!=0){
				$(rule.contentSelector).each(function (idx, ele) {
					content += ele.innerText;
				});
			} else {
				content = document.body.innerText;
			}
		}
	}
	saveAsText(fileName, content);
}

//监听菜单发送的请求
chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.action === "save-as-text") {
			handleSelectorAndSave(request.rule);
		}
	}
);

//按钮处理
function handleButtonClick() {
	chrome.extension.sendRequest({
		action: "getRule",
		url: window.location.href
	}, function (response) {
		handleSelectorAndSave(response.rule);
	});
}

//显示悬浮按钮
chrome.extension.sendRequest({
	action: "isShowButton"
}, function (response) {
	if (response.showButton=='true'){
		var button = addButtonToBody();
		button.onclick = handleButtonClick;
	}
});
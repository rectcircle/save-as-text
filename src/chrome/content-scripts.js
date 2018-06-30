//@@include('../core/saveAsText.js')
//@@include('../core/iconBase64.js')
//@@include('../core/addButtonToBody.js')

/**
 * 选取元素并保存
 * @param {Object} rule 选取元素规则
 * @param {Function} cb DOMElement -> String 将DOM元素转换为字符串的函数
 */
function handleSelectorAndSave(rule, suffix, cb) {
	var fileName = "";
	var content = "";
	if (rule === undefined) {
		fileName = document.title + "." + suffix;
		content = cb(document.body);
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
		fileName += "." + suffix;
		if (rule.contentSelector == "") {
			content = cb(document.body);
		} else {
			if ($(rule.contentSelector).length!=0){
				$(rule.contentSelector).each(function (idx, ele) {
					content += cb(ele);
				});
			} else {
				content = cb(document.body);
			}
		}
	}
	saveAsText(fileName, content);
}

function handleSelectorAndSaveTxt(rule) {
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

var turndownService = new TurndownService({
	codeBlockStyle: "fenced",
	emDelimiter: "*",
	headingStyle: "atx"
})


function handleSelectorAndSaveMd(rule) {
	handleSelectorAndSave(rule, "md",function (ele) {
		return turndownService.turndown(ele);
	})
}

//监听菜单发送的请求
chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.action === "save-as-text") {
			handleSelectorAndSaveTxt(request.rule);
		} else if (request.action === "save-as-md") {
			handleSelectorAndSaveMd(request.rule);
		}
	}
);

//按钮处理
function handleButtonClick() {
	chrome.extension.sendRequest({
		action: "getRule",
		url: window.location.href
	}, function (response) {
		if(response.rule==undefined){
			handleSelectorAndSaveTxt(response.rule);
		} else {
			if (response.rule.buttonFeature == 'saveMarkdown') {
				handleSelectorAndSaveMd(response.rule);
			} else if (response.rule.buttonFeature == 'saveText') {
				handleSelectorAndSaveTxt(response.rule);
			}
		}
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
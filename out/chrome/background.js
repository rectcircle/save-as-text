//匹配规则
function matchRules(rules, url) {
	for(var i=0; i<rules.length; i++){
		if (minimatch(url ,rules[i].globPattern)){
			return rules[i];
		}
	}
	return {
		"globPattern": "",
		"titleSelector": "",
		"buttonFeature": getButtonFeature(),
		"contentSelector": ""
	};
}

chrome.contextMenus.create({
	"title": chrome.i18n.getMessage("menuTitle"),
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　 // 先获取当前页面的tabID
			var rule = matchRules(getRules(), tab.url)
			chrome.tabs.sendMessage(tab.id, {
				action: "save-as-text",
				rule: rule
			});
		});
	}
});

chrome.contextMenus.create({
	"title": "将当前页面解析成Markdown格式并保存",
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　 // 先获取当前页面的tabID
			var rule = matchRules(getRules(), tab.url)
			chrome.tabs.sendMessage(tab.id, {
				action: "save-as-md",
				rule: rule
			});
		});
	}
});


//监听消息
chrome.extension.onRequest.addListener(
	function (request, sender, sendResponse) {
		if (request.action === "isShowButton") {
			sendResponse({
				showButton: localStorage['showButton']
			});
		} else if (request.action === "getRule") {
			sendResponse({
				rule: matchRules(getRules(), request.url)
			});
		}
	}
);
function addOrUpdateRule(url, rule) {
	var rules = getRules();
	var oldRule = undefined;
	for (var i = 0; i < rules.length; i++) {
		if (wildcardMatching(url, rules[i].urlPattern)) {
			oldRule = rules[i];
			break;
		}
	}
	if(oldRule){
		Object.assign(oldRule, rule);
	} else {
		var urlReg = /https{0,1}:\/\/([^\/]+)/i;
		var newRule = {
			"urlPattern": "*"+url.match(urlReg)[1]+"*",
			"titleSelector": "",
			"buttonFeature": "saveText",
			"contentSelector": ""
		}
		Object.assign(newRule, rule);
		rules.push(newRule);
	}
	setRules(rules);
}

//页面菜单
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
	"title": "保存当前页面为Markdown格式的文件",
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

//选中菜单
chrome.contextMenus.create({
	"title": "保存选中内容为无格式的文本文件",
	"contexts": ["selection"],
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　 // 先获取当前页面的tabID
			var rule = matchRules(getRules(), tab.url)
			chrome.tabs.sendMessage(tab.id, {
				action: "save-selection-as-text",
				rule: rule
			});
		});
	}
});

chrome.contextMenus.create({
	"title": "提取选中内容规则，添加到页面规则中的“标题选择器”",
	"contexts": ["selection"],
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　 // 先获取当前页面的tabID
			chrome.tabs.sendMessage(tab.id, {
					action: "parse-selection-as-title-selector"
				},
				function (response) {
					if (!response.selector){
						return;
					}
					addOrUpdateRule(tab.url, {
						titleSelector: response.selector
					})
				});
		});
	}
});

chrome.contextMenus.create({
	"title": "提取选中内容规则，添加到页面规则中的“内容选择器”",
	"contexts": ["selection"],
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　 // 先获取当前页面的tabID
			chrome.tabs.sendMessage(tab.id, {
				action: "parse-selection-as-content-selector"
			},
			function (response) {
				if (!response.selector) {
					return;
				}
				addOrUpdateRule(tab.url, {
					contentSelector: response.selector
				})
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
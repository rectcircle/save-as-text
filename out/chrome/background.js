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
	"title": chrome.i18n.getMessage("savePageAsTextMenu"),
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
	"title": chrome.i18n.getMessage("savePageAsMdMenu"),
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
var parentId = chrome.contextMenus.create({
	"title": chrome.i18n.getMessage("addSelectionToClipboardMenu"),
	"contexts": ["selection"]
});

chrome.contextMenus.create({
	"title": chrome.i18n.getMessage("plainTextFormat"),
	"contexts": ["selection"],
	"parentId": parentId,
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　 // 先获取当前页面的tabID
			var rule = matchRules(getRules(), tab.url)
			chrome.tabs.sendMessage(tab.id, {
				action: "add-selection-to-clipboard-txt",
				rule: rule
			});
		});
	}
});

chrome.contextMenus.create({
	"title": chrome.i18n.getMessage("markdownFormat"),
	"contexts": ["selection"],
	"parentId": parentId,
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　 // 先获取当前页面的tabID
			var rule = matchRules(getRules(), tab.url)
			chrome.tabs.sendMessage(tab.id, {
				action: "add-selection-to-clipboard-md",
				rule: rule
			});
		});
	}
});

chrome.contextMenus.create({
	"title": chrome.i18n.getMessage('saveSelectionAsTextMenu'),
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
	"title": chrome.i18n.getMessage('batchDownloadMenu'),
	"contexts": ["selection"],
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　 // 先获取当前页面的tabID
			var rule = matchRules(getRules(), tab.url)
			chrome.tabs.sendMessage(tab.id, {
				action: "batch-save-selection-link",
				rule: rule
			},function (response) {
				console.log(response);
				//将内容缓存到localStorage
				localStorage.setItem("selectionLinks", JSON.stringify(response.links));
				//打开选项页面，进行下载
				chrome.tabs.create({
					url: chrome.extension.getURL("popup.html")
				});
			});
		});
	}
});

chrome.contextMenus.create({
	"title": chrome.i18n.getMessage('extractTitle'),
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
	"title": chrome.i18n.getMessage('extractContent'),
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
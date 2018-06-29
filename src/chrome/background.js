chrome.contextMenus.create({
	"title": chrome.i18n.getMessage("menuTitle"),
	"onclick": function () {
		chrome.tabs.getSelected(null, function (tab) {　　 // 先获取当前页面的tabID
			chrome.tabs.sendMessage(tab.id, {
				action: "save-as-text",
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
		}
	}
);
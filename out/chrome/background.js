chrome.contextMenus.create({
	"title": "Save as Text",
	"onclick": function () {

		chrome.tabs.getSelected(null, function (tab) {　　 // 先获取当前页面的tabID
			chrome.tabs.sendMessage(tab.id, {
				action: "save-as-text"
			});
		});
	}
});
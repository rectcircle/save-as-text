//@@include('../core/saveAsText.js')

//监听消息
chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.action === "save-as-text") {
			var fileName = document.title + ".txt";
			var content = document.body.innerText;
			saveAsText(fileName, content);
		}

	}
);
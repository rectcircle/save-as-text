//@@include('../core/saveAsText.js')
//@@include('../core/iconBase64.js')
//@@include('../core/addButtonToBody.js')

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

chrome.extension.sendRequest({
	action: "isShowButton"
}, function (response) {
	if (response.showButton=='true'){
		addButtonToBody();
	}
});


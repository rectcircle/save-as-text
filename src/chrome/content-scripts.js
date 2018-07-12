//@@include('../core/iconBase64.js')
//@@include('../core/addButtonToBody.js')

/**
 * 根据规则获取标题
 * @param {Object} rule 页面规则
 */
function selectTitle(rule){
	var fileName = "";
	if (rule === undefined) {
		fileName = document.title;
	} else {
		if (rule.titleSelector == "") {
			fileName = document.title;
		} else {
			var ele = document.querySelector(rule.titleSelector);
			if (ele != undefined) {
				fileName = ele.innerText;
			} else {
				fileName = document.title;
			}
		}
	}
	return fileName;
}

/**
 * 选取元素并保存
 * @param {Object} rule 选取元素规则
 * @param {Function} cb DOMElement -> String 将DOM元素转换为字符串的函数
 */
function handleSelectorAndSave(rule, suffix, cb) {
	var fileName = selectTitle(rule)+"."+suffix;
	var content = "";
	if (rule === undefined) {
		content = cb(document.body);
	} else {
		if (rule.contentSelector == "") {
			content = cb(document.body);
		} else {
			var elementList = document.querySelectorAll(rule.contentSelector);
			if (elementList.length != 0) {
				elementList.forEach(function (ele) {
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
	handleSelectorAndSave(rule, "txt", function (ele) {
		return ele.innerText;
	});
}

function handleSelectorAndSaveMd(rule) {
	handleSelectorAndSave(rule, "md",function (ele) {
		return turndownService.turndown(ele);
	})
}


function saveSelection(rule) {
	var fileName = selectTitle(rule)+".txt";
	var content = window.getSelection().toString();
	saveAsText(fileName, content);
}

function createCSSSelectorByEle(ele){
	var selector = ele.localName;
	if (ele.id != "") {
		selector += '#' + ele.id;
	}
	if (ele.className != "") {
		var classNames = ele.className.split(/\s+/);
		classNames.forEach(function (value) {
			selector += '.' +value;
		})
	}
	return selector;
}

function parseSelectionAsTitle() {
	var userSelection = window.getSelection();
	if (!userSelection.anchorNode) {
		return undefined;
	}
	var ele = userSelection.anchorNode.parentElement;
	var selector = createCSSSelectorByEle(ele);
	var targets = document.querySelectorAll(selector);
	if(targets.length==0){
		return undefined;
	} else if (targets.length == 1){
		return selector;
	} else {
		if(targets[0]==ele){
			return selector;
		} else {
			return undefined;
		}
	}
	return selector;
}

function parseSelectionFatherElement() {
	var userSelection = window.getSelection();
	if (!userSelection.anchorNode) {
		return undefined;
	}
	var ele = userSelection.anchorNode.parentElement;
	var endEle = userSelection.focusNode.parentElement;
	while (ele.contains(endEle) == 0 && ele != endEle) {
		ele = ele.parentElement;
	}
	return ele;
}

function parseSelectionAsContent() {
	var ele = parseSelectionFatherElement();
	var selector = createCSSSelectorByEle(ele)
	return selector;
}

function parseSelectionAsLink() {
	var userSelection = window.getSelection();
	var selectionText = userSelection.toString();
	var ele = parseSelectionFatherElement();
	var linkList = ele.querySelectorAll('a');
	var linkArr = [];
	for(var i=0; i<linkList.length; i++){
		var a = linkList[i];
		if (selectionText.indexOf(a.innerText)!=-1){
			linkArr.push(a.href);
		}
	}
	return linkArr
}

//监听菜单发送的请求
chrome.extension.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request.action === "save-as-text") {
			handleSelectorAndSaveTxt(request.rule);
		} else if (request.action === "save-as-md") {
			handleSelectorAndSaveMd(request.rule);
		} else if (request.action === "save-selection-as-text") {
			saveSelection(request.rule);
		} else if (request.action === "parse-selection-as-title-selector") {
			var selector = parseSelectionAsTitle()
			if (!selector) {
				alert("提取规则失败，该元素不能作为标题");
			} else {
				alert("成功，可以通过扩展设置查看或修改")
			}
			sendResponse({
				selector: selector
			});
		} else if (request.action === "parse-selection-as-content-selector"){
			var selector = parseSelectionAsContent()
			if (!selector) {
				alert("您没有选择任何内容");
			} else {
				alert("成功，可以通过扩展设置查看或修改")
			}
			sendResponse({
				selector: selector
			});
		} else if (request.action === "batch-save-selection-link"){
			var linkArr = parseSelectionAsLink();
			sendResponse({
				links: linkArr
			})
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
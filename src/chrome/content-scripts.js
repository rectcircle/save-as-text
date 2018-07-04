//@@include('../core/saveAsText.js')
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

//html转markdown工具
var turndownService = new TurndownService({
	codeBlockStyle: "fenced",
	emDelimiter: "*",
	headingStyle: "atx"
})

//添加表格<strike>, <s>, and <del>支持
var gfm = turndownPluginGfm.gfm
turndownService.use(gfm)

//修正链接的一系列问题：非锚链接使用绝对路径，title 对引号转义，content换行替换
turndownService.addRule('linkFix', {
	filter: function (node, options) {
		return (
			options.linkStyle === 'inlined' &&
			node.nodeName === 'A' &&
			node.getAttribute('href')
		)
	},
	replacement: function (content, node, options) {
		var href = node.getAttribute('href');
		if (!href.startsWith("#")){
			href = node.href;
		}
		var title = node.title;
		if(title) {
			title = title ? ' "' + title.replace(/"/g, '\\"') + '"' : '';
		}
		var replacement = '[' + content.replace('\n', ' ') + '](' + href + title + ')';;
		return replacement
	}
})

//修正图片链接和转义问题
turndownService.addRule('imgLinkFix', {
	filter: 'img',
	replacement: function (content, node) {
		var alt = node.alt || '';
		var src = node.src || '';
		var title = node.title || '';
		var titlePart = title ? ' "' + title.replace(/"/g, '\\"') + '"' : '';
		return src ? '![' + alt + ']' + '(' + src + titlePart + ')' : ''
	}
});


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
	return selector;
}

function parseSelectionAsContent() {
	var userSelection = window.getSelection();
	if (!userSelection.anchorNode) {
		return undefined;
	}
	var ele = userSelection.anchorNode.parentElement;
	var endEle = userSelection.focusNode.parentElement;
	while (ele.contains(endEle) == 0 && ele != endEle) {
		ele = ele.parentElement;
	}
	var selector = createCSSSelectorByEle(ele)
	return selector;
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
				alert("您没有选择任何内容");
			} else {
				alert("成功，可以通过插件设置查看或修改")
			}
			sendResponse({
				selector: selector
			});
		} else if (request.action === "parse-selection-as-content-selector"){
			var selector = parseSelectionAsContent()
			if (!selector) {
				alert("您没有选择任何内容");
			} else {
				alert("成功，可以通过插件设置查看或修改")
			}
			sendResponse({
				selector: selector
			});
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
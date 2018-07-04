function getInputAndClear(id) {
	var value = document.getElementById(id).value.replace(/(^\s*)|(\s*$)/g, "");
	document.getElementById(id).value = "";
	return value;
}

function getRules() {
	var rules = localStorage["rules"];
	if (!rules) {
		localStorage["rules"] = JSON.stringify(defaultRules);
		rules = defaultRules;
	} else {
		rules = JSON.parse(rules);
	}
	return rules;
}

function setRules(rules) {
	localStorage["rules"] = JSON.stringify(rules);
}


function buttonFeatureToString(value){
	if (value == "saveMarkdown") {
		return ".md";
	} else {
		return ".txt";
	}
}

function getButtonFeature(){
	var buttonFeature = localStorage["buttonFeature"];
	if(!buttonFeature){
		return "saveText";
	}
	return buttonFeature;
}

function getSelectOption(key) {
	var select = document.getElementById(key);
	return select.children[select.selectedIndex].value;
}

function setSelectOption(key, value){
	var select = document.getElementById(key);
	for (var i = 0; i < select.children.length; i++) {
		var child = select.children[i];
		if (child.value == value) {
			child.selected = "true";
			break;
		}
	}
}

function wildcardMatching(dest, pattern){
	//第一步：替换将与正则表达式冲突的进行转义（不包括`*`和`？`）
	var regPattern = pattern
			.replace(/([\.\?\+\$\^\[\]\(\)\{\}\|\\\/])/g, '\\$1')
	//第二步：将`*`转换为正则表达式
			.replace(/\*/g, '.*')
	//第三步：将`?`转化为正则表达式
			.replace(/\?/g, '.');
	//第四步：添加开头结尾
	regPattern = '^'+regPattern+'$';

	// console.log(regPattern)
	var reg = new RegExp(regPattern);
	// console.log(reg.test(dest))
	return reg.test(dest);
}

//匹配规则
function matchRules(rules, url) {
	for (var i = 0; i < rules.length; i++) {
		if (wildcardMatching(url, rules[i].urlPattern)) {
			return rules[i];
		}
	}
	return {
		"urlPattern": "",
		"titleSelector": "",
		"buttonFeature": getButtonFeature(),
		"contentSelector": ""
	};
}

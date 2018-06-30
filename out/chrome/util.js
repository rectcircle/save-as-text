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
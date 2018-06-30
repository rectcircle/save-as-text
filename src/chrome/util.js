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
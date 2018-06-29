

window.onload = function () {

	function saveOptions() {
		var select = document.getElementById("showButton");
		var showButton = select.children[select.selectedIndex].value;
		localStorage["showButton"] = showButton;
	}

	function restoreOptions() {
		var showButton = localStorage["showButton"];
		if (!showButton) {
			return;
		}
		var select = document.getElementById("showButton");
		for (var i = 0; i < select.children.length; i++) {
			var child = select.children[i];
			if (child.value == showButton) {
				child.selected = "true";
				break;
			}
		}
	}


	restoreOptions();
	document.getElementById("showButton").onchange = saveOptions

	document.getElementById("showButtonLabel").innerHTML = 
		chrome.i18n.getMessage('showButtonLabel');
	document.getElementById("settingLegend").innerHTML =
		chrome.i18n.getMessage('setting');
	document.getElementById("yesOption").innerHTML =
		chrome.i18n.getMessage('yes');
	document.getElementById("noOption").innerHTML =
		chrome.i18n.getMessage('no');
}



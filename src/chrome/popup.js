window.onload = function () {

	//页面国际化
	document.getElementById("showButtonLabel").innerText =
		chrome.i18n.getMessage('showButtonLabel');
	document.getElementById("settingLegend").innerText =
		chrome.i18n.getMessage('setting');
	document.getElementById("yesOption").innerText =
		chrome.i18n.getMessage('yes');
	document.getElementById("noOption").innerText =
		chrome.i18n.getMessage('no');

	function saveOptions(key) {
		//设置是否显示悬浮按钮
		var select = document.getElementById(key);
		var value = select.children[select.selectedIndex].value;
		localStorage[key] = value;
	}

	function restoreOptions(key) {
		var value = localStorage[key];
		if (!showButton) {
			return;
		}
		var select = document.getElementById(key);
		for (var i = 0; i < select.children.length; i++) {
			var child = select.children[i];
			if (child.value == value) {
				child.selected = "true";
				break;
			}
		}
	}

	function addRule(event) {
		var isAdd = event.toElement.dataset.add=="true";
		event.toElement.dataset.add ="true";
		document.getElementById("addRule").innerText = "添加";
		var rule = {
			globPattern: getInputAndClear('globPattern'),
			titleSelector: getInputAndClear('titleSelector'),
			contentSelector: getInputAndClear('contentSelector'),
		}
		var rules = getRules();
		if (isAdd){
			rules.push(rule);
		} else {
			var idx = parseInt(event.toElement.dataset.index);
			rules[idx] = rule;
		}
		localStorage["rules"] = JSON.stringify(rules);
		restoreRule();
	}

	function restoreRule(){
		var rules = getRules();

		var contentHtml = '';
		for(var i=0; i<rules.length; i++){
			contentHtml += '<tr>';
			contentHtml += '<td>'+ i +'</td>';
			contentHtml += '<td><code>' + rules[i].globPattern + '</code></td>';
			contentHtml += '<td><code>' + rules[i].titleSelector + '</code></td>';
			contentHtml += '<td><code>' + rules[i].contentSelector + '</code></td>';
			contentHtml += '<td>'+
								'<button name="up" data-index="' + i + '">上移</button>' +
								'<button name="down" data-index="' + i + '">下移</button>' +
								'<button name="delete" data-index="' + i + '">删除</button>' +
								'<button name="update" data-index="' + i + '">更新</button>' +
								'<button name="copy" data-index="' + i + '">拷贝</button>' +
							'</td>';
			contentHtml += '</tr>';
		}
		var tbody = document.getElementById("ruleContent");
		tbody.innerHTML = contentHtml;
	}

	function setRule(event) {
		var ele = event.toElement;
		var index = ele.dataset.index;
		var rules;
		if(index){
			rules = getRules();
			index = parseInt(index);
		}
		if (ele.name == "up"){
			if(index!=0){
				var temp = rules[index-1]
				rules[index-1] = rules[index]
				rules[index] = temp;
			}
			setRules(rules);
			restoreRule();
		} else if (ele.name == "down") {
			if (index != rules.length-1) {
				var temp = rules[index + 1]
				rules[index + 1] = rules[index]
				rules[index] = temp;
			}
			setRules(rules);
			restoreRule();
		} else if (ele.name == "delete") {
			rules.splice(index, 1);
			setRules(rules);
			restoreRule();
		} else if (ele.name == "update") {
			document.getElementById("globPattern").value = rules[index].globPattern;
			document.getElementById("titleSelector").value = rules[index].titleSelector;
			document.getElementById("contentSelector").value = rules[index].contentSelector;
			document.getElementById("addRule").dataset.index = index;
			document.getElementById("addRule").dataset.add="false";
			document.getElementById("addRule").innerText = "更新";
		} else if (ele.name == "copy") {
			document.getElementById("globPattern").value = rules[index].globPattern;
			document.getElementById("titleSelector").value = rules[index].titleSelector;
			document.getElementById("contentSelector").value = rules[index].contentSelector;
			document.getElementById("addRule").dataset.add = "true";
			document.getElementById("addRule").innerText = "添加";
		}
	}

	//恢复配置
	restoreOptions("showButton");
	restoreOptions("buttonFeature");
	restoreRule();

	//保存配置
	document.getElementById("showButton").onchange = function () {
		saveOptions("showButton");
	}
	document.getElementById("buttonFeature").onchange = function () {
		saveOptions("buttonFeature");
	}
	this.document.getElementById("addRule").onclick = addRule;
	document.body.addEventListener("click", setRule)

}



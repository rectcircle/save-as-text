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
		// var select = document.getElementById(key);
		// var value = select.children[select.selectedIndex].value;
		var value = getSelectOption(key);
		localStorage[key] = value;
	}

	function restoreOptions(key) {
		var value = localStorage[key];
		if (!showButton) {
			return;
		}
		setSelectOption(key, value);
	}

	function addRule(event) {
		var isAdd = event.toElement.dataset.add=="true";
		event.toElement.dataset.add ="true";
		document.getElementById("addRule").innerText = "添加";
		var rule = {
			urlPattern: getInputAndClear('urlPattern'),
			titleSelector: getInputAndClear('titleSelector'),
			contentSelector: getInputAndClear('contentSelector'),
			buttonFeature: getSelectOption('pageButtonFeature')
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
			contentHtml += '<td><code>' + rules[i].urlPattern + '</code></td>';
			contentHtml += '<td><code>' + rules[i].titleSelector + '</code></td>';
			contentHtml += '<td><code>' + rules[i].contentSelector + '</code></td>';
			contentHtml += '<td><code>' + buttonFeatureToString(rules[i].buttonFeature) + '</code></td>';
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
			document.getElementById("urlPattern").value = rules[index].urlPattern;
			document.getElementById("titleSelector").value = rules[index].titleSelector;
			document.getElementById("contentSelector").value = rules[index].contentSelector;
			setSelectOption("pageButtonFeature", rules[index].buttonFeature);
			document.getElementById("addRule").dataset.index = index;
			document.getElementById("addRule").dataset.add="false";
			document.getElementById("addRule").innerText = "更新";
		} else if (ele.name == "copy") {
			document.getElementById("urlPattern").value = rules[index].urlPattern;
			document.getElementById("titleSelector").value = rules[index].titleSelector;
			document.getElementById("contentSelector").value = rules[index].contentSelector;
			setSelectOption("pageButtonFeature", rules[index].buttonFeature);
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
	document.body.addEventListener("click", setRule);

	//====高级功能====
	//高级功能1：保存本窗口所有标签作为文本文件
	this.document.getElementById('saveAllTabInWindowsAsTxt').onclick = function () {
		chrome.tabs.getAllInWindow(null, function (tabs) {
			for(var i=0; i<tabs.length; i++){
				var tab = tabs[i];
				var rule = matchRules(getRules(), tab.url)
				chrome.tabs.sendMessage(tab.id, {
					action: "save-as-text",
					rule: rule
				});
			}
		});
	};

	//高级功能2：保存本窗口所有标签作为Markdown文件
	this.document.getElementById('saveAllTabInWindowsAsMd').onclick = function () {
		chrome.tabs.getAllInWindow(null, function (tabs) {
			for (var i = 0; i < tabs.length; i++) {
				var tab = tabs[i];
				var rule = matchRules(getRules(), tab.url)
				chrome.tabs.sendMessage(tab.id, {
					action: "save-as-md",
					rule: rule
				});
			}
		});
	};


	/**
	 * 根据规则获取标题
	 * @param {Object} rule 页面规则
	 */
	function selectTitle(rule, document) {
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

	function handleTitleAndContent(url, html, cb) {
		var rule = matchRules(getRules(), url);
		var htmlInfos = htmlFilter(html);

		var div = document.createElement("div");
		div.innerHTML = htmlInfos.content;
		div.title = htmlInfos.title;
		div.body = div;

		var title = selectTitle(rule, div);

		var content = "";
		if (rule === undefined) {
			content = cb(div.body);
		} else {
			if (rule.contentSelector == "") {
				content = cb(div.body);
			} else {
				var elementList = div.querySelectorAll(rule.contentSelector);
				if (elementList.length != 0) {
					elementList.forEach(function (ele) {
						content += cb(ele);
					});
				} else {
					content = cb(div.body);
				}
			}
		}
		return {
			title: title,
			content:content
		}

	}

	//高级功能3：保存本窗口所有标签作为Markdown文件
	//下载器
	function Downloader(batchUrl, singleFile, fileType) {
		this.batchUrl = batchUrl;
		this.singleFile = singleFile;
		this.fileType = fileType;
		/**并发数 */
		this.asyncLimit = 10;
		/**睡眠延时时间 */
		this.waitTimeout = 1000;
		/**Ajax延时 */
		this.ajaxTimeout = 0;
		/**下载缓存*/
		this.contents = []; 
		/**第一个请求的标题（文件名）*/
		this.title = "" ; 
		/**当前发起下载的数目*/
		this.len = 0; 
		/**所有下载已发起，len被锁定，此时当cnt==len，下载完成*/
		this.isFinished = false; 
		/** 完成计数（ 包括失败） */
		this.cnt = 0;
		/** 成功计数 */
		this.successCnt = 0;
		/** 失败记录 */
		this.errors = [];
		/** 每个下载完成后，回调 */
		this.ondowmloadone = function (index, isSuccess, title, content) {};
		/** 所有下载完成后，回调 */
		this.ondowmloadall = function (len, successCnt, errors, title, contents) {};
	}

	Downloader.prototype.save = function(p,title){
		if(title!=undefined){
			this.title = title;
		}
		var self = this;
		var idx = self.len++;
		var url = this.batchUrl.replace(/\{p\}/g, p);
		this.contents[idx] = "";

		function exec() {
			if ((this.len - this.cnt) > this.asyncLimit) {
				setTimeout(exec, this.timeout + Math.floor(Math.random() * this.timeout/2));
			} else {
				Ajax(url)
					.timeout(self.ajaxTimeout)
					.success(function (html) {
						var pageInfos = handleTitleAndContent(url, html, function (ele) {
							if (self.fileType == 'txt') {
								return ele.innerText;
							} else if (self.fileType == 'md') {
								return turndownService.turndown(ele);
							}
						});
						self.contents[idx] = pageInfos.content;
						if (self.title == "") {
							self.title = pageInfos.title;
						}
						self.cnt++;
						self.successCnt++;
						var nowTitle;
						if (title != undefined) {
							nowTitle = title + idx;
						} else {
							nowTitle = pageInfos.title;
						}
						self.ondowmloadone(idx, true, nowTitle, self.contents[idx])
						if (self.isFinished && self.cnt == self.len) {
							self.ondowmloadall(self.len, self.successCnt, self.errors, self.title, self.contents);
						}
					})
					.error(function (status, msg) {
						self.contents[idx] = "第" + idx + "个页面：下载失败\n" +
							"Url：" + url + "\n" +
							"http状态码为：" + status +" 状态信息为："+msg+"\n";
						self.cnt++;
						self.errors.push(self.contents[idx]);
						self.ondowmloadone(idx, false, null, self.contents[idx])
						if (self.isFinished && self.cnt == self.len) {
							self.ondowmloadall(self.len, self.successCnt, self.errors, self.title, self.contents);
						}
					})
					.get();
			}
		}
		exec();

	}

	Downloader.prototype.finish = function () {
		this.isFinished = true;
	}

	function batchSave(fileType) {
		var batchUrl = getInput("batchUrl");
		var singleFile = getSelectOption("singleFile");
		var paramRuleFunction = getSelectOption("paramRuleFunction");
		var paramRuleStr = getInput("paramRule");
		var ajaxTimeout = document.getElementById("ajaxTimeout").valueAsNumber
		

		//进度信息初始化
		var progress = document.getElementById("downloadProgress");
		progress.value = 0;
		progress.max = 1;
		var successCntSpan = document.getElementById("successCnt");
		var errorCntSpan = document.getElementById("errorCnt");
		var totalCntSpan = document.getElementById("totalCnt");
		successCntSpan.innerText = errorCntSpan.innerText = totalCntSpan.innerText = 0;

		function updateProgress(isSuccess) {
			progress.value = progress.value+1;
			if (isSuccess) {
				successCntSpan.innerText = parseInt(successCntSpan.innerText) + 1;
			} else {
				errorCntSpan.innerText = parseInt(errorCntSpan.innerText) + 1;
			}
		}
		
		//构造并初始化下载器
		var downloader = new Downloader(batchUrl, singleFile=="true", fileType);
		downloader.ajaxTimeout = ajaxTimeout;
		if (singleFile=="true"){
			downloader.ondowmloadone = function (index, isSuccess, title, content) {
				updateProgress(isSuccess);
			};
			downloader.ondowmloadall = function (len, successCnt, errors, title, contents) {
				if (successCnt != 0) {
					saveAsText(title + '.' + fileType, contents.join('\n\n'));
				}
				if (errors.length!=0){
					saveAsText("失败日志.txt", errors.join('\n\n'));
				}
				progress.value = progress.value + 1;
				alert("下载完成：共需下载"+len+"，成功下载"+successCnt+"，失败下载"+errors.length+"。如有失败请查看`失败日志.txt`");
			}
		} else {
			downloader.ondowmloadone = function (index, isSuccess, title, content) {
				if(isSuccess){
					saveAsText(title + '.' + fileType, content);
				}
				updateProgress(isSuccess);
			};
			downloader.ondowmloadall = function (len, successCnt, errors, title, contents) {
				if (errors.length!=0){
					saveAsText("失败日志.txt", errors.join('\n\n'));
				}
				progress.value = progress.value + 1;
				alert("下载完成：共需下载"+len+"，成功下载"+successCnt+"，失败下载"+errors.length+"。如有失败请查看`失败日志.txt`");
			};
		}

		var paramRule = undefined;

		//使用用户自定义变量生成函数
		if (paramRuleFunction=="true"){ 
			try {
				eval(paramRuleStr)
				if (paramRule==undefined){
					throw "规则函数名必须为paramRule";
				}
			} catch (e) {
				alert("自定义变量生成函数有错误：" + e);
				return;
			}
		} else { //默认使用区间规则的函数
			paramRule = function(save) {
				try {
					var ranges = JSON.parse(paramRuleStr);
				} catch (e) {
					throw "规则必须是合法的json格式"
				}
				var title = undefined;
				var intervals = [];

				function handleNumber(num) {
					intervals.push([num, num, 1]);
				}

				function handleArray(arr) {
					var interval = arr.slice(0);
					for (var i = 0; i < interval.length; i++){
						if (typeof (interval[i]) != 'number') {
							throw "只能是数组元素只能是数字";
						}
					}
					if (interval.length == 1) {
						interval.push(interval[0]);
						interval.push(1);
					} else if (interval.length == 2) {
						interval.push(1);
					} else if (interval.length == 3){
						if (interval[0] < interval[1] && interval[2]<0){
							throw "当start<end时，则step>0"
						}
						if (interval[0] > interval[1] && interval[2] > 0) {
							throw "当start>end时，则step<0"
						}
					} else {
						throw "区间数组长度最大最小为1，最大为3"
					}
					intervals.push(interval);
				}

				function handleIntervals(ranges) {
					if (typeof (ranges) == 'number') { //单个数字
						handleNumber(ranges)
					} else if (ranges instanceof Array) { //是个数组
						//检测子元素是否是数组
						var subArr = false;
						for (var i = 0; i < ranges.length; i++) {
							if (ranges[i] instanceof Array) {
								subArr = true;
								break;
							}
						}
						if (subArr) { //子元素是数组
							for (var i = 0; i < ranges.length; i++) {
								if (typeof (ranges[i]) == 'number') {
									handleNumber(ranges[i]);
								} else if (ranges[i] instanceof Array) {
									handleArray(ranges[i]);
								} else {
									throw "数组元素只能是数字或者数组";
								}
							}
						} else {
							handleArray(ranges);
						}

					} else {
						throw "intervals只能是数字或数组";
					}
				}

				if (typeof (ranges) == 'number' || ranges instanceof Array) { //单个数字
					handleIntervals(ranges);
				} else if ((ranges instanceof Object) && !(ranges instanceof Array)){
					//是一个对象
					if (ranges["title"]){
						title = ranges["title"];
					}
					if (ranges["intervals"]){
						handleIntervals(ranges["intervals"]);
					} else {
						throw "必须包含intervals字段"
					}
				} else {
					throw "区间规则类型错误（只能是对象、数组、数字）";
				}

				for (var i = 0; i < intervals.length; i++){
					if (intervals[i][2]>0){
						for (var j = intervals[i][0]; j <= intervals[i][1]; j += intervals[i][2]) {
							save(j, title);
						}
					} else if (intervals[i][2] < 0){
						for (var j = intervals[i][0]; j >= intervals[i][1]; j += intervals[i][2]) {
							save(j, title);
						}
					} else {
						throw "step不能等于0";
					}
				}
			}
		}

		//执行下载
		try {
			paramRule(function(p,title){
					progress.max = progress.max + 1;
					totalCntSpan.innerText = progress.max-1;
					downloader.save(p, title);
				});
			downloader.finish();
		} catch (e) {
			alert("规则存在语法错误：" + e);
			return;
		}
		
	}

	this.document.getElementById('batchSavePageAsTxt').onclick = function () {
		batchSave("txt");
	}

	this.document.getElementById('batchSavePageAsMd').onclick = function () {
		batchSave("md");
	}

	//高级功能3：批量下载选中所有链接
	function downloadSelectionLinks(){
		var linksJson = localStorage.getItem("selectionLinks");
		localStorage.removeItem("selectionLinks");
		if (linksJson == undefined || linksJson == "") {
			return;
		}


		var paramRuleStr = 'function paramRule(save) {' + '\n' +
		'	var links = ' + linksJson + ';' + '\n' +
		'	for(var i=0; i<links.length; i++){' + '\n' +
		'		save(links[i]);' + '\n' +
		'	}' + '\n' +
		'}';

		//设置URL
		document.getElementById("batchUrl").value = "{p}";

		//设置使用规则函数
		document.getElementById("paramRuleFunction").value = "true";

		//设置规则函数
		document.getElementById("paramRule").value = paramRuleStr;

		if (confirm("是否确认下载：\n格式-txt，保存为-单文件\n若要自定义配置，点击取消")){
			setTimeout(function () {
				batchSave('txt');
			}, 500);
		}
	}
	downloadSelectionLinks();

}



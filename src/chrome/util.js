function getInput(id) {
	var value = document.getElementById(id).value.replace(/(^\s*)|(\s*$)/g, "");
	return value;
}

function getInputAndClear(id) {
	var value = getInput(id);
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


//Ajax请求
function Ajax(url){
	function AjaxObject(url){
		this._url = url;
		this._params = {};
		this._method = "GET";
		this._async = true;
		this._success =function (content) {};
		this._error = function (status, content) {};
	}

	AjaxObject.prototype.param = function (paramObj) {
		if(arguments.length==1){
			if (paramObj instanceof Object){
				this._params = Object.assign(this._params, paramObj);
			} else {
				throw "单参数情况下必须是一个Object"
			}
		} else if(arguments.length%2==0){
			for(var i=0; i<arguments.length; i+=2){
				if (typeof (arguments[i]) == "string"){
					this._params[arguments[i]] = arguments[i+1];
				} else {
					throw "第" + i + "个参数 " + arguments[i] + " 必须为字符串类型"
				}
			}
		} else {
			throw "参数数目不能是基数";
		}
		return this;
	}

	AjaxObject.prototype.success = function (fn) {
		this._success = fn;
		return this;
	}

	AjaxObject.prototype.error = function (fn) {
		this._error = fn;
		return this;
	}

	AjaxObject.prototype.async = function (isAsync) {
		this._async = isAsync;
		return this;
	}

	function handleParams(params) {
		var arr = [];
		for (var i in params) {
			if (data[i] instanceof Array) {
				for (var j in data[i]) {
					arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i][j])); //得到name=Lee,age=100
				}
			} else {
				arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i])); //得到name=Lee,age=100
			}
		}
		return arr.join('&');
	}

	//为了解决乱码问题，使用blob和FileReader进行解码
	function handleResponseBlob(blob, contentType, cb) {
		if (contentType && contentType.indexOf("=") != -1) { //头指定了编码
			// var charset = contentType.substr(contentType.indexOf("=")+1);
			var reader = new FileReader();
			reader.onload = function (e) {
				cb(reader.result); //回调传递参数
			}
			reader.readAsText(blob);
		} else {
			var reader = new FileReader();
			reader.onload = function (e) {
				var grp = reader.result.match(/charset=(.+?)["\s]/);
				if(grp==null){
					cb(reader.result);
				}  else {
					var reader1 = new FileReader();
					reader1.onload = function (e) {
						cb(reader1.result); //回调传递参数
					}
					reader1.readAsText(blob, grp[1]);
				}
			}
			reader.readAsText(blob);
		}
	}

	AjaxObject.prototype.exec = function() {
		//处理参数
		var url = this._url
		var body = handleParams(this._params);
		//GET方式
		if (Object.keys(this._params).length != 0 && this._method=='GET') {
			url += url.indexOf('?') == -1 ? '?' : '&';
			url += body;
		}
		
		//创建XHR
		var xhr = new XMLHttpRequest();
		//若是异步创建异步处理函数
		if (this._async === true) { 
			var self = this;
			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						var blob = this.response;
						var contentType = xhr.getResponseHeader('content-type')
						handleResponseBlob(blob, contentType, self._success);
					} else {
						var blob = this.response;
						var contentType = xhr.getResponseHeader('content-type')
						handleResponseBlob(blob, contentType, function name(text) {
							self._error(xhr.status, text);
						});
					}
				}
			};
		};
		xhr.open(this._method, url, this.async);
		xhr.responseType = "blob";
		if (this._method !== 'GET') { //非GET方式
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(body);
		} else {
			xhr.send(null);
		}
		if (this._async === false) {
			if (xhr.status == 200) {
				var blob = this.response;
				var contentType = xhr.getResponseHeader('content-type')
				handleResponseBlob(blob, contentType, self._success);
			} else {
				var blob = this.response;
				var contentType = xhr.getResponseHeader('content-type')
				handleResponseBlob(blob, contentType, function name(text) {
					self._error(xhr.status, text);
				});
			}
		}
		return this;
	}

	AjaxObject.prototype.get = function () {
		this._method = "GET";
		return this.exec();
	}

	AjaxObject.prototype.post = function () {
		this._method = "POST";
		return this.exec();
	}

	return new AjaxObject(url);
}

//html文本过滤：提取body内部的内容，去除script内容
function htmlFilter(html){
	var result;
	//获取标题
	result = html.match(/<title[\s\S]*?>([\s\S]+)<\/title[\s]*?>/);
	if(result == null){
		return undefined;
	}
	var title = result[1].replace(/(^\s*)|(\s*$)/g, "");

	//获取内容
	result = html.match(/<body[\s\S]*?>([\s\S]+)<\/body[\s]*?>/);
	if (result == null) {
		result = html.match(/<body[\s\S]*?>([\s\S]+)$/);
		if(result == null){
			return undefined;
		}
	}
	var content = result[1].replace(/(^\s*)|(\s*$)/, "");
	content = content.replace(/<script[\s\S]*?<\/script>/g, "");
	content = content.replace(/<style[\s\S]*?<\/style>/g, "");
	return {
		title:title,
		content:content
	}
}

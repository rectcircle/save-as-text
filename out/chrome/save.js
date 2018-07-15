/**
 * 以utf8编码将content保存到文件系统中，文件名为fileName
 * @param {string} fileName 文件名
 * @param {String} content 文件内容
 */
function saveAsText(fileName, content) {
	blobOptions = {
		type: "text/plain;charset=utf-8"
	};

	//创建Blob对象
	var pf = window.navigator.platform;
	if (pf == "Win32" || pf == "Windows") {
		content = '\uFEFF' + content;
	}
	var blob = new Blob([content], blobOptions);

	//使用a标签下载文件
	var a = document.createElement('a');

	//设置文件名
	a.innerHTML = fileName;
	a.download = fileName;

	//设置下载内容
	a.href = URL.createObjectURL(blob);

	//将此此节点放入body下
	document.body.appendChild(a);

	//触发点击事件
	var evt = document.createEvent("MouseEvents");
	evt.initEvent("click", false, false);
	a.dispatchEvent(evt);

	//删除标签
	document.body.removeChild(a);
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
		if (!href.startsWith("#")) {
			href = node.href;
		}
		var title = node.title;
		if (title) {
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


//修正csdn代码块问题
turndownService.addRule('csdnCodeFix', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'fenced' &&
			node.nodeName === 'PRE' &&
			node.firstChild &&
			node.firstChild.nodeName === 'CODE' &&
			node.firstChild["firstChild"] &&
			node.firstChild.firstChild.nodeName === 'OL'
		)
	},

	replacement: function (content, node, options) {
		var className = node.firstChild.className || '';
		var language = (className.match(/language-(\S+)/) || [null, ''])[1];
		var lis = node.firstChild.firstChild.children;
		var codeContent = "";
		for(var i =0; i<lis.length; i++){
			codeContent += lis[i].textContent +'\n';
		}
		return (
			'\n\n' + options.fence + language + '\n' +
			codeContent +
			options.fence + '\n\n'
		)
	}
});

//修正博客园代码块问题1，例子：https://www.cnblogs.com/zyy1688/p/9273579.html
turndownService.addRule('cnblogsCodeFix1', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'fenced' &&
			node.nodeName === 'TABLE' &&
			node.querySelector('td.gutter') != null &&
			node.querySelector('td.code') != null &&
			node.querySelector('div.container') != null
		)
	},

	replacement: function (content, node, options) {
		var className = node.firstChild.className || '';
		var language = (className.match(/language-(\S+)/) || [null, ''])[1];
		var codeContent = "";
		var divCodes = node.querySelector('div.container').children;

		for (var i = 0; i < divCodes.length; i++) {
			codeContent += divCodes[i].textContent + '\n';
		}

		return (
			'\n\n' + options.fence + language + '\n' +
			codeContent +
			options.fence + '\n\n'
		)
	}
});


//修正博客园代码块问题2，去除复制代码按钮
turndownService.addRule('cnblogsCodeFix2', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'fenced' &&
			node.nodeName === 'DIV' &&
			node.className === 'cnblogs_code' && 
			node.querySelector('pre') != null
		)
	},

	replacement: function (content, node, options) {
		var className = node.firstChild.className || '';
		var language = (className.match(/language-(\S+)/) || [null, ''])[1];
		var codeContent = "";
		var preCodes = node.querySelector('pre');
		codeContent = preCodes.textContent;

		return (
			'\n\n' + options.fence + language + '\n' +
			codeContent +
			'\n' + options.fence + '\n\n'
		)
	}
});


//修正简书代码块：添加语言
turndownService.addRule('jianshuCodeFix', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'fenced' &&
			node.nodeName === 'PRE' &&
			node.firstChild &&
			node.firstChild.nodeName === 'CODE' && 
			window.location.href.indexOf("jianshu.com") !=-1
		)
	},

	replacement: function (content, node, options) {
		var className = node.firstChild.className || '';
		var language = className;

		return (
			'\n\n' + options.fence + language + '\n' +
			node.firstChild.textContent +
			'\n' + options.fence + '\n\n'
		)
	}
});

//修正51cto代码块：添加语言，http://blog.51cto.com/wyait/2125708
turndownService.addRule('51ctoCodeFix', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'fenced' &&
			node.nodeName === 'PRE' &&
			node.firstChild &&
			node.firstChild.nodeName === 'CODE' &&
			window.location.href.indexOf("http://blog.51cto.com") != -1
		)
	},

	replacement: function (content, node, options) {
		var className = node.firstChild.className || '';
		var language = (className.match(/language-(\S+)/) || [null, ''])[1];
		if(language==''){
			language = node.firstChild.classList[1] || '';
		}

		return (
			'\n\n' + options.fence + language + '\n' +
			node.firstChild.textContent +
			'\n' + options.fence + '\n\n'
		)
	}
});


//修正51cto-article代码块问题：http://database.51cto.com/art/201807/577910.htm
turndownService.addRule('csdnArticleCodeFix', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'fenced' &&
			node.nodeName === 'PRE' &&
			node.firstChild &&
			node.firstChild.nodeName === 'OL' &&
			window.location.href.indexOf("51cto.com/art") != -1
		)
	},

	replacement: function (content, node, options) {
		var className = node.firstChild.className || '';
		var language = (className.match(/language-(\S+)/) || [null, ''])[1];
		var lis = node.firstChild.children;
		var codeContent = "";
		for (var i = 0; i < lis.length; i++) {
			codeContent += lis[i].textContent + '\n';
		}
		return (
			'\n\n' + options.fence + language + '\n' +
			codeContent +
			options.fence + '\n\n'
		)
	}
});

//修正开源中国代码块问题：https://my.oschina.net/chkui/blog/1840824
turndownService.addRule('oschinaCodeFix', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'fenced' &&
			node.nodeName === 'PRE' &&
			node.firstChild &&
			node.firstChild.nodeName === 'CODE' &&
			window.location.href.indexOf("my.oschina.net") != -1
		)
	},

	replacement: function (content, node, options) {
		var className = node.firstChild.className || '';
		var language = (className.match(/language-(\S+)/) || [null, ''])[1];
		if (language == '') {
			language = node.firstChild.classList[1] || '';
		}

		return (
			'\n\n' + options.fence + language + '\n' +
			node.firstChild.textContent +
			'\n' + options.fence + '\n\n'
		)
	}
});


//修正chinaunix代码块问题：http://blog.chinaunix.net/uid-31422160-id-5786265.html
turndownService.addRule('chinaunixCodeFix', {
	filter: function (node, options) {
		return (
			options.codeBlockStyle === 'fenced' &&
			(node.className === 'codeheads' || node.className === 'codeText')
		)
	},

	replacement: function (content, node, options) {
		if (node.className === 'codeheads') {
			return '';
		}

		var className = node.firstChild.className || '';
		var language = (className.match(/language-(\S+)/) || [null, ''])[1];

		var lis = node.firstChild.children;
		var codeContent = "";
		for (var i = 0; i < lis.length; i++) {
			codeContent += lis[i].textContent + '\n';
		}

		return (
			'\n\n' + options.fence + language + '\n' +
			codeContent +
			options.fence + '\n\n'
		)
	}
});

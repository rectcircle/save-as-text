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
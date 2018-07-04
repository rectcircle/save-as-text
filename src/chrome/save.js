//@@include('../core/saveAsText.js')

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
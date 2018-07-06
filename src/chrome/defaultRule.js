var defaultRules = [
	{
		"urlPattern": "*blog.csdn.net/*/article/details/*",
		"titleSelector": "h1",
		"buttonFeature": "saveMarkdown",
		"contentSelector": "article"
	},
	{
		"urlPattern": "*www.cnblogs.com/*/p/*",
		"titleSelector": "",
		"buttonFeature": "saveMarkdown",
		"contentSelector": ".post"
	},
	{
		"urlPattern": "*www.jianshu.com/p/*",
		"titleSelector": "h1.title",
		"buttonFeature": "saveMarkdown",
		"contentSelector": "div.show-content"
	},
	{
		"urlPattern": "*blog.51cto.com/*/*",
		"titleSelector": "h1.artical-title",
		"buttonFeature": "saveMarkdown",
		"contentSelector": "div.main-content"
	},
	{
		"urlPattern": "*51cto.com/art/*",
		"titleSelector": "",
		"buttonFeature": "saveMarkdown",
		"contentSelector": "div.zwnr"
	},
	{
		"urlPattern": "*my.oschina.net/*/blog/*",
		"titleSelector": "h1.header",
		"buttonFeature": "saveMarkdown",
		"contentSelector": "div#articleContent"
	},
	{
		"urlPattern": "*blog.chinaunix.net*",
		"titleSelector": "h1.header",
		"buttonFeature": "saveMarkdown",
		"contentSelector": "div.Blog_wz1"
	},
	{
		"urlPattern": "*book.zongheng.com/*",
		"titleSelector": "h1",
		"buttonFeature": "saveText",
		"contentSelector": "#ajax_content"
	}
]
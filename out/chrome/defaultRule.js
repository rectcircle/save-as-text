var defaultRules = [
	{
		"urlPattern": "*blog.csdn.net/*",
		"titleSelector": "h1",
		"buttonFeature": "saveMarkdown",
		"contentSelector": "article"
	},
	{
		"urlPattern": "*www.cnblogs.com/*",
		"titleSelector": "",
		"buttonFeature": "saveMarkdown",
		"contentSelector": ".post"
	},
	{
		"urlPattern": "*book.zongheng.com/*",
		"titleSelector": "h1",
		"buttonFeature": "saveText",
		"contentSelector": "#ajax_content"
	}
]
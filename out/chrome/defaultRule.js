var defaultRules = [
	{
		"globPattern": "https://blog.csdn.net/**",
		"titleSelector": "h1",
		"buttonFeature": "saveMarkdown",
		"contentSelector": "article"
	},
	{
		"globPattern": "https://www.cnblogs.com/**",
		"titleSelector": "",
		"buttonFeature": "saveMarkdown",
		"contentSelector": ".post"
	},
	{
		"globPattern": "http://book.zongheng.com/**",
		"titleSelector": "h1",
		"buttonFeature": "saveText",
		"contentSelector": "#ajax_content"
	}
]
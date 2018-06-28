/**
 * 添加一个下载按钮到页面
 */
function addButtonToBody() {
	var img = document.createElement('img');
	//指定图片
	img.src = iconBase64;
	//配置添加到页面的元素的样式
	img.style = "position:fixed; right:20px; bottom:20px; width:50px; " + //设置位置大小
		"z-index:2147483647; cursor:pointer; " + //设置在最上层，手型
		"border: 2px solid #999; border-radius: 70px; padding:10px; " + //边框
		"background-color:#222; opacity: 0.8;"; //颜色与透明度
	img.alt = "Save as Text";
	img.title = "Save as Text"
	//单击事件，保存当前页面
	img.onclick = function () {
		var fileName = document.title + ".txt";
		var content = document.body.innerText;
		saveAsText(fileName, content);
	};
	document.body.appendChild(img);
}
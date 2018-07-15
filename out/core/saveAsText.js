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
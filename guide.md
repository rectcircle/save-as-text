# Save as Text 使用指南


<!-- @import "[TOC]" {cmd="toc" depthFrom=2 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

* [安装](#安装)
* [扩展入口](#扩展入口)
* [扩展功能](#扩展功能)
* [保存单页面](#保存单页面)
* [保存选中内容](#保存选中内容)
* [悬浮按钮](#悬浮按钮)
	* [显示悬浮按钮设置](#显示悬浮按钮设置)
	* [悬浮按钮功能选择](#悬浮按钮功能选择)
* [保存规则设置](#保存规则设置)
	* [自动提取方式](#自动提取方式)
	* [手动配置方式](#手动配置方式)
* [保存当前窗口打开的所有页面](#保存当前窗口打开的所有页面)
* [批量下载页面](#批量下载页面)
	* [区间规则](#区间规则)
		* [单个区间](#单个区间)
		* [多区间](#多区间)
		* [显示指定文件名（不包括后缀）](#显示指定文件名不包括后缀)
	* [变量生成函数](#变量生成函数)

<!-- /code_chunk_output -->


## 安装


## 扩展入口

* 页面上下文菜单（右键菜单）
* 页面注入的悬浮按钮（可选打开）
* 扩展弹出窗口（单击扩展图标）
* 扩展选项页
  * 和弹出窗口是同一个页面
  * 右击扩展图标，选择`选项`


## 扩展功能

* 支持将网页保存为如下格式
  * 纯文本文件
  * Markdown格式文件
* 一键保存单个页面
* 一键保存单个页面的选定内容
* 一键保存当前窗口打开的所有页面
* 批量保存给定URL和变量模式的内容
* 支持对特定URL模式的个性化配置：
  * 配置按钮功能
  * 配置如何从页面中提取文件名
  * 配置如何从页面中提取文件内容

## 保存单页面
在浏览器中需要保存的页面上，鼠标右击，选择`保存为文本文件`，一共有两个选项：
![chrome-context-menu](/assets/chrome-context-menu.png)

* `保存当前页面为纯文本文件` 这种方式保存的是纯文本，没有任何格式的文件，文件扩展名为`.txt`
* `保存当前页面为Markdown格式的文件` 这种方式是将HTML文件反向解析成Markdown格式，文件扩展名为`.md`


默认情况下，保存的下来的文件名为页面的标题，文件内容为页面全部


## 保存选中内容

选中需要保存的内容， `右击` -> `保存文本文件` -> `保存选中内容为无格式的文本文件`

## 悬浮按钮

本扩展提供更便捷的保存页面内容的方式——在每页面上注入一个下载按钮。单击扩展按钮即可

### 显示悬浮按钮设置

默认该功能不开启，开启方式为：

打开扩展弹出窗口或者扩展选项，`是否显示悬浮按钮`选项，选择`是`，刷新页面，将在页面右下角显示一个下载按钮

![chrome-popup](/assets/chrome-popup.png)

![chrome-download-button](/assets/chrome-download-button.png)


### 悬浮按钮功能选择

悬浮按钮个功能可以自定义，在扩展弹出窗口或者扩展选项中设置。

注意：在规则设置中，按钮保存格式选项，将覆盖这个选择项


## 保存规则设置

保存规则指的是：对一类页面，保存时文件名如何生成，保存的文件内容是页面的那些部分

本扩展支持对特定URL模式的个性化配置：

* 配置按钮功能
* 配置如何从页面中提取文件名
* 配置如何从页面中提取文件内容

### 自动提取方式

* 标题模式提取：
选择页面中适合内容作为标题的文字。`右击` -> `保存文本文件` -> `提取选中内容规则，添加到页面规则中的“标题选择器”`
* 内容模式：
选择页面中适合作为标题的文字。`右击` -> `保存文本文件` -> `提取选中内容规则，添加到页面规则中的“标题选择器”`

![chrome-pattern](/assets/chrome-pattern.png)

此后再使用扩展的保存功能，此类型的页面将以提取出来的模式匹配的内容作为文件名和内容。

提取出来的模式可以在 扩展弹出窗口或者扩展选项 查看

此种方式可能不准确，若想精确配置，可以[手动配置](#手动配置方式)

### 手动配置方式

注意：此内容需要料及HTML、CSS先关知识

每个规则有如下内容：

* 序号
  * 表示匹配顺序，从零开始匹配，如果序号小的匹配通过，后面的将不在匹配
* URL模式
  * 扩展将URL与该字段进行匹配，支持通配符如下：
  * `*` 0个或多个字符
  * `?` 1个字符
* 标题选择器
  * 语法为CSS DOM元素选择器
  * 扩展将会根据此字段从页面中选择元素
  * 如果有多个被选中，将选择第一个作为标题
* 内容选择器
  * 语法为CSS DOM元素选择器
  * 扩展将会根据此字段从页面中选择元素
  * 如果有多个被选中，所有被选中的元素将被提取内容并保存到文件
* 格式
  * 可选`txt`和`md`
  * 表示若使用悬浮按钮时，悬浮按钮的功能

配置方式，扩展弹出窗口或者扩展选项

## 保存当前窗口打开的所有页面

打开扩展弹出窗口或者扩展选项，点击`高级`下的按钮
* `保存当前窗口所有页面为纯文本文件`
* `保存当前窗口所有页面为Markdown文件`


## 批量下载页面

建议此功能在`扩展选项页面`使用，以防止弹出窗口无意中被关闭。

功能描述：页面批量下载，并保存为纯文本文件或markdown格式文件。

该功能使用可能需要JavaScript相关知识

需要提供的信息

* URL
  * 需要下载的URL，支持字符串替换，使用`{p}`标记
* 是否保存到单文件
  * 是：将所有URL下载处理完成后保存到单一文件，文件名为第一个下载完成的页面的标题
  * 否：将下载文件保存到多个文件
* 是否使用变量生成函数
  * 是，将使用变量生成函数
    * URL中的`{p}`的生成函数
    * 签名在稍后详细描述
  * 否，使用区间描述
* 变量生成规则
  * 若`是否使用变量生成函数`为`是`，在此填写函数内容
  * 若`是否使用变量生成函数`为`否`，在此填写区间，语法稍后详细描述


### 区间规则

对于URL中的变量`{p}`将被替换为区间规则中的每一个整数

**例子**

如果你想下载url为如下内容的页面

```http
http://example.cn/files/yuanchuang/201102/1530/35120.html
http://example.cn/files/yuanchuang/201102/1530/35121.html
http://example.cn/files/yuanchuang/201102/1530/35122.html
...
http://example.cn/files/yuanchuang/201102/1530/35164.html
```

你可以这项填写内容
* URL： `http://example.cn/files/yuanchuang/201102/1530/{p}.html`
* 是否保存到单文件：`是`
* 是否使用变量生成函数：`否`
* 规则：
```json
[35120, 35164]
```

然后点击`批量下载为纯文本文件`即可


**区间规则语法**

需要符合如下JSON格式


#### 单个页面
```json
number
```
* `number`为一个数字

#### 单个区间
```json
[start, end=start, step=1]
```
* `start`：开始（包括）
* `end`：结束（包括），可省略，
* `step`：步长，可省略，非零整数
* 若`step`为正数，则`end>=start`
* 若`step`为负数，则`end<=start`

转换为for循环如下（step为正数）
```js
var rule = [start, end=start, step=1];
for(var i=rule[0]; i<=rule[1]; i+=rule[2]{
}
```

例子
* `[35120]` 单页面
* `[35120,35164]` 35120到35164连续的页面
* `[35120,35164,2]` 步长为2的页面


#### 多区间
```json
[区间1, 区间2, 区间3]
```

例子：
* `[[35110],[35120,35164], [35170,35184,2]]`


#### 显示指定文件名（不包括后缀）
```json
{
  "title":"文件名",
  "intervals":区间
}
```

如果，是`保存到多文件`，真正的文件名应该为：`文件名$index.[md|txt]`，`$index`指的是文件是第几个开始下载的，从0开始

例子
```json
{
  "title":"文件名",
  "intervals":[[35110],[35120,35164], [35170,35184,2]]
}
```

### 变量生成函数
对于URL中的变量`{p}`将被替换为变量生成函数生成的内容

函数语法为JavaScript，声明如下
```js
function paramRule(save) {
	var ranges = [35120,35164,1]
	for (var i = ranges[0]; i <= ranges[1]; i += ranges[2]) {
		save(i);
	}
}
```

* `save`是一个内部函数，当调用时将执行一个下载，签名如下
```js
/**
 * p表示要替换`{p}`的值
 * title为文件的标题，选填
 */
function save(p, title){

}
```


例子（下载35120到35164，并指定标题）

```js
function paramRule(save) {
  var ranges = [35120,35164,1];
  var title = "文件名";
  for (var i = ranges[0]; i <= ranges[1]; i += ranges[2]) {
    save(i, title);
    //不指定标题save(i);
  }
}
```
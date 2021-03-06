// ==UserScript==
// @name         Save As Text
// @name:zh      保存为纯文本文件
// @supportURL   https://github.com/rectcircle/save-as-text
// @downloadURL  https://raw.githubusercontent.com/rectcircle/save-as-text/master/out/userscript/save-as-text.user.js
// @namespace    https://github.com/rectcircle/save-as-text
// @license      MIT
// @version      1.0.1
// @description         Save the Page as Plain text file
// @description:zh      将当前网页保存为纯文本文件
// @author       Rectcircle <rectcircle96@gmail.com>
// @icon         //@@include('../core/icon')
// @include      *
// @run-at      document-end
// ==/UserScript==

//@@include('../core/saveAsText.js')
//@@include('../core/iconBase64.js')
//@@include('../core/addButtonToBody.js')

addButtonToBody();
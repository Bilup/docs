---
slug: /packager/offline
hide_table_of_contents: true
sidebar_label: 离线打包器
---

# 离线打包器

有方法可以离线使用 [Bilup 打包器](https://packager.bilup.org/)，这在各种情况下都很有用(例如，也许你的学校屏蔽了 editor.bilup.org)。

~~我们的目标是大约每月更新一次离线打包器。~~

大型文件(如 Electron、NW.js 或 WKWebView 可执行文件)*不*包含在离线打包器中，会根据需要单独下载。打包器会尝试在你第一次下载后离线缓存这些文件，所以它们只需要下载一次。通常，即使你的学校屏蔽了 editor.bilup.org，这些下载仍然有效。

## 基于网页的打包

Bilup 的打包器可在 [packager.bilup.org](https://packager.bilup.org/) 在线获取，完全在你的浏览器中运行。

大型文件(如运行时库)会根据需要单独下载。打包器会在你第一次下载后尝试缓存这些文件，所以它们只需要下载一次。

## 独立 HTML {#html}

对于离线使用，你可以从 GitHub 下载独立 HTML 版本。访问 https://github.com/Bilup/packager/releases 并从最新版本下载「Assets」下的「bilup-packager-standalone-x.x.x.html」。你可以在浏览器中直接打开这个 HTML 文件。

HTML 文件不包含任何更新检查器。你需要自己检查和处理更新。

## 网页应用 {#pwa}

https://packager.bilup.org/ 是一个在加载一次后尝试离线工作的网页应用。这仍然是实验性的，我们不建议依赖于此。

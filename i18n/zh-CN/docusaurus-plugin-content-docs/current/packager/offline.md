---
title: 离线打包器
sidebar_position: 6
slug: /packager/offline
---

# 离线打包器

[Bilup 打包器](/packager/overview)完全在您的浏览器中运行，并且有一些方法可以在没有互联网连接的情况下运行它，这在网络阻止 `editor.bilup.org` 或您离线时很有帮助。

大型运行时资源（用于原生构建的 Electron、NW.js 和 WKWebView 可执行文件）**不会**捆绑到打包器中。它们在特定输出格式需要时单独下载，打包器在第一次下载后缓存它们，因此每种只需获取一次。这些下载通常即使在 `editor.bilup.org` 被阻止的地方也能工作。

## 独立 HTML 构建

要完全离线使用，请下载打包器本身的独立副本：

1. 前往 [github.com/Bilup/packager/releases](https://github.com/Bilup/packager/releases)。
2. 在最新版本的 Assets 下，下载独立 HTML 文件（其名称包含 `standalone`）。
3. 在浏览器中打开该 HTML 文件。

此文件没有更新检查器，因此当您想要更新时请自行检查较新的版本。

## 可安装 Web 应用

[packager.bilup.org](https://packager.bilup.org/) 是一个 Web 应用，在您加载一次后尝试保持离线工作。这是实验性的，因此不要在任何重要的事情上依赖它；为保证离线使用，请优先选择独立 HTML 构建。

## 另请参阅

- [打包器概览](/packager/overview)

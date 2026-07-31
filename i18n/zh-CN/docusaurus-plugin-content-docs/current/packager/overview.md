---
title: 概览
sidebar_position: 1
---

# Bilup 打包器

Bilup 打包器将 Scratch 或 Bilup 项目变成独立程序：单个 HTML 文件、zip，或 Windows、macOS、Linux 的原生可执行文件。输出不需要编辑器或互联网连接即可运行，并且捆绑了 Bilup 快速的编译运行时。

在 [packager.bilup.org](https://packager.bilup.org/) 使用它。

它与 HTMLifier 或 forkphorus 打包器扮演相同的角色，但提供更多输出格式，并对加载屏幕、控件和运行时设置拥有更多控制。

## 您可以做什么

- **将项目作为单个文件分享。** 给某人一个 HTML 文件，他们可以在任何浏览器中打开，周围没有 Bilup 品牌。
- **发布桌面应用。** 打包为像原生程序一样运行的 Electron、NW.js 或 WKWebView 可执行文件。
- **嵌入您完全控制的项目。** [嵌入打包文件](/packager/embedding)，而不是依赖托管的嵌入。
- **离线或在受限网络上运行。** 请参阅[离线打包器](/packager/offline)。

## 将项目放入打包器

您有几个选项：

- 输入 Scratch 项目 ID 或直接项目 URL。
- 从电脑上传 `.sb3` 文件。
- 直接从编辑器发送当前项目。请参阅[编辑器集成](/packager/editor-integration)。

请记住，[未共享的 Scratch 项目](/advanced/unshared-projects)不能通过 ID 加载；请下载 `.sb3` 并改为上传。

## 常用设置

打包器公开与编辑器相同的大多数运行时选项，包括[自定义 FPS](/advanced/custom-fps)、[插值](/advanced/interpolation)、[高质量画笔](/advanced/high-quality-pen)和[自定义舞台大小](/advanced/custom-stage-size)。它还添加打包器特有的功能：

- [动态舞台缩放](/packager/dynamic-stage-resize) 让舞台跟随窗口或全屏大小。
- [特殊云行为](/packager/special-cloud-behaviors) 用于具有特殊名称的云变量。

## 另请参阅

- [嵌入打包项目](/packager/embedding)
- [编辑器集成](/packager/editor-integration)
- [离线打包器](/packager/offline)
- [我可以出售打包项目吗?](/packager/commercial-use)

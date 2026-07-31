---
title: 自定义扩展简介
sidebar_position: 1
---

# 自定义扩展简介

自定义扩展用 JavaScript 为 Bilup 添加新积木。本教程从最简单的扩展逐步构建到功能完整的扩展，一次一个概念。请按顺序阅读各页，并在继续之前完成练习；每一页都假设您理解了上一页。

如果您只想使用现有积木，您不需要这些。打开编辑器，点击"添加扩展"按钮（积木区左下角两个积木旁边的加号），然后选择一个内置扩展。本教程面向想编写自己的扩展的人。

## "扩展"可以指什么

这个词用于几种不同的事情：

| | 可以访问 Bilup 内部 | 可以通过 URL 加载 |
|:-:|:-:|:-:|
| 内置扩展（画笔、音乐等） | 是 | 否 |
| 沙箱自定义扩展 | 否 | 是 |
| 非沙箱自定义扩展 | 是 | 是 |

这些页面只涵盖**自定义**扩展（沙箱和非沙箱类型）。内置扩展共享相同的积木描述格式，但捆绑在编辑器构建本身中，因此开发它们是涉及 [scratch-vm 源码](/contributing/project-structure)的不同过程。[沙箱和非沙箱之间的区别](/building-extensions/sandbox)稍后介绍。

## 兼容性

自定义扩展是 Bilup 和 TurboWarp 的功能。使用它们的项目不能上传到 Scratch 网站。它们在 Bilup 编辑器中工作，并且可以通过[Bilup 打包器](/packager/overview)捆绑到独立应用或网页中，打包器总是以非沙箱方式运行扩展。

## 先决条件

编写扩展需要了解 JavaScript。如果您还不知道 `"1"`（字符串）和 `1`（数字）之间的区别，请先学习 JavaScript；否则扩展开发会非常困难。本教程不教授这门语言。

您还需要浏览器的开发者工具。它们通常在右键单击下，然后是"检查"，或在桌面应用中是 Ctrl+Shift+I（macOS 上是 Option+Command+I）。不打开控制台编写 JavaScript 是痛苦的，而且您遇到的大多数问题只会在那里可见。

## 设置开发环境

有几种方法可以加载您正在开发的扩展。

### 从文件或粘贴的代码加载（最简单）

在编辑器中，"添加扩展"，滚动到底部，选择"自定义扩展"。对话框让您直接粘贴 JavaScript 或选择本地文件。这在任何只有文本编辑器的机器上都能工作，但您每次更改它都必须重新粘贴或重新选择文件。

### 本地 HTTP 服务器（推荐）

本地 Web 服务器让 Bilup 通过 URL 获取您的扩展，因此更改后只需重新加载页面。如果您安装了 Python，您已经有了一个服务器：

```bash
cd path/to/your/extensions
python3 -m http.server 8080
```

那会在 `http://localhost:8080/` 提供当前文件夹。在该文件夹中放一个名为 `hello-world.js` 的文件，并在继续之前确认您可以在浏览器中打开 [http://localhost:8080/hello-world.js](http://localhost:8080/hello-world.js)。

现在请使用**不是 8000** 的端口。端口 8000 很特殊：它是 Bilup 信任用于运行[非沙箱](/building-extensions/unsandboxed)的 URL 之一，这带有我们还没有准备好的额外责任。从沙箱开始。

稍后我们会介绍[一个专门的开发服务器](/building-extensions/better-development-server)，但从最原始的设置开始可以让各个部分可见。

## 下一步

让我们[编写您的第一个扩展](/building-extensions/hello-world)。

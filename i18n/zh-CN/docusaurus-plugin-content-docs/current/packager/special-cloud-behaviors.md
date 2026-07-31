---
title: 特殊云行为
sidebar_position: 5
slug: /packager/special-cloud-behaviors
---

# 特殊云行为

::::info
这是[Bilup 打包器](/packager/overview)的选项。
::::

"特殊云行为"是一个选项（默认关闭），它给具有特殊名称的[云变量](/advanced/cloud-variables)特殊能力，使打包项目可以与它运行的页面交互。它基于 [HTMLifier 中的相同功能](https://github.com/SheepTester/htmlifier/wiki/Special-cloud-behaviours)，您可以在打包器的"云变量"部分启用它。

要使用一个，请创建一个名称与下面列出完全相同的普通云变量。例如，对于 `☁ url`，创建一个名为 `url` 的云变量。

启用特殊云行为会覆盖这些名称的正常云处理，因此像 `☁ username` 这样的变量永远不会在本地存储或与其他玩家同步。

## 只读

### ☁ url
设置为页面当前的 URL。写入它不做任何事情。

### ☁ pasted
当用户在页面上粘贴文本时（例如用 Ctrl+V），粘贴的文本会放在这里。

## 操作

### ☁ redirect
将其设置为一个 URL，当前标签页会导航到那里。

### ☁ open link
将其设置为一个 URL，在新标签页中打开该 URL。浏览器弹出窗口拦截器可能会阻止这一点。

### ☁ username
更改它会在侦测分类中更改 `用户名` 积木返回的值。

### ☁ set clipboard
更改它会尝试将文本复制到用户的剪贴板。浏览器并不总是允许。

### ☁ room id
更改它会改变用于同步云变量的项目 ID。如果原始 ID 是 `1234`，您将 `☁ room id` 设置为 `xyz`，同步 ID 变成 `1234-xyz`。将其设置回空字符串以恢复原始值。只有共享房间 ID 的玩家彼此同步，这使它成为无需额外变量的简单服务器选择器。重新连接可能需要几秒钟。这不影响本地存储的云变量。

## 运行代码

### ☁ eval

::::warning
这需要单独的"不安全的特殊云行为"选项。不安全的行为让打包项目在正常项目沙箱之外运行任意代码。根据您打包的内容，这可以给项目对其运行的电脑的完全控制权，包括安装恶意软件。除非您信任该项目并实际使用此功能，否则请保持关闭。
::::

设置 `☁ eval`，其值会作为 JavaScript 运行。结果写入 `☁ eval output`，错误写入 `☁ eval error`。如果代码返回一个 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)，解析值或拒绝错误会在它结算时写入这些变量。设置 `☁ eval` 会立即返回，因此输出变量可能不会在同一帧更新。

## 另请参阅

- [云变量](/advanced/cloud-variables)
- [打包器概览](/packager/overview)

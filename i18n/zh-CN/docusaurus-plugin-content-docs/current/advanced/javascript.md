---
title: JavaScript 与编译器
sidebar_position: 2
---

# JavaScript 与编译器

JavaScript 以三种方式出现在 Bilup 中：**编译器**会自动将您的积木转换为 JavaScript 以提高速度，**补丁扩展**提供 `js (...)` 积木让您在项目中运行自己的 JavaScript，**扩展系统**让您用 JavaScript 编写自己的完整积木。本页涵盖这三者。

## 编译器

每次项目运行时，Bilup 都会将您的脚本编译为浏览器可以直接运行的 JavaScript，而不是逐个解释积木。这是项目在 Bilup 中比原版 Scratch 运行快得多的主要原因。它是自动发生的，无需开启任何东西，结果与积木在 Scratch 中的行为相同（除了更快）。

脚本在首次运行时编译。如果项目似乎在脚本首次触发时短暂停顿，那就是编译发生了一次；它不会重复。

您几乎不需要考虑编译器。您可能需要考虑它的两种情况：

- **调试编译器 bug。** 如果脚本在 Bilup 中的行为与在 Scratch 中不同，您可以关闭编译器检查是否是编译器的错。请参阅[禁用编译器](/advanced/disable-compiler)。
- **查看生成的代码**（见下文）。

## 在项目内部运行 JavaScript

[**补丁扩展**](/extensions/patching) 添加了可运行您在项目中直接编写的 JavaScript 的积木：

- **报告型** `js (...)`，返回 JavaScript 表达式的值，
- **布尔型** `js (...)`，用于条件判断，
- **命令型** `js (...)`，运行一条语句。

由于 JavaScript 被拼接到编译输出中，这些积木只在编译器开启时工作；禁用编译器后它们会抛出"补丁积木需要编译器"。这是直接的"粘贴一些 JavaScript"路径，与页面上运行的任何代码一样，只运行您理解的 JavaScript。

## 用 JavaScript 编写自己的积木

如果您需要的不仅仅是一行内表达式（调用 Web API、使用浏览器功能或添加可复用的自己的积木），请编写一个**非沙箱扩展**。非沙箱扩展在与编辑器相同的上下文中运行，可以完全访问 VM、渲染器以及 `fetch` 和 `localStorage` 等普通浏览器 API。

这是真正的编程任务，不是积木。完整指南在[构建扩展](/building-extensions/introduction)，非沙箱环境的具体细节在[非沙箱扩展](/building-extensions/unsandboxed)。您可以通过 [`extension` URL 参数](/advanced/url-parameters#extension) 从 URL 加载扩展：

```
https://editor.bilup.org/?extension=https://example.com/extension.js
```

::::warning
非沙箱扩展以完全访问权限在页面上运行。只加载来自可信来源的扩展。恶意扩展可以做您的浏览器能做的任何事情。
::::

## 查看生成的 JavaScript

Bilup 生成的 JavaScript **不是为人类阅读或编辑而设计的**。它针对速度和兼容性进行了优化，而不是可读性。例如，读取列表项可能编译为 `(b1.value[(b0.value | 0) - 1] ?? "")`，其中 `b0` 和 `b1` 是内部变量名。没有格式，也没有注释。

如果您仍然想查看，请在启动项目前打开浏览器的 JavaScript 控制台并运行：

```js
vm.enableDebug();
```

每个脚本编译时，其编译后的 JavaScript 都会记录到控制台。要关闭日志：

```js
vm.disableDebug();
```

如果您想**学习** Scratch 项目在 JavaScript 中会是什么样子，编译器输出不是合适的工具。请改用像 [Leopard](https://leopardjs.com/) 这样的项目转 JavaScript 转换器，它会产生干净、可读的代码。

## 使用自定义代码打包

要将项目作为独立 HTML 文件或应用发布，请使用[Bilup 打包器](/packager/overview)。打包器将编译后的运行时与您的项目捆绑在一起，使其在任何地方都能运行，无需编辑器。

## 另请参阅

- [补丁扩展](/extensions/patching)
- [禁用编译器](/advanced/disable-compiler)
- [构建扩展](/building-extensions/introduction)
- [URL 参数](/advanced/url-parameters)

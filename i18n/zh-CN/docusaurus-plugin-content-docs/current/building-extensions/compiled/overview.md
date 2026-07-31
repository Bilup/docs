---
title: 编译扩展概览
sidebar_position: 1
---

# 编译扩展

Bilup 不逐积木解释项目。它**编译**它们：积木被转换为 JavaScript，浏览器以原生速度运行。普通扩展积木是编译代码调用的函数，这对大多数事情来说足够快，但仍然是一种解释器风格的调用。

编译扩展更进一步。它告诉编译器如何将您的积木*内联*转换为 JavaScript，因此完全没有对您的函数的调用。对于数学积木，这就是"调用返回 `Math.pow(a, b)` 的扩展"和直接向脚本中发射 `Math.pow(a, b)` 之间的区别。

## 何时值得

编译积木只在积木很小且运行很多时有帮助：数学、字符串处理和其他紧密循环操作。它对以真实工作为主的积木（网络请求、绘制、等待）没有作用，并且它增加了复杂性。

在以下情况使用编译积木：

- 操作便宜但每帧被调用数千次，并且解释器开销出现在性能分析中。
- 您可以将积木表示为短的 JavaScript 表达式。

当积木做任何实质性的工作时、在原型设计时，或额外复杂性不值当时，请坚持使用[普通扩展](/building-extensions/introduction)。

## 要求

- 编译扩展必须以[非沙箱](/building-extensions/unsandboxed)方式运行；它们使用只在主页面中存在的 `Scratch.vm.exports`。
- 它们依赖 Bilup 的编译器，因此它们在 Bilup 和[打包器](/packager/overview)中运行，但在标准 Scratch 中不运行。
- 您总是提供普通的 `func` 回退，使积木在编译器关闭时仍然工作（例如当监视器读取报告积木时，或如果用户禁用编译器）。

## 两种做法

Bilup 在 `Scratch.vm.exports` 上暴露两个编译器入口点：

- **`vm.exports.compiler.register(...)`** 是受支持的、稳定的方式。您为每个积木注册一个返回 JavaScript 源字符串的小 `compile` 函数。本节的其余部分教的就是这个。
- **`vm.exports.i_will_not_ask_for_help_when_these_break()`** 为*旧的* TurboWarp 风格（修补编译器内部生成器）返回一个兼容垫片。它的存在是为了让较旧的编译扩展继续工作。这个名字是一个字面警告：它不受支持，按约定没有文档，并且可能在任何版本中损坏。只用它来让遗留扩展运行；用 `compiler.register` 编写新的。请参阅[修补编译器](/building-extensions/compiled/patching)。

## 开始

先阅读[普通扩展开发](/building-extensions/introduction)；编译积木仍然是一个带编译器入口的普通积木。然后继续[扩展结构](/building-extensions/compiled/structure)。

---
title: 补丁
sidebar_position: 3
---

# 补丁

**补丁**扩展让您在积木中编写原始 JavaScript。项目编译时，该 JavaScript 被直接注入生成的代码中，并作为编译线程的一部分运行。它是内置的，并被标记为与 Scratch 不兼容。

从**添加扩展**加载它并选择**补丁**。

## 积木

### js `[代码]`（报告）

```scratch
(js [1 * 3])
```

计算 JavaScript 表达式并返回其值。默认文本是 `1 * 3`，报告 `3`。

### js `[代码]`（布尔）

```scratch
<js [1 === 1]>
```

计算 JavaScript 表达式并将其作为布尔值报告。

### js `[代码]`（命令）

```scratch
js [console.log("hello")]
```

将 JavaScript 作为语句运行，用于产生副作用。默认文本将 `hello` 记录到控制台。

## 需要编译器

补丁积木只在编译器开启时工作。积木体被拼接到编译输出中；没有解释器回退，因此如果编译器被禁用，积木会抛出 `补丁积木需要编译器`。确保编译器已启用（默认启用）。编译如何控制请参阅[禁用编译器](/advanced/disable-compiler)。

## 安全与稳定性风险

::::warning
补丁以与页面其余部分相同的访问权限运行您放入积木中的任何 JavaScript。请像对待您从互联网粘贴的任何代码一样对待它。
::::

- 只使用您理解的代码。补丁积木可以读取和更改项目能做的任何事情，包括发出网络请求。
- 除非您信任作者，否则永远不要加载使用补丁积木的共享项目，原因相同。
- 因为代码被注入编译输出中，语法错误或运行时异常可能破坏整个编译线程，而不只是那一个积木。
- 表达式形式（`js` 报告和布尔）应该是一个单个表达式。命令形式接受语句。

要以结构化的方式编写参与编译项目的 JavaScript，请参阅[编译扩展](/building-extensions/compiled/overview)，这是超出快速一行之外任何内容的受支持路径。

## 另请参阅

- [项目中的 JavaScript](/advanced/javascript)
- [禁用编译器](/advanced/disable-compiler)
- [编译扩展](/building-extensions/compiled/overview)

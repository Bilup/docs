---
slug: /javascript
hide_table_of_contents: true
---

# 如何下载 JavaScript

:::note
由于 Bilup **基于** TurboWarp，它支持以下所有相同的功能。

:::

## 简短回答 {#short}

 * 如果你想打包/HTML 化一个项目，请使用 https://packager.bilup.org/
 * 如果你想将 Scratch 项目转换为可读且可编辑的 JavaScript，请使用 https://leopardjs.com/ 而不是 TurboWarp

## 详细回答 {#long}

TurboWarp 生成的代码不是为人类阅读或编辑而设计的。这样做会损害学习者的学习效果，因为我们为提高兼容性或性能做了许多不寻常的事情。

例如，在常规 JavaScript 中访问列表项就像 `myList[myIndex]` 一样简单，但 TurboWarp 会根据它可以做出的假设，做 `(b1.value[(b0.value | 0) - 1] ?? "")` 或 `listGet(b0, b1.value)` 这样的操作。`b0` 和 `b1` 是 TurboWarp 将使用的真实变量名，`listGet` 是 TurboWarp 运行时的一部分的魔法函数。该代码也缺乏任何格式化。[另一页面](how) 中提供了一些更多的代码示例。

如果你想将 Scratch 项目转换为可读且可编辑的 JavaScript，请使用 https://leopardjs.com/

<details>
<summary>如果你真的知道自己在做什么...</summary>

在启动项目之前，在 JavaScript 控制台中运行：

```javascript
vm.enableDebug();
```

然后，当代码被编译时，JavaScript 将被记录到控制台。

如果你不知道「JavaScript 控制台」是什么或如何访问它，那么最好不要查看生成的 JavaScript。

Bilup 有一个额外的功能，允许你禁用此功能：
```javascript
vm.disableDebug()
```
</details>

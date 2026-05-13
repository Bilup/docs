---
slug: /development/scratchx
hide_table_of_contents: true
---

# ScratchX & Bilup

Bilup 现在对使用 ScratchX 扩展和加载 ScratchX 项目（.sbx）提供了基本支持。ScratchX 是 Scratch Team 创建的 Scratch 2 的修改版本，允许使用非官方扩展。由于所有主流浏览器都移除了 Flash，ScratchX 不再运行，该网站最终于 2023 年初关闭。

要在 Bilup 中使用 ScratchX 扩展，找到扩展的 JavaScript 源代码 URL，并像加载其他[自定义扩展](../extensions/introduction)一样加载它。

ScratchX 扩展在扩展沙箱中运行，与硬件相关的任何内容都无法工作。
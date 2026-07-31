---
title: 禁用编译器
sidebar_position: 15
---

# 禁用编译器

Bilup 的[编译器](/advanced/javascript)会将您的积木转换为 JavaScript，使它们比原版 Scratch 运行得快得多。此选项将其关闭，回退到像 Scratch 一样逐个解释积木。可以在[编辑器设置](/editor/settings)或通过 [`nocompile` URL 参数](/advanced/url-parameters) 切换。

::::warning
除非您确切知道为什么需要，否则不要更改此项。禁用编译器会使项目慢得多。
::::

禁用它的两个合理原因：

- **调试编译器 bug。** 如果脚本在 Bilup 中的行为与在 Scratch 中不同，关闭编译器可以判断编译器是否是原因。
- **编辑。** 关闭编译器后，脚本更改会在编辑时立即生效，有些人在构建时更喜欢这样。"在编辑器中禁用编译器"插件默认就是这么做的，仅在编辑器中，让播放器保持快速。

## 另请参阅

- [JavaScript 与编译器](/advanced/javascript)
- [插件](/editor/addons)
- [编辑器设置](/editor/settings)

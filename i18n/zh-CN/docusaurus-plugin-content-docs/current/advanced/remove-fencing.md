---
title: 移除围栏
sidebar_position: 14
---

# 移除围栏

"围栏"是 Scratch 的规则：让角色部分保持在舞台上，限制它们可以变大或变小的程度，并让"碰到"检测在舞台边缘之外失效。移除围栏可以让角色完全移出屏幕、不受限制地放大或缩小，并能检测到屏幕外的接触。可以在[编辑器设置](/editor/settings)或通过 [`offscreen` URL 参数](/advanced/url-parameters) 启用。

这可以略微提高某些项目的性能，因为运行时不再每帧限制角色位置。

::::caution
有些项目依赖围栏让角色保持可见或在边界内，移除后可能会出问题。
::::

## 另请参阅

- [移除杂项限制](/advanced/remove-limits)
- [编辑器设置](/editor/settings)

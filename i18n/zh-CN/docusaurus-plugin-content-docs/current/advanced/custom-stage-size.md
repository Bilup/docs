---
title: 自定义舞台大小
sidebar_position: 8
---

# 自定义舞台大小

Bilup 可以将舞台从 Scratch 默认的 480x360（4:3）更改为任何其他尺寸，可以从[编辑器设置](/editor/settings)或 [`size` URL 参数](/advanced/url-parameters)（`size=640x360`）进行设置。

::::caution
大多数项目并非针对不同的舞台大小而设计，更改后布局可能无法正确显示。
::::

例如，`640x360` 提供宽屏 16:9 舞台。`1280x720` 或 `1920x1080` 等更高分辨率也有效，但通常最好以相同宽高比的较低分辨率创作，让全屏模式负责放大。非常大的舞台可能在某些显示器上无法完整显示，而且渲染成本更高。

项目可以在运行时读取当前舞台大小，因此定位或缩放的脚本可以自适应。如果您希望打包构建中的舞台自动跟随窗口或全屏大小，请参阅[动态舞台缩放](/packager/dynamic-stage-resize)。

## 另请参阅

- [高质量画笔](/advanced/high-quality-pen)
- [动态舞台缩放](/packager/dynamic-stage-resize)
- [编辑器设置](/editor/settings)

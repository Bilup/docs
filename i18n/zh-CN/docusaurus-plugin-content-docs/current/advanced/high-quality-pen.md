---
title: 高质量画笔
sidebar_position: 9
---

# 高质量画笔

默认情况下，画笔层以 480x360 绘制并拉伸以适合舞台，因此当舞台较大时，画笔图案可能看起来有锯齿。高质量画笔改为以舞台的真实分辨率渲染画笔层，并禁用部分坐标舍入，让画笔线条落在您期望的位置。可以在[编辑器设置](/editor/settings)或通过 [`hqpen` URL 参数](/advanced/url-parameters) 启用。

::::caution
高质量画笔会显著降低性能，尤其是在全屏模式下，因为每帧需要绘制更多像素。并非所有项目开启它都会更好看，因此发布前请先对比。
::::

它与[自定义舞台大小](/advanced/custom-stage-size)天然搭配，因为那时低默认画笔分辨率最明显。

## 另请参阅

- [自定义舞台大小](/advanced/custom-stage-size)
- [画笔扩展](/extensions/pen)
- [编辑器设置](/editor/settings)

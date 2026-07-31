---
title: 动态舞台缩放
sidebar_position: 4
slug: /packager/dynamic-stage-resize
---

# 动态舞台缩放

::::info
这是[Bilup 打包器](/packager/overview)的选项。
::::

动态舞台缩放让舞台匹配它被显示的任何大小和宽高比，而不是固定的[舞台大小](/advanced/custom-stage-size)。

舞台不被缩放，它的实际尺寸会改变。如果用户在 1920x1080 的显示器上全屏，舞台变成 1920x1080。如果他们将窗口缩小到 1x1，舞台变成 1x1，因此请在项目中添加最小尺寸检查，以避免退化情况。

## 使项目兼容

几乎没有项目开箱即用地处理这一点。要支持它：

1. 首先让项目在[自定义舞台大小](/advanced/custom-stage-size)下工作。
2. 然后将舞台大小检测移入每帧运行的循环中，并根据每帧的当前大小重新定位所有内容。这不是优雅的，但足够快，也是最可靠的方法。

## 另请参阅

- [自定义舞台大小](/advanced/custom-stage-size)
- [打包器概览](/packager/overview)

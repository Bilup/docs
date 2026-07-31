---
title: 自定义 FPS
sidebar_position: 7
---

# 自定义 FPS

帧率（每秒帧数）控制您的脚本每秒运行多少次。Scratch 以 30 FPS 运行。Bilup 允许您更改此设置，最常见的是 60 FPS，可以从[编辑器设置](/editor/settings)或 [`fps` URL 参数](/advanced/url-parameters) 中进行设置。

`0` 值很特殊：项目以显示器的刷新率运行，而不是固定间隔。在 `0` 时，当项目的标签页隐藏时，脚本可能会停止运行。

## 大多数项目需要修改才能在更高 FPS 下正常工作

提高帧率会让脚本运行得更频繁，因此每帧移动固定距离的内容会移动得更快。考虑 `重复执行 { 移动 1 步 }`：在 30 FPS 下角色每秒移动 30 步，但在 60 FPS 下每秒移动 60 步，快了两倍。

如果您只想获得更流畅的运动而不改变游戏速度，请使用[插值](/advanced/interpolation)而不是提高帧率。插值让脚本保持正常速率，并在其间平滑视觉效果。

要让项目真正独立于帧率，请使用**增量时间**：测量自上一帧以来经过的真实时间，并按它缩放移动。这是常见的游戏开发技术，通常需要重构您的移动脚本。

- [增量计时（维基百科）](https://en.wikipedia.org/wiki/Delta_timing)

## 另请参阅

- [插值](/advanced/interpolation)
- [URL 参数](/advanced/url-parameters)
- [编辑器设置](/editor/settings)

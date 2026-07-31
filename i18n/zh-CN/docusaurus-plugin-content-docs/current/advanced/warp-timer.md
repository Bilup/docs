---
title: 防卡死计时器
sidebar_position: 12
---

# 防卡死计时器

防卡死计时器让脚本检查是否卡在长循环或无限循环中，并降到低帧率，而不是让整个项目冻结直到循环结束。这可以防止大多数"项目无响应"的崩溃，但它有真实的性能代价，因此默认只在编辑器中开启，播放器中不开启。可以在[编辑器设置](/editor/settings)或通过 [`stuck` URL 参数](/advanced/url-parameters)（也接受 `warp_timer`）切换。

作为演示，考虑一个在"不刷新屏幕"积木内有无限循环的项目。开启防卡死计时器后，项目会以低帧率（每秒几帧）继续渲染。关闭时，脚本永远不会让出，项目看起来像冻结了。

防卡死计时器以前被称为"卡死检查"。

## 另请参阅

- [自定义 FPS](/advanced/custom-fps)
- [URL 参数](/advanced/url-parameters)
- [编辑器设置](/editor/settings)

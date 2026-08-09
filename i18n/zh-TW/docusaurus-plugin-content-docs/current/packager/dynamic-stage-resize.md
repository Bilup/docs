---
title: 動態舞臺縮放
sidebar_position: 4
slug: /packager/dynamic-stage-resize
---

# 動態舞臺縮放

::::info
這是[Bilup 打包器](/packager/overview)的選項。
::::

動態舞臺縮放讓舞臺匹配它被顯示的任何大小和寬高比，而不是固定的[舞臺大小](/advanced/custom-stage-size)。

舞臺不被縮放，它的實際尺寸會改變。如果使用者在 1920x1080 的顯示器上全屏，舞臺變成 1920x1080。如果他們將視窗縮小到 1x1，舞臺變成 1x1，因此請在專案中新增最小尺寸檢查，以避免退化情況。

## 使專案相容

幾乎沒有專案開箱即用地處理這一點。要支援它：

1. 首先讓專案在[自訂舞臺大小](/advanced/custom-stage-size)下工作。
2. 然後將舞臺大小檢測移入每幀執行的迴圈中，並根據每幀的當前大小重新定位所有內容。這不是優雅的，但足夠快，也是最可靠的方法。

## 另請參閱

- [自訂舞臺大小](/advanced/custom-stage-size)
- [打包器概覽](/packager/overview)

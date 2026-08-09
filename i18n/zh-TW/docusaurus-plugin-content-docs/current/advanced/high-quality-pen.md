---
title: 高質量畫筆
sidebar_position: 9
---

# 高質量畫筆

預設情況下，畫筆層以 480x360 繪製並拉伸以適合舞臺，因此當舞臺較大時，畫筆圖案可能看起來有鋸齒。高質量畫筆改為以舞臺的真實解析度渲染畫筆層，並停用部分座標舍入，讓畫筆線條落在您期望的位置。可以在[編輯器設定](/editor/settings)或透過 [`hqpen` URL 引數](/advanced/url-parameters) 啟用。

::::caution
高質量畫筆會顯著降低效能，尤其是在全屏模式下，因為每幀需要繪製更多畫素。並非所有專案開啟它都會更好看，因此發佈前請先對比。
::::

它與[自訂舞臺大小](/advanced/custom-stage-size)天然搭配，因為那時低預設畫筆解析度最明顯。

## 另請參閱

- [自訂舞臺大小](/advanced/custom-stage-size)
- [畫筆擴充功能](/extensions/pen)
- [編輯器設定](/editor/settings)

---
title: 自訂 FPS
sidebar_position: 7
---

# 自訂 FPS

幀率（每秒幀數）控制您的指令碼每秒執行多少次。Scratch 以 30 FPS 執行。Bilup 允許您更改此設定，最常見的是 60 FPS，可以從[編輯器設定](/editor/settings)或 [`fps` URL 引數](/advanced/url-parameters) 中進行設定。

`0` 值很特殊：專案以顯示器的重新整理率執行，而不是固定間隔。在 `0` 時，當專案的標籤頁隱藏時，指令碼可能會停止執行。

## 大多數專案需要修改才能在更高 FPS 下正常工作

提高幀率會讓指令碼執行得更頻繁，因此每幀移動固定距離的內容會移動得更快。考慮 `重複執行 { 移動 1 步 }`：在 30 FPS 下角色每秒移動 30 步，但在 60 FPS 下每秒移動 60 步，快了兩倍。

如果您只想獲得更流暢的運動而不改變遊戲速度，請使用[插值](/advanced/interpolation)而不是提高幀率。插值讓指令碼保持正常速率，並在其間平滑視覺效果。

要讓專案真正獨立於幀率，請使用**增量時間**：測量自上一幀以來經過的真即時間，並按它縮放移動。這是常見的遊戲開發技術，通常需要重構您的移動指令碼。

- [增量計時（維基百科）](https://en.wikipedia.org/wiki/Delta_timing)

## 另請參閱

- [插值](/advanced/interpolation)
- [URL 引數](/advanced/url-parameters)
- [編輯器設定](/editor/settings)

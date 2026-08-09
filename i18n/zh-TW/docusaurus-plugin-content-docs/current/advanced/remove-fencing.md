---
title: 移除圍欄
sidebar_position: 14
---

# 移除圍欄

"圍欄"是 Scratch 的規則：讓角色部分保持在舞臺上，限制它們可以變大或變小的程度，並讓"碰到"檢測在舞臺邊緣之外失效。移除圍欄可以讓角色完全移出螢幕、不受限制地放大或縮小，並能檢測到螢幕外的接觸。可以在[編輯器設定](/editor/settings)或透過 [`offscreen` URL 引數](/advanced/url-parameters) 啟用。

這可以略微提高某些專案的效能，因為執行時不再每幀限制角色位置。

::::caution
有些專案依賴圍欄讓角色保持可見或在邊界內，移除後可能會出問題。
::::

## 另請參閱

- [移除雜項限制](/advanced/remove-limits)
- [編輯器設定](/editor/settings)

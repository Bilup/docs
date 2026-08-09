---
title: 停用編譯器
sidebar_position: 15
---

# 停用編譯器

Bilup 的[編譯器](/advanced/javascript)會將您的積木轉換為 JavaScript，使它們比原版 Scratch 執行得快得多。此選項將其關閉，回退到像 Scratch 一樣逐個解釋積木。可以在[編輯器設定](/editor/settings)或透過 [`nocompile` URL 引數](/advanced/url-parameters) 切換。

::::warning
除非您確切知道為什麼需要，否則不要更改此項。停用編譯器會使專案慢得多。
::::

停用它的兩個合理原因：

- **除錯編譯器 bug。** 如果指令碼在 Bilup 中的行為與在 Scratch 中不同，關閉編譯器可以判斷編譯器是否是原因。
- **編輯。** 關閉編譯器後，指令碼更改會在編輯時立即生效，有些人在建置時更喜歡這樣。"在編輯器中停用編譯器"外掛預設就是這麼做的，僅在編輯器中，讓播放器保持快速。

## 另請參閱

- [JavaScript 與編譯器](/advanced/javascript)
- [外掛](/editor/addons)
- [編輯器設定](/editor/settings)

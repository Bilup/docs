---
title: 編譯擴充功能概覽
sidebar_position: 1
---

# 編譯擴充功能

Bilup 不逐積木解釋專案。它**編譯**它們：積木被轉換為 JavaScript，瀏覽器以原生速度執行。普通擴充功能積木是編譯程式碼呼叫的函式，這對大多數事情來說足夠快，但仍然是一種直譯器風格的呼叫。

編譯擴充功能更進一步。它告訴編譯器如何將您的積木*內聯*轉換為 JavaScript，因此完全沒有對您的函式的呼叫。對於數學積木，這就是"呼叫返回 `Math.pow(a, b)` 的擴充功能"和直接向指令碼中發射 `Math.pow(a, b)` 之間的區別。

## 何時值得

編譯積木只在積木很小且執行很多時有幫助：數學、字串處理和其他緊密迴圈操作。它對以真實工作為主的積木（網路請求、繪製、等待）沒有作用，並且它增加了複雜性。

在以下情況使用編譯積木：

- 操作便宜但每幀被呼叫數千次，並且直譯器開銷出現在效能分析中。
- 您可以將積木表示為短的 JavaScript 表示式。

當積木做任何實質性的工作時、在原型設計時，或額外複雜性不值當時，請堅持使用[普通擴充功能](/building-extensions/introduction)。

## 要求

- 編譯擴充功能必須以[非沙箱](/building-extensions/unsandboxed)方式執行；它們使用只在主頁面中存在的 `Scratch.vm.exports`。
- 它們依賴 Bilup 的編譯器，因此它們在 Bilup 和[打包器](/packager/overview)中執行，但在標準 Scratch 中不執行。
- 您總是提供普通的 `func` 回退，使積木在編譯器關閉時仍然工作（例如當監視器讀取報告積木時，或如果使用者停用編譯器）。

## 兩種做法

Bilup 在 `Scratch.vm.exports` 上暴露兩個編譯器入口點：

- **`vm.exports.compiler.register(...)`** 是受支援的、穩定的方式。您為每個積木註冊一個返回 JavaScript 源字串的小 `compile` 函式。本節的其餘部分教的就是這個。
- **`vm.exports.i_will_not_ask_for_help_when_these_break()`** 為*舊的* TurboWarp 風格（修補編譯器內部生成器）返回一個相容墊片。它的存在是為了讓較舊的編譯擴充功能繼續工作。這個名字是一個字面警告：它不受支援，按約定沒有文件，並且可能在任何版本中損壞。只用它來讓遺留擴充功能執行；用 `compiler.register` 編寫新的。請參閱[修補編譯器](/building-extensions/compiled/patching)。

## 開始

先閱讀[普通擴充功能開發](/building-extensions/introduction)；編譯積木仍然是一個帶編譯器入口的普通積木。然後繼續[擴充功能結構](/building-extensions/compiled/structure)。

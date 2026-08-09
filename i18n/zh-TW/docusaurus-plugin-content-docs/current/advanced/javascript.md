---
title: JavaScript 與編譯器
sidebar_position: 2
---

# JavaScript 與編譯器

JavaScript 以三種方式出現在 Bilup 中：**編譯器**會自動將您的積木轉換為 JavaScript 以提高速度，**補丁擴充功能**提供 `js (...)` 積木讓您在專案中執行自己的 JavaScript，**擴充功能系統**讓您用 JavaScript 編寫自己的完整積木。本頁涵蓋這三者。

## 編譯器

每次專案執行時，Bilup 都會將您的指令碼編譯為瀏覽器可以直接執行的 JavaScript，而不是逐個解釋積木。這是專案在 Bilup 中比原版 Scratch 執行快得多的主要原因。它是自動發生的，無需開啟任何東西，結果與積木在 Scratch 中的行為相同（除了更快）。

指令碼在首次執行時編譯。如果專案似乎在指令碼首次觸發時短暫停頓，那就是編譯發生了一次；它不會重複。

您幾乎不需要考慮編譯器。您可能需要考慮它的兩種情況：

- **除錯編譯器 bug。** 如果指令碼在 Bilup 中的行為與在 Scratch 中不同，您可以關閉編譯器檢查是否是編譯器的錯。請參閱[停用編譯器](/advanced/disable-compiler)。
- **檢視生成的程式碼**（見下文）。

## 在專案內部執行 JavaScript

[**補丁擴充功能**](/extensions/patching) 添加了可執行您在專案中直接編寫的 JavaScript 的積木：

- **報告型** `js (...)`，返回 JavaScript 表示式的值，
- **布林型** `js (...)`，用於條件判斷，
- **命令型** `js (...)`，執行一條語句。

由於 JavaScript 被拼接到編譯輸出中，這些積木只在編譯器開啟時工作；停用編譯器後它們會丟擲"補丁積木需要編譯器"。這是直接的"貼上一些 JavaScript"路徑，與頁面上執行的任何程式碼一樣，只執行您理解的 JavaScript。

## 用 JavaScript 編寫自己的積木

如果您需要的不僅僅是一行內表示式（呼叫 Web API、使用瀏覽器功能或新增可複用的自己的積木），請編寫一個**非沙箱擴充功能**。非沙箱擴充功能在與編輯器相同的上下文中執行，可以完全存取 VM、渲染器以及 `fetch` 和 `localStorage` 等普通瀏覽器 API。

這是真正的程式設計任務，不是積木。完整指南在[建置擴充功能](/building-extensions/introduction)，非沙箱環境的具體細節在[非沙箱擴充功能](/building-extensions/unsandboxed)。您可以透過 [`extension` URL 引數](/advanced/url-parameters#extension) 從 URL 載入擴充功能：

```
https://com.bilup.org/?extension=https://example.com/extension.js
```

::::warning
非沙箱擴充功能以完全存取許可權在頁面上執行。只加載來自可信來源的擴充功能。惡意擴充功能可以做您的瀏覽器能做的任何事情。
::::

## 檢視生成的 JavaScript

Bilup 生成的 JavaScript **不是為人類閱讀或編輯而設計的**。它針對速度和相容性進行了最佳化，而不是可讀性。例如，讀取列表項可能編譯為 `(b1.value[(b0.value | 0) - 1] ?? "")`，其中 `b0` 和 `b1` 是內部變數名。沒有格式，也沒有註解。

如果您仍然想檢視，請在啟動專案前開啟瀏覽器的 JavaScript 控制台並執行：

```js
vm.enableDebug();
```

每個指令碼編譯時，其編譯後的 JavaScript 都會記錄到控制台。要關閉日誌：

```js
vm.disableDebug();
```

如果您想**學習** Scratch 專案在 JavaScript 中會是什麼樣子，編譯器輸出不是合適的工具。請改用像 [Leopard](https://leopardjs.com/) 這樣的專案轉 JavaScript 轉換器，它會產生乾淨、可讀的程式碼。

## 使用自訂程式碼打包

要將專案作為獨立 HTML 檔案或應用發佈，請使用[Bilup 打包器](/packager/overview)。打包器將編譯後的執行時與您的專案捆綁在一起，使其在任何地方都能執行，無需編輯器。

## 另請參閱

- [補丁擴充功能](/extensions/patching)
- [停用編譯器](/advanced/disable-compiler)
- [建置擴充功能](/building-extensions/introduction)
- [URL 引數](/advanced/url-parameters)

---
title: 概覽
sidebar_position: 1
---

# Bilup 打包器

Bilup 打包器將 Scratch 或 Bilup 專案變成獨立程式：單個 HTML 檔案、zip，或 Windows、macOS、Linux 的原生執行檔。輸出不需要編輯器或網際網路連線即可執行，並且捆綁了 Bilup 快速的編譯執行時。

在 [packager.bilup.org](https://packager.bilup.org/) 使用它。

它與 HTMLifier 或 forkphorus 打包器扮演相同的角色，但提供更多輸出格式，並對載入螢幕、控制元件和執行時設定擁有更多控制。

## 您可以做什麼

- **將專案作為單個檔案分享。** 給某人一個 HTML 檔案，他們可以在任何瀏覽器中開啟，周圍沒有 Bilup 品牌。
- **發佈桌面應用。** 打包為像原生程式一樣執行的 Electron、NW.js 或 WKWebView 執行檔。
- **嵌入您完全控制的專案。** [嵌入打包檔案](/packager/embedding)，而不是依賴託管的嵌入。
- **離線或在受限網路上執行。** 請參閱[離線打包器](/packager/offline)。

## 將專案放入打包器

您有幾個選項：

- 輸入 Scratch 專案 ID 或直接專案 URL。
- 從電腦上傳 `.sb3` 檔案。
- 直接從編輯器傳送當前專案。請參閱[編輯器整合](/packager/editor-integration)。

請記住，[未共享的 Scratch 專案](/advanced/unshared-projects)不能透過 ID 載入；請下載 `.sb3` 並改為上傳。

## 常用設定

打包器公開與編輯器相同的大多數執行時選項，包括[自訂 FPS](/advanced/custom-fps)、[插值](/advanced/interpolation)、[高質量畫筆](/advanced/high-quality-pen)和[自訂舞臺大小](/advanced/custom-stage-size)。它還新增打包器特有的功能：

- [動態舞臺縮放](/packager/dynamic-stage-resize) 讓舞臺跟隨視窗或全屏大小。
- [特殊雲行為](/packager/special-cloud-behaviors) 用於具有特殊名稱的雲端變數。

## 另請參閱

- [嵌入打包專案](/packager/embedding)
- [編輯器整合](/packager/editor-integration)
- [離線打包器](/packager/offline)
- [我可以出售打包專案嗎?](/packager/commercial-use)

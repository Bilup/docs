---
title: 離線打包器
sidebar_position: 6
slug: /packager/offline
---

# 離線打包器

[Bilup 打包器](/packager/overview)完全在您的瀏覽器中執行，並且有一些方法可以在沒有網際網路連線的情況下執行它，這在網路阻止 `com.bilup.org` 或您離線時很有幫助。

大型執行時資源（用於原生建置的 Electron、NW.js 和 WKWebView 執行檔）**不會**捆綁到打包器中。它們在特定輸出格式需要時單獨下載，打包器在第一次下載後快取它們，因此每種只需獲取一次。這些下載通常即使在 `com.bilup.org` 被阻止的地方也能工作。

## 獨立 HTML 建置

要完全離線使用，請下載打包器本身的獨立副本：

1. 前往 [github.com/Bilup/packager/releases](https://github.com/Bilup/packager/releases)。
2. 在最新版本的 Assets 下，下載獨立 HTML 檔案（其名稱包含 `standalone`）。
3. 在瀏覽器中開啟該 HTML 檔案。

此檔案沒有更新檢查器，因此當您想要更新時請自行檢查較新的版本。

## 可安裝 Web 應用

[packager.bilup.org](https://packager.bilup.org/) 是一個 Web 應用，在您載入一次後嘗試保持離線工作。這是實驗性的，因此不要在任何重要的事情上依賴它；為保證離線使用，請優先選擇獨立 HTML 建置。

## 另請參閱

- [打包器概覽](/packager/overview)

---
title: 特殊雲行為
sidebar_position: 5
slug: /packager/special-cloud-behaviors
---

# 特殊雲行為

::::info
這是[Bilup 打包器](/packager/overview)的選項。
::::

"特殊雲行為"是一個選項（預設關閉），它給具有特殊名稱的[雲端變數](/advanced/cloud-variables)特殊能力，使打包專案可以與它執行的頁面互動。它基於 [HTMLifier 中的相同功能](https://github.com/SheepTester/htmlifier/wiki/Special-cloud-behaviours)，您可以在打包器的"雲端變數"部分啟用它。

要使用一個，請建立一個名稱與下面列出完全相同的普通雲端變數。例如，對於 `☁ url`，建立一個名為 `url` 的雲端變數。

啟用特殊雲行為會覆蓋這些名稱的正常雲處理，因此像 `☁ username` 這樣的變數永遠不會在本地儲存或與其他玩家同步。

## 只讀

### ☁ url
設定為頁面當前的 URL。寫入它不做任何事情。

### ☁ pasted
當使用者在頁面上貼上文本時（例如用 Ctrl+V），貼上的文本會放在這裡。

## 操作

### ☁ redirect
將其設定為一個 URL，當前標籤頁會導航到那裡。

### ☁ open link
將其設定為一個 URL，在新標籤頁中開啟該 URL。瀏覽器彈出視窗攔截器可能會阻止這一點。

### ☁ username
更改它會在偵測分類中更改 `使用者名稱` 積木返回的值。

### ☁ set clipboard
更改它會嘗試將文本複製到使用者的剪貼簿。瀏覽器並不總是允許。

### ☁ room id
更改它會改變用於同步雲端變數的專案 ID。如果原始 ID 是 `1234`，您將 `☁ room id` 設定為 `xyz`，同步 ID 變成 `1234-xyz`。將其設定回空字串以恢復原始值。只有共享房間 ID 的玩家彼此同步，這使它成為無需額外變數的簡單伺服器選擇器。重新連線可能需要幾秒鐘。這不影響本地儲存的雲端變數。

## 執行程式碼

### ☁ eval

::::warning
這需要單獨的"不安全的特殊雲行為"選項。不安全的行為讓打包專案在正常專案沙箱之外執行任意程式碼。根據您打包的內容，這可以給專案對其執行的電腦的完全控制權，包括安裝惡意軟體。除非您信任該專案並實際使用此功能，否則請保持關閉。
::::

設定 `☁ eval`，其值會作為 JavaScript 執行。結果寫入 `☁ eval output`，錯誤寫入 `☁ eval error`。如果程式碼返回一個 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)，解析值或拒絕錯誤會在它結算時寫入這些變數。設定 `☁ eval` 會立即返回，因此輸出變數可能不會在同一幀更新。

## 另請參閱

- [雲端變數](/advanced/cloud-variables)
- [打包器概覽](/packager/overview)

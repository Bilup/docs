---
title: 更好的開發伺服器
sidebar_position: 11
---

# 更好的開發伺服器

[簡介](/building-extensions/introduction)中的 Python HTTP 伺服器能用，但它有兩個粗糙的邊緣。本頁是可選的，但平滑它們可以消除擴充功能開發中的大部分摩擦。

## 兩個問題

1. **快取。** `python3 -m http.server` 設定的快取頭讓瀏覽器保留您的舊檔案。編輯擴充功能後，您常常必須硬重新整理（忽略快取重新載入）才能看到更改。
2. **沙箱。** 任何不是從受信任來源提供的內容都會[沙箱](/building-extensions/sandbox)載入，這強制每個積木一幀的延遲。學習時這沒問題，但它會掩蓋您的積木發佈後的真實行為。

## 在埠 8000 上提供服務以非沙箱開發

`http://localhost:8000/` 是 Bilup 信任的來源之一，因此從那裡提供的擴充功能會自動以[非沙箱](/building-extensions/unsandboxed)方式載入，無需每次載入的提示。將您的靜態伺服器指向 8000 埠並直接載入檔案：

```bash
cd path/to/your/extensions
python3 -m http.server 8000
```

然後載入 `http://localhost:8000/your-extension.js`（或用 `?extension=http://localhost:8000/your-extension.js` 自動載入）。它必須恰好是 8000 埠上的 `localhost`；`127.0.0.1` 和 `0.0.0.0` 不受信任。

給擴充功能一個包含您名字的 ID，如 `yournamefetch`，這樣它不會與任何其他人的擴充功能 ID 衝突。

## 擺脫硬重新整理

使用任何傳送 no-cache 頭的靜態伺服器，而不是裸的 Python 伺服器。例如，安裝了 Node.js：

```bash
npx http-server -p 8000 -c-1
```

`-c-1` 停用快取，因此普通重新整理總是獲取當前檔案。任何等效的靜態伺服器都可以；唯一重要的是它在 8000 埠上執行並且不快取。

## 下一步

有了更快的迴圈，讓我們介紹[擴充功能可以使用的更多 API 和選項](/building-extensions/assorted-apis)。

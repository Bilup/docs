---
title: 未共享專案
sidebar_position: 5
---

# 未共享專案

Scratch 上未共享的專案無法在 Bilup、打包器或任何其他第三方網站中開啟。這是 Scratch 的限制，不是 Bilup 的，並且在不危及帳戶安全的情況下沒有任何辦法繞過。

::::warning
任何非 scratch.mit.edu 的網站，如果索要您的 Scratch 密碼，都是詐騙，即使它聲稱能讓您開啟未共享的專案。您的帳戶會被盜。這條規則沒有任何例外。
::::

## 為什麼會這樣

從 Scratch API 下載專案需要一個臨時的"專案令牌"。對於未共享的專案，該令牌只能由專案所有者獲得，並且幾分鐘後過期。即使您在同一瀏覽器中登入了 Scratch，Bilup 也無法讀取該令牌，因此無法下載專案資料。

這是 Scratch 團隊有意做出的更改，讓未共享專案真正私密。在此之前，"未共享"專案實際上對任何知道 ID 的人都是公開的，考慮到其中許多專案包含個人資訊，這是一個真正的隱私問題。保護它們是正確的決定。

## 應該怎麼做

**測試自己的專案。** 在 Scratch 編輯器中使用檔案，然後儲存到電腦下載 `.sb3`，然後在 Bilup 中使用檔案，然後從電腦載入開啟它。許多人主要在 Bilup 中工作，並將完成的 `.sb3` 上傳回 Scratch。這樣做時請保留備份。

**協作。** 在 Scratch 上共享專案。共享未完成的工作完全可以。如果您想與他人即時編輯，Bilup 還內建了完全不依賴 Scratch 的[協作](/editor/collaboration)。

**嵌入。** 在 Scratch 上共享專案，或下載 `.sb3` 並使用[Bilup 打包器](/packager/overview)將其轉換為可以[嵌入](/packager/embedding)的獨立檔案。

## 面向工具開發者

本部分面向建置自己的 Scratch 相關工具的人。要下載共享專案，您首先獲取其後設資料以獲得專案令牌，然後使用該令牌獲取資料：

1. `GET https://api.scratch.mit.edu/projects/<id>` 並讀取 `project_token` 欄位。
2. `GET https://projects.scratch.mit.edu/<id>?token=<token>` 獲取專案 JSON 或 SB3。

瀏覽器不能直接呼叫 `api.scratch.mit.edu`，因為它不傳送 [CORS](/advanced/cors) 頭，因此瀏覽器端程式碼需要 CORS 代理；伺服器端程式碼（Node.js）不受 CORS 約束，可以直接呼叫。有關處理這一切的現成下載器，請參閱 [sb-downloader](https://github.com/forkphorus/sb-downloader)。

## 另請參閱

- [協作](/editor/collaboration)
- [Bilup 打包器](/packager/overview)
- [CORS](/advanced/cors)

---
title: 部署
sidebar_position: 6
---

# 部署

Bilup 的編輯器是一個靜態站點。生產建置是一個 HTML、JavaScript 和資產資料夾，可以由任何靜態主機提供。本頁介紹如何建置和發佈該資料夾，這是您執行自己的編輯器實例時需要的。

貢獻更改不需要這個。只有當您想自己託管建置時它才重要。

## 建置輸出

scratch-gui 的生產建置由以下命令產生：

```bash
NODE_ENV=production pnpm run build
```

這會清理之前的輸出並執行 webpack，將可部署的站點寫入 `build/` 目錄。`build/` 下的所有內容都是靜態且自包含的。

## 部署指令碼

scratch-gui 附帶一個 `deploy` 指令碼，一步建置併發佈到 `gh-pages` 分支：

```bash
pnpm run deploy
```

在底層它執行：

```bash
NODE_ENV=production pnpm run build && \
  touch build/.nojekyll && \
  cp -r functions build/functions && \
  gh-pages -t -d build -m "Build for <commit hash>"
```

按順序，它：

- 做一次生產建置，
- 新增 `.nojekyll` 標記，讓主機不在輸出上執行 Jekyll，
- 將 `functions/` 目錄複製到建置中（這些是用於路由和動態行為的 Cloudflare Pages Functions），
- 用 `gh-pages` 工具將整個 `build/` 目錄推送到 `gh-pages` 分支。

提交到預設分支不會部署任何東西。發佈是刻意的 `pnpm run deploy`。

## 託管建置

因為輸出是靜態的，您可以從任何靜態主機提供它。Bilup 的設定發佈 `gh-pages` 分支並將主機指向它。

### Cloudflare Pages

建置中的 `functions/` 目錄是為 [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) 編寫的，因此 Cloudflare Pages 是預期的主機。典型設定：

1. 建立一個連線到您的 `scratch-gui` fork 的 Pages 專案。
2. 在專案設定中，將生產分支設定為 `gh-pages` 併為其啟用自動部署。
3. 每當您想發佈時在本地執行 `pnpm run deploy`。Cloudflare 檢測 `gh-pages` 上的新提交併部署它。

因為您在本地建置並推送完成的 `build/` 目錄，Cloudflare 不需要執行自己的建置步驟。

### 其他靜態主機

任何可以提供目錄的主機都可以：GitHub Pages、普通 Web 伺服器、帶靜態託管的物件儲存等。要保留兩件事：

- 保留 `.nojekyll` 標記（或主機的等價物），使以下劃線開頭的檔名不被剝離。
- 復現路由。同一個建置從一組檔案提供多個應用（`/editor`、`/embed.html`、社群客戶端路由和遺留播放器路由）。在 Cloudflare Pages 上 `functions/` 目錄處理此問題；在另一個主機上您必須實現等價的重寫，否則客戶端路由會在重新載入時 404。

## 社群後端

編輯器建置只是前端。如果您也執行社群平臺，後端（bilup-api）是一個單獨的 Go 服務，不是這個靜態建置的一部分。它單獨部署和執行；它是什麼請參閱[專案結構](/contributing/project-structure)。僅託管編輯器不需要它。

## 另請參閱

- [建置與執行](/contributing/building-running)
- [專案結構](/contributing/project-structure)
- [貢獻](/contributing/guidelines)

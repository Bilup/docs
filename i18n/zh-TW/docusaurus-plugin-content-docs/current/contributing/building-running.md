---
title: 建置與執行
sidebar_position: 3
---

# 建置與執行

本頁介紹設定本地 Bilup 編輯器建置的步驟。示例使用 scratch-gui，因為那是大多數開發發生的地方，但相同的克隆和連結模式適用於其他引擎包。

## 先決條件

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) v20（v18 或更高版本可能也可以，但 v20 是我們開發的目標）
- [pnpm](https://pnpm.io/)，scratch-gui 使用的包管理器

建置編輯器可能需要幾個 GB 的磁碟空間和記憶體，所以給它留出空間。

## 並排克隆各包

引擎包透過相對路徑相互連結，因此它們必須位於同一個父目錄中作為同級。

```bash
mkdir bilup
cd bilup
git clone https://github.com/Bilup/scratch-gui
git clone https://github.com/Bilup/scratch-vm
git clone https://github.com/Bilup/scratch-blocks
git clone https://github.com/Bilup/scratch-render
git clone https://github.com/Bilup/scratch-paint
```

您只需要打算更改的包。如果您只是修改編輯器 UI，只克隆 scratch-gui 就夠了；它的依賴回退到 `package.json` 中固定的版本。

## 安裝並連結

從 `scratch-gui` 開始：

```bash
cd scratch-gui
pnpm install
pnpm run link
```

`pnpm run link` 將同級簽出 symlink 到 scratch-gui：

```
pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

連結後，您在這些包中所做的更改會被 scratch-gui 建置拾取。如果連結後安裝重置了連結，只需再次執行 `pnpm run link`。還有一個 `pnpm run reinstall` 指令碼，會一次性清除 `node_modules` 和 lockfile、重新安裝並重新連結。

## 執行開發伺服器

```bash
pnpm start
```

這會啟動 webpack-dev-server。開啟 [http://localhost:8601/](http://localhost:8601/)。開發伺服器也映象生產路由，因此 `/editor` 是編輯器，`/embed.html` 是嵌入播放器，社群客戶端路由也會被提供。

## 生產建置

```bash
NODE_ENV=production pnpm run build
```

`pnpm run build` 清理 `build/` 和 `dist/` 目錄並執行 webpack。設定 `NODE_ENV=production` 會在 `build/` 下產生一個壓縮的、可部署的建置。

## Lint 與格式化

```bash
pnpm run lint   # eslint 檢查
pnpm run fmt    # eslint --fix
```

Lint 必須在拉取請求合併之前透過。樣式規則請參閱[貢獻](/contributing/guidelines)中那些不會被自動捕獲的（無程式碼註解、無長破折號）。

## 其他包

### scratch-vm

scratch-vm 使用 npm 和自己的指令碼：

```bash
cd scratch-vm
npm install
npm run lint
npm run tap          # 所有測試
npm run tap:unit     # 僅單元測試
npx tap test/unit/<file>.js   # 單個檔案
```

### scratch-blocks

scratch-blocks `core/` 下的編輯用 Google Closure 編譯，因此僅僅重建是不夠的。將 `node_modules/.bin` 放在 `PATH` 上後，執行：

```bash
node universal-python.js build.py
```

您新增的任何新符號都必須在 `goog.global` 塊中匯出，否則 Closure 會從建置中剝離它們。

### bilup-api

社群後端是一個 Go 服務。安裝了 Go 後：

```bash
cd bilup-api
go build .
./bilup-api
```

它將資料儲存為 `data/` 下的扁平 JSON，並且在沒有任何額外配置的情況下，為專案檔案回退到本地 `data/blobs/` 目錄，因此您可以在沒有云設定的情況下執行它。

## 另請參閱

- [專案結構](/contributing/project-structure)
- [測試](/contributing/testing)
- [部署](/contributing/deploying)

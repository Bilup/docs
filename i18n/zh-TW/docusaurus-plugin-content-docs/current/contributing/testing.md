---
title: 測試
sidebar_position: 4
---

# 測試

Bilup 繼承了 Scratch 的測試設定：scratch-gui 中用 [Jest](https://jestjs.io/)，scratch-vm 中用 [tap](https://node-tap.io/)。本頁列出各套件以及如何執行它們。

## scratch-gui

scratch-gui 在 `package.json` 中定義其測試指令碼。完整執行串聯 lint、單元測試、建置和整合測試：

```bash
pnpm test
```

開發期間很少需要這個。單獨的部分更有用。

### Lint

```bash
pnpm run test:lint   # eslint . --ext .js,.jsx
```

### 單元測試

單元測試位於 `test/unit/` 下。它們用 Jest 和 Enzyme（React 16）執行。定義了兩個套件：

```bash
pnpm run test:unit     # 外掛測試套件（test/unit/addons）
pnpm run test:collab   # 協作引擎測試（test/unit/collaboration）
```

`pnpm run test:collab` 覆蓋 `src/lib/collaboration/` 下的協作序列器引擎，是處理即時協作時要執行的套件。您可以直接執行單個 Jest 檔案：

```bash
npx jest test/unit/collaboration/<file>.test.js
```

### 整合測試

`test/integration/` 下的整合測試驅動無頭瀏覽器（帶 chromedriver 的 Selenium）對真實建置執行。它們需要先建置：

```bash
pnpm run build
pnpm run test:integration
```

您可以執行單個整合檔案，並觀看瀏覽器而不是無頭執行：

```bash
npx jest --runInBand test/integration/backpack.test.js
USE_HEADLESS=no npx jest --runInBand test/integration/backpack.test.js
```

如果 chromedriver 與您安裝的 Chrome 不相容，請用 `pnpm add -D chromedriver@<version>` 安裝匹配的版本。

## scratch-vm

scratch-vm 使用 tap。從 scratch-vm 簽出目錄：

```bash
npm run tap            # 單元和整合測試
npm run tap:unit       # 僅單元測試
npm run tap:integration
npx tap test/unit/<file>.js   # 單個檔案
```

VM 是積木和編譯器所在的地方，因此這是更改執行時行為時要執行的套件。新增或更改積木時，在 `test/` 下新增或更新一個 fixture，使行為被固定。

## 測試什麼

- 更改積木或編譯器：新增一個 scratch-vm tap 測試。
- 更改協作：執行 `pnpm run test:collab`。
- 更改 React 元件或容器：在 `test/unit/` 下新增一個 Jest 單元測試。
- 任何涉及瀏覽器的使用者可見內容：考慮一個整合測試。

## 另請參閱

- [建置與執行](/contributing/building-running)
- [貢獻](/contributing/guidelines)

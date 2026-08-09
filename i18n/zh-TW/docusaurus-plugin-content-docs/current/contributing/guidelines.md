---
title: 貢獻指南
sidebar_position: 5
---

# 貢獻

本頁涵蓋將更改提交到 Bilup 的實際工作流程：程式碼在哪裡、工作時各包如何連結、樣式規則，以及如何開啟拉取請求。如果您還沒有設定本地建置，請先閱讀[建置與執行](/contributing/building-running)。

## 程式碼在哪裡

Bilup 分佈在 [GitHub 上的 Bilup 組織](https://github.com/Bilup) 下的幾個倉庫中。您最可能接觸到的：

- [scratch-gui](https://github.com/Bilup/scratch-gui) 是編輯器和社群站點。大多數 UI 工作在這裡完成。
- [scratch-vm](https://github.com/Bilup/scratch-vm) 執行專案並持有積木定義和編譯器。
- [scratch-blocks](https://github.com/Bilup/scratch-blocks)、[scratch-render](https://github.com/Bilup/scratch-render)、[scratch-paint](https://github.com/Bilup/scratch-paint) 和 [scratch-audio](https://github.com/Bilup/scratch-audio) 是其他引擎包。

每個包的用途請參閱[專案結構](/contributing/project-structure)。

Bilup 是 TurboWarp 的分叉，TurboWarp 是 [Scratch](https://scratch.mit.edu/) 的分叉。因為這個譜系，您閱讀的大量程式碼（以及您修復的大量 bug）不是 Bilup 特有的。上游也存在的 bug 通常最好也向上游報告或修復。

## pnpm 連結工作流

開發期間引擎包不是從 npm 獲取的。它們從本地並排簽出 symlink 連結，因此例如 scratch-vm 中的更改無需重新發佈就會被 scratch-gui 建置拾取。這隻有在各包位於同一個父目錄中作為同級時才有效。

從 `scratch-gui` 開始：

```bash
pnpm install
pnpm run link   # pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

如果之後 `pnpm install` 重置了連結，請再次執行 `pnpm run link`。`pnpm run reinstall` 會一次性清除 `node_modules` 和 lockfile、重新安裝並重新連結。

一個值得記住的後果：因為連結是透過相對路徑的，您的目錄佈局是建置的一部分。請保持簽出命名並作為同級放置。

## 樣式規則

一些規則由 linter 強制執行，一些是您必須手動遵循的專案約定。

提交前執行 linter：

```bash
pnpm run lint   # eslint 檢查
pnpm run fmt    # eslint --fix
```

linter 無法捕獲的兩個約定是跨每個倉庫的硬性專案規則：

- **無程式碼註解。** 不要向程式碼新增解釋性註解。唯一允許的註解是 lint 要求的標記，如 `eslint-disable` 行。這適用於每個 Bilup 倉庫。
- **無長破折號（em dash）。** 不要在任何地方使用長破折號：程式碼中、UI 字串中、行文中都不用。使用逗號、括號或 "到" 表示範圍。

幾個容易踩坑的包特定規則：

- scratch-gui CSS 只用 postcss-simple-vars 處理。沒有 `lighten()` 或 `darken()`；改用 `color-mix()`。
- css-loader 在 scratch-gui 中對類名做雜湊和駝峰化。裸的 `:global {}` 塊會靜默丟棄其規則；改用 `import '!!style-loader!css-loader!./x.css'` 匯入真正的全域 CSS。
- 社群站點 CSS 自訂屬性使用 `--mw-*` 字首。編輯器在 `documentElement` 上設定裸屬性名，如 `--text`，因此社群側的無字首名稱會衝突。請參閱[主題](/internals/theming)。
- scratch-blocks `core/` 下的編輯需要 Closure 重新編譯，任何新符號必須在 `goog.global` 塊中匯出，否則 Closure 會剝離它。請參閱[建置與執行](/contributing/building-running)。

## 測試您的更改

開啟拉取請求前執行相關測試套件。scratch-gui 和 scratch-vm 有獨立的套件和獨立命令，在[測試](/contributing/testing)中介紹。至少，lint 必須通過並且應用必須能建置。

## 開啟拉取請求

1. Fork 您要更改的倉庫，或在有存取許可權時推送分支。不要直接提交到預設分支。
2. 在帶描述性名稱的主題分支上進行更改。
3. 執行 `pnpm run lint`（和測試）並確保建置成功。
4. 對相應的 Bilup 倉庫開啟拉取請求。描述更改做了什麼以及為什麼。如果它修復了 bug，描述如何復現它。
5. 如果您的更改跨越多個包（例如 GUI 依賴的 VM 更改），請在描述中註明，以便審查者簽出匹配的分支。

## 許可

Bilup 繼承了 TurboWarp 和 Scratch 的許可。TurboWarp 對 Scratch 的修改在 GNU 通用公共授權 v3.0 下，原始 Scratch BSD 授權在需要的地方保留。透過貢獻，您同意您的更改在相同條款下發佈。捆綁的外掛來自 [Scratch Addons](https://scratchaddons.com/) 專案；請參閱[外掛系統](/internals/addons-system)。

## 另請參閱

- [建置與執行](/contributing/building-running)
- [專案結構](/contributing/project-structure)
- [測試](/contributing/testing)
- [部署](/contributing/deploying)
- [內部概覽](/internals/overview)

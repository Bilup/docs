---
title: 專案結構
sidebar_position: 2
---

# 專案結構

Bilup 是一個多倉庫工作區。每個包都是自己的 Git 簽出，它們作為同一個父目錄中的同級放置，以便相互連結。父目錄本身不是一個倉庫。

```
bilup/
├── scratch-gui/       # 編輯器 + 社群站點（同一個 webpack 建置）
├── scratch-vm/        # 執行時和編譯器；積木在這裡定義
├── scratch-blocks/    # 積木編輯器（Blockly 分叉）
├── scratch-render/    # WebGL 舞臺渲染器
├── scratch-paint/     # 造型和背景編輯器
├── scratch-audio/     # Web Audio 播放
├── packager/          # 獨立專案打包器
├── unpackager/        # 打包器的逆向
├── api/               # 社群平臺後端
├── desktop/           # 編輯器的桌面包裝
└── docs/              # 本文件站點（Docusaurus）
```

## 各包

Scratch 被拆分為分別實現應用一部分的包。Bilup 分叉了其中幾個。

- **scratch-gui** 實現大部分介面（選單欄、角色列表、標籤頁），將它們組合在一起，並且是外掛所在的地方。它是一組 React 元件加上一個 Redux store。Bilup 獨有的，同一個建置還提供社群站點。
- **scratch-vm** 執行專案。它持有積木定義（`src/blocks/scratch3_*.js`）、擴充功能（`src/extensions/`）以及將積木變成 JavaScript 的編譯器（`src/compiler/`）。
- **scratch-render** 繪製舞臺：角色、畫筆、文本氣泡和"碰到"等碰撞積木。注意變數監視器等覆蓋層由 scratch-gui 繪製，而不是 scratch-render。
- **scratch-blocks** 是積木區和工作區，Google Blockly 的一個分叉。其 `core/` 目錄下的編輯需要 Closure 重新編譯（請參閱[建置與執行](/contributing/building-running)）。
- **scratch-paint** 是造型和背景編輯器。
- **scratch-audio** 處理聲音播放。

另外兩個支援包作為 npm 依賴而不是本地簽出引入，但您會看到它們的引用：**scratch-parser**（驗證 sb2/sb3 檔案）和 **@turbowarp/scratch-storage**（用於下載資產的 fetch 抽象）。

## scratch-gui 內部

scratch-gui 是大多數編輯器工作發生的地方。重要的源目錄：

```
scratch-gui/src/
├── components/    # 展示性 React 元件（foo/foo.jsx + foo.css）
├── containers/    # 圍繞元件的 Redux 連線包裝
├── reducers/      # Redux reducer，每個狀態切片一個檔案
├── lib/           # 共享服務層、HOC、主題、持久化
├── addons/        # 外掛系統（設定儲存、視窗系統、外掛）
├── playground/    # webpack 入口點（編輯器、播放器、社群、嵌入、...）
└── community/     # 社群單頁應用
```

- `components/` 持有純 UI。每個元件是一個帶 `.jsx` 和匹配 CSS 模組的資料夾。
- `containers/` 將元件連線到 Redux store。請參閱[容器模式](/internals/containers)。
- `reducers/` 是 Redux 狀態。請參閱[狀態管理](/internals/state)。
- `lib/` 是最大的目錄：`lib/components/` 下的高階元件、`lib/themes/` 下的主題引擎、`lib/persistence/` 下的專案持久化，加上編輯器與社群站點都使用的 Bilup 服務層 `lib/community/` 和 `lib/rotur/`。
- `addons/` 是外掛框架，從 Scratch Addons 移植。請參閱[外掛系統](/internals/addons-system)。

建置產生幾個入口點，定義在 `src/playground/` 下：`editor`、`player`、`community`、`fullscreen`、`embed`、`addons` 和 `credits`。路由被處理為 `/editor` 提供編輯器，`/embed.html` 提供嵌入播放器，`/project/*` 和 `/explore` 等客戶端路由提供社群應用。

## 各包如何連結

開發期間引擎包不是從 npm 獲取的。它們從本地簽出 symlink 連結，因此例如 scratch-vm 的更改會出現在編輯器中而無需重新發佈。scratch-gui 在其 `pnpm.overrides` 中宣告這些連結並暴露一個輔助指令碼：

```bash
pnpm run link
# 執行：pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

這意味著您的目錄佈局很重要：引擎包必須是 scratch-gui 的同級，如上所示。

## Bilup 專用服務

兩個部分根本不是 Scratch 或 TurboWarp 程式碼：

- **api** 是社群後端（帳戶、專案、評論、通知、設定同步）。它用 Go 編寫，將資料儲存為扁平 JSON，對專案 blob 使用 Cloudflare R2。前端在 `https://api.bilup.org/api` 與它通訊。
- 身分和社交功能透過 **Bilup Accounts** 執行。登入將 Bilup Accounts 令牌換成 Bilup 會話；社交功能（帖子、點贊、關注）轉到 `https://api.accounts.bilup.org`。

您不需要兩者都執行來參與編輯器本身的工作。它們在做社群站點時才有意義。

## 另請參閱

- [建置與執行](/contributing/building-running)
- [內部概覽](/internals/overview)

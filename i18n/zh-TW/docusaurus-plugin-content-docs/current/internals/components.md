---
title: 元件
sidebar_position: 3
---

# 元件

scratch-gui 將其 React 程式碼拆分為兩個扮演非常不同角色的目錄：`src/components/` 用於展示，`src/containers/` 用於接線。本頁描述元件側以及兩者之間的拆分。容器側在[容器](/internals/containers)中介紹。

## 容器/元件拆分

規則很簡單：

- **元件**（`src/components/`）渲染 UI。它透過 props 接收它需要的一切，不匯入 Redux store 或 VM。給定相同的 props 它渲染相同的內容，這使它容易推理和複用。
- **容器**（`src/containers/`）知道 store 和 VM。它選擇元件需要的狀態、繫結回呼，並用那些 props 渲染匹配的元件。

讓展示不知道資料來自哪裡，這就是同一個視覺元件可以在編輯器中被 Redux 驅動、在播放器中被不同狀態驅動、或在測試中被 props 驅動的原因。

並非每個檔案都完美地落線上的一側。一些元件用 React hooks 或 `useState` 持有本地 UI 狀態（佈局測量、懸停、拖動），因為那種狀態不值得放進 Redux。`src/components/gui/gui.jsx` 是一個大例子：它在本地管理舞臺面板調整大小和窄佈局檢測，同時仍然從連線的容器接收其資料 props。元件避免的是直接觸及全域 store。

## 元件如何組織

每個元件是一個包含 `.jsx` 檔案和同名匹配 CSS 模組的資料夾，例如 `menu-bar/menu-bar.jsx` 和 `menu-bar/menu-bar.css`。JSX 將其樣式作為模組匯入：

```js
import styles from './menu-bar.css';
```

css-loader 對類名做雜湊和駝峰化，因此 `styles.someClass` 解析為一個唯一的生成名。這使樣式作用於元件，這也是真正的全域 CSS 必須以不同方式匯入的原因（請參閱[主題](/internals/theming)和[貢獻](/contributing/guidelines)中的 CSS 說明）。

顯示給使用者的文本透過 react-intl 的 `FormattedMessage` 和 `defineMessages`，而不是硬編碼字串，因此介面可以翻譯。

## 主要元件樹

`src/components/gui/gui.jsx`（`GUIComponent`）是編輯器展示的根。它組合介面的主要區域，其中大多數本身是容器：

- 頂部的 `MenuBar`。
- 帶三個面板的標籤條：積木工作區（`Blocks`）、`CostumeTab` 和 `SoundTab`。
- `StageWrapper`，持有舞臺畫布，以及 `TargetPane`，角色和舞臺列表。
- 帶搜尋和新增擴充功能按鈕的積木區頁尾，以及 `Watermark`。
- 每個模態視窗和覆蓋層：素材庫（造型、聲音、背景、擴充功能）、設定、git 模態視窗、還原點、偵錯器、警報、卡片等。許多隻在對應的 `...Visible` prop 為真時渲染。

設定 `isPlayerOnly` 時，同一個元件只渲染 `StageWrapper` 而不是完整編輯器，這就是播放器和嵌入檢視複用編輯器程式碼的方式。

## 去哪裡看

一些您經常遇到的元件目錄：

- `components/gui/` 是頂層佈局。
- `components/menu-bar/` 是頂欄及其選單。
- `components/stage/`、`components/stage-header/`、`components/target-pane/` 和 `components/sprite-selector/` 建置舞臺側。
- `components/loader/`、`components/box/`、`components/modal/` 等是小型共享積木。

許多編輯器功能（設定、自訂擴充功能、git 模態視窗、還原點等）以 `tw-` 或 `mw-` 為字首，標記它們是在原始 Scratch 元件之上的 TurboWarp 或 Bilup 新增。

## 另請參閱

- [容器](/internals/containers)
- [架構](/internals/architecture)
- [狀態管理](/internals/state)
- [主題](/internals/theming)

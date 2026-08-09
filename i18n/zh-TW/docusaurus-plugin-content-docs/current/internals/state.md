---
title: 狀態管理
sidebar_position: 5
---

# 狀態管理

編輯器將其介面狀態儲存在一個 Redux store 中。本頁列出構成該 store 的實際 reducer，並解釋 action creator、選擇器和中介軟體如何圍繞它們組織。

## Store 形狀

store 在 `src/lib/components/app-state-hoc.jsx` 中從三個頂層 reducer 建立：

- **`scratchGui`** 是編輯器狀態樹，在 `src/reducers/gui.js` 中建置。
- **`locales`** 持有活動語言和 RTL 標誌（`src/reducers/locales.js`）。
- **`scratchPaint`** 是造型編輯器自己的 store，從 scratch-paint 匯入。

編輯器觸及的幾乎所有內容都在 `scratchGui` 下。該切片本身在 `src/reducers/gui.js` 中用 `combineReducers` 組裝，`src/reducers/` 中每個檔案對應一個子 reducer。

## Reducers

下面的每個條目都是組合進 `scratchGui` 的真實切片，定義它的檔案在 `src/reducers/`。讀取狀態意味著 `state.scratchGui.<slice>`。

**專案生命週期**

- `projectState`（`project-state.js`）跟蹤當前專案的載入、儲存和錯誤狀態，並匯出 `getIsError` 和 `getIsShowingProject` 等選擇器。
- `projectTitle`（`project-title.js`）是專案名稱。
- `projectChanged`（`project-changed.js`）跟蹤是否有未儲存的更改。
- `autosave`（`autosave.js`）持有自動儲存狀態。

**執行時和 VM**

- `vm`（`vm.js`）持有唯一的 VM 實例（在這裡建立一次）和任何其他可序列化的東西。
- `vmStatus`（`vm-status.js`）映象執行、啟動和渦輪狀態。
- `tw`（`tw.js`）持有 TurboWarp 執行時選項：幀率、插值、編譯器選項、編譯錯誤、雲端變數存在性和平臺不匹配詳情。

**目標和監視器**

- `targets`（`targets.js`）是角色和舞臺列表以及正在編輯的目標。
- `hoveredTarget`（`hovered-target.js`）跟蹤拖放的懸停角色。
- `monitors`（`monitors.js`）持有變數和列表監視器，`monitorLayout`（`monitor-layout.js`）跟蹤它們的位置。

**編輯器佈局和標籤頁**

- `mode`（`mode.js`）是佈局的大切片：`isPlayerOnly`、`isFullScreen`、`isEmbedded`。它決定渲染完整編輯器還是隻渲染播放器。
- `editorTab`（`editor-tab.js`）是活動標籤頁（程式碼、造型、聲音）。
- `stageSize`（`stage-size.js`）和 `customStageSize`（`custom-stage-size.js`）控制舞臺尺寸。
- `workspaceMetrics`（`workspace-metrics.js`）按目標記住積木工作區的滾動和縮放。
- `toolbox`（`toolbox.js`）持有積木區 XML 狀態。

**模態視窗、選單和覆蓋層**

- `modals`（`modals.js`）是哪些模態視窗開啟的地圖（素材庫、設定、git、還原點、字型、資產、偵錯器等），由 `openModal` / `closeModal` action creator 切換。
- `menus`（`menus.js`）跟蹤哪些選單欄下拉框開啟。
- `cards`（`cards.js`）是教程卡片組，`alerts`（`alerts.js`）是警報佇列，`toast`（`toast.js`）是短暫的 toast 訊息。
- `connectionModal`（`connection-modal.js`）是周邊連線狀態。
- `colorPicker`（`color-picker.js`）支撐取色器。
- `micIndicator`（`mic-indicator.js`）是麥克風電平指示器。
- `onboarding`（`onboarding.js`）驅動首次執行的引導流程。

**拖動、恢復和歷史**

- `blockDrag`（`block-drag.js`）和 `assetDrag`（`asset-drag.js`）跟蹤進行中的拖動。
- `restoreDeletion`（`restore-deletion.js`）支撐"恢復最後刪除的"操作。
- `timeTravel`（`time-travel.js`）持有積木主題的"年份"，用於重新鍵控積木工作區。

**主題**

- `theme`（`theme.js`）持有當前 `Theme` 物件，並在它更改時應用其顏色。
- `mwProjectTheme`（`mw-project-theme.js`）支撐應用嵌入專案中的主題的提示。請參閱[主題](/internals/theming)。

**Bilup 新增和其他**

- `rotur`（`rotur.js`）持有社群整合使用的 Bilup Accounts 帳戶和會話狀態。
- `collaboration`（`collaboration.js`）持有即時協作狀態。
- `shortcuts`（`shortcuts.js`）持有鍵盤快速鍵配置。
- `fontsLoaded`（`fonts-loaded.js`）跟蹤字型載入，`timeout`（`timeout.js`）是一個小型共享超時切片。

## Action creator 和選擇器

每個 reducer 檔案遵循相同的約定：它定義其 action 型別常量和 reducer，並預設匯出 reducer 加上它的 action creator（有時還有選擇器和它的 `initialState`）。例如 `theme.js` 匯出 `setTheme`，`vm.js` 匯出 `setVM`，`project-state.js` 在其 actions 旁邊匯出 `getIsError` 等選擇器。

容器直接匯入這些。`mapStateToProps` 讀取切片（或呼叫選擇器），`mapDispatchToProps` 包裹一個匯入的 action creator，使元件接收普通的回呼。模式請參閱[容器](/internals/containers)。

## 初始狀態和渲染模式

`gui.js` 還匯出 `guiInitialState` 以及為受限檢視轉換它的輔助工具：`initPlayer`、`initFullScreen` 和 `initEmbedded`。`AppStateHOC` 在建立 store 之前應用這些，因此同樣的 reducer 可以支撐完整編輯器、播放器或嵌入，只在 `mode` 切片上有所不同。

## 中介軟體

`scratchGui` store 用一箇中間件 `guiMiddleware` 增強，定義在 `gui.js` 中。它是配置為合併快速重複 actions（leading 和 trailing，300 毫秒）的 `redux-throttle`，這防止來自 VM 的高頻更新壓垮 React。`AppStateHOC` 還包裹組合的 reducer 以在每個 action 後通知外掛系統（`AddonHooks.appStateReducer`），並在 `window.ReduxStore` 上暴露 store 供除錯和外掛使用。

## 另請參閱

- [容器](/internals/containers)
- [架構](/internals/architecture)
- [主題](/internals/theming)
- [外掛系統](/internals/addons-system)

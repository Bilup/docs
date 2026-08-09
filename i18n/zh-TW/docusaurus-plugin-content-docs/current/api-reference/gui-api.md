---
title: GUI API
sidebar_position: 3
---

`scratch-gui` 是渲染 Bilup 編輯器和播放器（也提供社群站點）的 React 應用。它的包入口點 `scratch-gui/src/index.js` 匯出您在自訂 React 應用中掛載編輯器或播放器所需的部件。

對大多數嵌入來說您不需要這些。如果您只想在頁面上顯示專案，請使用[打包器](/packager/overview)或[嵌入 iframe](/advanced/embedding)。當您圍繞編輯器建置自己的 React 宿主時，才需要 GUI API。

## 包匯出了什麼

```js
import GUI, {
    AppStateHOC,
    setAppElement,
    guiReducers,
    guiInitialState,
    guiMiddleware,
    initEmbedded,
    initPlayer,
    initFullScreen,
    initLocale,
    localesInitialState,
    remixProject,
    setFullScreen,
    setPlayer
} from 'scratch-gui';
```

- `GUI`（預設匯出）：頂層編輯器元件（`containers/gui.jsx`）。
- `AppStateHOC`：用 Redux store、locale 提供程式和錯誤邊界包裹 `GUI` 的高階元件。用它包裹您的根元件，這樣 GUI 就有它需要的狀態。
- `setAppElement`：從 `react-modal` 重新匯出；用您的應用根元素呼叫它，讓模態視窗為無障礙正確附加。
- `guiReducers`、`guiInitialState`、`guiMiddleware`：Redux reducer 對映（`locales`、`scratchGui`、`scratchPaint`）、初始狀態和中介軟體。如果您自己建置 store 而不是依賴 `AppStateHOC`，請使用這些。
- `localesInitialState`、`initLocale`：locale 狀態和一個在狀態物件上設定活動 locale 的輔助工具。
- `initPlayer`、`initFullScreen`、`initEmbedded`：修改初始狀態以播放器專用、全屏或嵌入模式開始的輔助工具。
- `setPlayer(isPlayerOnly)`、`setFullScreen(isFullScreen)`：在執行時切換模式的 Redux action creator。
- `remixProject`：將專案放入改編狀態的 Redux action creator。

## 最小編輯器

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import GUI, {AppStateHOC, setAppElement} from 'scratch-gui';

const WrappedGUI = AppStateHOC(GUI);

const appTarget = document.getElementById('app');
setAppElement(appTarget);

ReactDOM.render(<WrappedGUI />, appTarget);
```

## 僅播放器

透過 props 傳遞 `isPlayerOnly`（可選地還有全屏），或從播放器初始狀態開始：

```jsx
import GUI, {AppStateHOC, initPlayer, guiInitialState} from 'scratch-gui';

const WrappedGUI = AppStateHOC(GUI);
const initialState = initPlayer(guiInitialState);

<WrappedGUI isPlayerOnly initialState={initialState} projectId="0" />
```

## 獲取 VM

`GUI` 元件建立並擁有一個 [`VirtualMachine`](/api-reference/vm-api)。在執行中的建置中它暴露在 `window.vm` 上（由 `src/lib/components/vm-manager-hoc.jsx` 設定），Redux store 位於 `window.ReduxStore`（請參閱 `src/lib/components/app-state-hoc.jsx`）。在 GUI 的 Redux 狀態內部，VM 位於 `state.scratchGui.vm`。您也可以將自己的 `vm` 實例作為 prop 傳入。

## 進階

`AppStateHOC` 組合幾個提供程式，使樹的其餘部分可以假設它們存在；如果您跳過它，您必須自己提供 Redux store（由 `guiReducers` / `guiMiddleware` 建置）、locale 資料和模態視窗根。`initEmbedded` / `initPlayer` / `initFullScreen` 輔助工具只調整初始 Redux 狀態；掛載後切換模式使用 `setPlayer` 和 `setFullScreen` 操作。

## 另請參閱

- [VM API](/api-reference/vm-api)
- [內部：元件](/internals/components) 和[容器](/internals/containers)
- [內部：狀態](/internals/state) 瞭解 Redux 佈局
- [嵌入](/advanced/embedding)

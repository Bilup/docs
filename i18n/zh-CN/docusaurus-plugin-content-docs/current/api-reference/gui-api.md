---
title: GUI API
sidebar_position: 3
---

`scratch-gui` 是渲染 Bilup 编辑器和播放器（也提供社区站点）的 React 应用。它的包入口点 `scratch-gui/src/index.js` 导出您在自定义 React 应用中挂载编辑器或播放器所需的部件。

对大多数嵌入来说您不需要这些。如果您只想在页面上显示项目，请使用[打包器](/packager/overview)或[嵌入 iframe](/advanced/embedding)。当您围绕编辑器构建自己的 React 宿主时，才需要 GUI API。

## 包导出了什么

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

- `GUI`（默认导出）：顶层编辑器组件（`containers/gui.jsx`）。
- `AppStateHOC`：用 Redux store、locale 提供程序和错误边界包裹 `GUI` 的高阶组件。用它包裹您的根组件，这样 GUI 就有它需要的状态。
- `setAppElement`：从 `react-modal` 重新导出；用您的应用根元素调用它，让模态框为无障碍正确附加。
- `guiReducers`、`guiInitialState`、`guiMiddleware`：Redux reducer 映射（`locales`、`scratchGui`、`scratchPaint`）、初始状态和中间件。如果您自己构建 store 而不是依赖 `AppStateHOC`，请使用这些。
- `localesInitialState`、`initLocale`：locale 状态和一个在状态对象上设置活动 locale 的辅助工具。
- `initPlayer`、`initFullScreen`、`initEmbedded`：修改初始状态以播放器专用、全屏或嵌入模式开始的辅助工具。
- `setPlayer(isPlayerOnly)`、`setFullScreen(isFullScreen)`：在运行时切换模式的 Redux action creator。
- `remixProject`：将项目放入改编状态的 Redux action creator。

## 最小编辑器

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import GUI, {AppStateHOC, setAppElement} from 'scratch-gui';

const WrappedGUI = AppStateHOC(GUI);

const appTarget = document.getElementById('app');
setAppElement(appTarget);

ReactDOM.render(<WrappedGUI />, appTarget);
```

## 仅播放器

通过 props 传递 `isPlayerOnly`（可选地还有全屏），或从播放器初始状态开始：

```jsx
import GUI, {AppStateHOC, initPlayer, guiInitialState} from 'scratch-gui';

const WrappedGUI = AppStateHOC(GUI);
const initialState = initPlayer(guiInitialState);

<WrappedGUI isPlayerOnly initialState={initialState} projectId="0" />
```

## 获取 VM

`GUI` 组件创建并拥有一个 [`VirtualMachine`](/api-reference/vm-api)。在运行中的构建中它暴露在 `window.vm` 上（由 `src/lib/components/vm-manager-hoc.jsx` 设置），Redux store 位于 `window.ReduxStore`（请参阅 `src/lib/components/app-state-hoc.jsx`）。在 GUI 的 Redux 状态内部，VM 位于 `state.scratchGui.vm`。您也可以将自己的 `vm` 实例作为 prop 传入。

## 高级

`AppStateHOC` 组合几个提供程序，使树的其余部分可以假设它们存在；如果您跳过它，您必须自己提供 Redux store（由 `guiReducers` / `guiMiddleware` 构建）、locale 数据和模态框根。`initEmbedded` / `initPlayer` / `initFullScreen` 辅助工具只调整初始 Redux 状态；挂载后切换模式使用 `setPlayer` 和 `setFullScreen` 操作。

## 另请参阅

- [VM API](/api-reference/vm-api)
- [内部：组件](/internals/components) 和[容器](/internals/containers)
- [内部：状态](/internals/state) 了解 Redux 布局
- [嵌入](/advanced/embedding)

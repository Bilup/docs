---
title: 状态管理
sidebar_position: 5
---

# 状态管理

编辑器将其界面状态保存在一个 Redux store 中。本页列出构成该 store 的实际 reducer，并解释 action creator、选择器和中间件如何围绕它们组织。

## Store 形状

store 在 `src/lib/components/app-state-hoc.jsx` 中从三个顶层 reducer 创建：

- **`scratchGui`** 是编辑器状态树，在 `src/reducers/gui.js` 中构建。
- **`locales`** 持有活动语言和 RTL 标志（`src/reducers/locales.js`）。
- **`scratchPaint`** 是造型编辑器自己的 store，从 scratch-paint 导入。

编辑器触及的几乎所有内容都在 `scratchGui` 下。该切片本身在 `src/reducers/gui.js` 中用 `combineReducers` 组装，`src/reducers/` 中每个文件对应一个子 reducer。

## Reducers

下面的每个条目都是组合进 `scratchGui` 的真实切片，定义它的文件在 `src/reducers/`。读取状态意味着 `state.scratchGui.<slice>`。

**项目生命周期**

- `projectState`（`project-state.js`）跟踪当前项目的加载、保存和错误状态，并导出 `getIsError` 和 `getIsShowingProject` 等选择器。
- `projectTitle`（`project-title.js`）是项目名称。
- `projectChanged`（`project-changed.js`）跟踪是否有未保存的更改。
- `autosave`（`autosave.js`）持有自动保存状态。

**运行时和 VM**

- `vm`（`vm.js`）持有唯一的 VM 实例（在这里创建一次）和任何其他可序列化的东西。
- `vmStatus`（`vm-status.js`）镜像运行、启动和涡轮状态。
- `tw`（`tw.js`）持有 TurboWarp 运行时选项：帧率、插值、编译器选项、编译错误、云变量存在性和平台不匹配详情。

**目标和监视器**

- `targets`（`targets.js`）是角色和舞台列表以及正在编辑的目标。
- `hoveredTarget`（`hovered-target.js`）跟踪拖放的悬停角色。
- `monitors`（`monitors.js`）持有变量和列表监视器，`monitorLayout`（`monitor-layout.js`）跟踪它们的位置。

**编辑器布局和标签页**

- `mode`（`mode.js`）是布局的大切片：`isPlayerOnly`、`isFullScreen`、`isEmbedded`。它决定渲染完整编辑器还是只渲染播放器。
- `editorTab`（`editor-tab.js`）是活动标签页（代码、造型、声音）。
- `stageSize`（`stage-size.js`）和 `customStageSize`（`custom-stage-size.js`）控制舞台尺寸。
- `workspaceMetrics`（`workspace-metrics.js`）按目标记住积木工作区的滚动和缩放。
- `toolbox`（`toolbox.js`）持有积木区 XML 状态。

**模态框、菜单和覆盖层**

- `modals`（`modals.js`）是哪些模态框打开的地图（素材库、设置、git、还原点、字体、资产、调试器等），由 `openModal` / `closeModal` action creator 切换。
- `menus`（`menus.js`）跟踪哪些菜单栏下拉框打开。
- `cards`（`cards.js`）是教程卡片组，`alerts`（`alerts.js`）是警报队列，`toast`（`toast.js`）是短暂的 toast 消息。
- `connectionModal`（`connection-modal.js`）是外设连接状态。
- `colorPicker`（`color-picker.js`）支撑取色器。
- `micIndicator`（`mic-indicator.js`）是麦克风电平指示器。
- `onboarding`（`onboarding.js`）驱动首次运行的引导流程。

**拖动、恢复和历史**

- `blockDrag`（`block-drag.js`）和 `assetDrag`（`asset-drag.js`）跟踪进行中的拖动。
- `restoreDeletion`（`restore-deletion.js`）支撑"恢复最后删除的"操作。
- `timeTravel`（`time-travel.js`）持有积木主题的"年份"，用于重新键控积木工作区。

**主题**

- `theme`（`theme.js`）持有当前 `Theme` 对象，并在它更改时应用其颜色。
- `mwProjectTheme`（`mw-project-theme.js`）支撑应用嵌入项目中的主题的提示。请参阅[主题](/internals/theming)。

**Bilup 添加和其他**

- `rotur`（`rotur.js`）持有社区集成使用的 Bilup Accounts 账户和会话状态。
- `collaboration`（`collaboration.js`）持有实时协作状态。
- `shortcuts`（`shortcuts.js`）持有键盘快捷键配置。
- `fontsLoaded`（`fonts-loaded.js`）跟踪字体加载，`timeout`（`timeout.js`）是一个小型共享超时切片。

## Action creator 和选择器

每个 reducer 文件遵循相同的约定：它定义其 action 类型常量和 reducer，并默认导出 reducer 加上它的 action creator（有时还有选择器和它的 `initialState`）。例如 `theme.js` 导出 `setTheme`，`vm.js` 导出 `setVM`，`project-state.js` 在其 actions 旁边导出 `getIsError` 等选择器。

容器直接导入这些。`mapStateToProps` 读取切片（或调用选择器），`mapDispatchToProps` 包裹一个导入的 action creator，使组件接收普通的回调。模式请参阅[容器](/internals/containers)。

## 初始状态和渲染模式

`gui.js` 还导出 `guiInitialState` 以及为受限视图转换它的辅助工具：`initPlayer`、`initFullScreen` 和 `initEmbedded`。`AppStateHOC` 在创建 store 之前应用这些，因此同样的 reducer 可以支撑完整编辑器、播放器或嵌入，只在 `mode` 切片上有所不同。

## 中间件

`scratchGui` store 用一个中间件 `guiMiddleware` 增强，定义在 `gui.js` 中。它是配置为合并快速重复 actions（leading 和 trailing，300 毫秒）的 `redux-throttle`，这防止来自 VM 的高频更新压垮 React。`AppStateHOC` 还包裹组合的 reducer 以在每个 action 后通知插件系统（`AddonHooks.appStateReducer`），并在 `window.ReduxStore` 上暴露 store 供调试和插件使用。

## 另请参阅

- [容器](/internals/containers)
- [架构](/internals/architecture)
- [主题](/internals/theming)
- [插件系统](/internals/addons-system)

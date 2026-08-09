---
title: API 參考概覽
sidebar_position: 1
---

Bilup 由一組 JavaScript 包建置：`scratch-vm`（執行專案的引擎）、`scratch-render`（WebGL 渲染器）、`scratch-blocks`（積木編輯器）和 `scratch-gui`（將它們整合在一起並同時提供社群站點的 React 應用）。本節記錄這些包暴露的程式化表面。

它面向進階使用者、擴充功能作者以及在自己的頁面中嵌入 Bilup 的人。如果您只想製作專案，您不需要這些。如果您想編寫指令碼控制執行中的專案、建置擴充功能或自己驅動 VM，從這裡開始。

## 存取執行中的實例

編輯器或播放器開啟時，scratch-gui 將兩個物件放在 `window` 上用於除錯和指令碼編寫：

- `window.vm` 是即時的 [`VirtualMachine`](/api-reference/vm-api) 實例。VM 管理器掛載後設置一次（請參閱 `src/lib/components/vm-manager-hoc.jsx`）。
- `window.ReduxStore` 是應用的 Redux store（請參閱 `src/lib/components/app-state-hoc.jsx`），對檢查 GUI 狀態很有用。

在編輯器上開啟瀏覽器控制台並嘗試：

```js
// 運行當前專案的 VM
window.vm

// 啟動專案，就像點選了綠旗
window.vm.greenFlag();

// 渲染器，如果已附加
window.vm.renderer

// 引擎執行時（目標、執行緒、積木、IO 裝置）
window.vm.runtime
```

這些全域變數用於互動式使用。它們不是穩定的、帶版本的 API，並且可能隨建置而更改。擴充功能應該改用[擴充功能 API](/api-reference/extension-api)，它會顯式傳遞 `Scratch.vm`。

## 各層

- [VM API](/api-reference/vm-api)：公開的 `VirtualMachine` 類。載入和儲存專案、控制播放、管理角色/造型/聲音，以及讀取狀態。這是嵌入者對話的物件。
- [GUI API](/api-reference/gui-api)：scratch-gui 匯出的 React 入口點，讓您可以在自己的應用中渲染編輯器或播放器。
- [擴充功能 API](/api-reference/extension-api)：擴充功能作者針對其編寫的 `Scratch` 物件（`BlockType`、`ArgumentType`、`Scratch.extensions.register` 以及沙箱許可權輔助工具）。
- [積木註冊](/api-reference/block-registration)：操作碼和帽子如何接入執行時。
- [執行緒](/api-reference/threads)：實際執行指令碼的執行緒和序列器模型。
- [執行時 API](/api-reference/runtime)：持有目標、IO 裝置、監視器並啟動執行緒的引擎（`vm.runtime`）。
- [外掛 API](/api-reference/addon-api)：userscript 接收的 `addon` 物件。
- [事件](/api-reference/events)：VM 發出的事件。
- [實用工具](/api-reference/utilities)：`Cast`、`Color` 和 `MathUtil` 等輔助模組。

## 嵌入

如果您想在自己的頁面上放置 Bilup 專案，通常不需要直接針對 VM 建置；您使用[打包器](/packager/overview)或[嵌入 iframe](/advanced/embedding)。只有當您需要這些工具不給您的控制時，才直接針對 VM/GUI 建置。

## 另請參閱

- [建置擴充功能](/building-extensions/introduction)
- [內部：架構](/internals/architecture)
- [專案中的 JavaScript](/advanced/javascript)

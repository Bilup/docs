---
title: 外掛 API
sidebar_position: 7
---

外掛是修改編輯器和播放器的 userscript 和 userstyle。每個外掛是 `scratch-gui/src/addons/addons/` 下的一個資料夾，帶有一個清單和一個或多個指令碼。當外掛的 userscript 執行時，它接收一個 API 物件。本頁是該物件的參考，定義在 `scratch-gui/src/addons/api.js`。外掛是什麼以及如何使用請參閱[外掛](/editor/addons)。

## userscript 入口點

外掛 userscript 匯出一個接收 API 物件的預設非同步函式：

```js
export default async function ({addon, console, msg}) {
    const vm = addon.tab.traps.vm;
    // ... 修改編輯器 ...
}
```

傳入的物件具有以下成員：

- `addon`：外掛 API，分為 `addon.tab`、`addon.settings` 和 `addon.self`（見下文）。
- `console`：瀏覽器控制台。
- `global`：全域物件。
- `msg(key, vars)`：來自外掛翻譯的本地化訊息。
- `safeMsg(key, vars)`：相同，但經過 HTML 轉義。

## addon.tab

`addon.tab` 是觸及頁面的主要表面。它是一個事件目標。

- `tab.traps`：到編輯器內部的逃生艙口：
  - `traps.vm`：即時的 [`VirtualMachine`](/api-reference/vm-api)。
  - `traps.getBlockly()`：在 Blockly 實例就緒後解析它。
  - `traps.getWorkspace()`：當前的 Blockly 工作區。
  - `traps.getPaper()`：在造型編輯器開啟時解析 paper.js 作用域。
- `tab.redux`：存取 GUI 的 Redux store，包括 `tab.redux.state` 和 `statechanged` 事件。
- `tab.waitForElement(selector, options)`：在匹配的 DOM 元素出現後解析它。選項包括 `markAsSeen`（這樣同一元素不會返回兩次）、`condition` 回呼、`reduxCondition` 回呼和 `reduxEvents` 以等待特定的 store 操作。
- `tab.appendToSharedSpace({space, element, order, scope})`：將元素插入已知的編輯器區域（例如 `stageHeader`），相對於其他外掛保持在穩定位置。
- `tab.createBlockContextMenu(callback, {workspace, blocks, flyout, comments})`：向積木或工作區上下文選單新增專案。
- `tab.scratchClass(...names, {others})`：將 Bilup 的雜湊 CSS 類名（例如 `green-flag`）解析為它們真實的執行時類名，讓您的樣式和查詢匹配。
- `tab.scratchMessage(id)`：查詢編輯器自己本地化字串之一。
- `tab.copyImage(dataURL)`：將 PNG 資料 URL 複製到剪貼簿。
- `tab.createModal(title, {isOpen})`、`tab.confirm(...)`、`tab.prompt(...)`：編輯器風格的對話方塊。
- `tab.displayNoneWhileDisabled(el, options)`：在外掛被停用時隱藏元素。
- `tab.editorMode`：當前編輯器模式字串。
- `tab.direction`：當前語言環境的 `'ltr'` 或 `'rtl'`。
- `tab.recolorable()`：一個 `<img>`，其 SVG 根據當前主題強調色重新著色。

## addon.settings

`addon.settings` 讀取外掛自己的設定，按其清單宣告。它是一個事件目標。

- `settings.get(id)`：設定的當前值。
- 監聽 `change` 事件以在使用者更改設定時做出反應：

```js
addon.settings.addEventListener('change', () => {
    const speed = addon.settings.get('speed');
    // ... 應用新值 ...
});
```

## addon.self

`addon.self` 是外掛自己的狀態。它是一個事件目標。

- `self.id`：外掛的 ID。
- `self.disabled`：外掛當前是否被停用。
- `self.getResource(path)`：將捆綁的資源路徑解析為可用的 URL。
- 當使用者開啟編輯器時切換外掛時，會觸發 `disabled` 和 `reenabled` 事件，因此外掛無需重新載入即可清理或重新應用其更改：

```js
addon.self.addEventListener('disabled', () => { /* 撤銷更改 */ });
addon.self.addEventListener('reenabled', () => { /* 重做更改 */ });
```

## Userstyles

外掛還可以攜帶 CSS。靜態樣式表自動應用，設定可以驅動 CSS 自訂屬性：清單設定產生名為 `--<addonId>-<settingId>` 的變數，清單 `customCssVariables` 可以計算在設定更改時更新的顏色（混合、增亮、閾值等）。

## 另請參閱

- [外掛](/editor/addons) 瞭解面向使用者的功能
- [內部：外掛系統](/internals/addons-system)
- [VM API](/api-reference/vm-api)

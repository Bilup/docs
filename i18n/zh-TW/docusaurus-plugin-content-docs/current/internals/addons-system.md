---
title: 外掛系統
sidebar_position: 7
---

# 外掛系統

外掛是修改編輯器的小功能：編輯器調整、額外工具、外觀更改。Bilup 的外掛框架繼承自 [Scratch Addons](https://scratchaddons.com/) 瀏覽器擴充功能，適配後在編輯器建置內部執行。本頁描述您最可能使用的兩個部分：設定儲存和視窗系統。

外掛程式碼位於 `src/addons/`。

## 外掛從哪裡來

外掛及其翻譯從 Scratch Addons 拉取，併為在 Bilup 中使用打補丁。`src/addons/` 的大部分是生成的：`pull.js` 指令碼獲取上游原始碼、應用補丁並寫入 `addons/`、`addons-l10n/`、`libraries/` 和 `generated/` 資料夾。您通常不手動編輯這些。正如 addons README 所說，功能請求去上游，但由 TurboWarp 移植引起的 bug 在這裡報告。

捆綁外掛的列表定義在 `src/addons/addons.js` 中（僅由 `pull.js` 使用，不在執行時使用）。它包含 `editor-devtools`、`debugger`、`variable-manager`、`folders`、`block-switching` 等編輯器工具，以及為自訂積木主題提供動力的 `editor-theme3` 外掛。

## 設定儲存

每個外掛都有設定（至少包括它是否啟用）。所有這些由一個 `SettingsStore`（`src/addons/settings-store.js`）持有，透過 `src/addons/settings-store-singleton.js` 作為單例使用：

```js
import SettingsStore from './settings-store';

const settingStore = new SettingsStore();
const urlParameters = new URLSearchParams(location.search);
if (urlParameters.has('addons')) {
    settingStore.parseUrlParameter(urlParameters.get('addons'));
} else {
    settingStore.readLocalStorage();
}

export default settingStore;
```

啟動時 store 從 `localStorage`（鍵 `tw:addons`）載入設定，除非 `addons` URL 引數覆蓋它們。`SettingsStore` 擴充功能一個事件目標墊片，因此應用的其他部分訂閱它並在設定更改時做出反應。

它的主要職責：

- **讀取和持久化。** `readLocalStorage()` 和 `saveToLocalStorage()` 載入和儲存設定，`migrateSettings()` 升級較舊的儲存格式（store 當前是第 5 版）。
- **查詢。** `getAddonEnabled(id)`、`getAddonSetting(id, settingId)`、`getAddonManifest(id)` 和 `getDefaultSettings(id)` 回答外掛的當前配置是什麼，回退到清單預設值。
- **更改。** `setAddonEnabled(id, enabled)` 和 `setAddonSetting(id, settingId, value)` 更新值、持久化併發出更改事件，讓受影響的外掛即時響應。`resetAddon()` 和 `resetAllAddons()` 恢復預設值。
- **匯入和匯出。** `export({theme})` 和 `import(data)` 在實例之間移動設定，`parseUrlParameter()` 應用在 URL 中傳入的設定。
- **條件。** `evaluateCondition()` 支援只在其他設定持有某些值時應用的外掛設定。

設定 UI（在 `src/addons/settings/`）是這個 store 的一個檢視；更改控制元件呼叫 `setAddonSetting`，其餘由 store 完成。

## 視窗系統

一些外掛開啟自己的浮動面板（例如偵錯器和變數管理器）。與其讓每個外掛重新發明，有一個共享視窗系統在 `src/addons/window-system/` 中，以 `window-manager.js` 為中心。

`window-manager.js` 匯出一個 `WindowManager` 物件，一個用於建立和跟蹤視窗的小型 API：

```js
const WindowManager = {
    createWindow (options = {}) { /* ... */ },
    getWindow (id) { /* ... */ },
    getAllWindows () { /* ... */ },
    closeWindow (id) { /* ... */ },
    closeAllWindows () { /* ... */ },
    bringToFront (id) { /* ... */ }
};
```

它也作為 `window.wm` 全域暴露。

`createWindow` 根據環境返回兩個實現之一：

- **`AddonWindow`** 是在編輯器內部渲染的頁內可拖動、可調整大小的視窗。這是正常情況。
- **`NativeAddonWindow`** 在真正的作業系統視窗可用時（例如在桌面應用中）使用，透過 `window.open` 開啟一個真正的彈出視窗並使其相對於主視窗定位。`createWindow` 只在原生視窗可以使用且視窗的 id 未被強制保持頁內時選擇這條路徑。

無論哪種方式，管理器都保持活動視窗的登錄檔，以便查詢它們、聚焦它們（`bringToFront`），並單獨或一次性關閉它們。透過此係統建立的視窗共享樣式和行為（捲軸、標題按鈕、焦點處理），因此外掛獲得一致的視窗而無需每個都建置自己的。

## 另請參閱

- [編輯器外掛](/editor/addons)
- [狀態管理](/internals/state)
- [主題](/internals/theming)
- [架構](/internals/architecture)

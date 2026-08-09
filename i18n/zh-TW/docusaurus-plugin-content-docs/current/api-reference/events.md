---
title: 事件
sidebar_position: 8
---

`VirtualMachine` 擴充功能 Node 的 `EventEmitter`。編輯器和播放器監聽這些事件以保持 UI 同步，您也可以：

```js
vm.on('PROJECT_CHANGED', () => {
    console.log('the project was edited');
});
```

VM 以相同名稱重新發出執行時的大部分事件，因此您通常監聽 `vm`。少數只在 `vm.runtime` 上觸發；下面已註明。此列表取自 `scratch-vm/src/virtual-machine.js` 和 `scratch-vm/src/engine/runtime.js`。

## 播放與執行

| 事件 | 觸發時 |
| --- | --- |
| `PROJECT_START` | 綠旗被按下。 |
| `PROJECT_RUN_START` | 執行緒本幀開始執行（從空閒到活動）。 |
| `PROJECT_RUN_STOP` | 所有執行緒已停止（從活動到空閒）。 |
| `PROJECT_CHANGED` | 專案以影響序列化的方式被編輯。 |
| `PROJECT_LOADED` | 專案完成載入。在 `vm.runtime` 上觸發。 |
| `TURBO_MODE_ON` / `TURBO_MODE_OFF` | 渦輪模式被切換。 |
| `RUNTIME_STARTED` / `RUNTIME_STOPPED` | 執行時的步進迴圈開始或停止。 |

## 載入進度

| 事件 | 負載 |
| --- | --- |
| `LOAD_PROGRESS` | `{stage, loaded, total}`，其中 `stage` 是 `unzipping`、`parsing`、`checking`、`building`、`installing` 之一。 |
| `ASSET_PROGRESS` | 專案資產下載時的 `(finished, total)`。 |

## 目標、積木和工作區

| 事件 | 負載 |
| --- | --- |
| `targetsUpdate` | `{targetList, editingTarget}`。目標列表更改或選擇更改。 |
| `workspaceUpdate` | 編輯目標的積木，用於重建積木工作區。 |
| `MONITORS_UPDATE` | 當前監視器（舞臺觀察器）狀態。 |
| `BLOCK_DRAG_UPDATE` / `BLOCK_DRAG_END` | 積木正在 GUI 上拖動 / 拖動完成。 |
| `VISUAL_REPORT` | 要在被點選的報告積木旁邊顯示為氣泡的值。 |
| `SCRIPT_GLOW_ON` / `SCRIPT_GLOW_OFF` | 指令碼開始或停止發光。 |
| `BLOCK_GLOW_ON` / `BLOCK_GLOW_OFF` | 單個積木開始或停止發光。 |
| `PROJECT_STOP_ALL`、`STOP_FOR_TARGET` | 停止按鈕被點選 / 一個目標被停止。在 `vm.runtime` 上觸發。 |

## 擴充功能

| 事件 | 觸發時 |
| --- | --- |
| `EXTENSION_ADDED` | 擴充功能的積木分類被註冊。負載是分類資訊。 |
| `EXTENSION_REMOVED` | 擴充功能被移除。 |
| `EXTENSIONS_REORDERED` | 擴充功能順序更改。 |
| `EXTENSION_FIELD_ADDED` | 擴充功能註冊了一個自訂欄位型別。 |
| `BLOCKSINFO_UPDATE` | 擴充功能的積木被重新整理（例如 locale 更改後）。 |
| `PERIPHERAL_LIST_UPDATE`、`USER_PICKED_PERIPHERAL`、`PERIPHERAL_CONNECTED`、`PERIPHERAL_DISCONNECTED`、`PERIPHERAL_REQUEST_ERROR`、`PERIPHERAL_CONNECTION_LOST_ERROR`、`PERIPHERAL_SCAN_TIMEOUT` | 周邊掃描和連線生命週期。 |

## 設定已更改

這些在匹配的設定器執行後觸發，因此 UI 可以更新：

| 事件 | 負載 |
| --- | --- |
| `RUNTIME_OPTIONS_CHANGED` | 當前的執行時選項。 |
| `COMPILER_OPTIONS_CHANGED` | 當前的編譯器選項。 |
| `FRAMERATE_CHANGED` | 新的幀率。 |
| `INTERPOLATION_CHANGED` | 插值是否開啟。 |
| `STAGE_SIZE_CHANGED` | `(width, height)`。 |
| `COMPILE_ERROR` | 指令碼編譯失敗時的 `(target, error)`。 |
| `HAS_CLOUD_DATA_UPDATE` | 專案是否使用雲端變數。 |
| `MIC_LISTENING` | 麥克風是否活動。 |
| `LOCALE_CHANGED` | `setLocale` 之後的新 locale。 |

## 積木詢問宿主

一些積木需要宿主 UI 響應。這些在 `vm.runtime` 上觸發：

- `SAY`：角色說話或思考（`say`/`think` 積木）。
- `QUESTION`：一個"詢問並等待"積木正在等待輸入。宿主收集答案並在執行時上發出 `ANSWER` 事件以解除指令碼阻塞。

## 另請參閱

- [VM API](/api-reference/vm-api)
- [執行緒](/api-reference/threads)
- [積木註冊](/api-reference/block-registration)

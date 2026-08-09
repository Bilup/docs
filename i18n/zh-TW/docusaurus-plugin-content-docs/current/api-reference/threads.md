---
title: 執行緒
sidebar_position: 6
---

專案是一組指令碼，每個執行中的指令碼是一個執行緒。執行時每幀對每個執行緒步進一點；正是這種步進讓積木執行。本頁描述 `scratch-vm/src/engine/` 中的 `Thread` 和 `Sequencer` 模型。Bilup 也可以將指令碼編譯為 JavaScript，這改變執行緒的執行方式，但不改變周圍的模型。

## 執行緒是什麼

`Thread`（`engine/thread.js`）是一個執行中的指令碼。它重要的欄位：

- `topBlock`：指令碼頂部（帽子或第一個）積木的 ID。
- `target`：執行指令碼的角色或舞臺。
- `blockContainer`：執行緒從中執行的 `Blocks` 容器。通常是目標自己的積木，但積木區中點選的指令碼從 `runtime.flyoutBlocks` 執行。編譯器也讀取它，因此空容器會跳過編譯。
- `stack`：從頂部積木到當前執行積木的積木 ID。進入 C 積木（迴圈或 `如果`）會壓入此棧；完成時彈出。
- `stackFrames`：每個棧級別一個 `_StackFrame`，持有每級別的執行狀態（`warpMode`、`isLoop`、`justReported`、`waitingReporter`、過程 `params` 以及積木方法可以在讓出期間使用的暫存 `executionContext`）。幀透過空閒列表池化和回收。
- `status`：執行緒的狀態（見下文）。
- `requestScriptGlowInFrame` / `blockGlowInFrame`：指令碼本幀是否應發光以及發光哪個積木 ID。執行時在發出發光事件時讀取這些（見下文）。
- `warpTimer`：執行緒進入 warp 模式時建立的 `Timer`；請參閱[Warp 模式](#warp-mode)。
- `isKilled`：執行緒在中間被停止時設定，因此恢復的積木不會越過終點。
- `isCompiled`、`generator`、`procedures`：執行緒被編譯為 JavaScript 時設定。

每個執行緒從其目標和頂部積木獲得一個穩定 ID，`target.id & topBlock`（`Thread.getIdFromTargetAndBlock`）。

### 執行緒狀態

`status` 是五個常量之一：

| 常量 | 值 | 含義 |
| --- | --- | --- |
| `Thread.STATUS_RUNNING` | 0 | 正常執行；逐積木步進。 |
| `Thread.STATUS_PROMISE_WAIT` | 1 | 等待非同步積木的 promise。 |
| `Thread.STATUS_YIELD` | 2 | 已讓出；下一步恢復。 |
| `Thread.STATUS_YIELD_TICK` | 3 | 為單個 tick 讓出；恢復時清除。 |
| `Thread.STATUS_DONE` | 4 | 已完成；沒有剩餘積木。 |

### 棧

`Thread` 暴露直譯器和 C 積木實現使用的棧輔助工具：`pushStack(blockId)`、`popStack()`、`peekStack()`、`peekStackFrame()`、`goToNextBlock()`、`reuseStackForNextBlock(blockId)`、`stopThisScript()`，以及過程引數輔助工具 `pushParam`、`getParam`、`initParams`。

## 序列器 {#the-sequencer}

`Sequencer`（`engine/sequencer.js`）執行執行緒。每幀執行時呼叫一次 `stepThreads()`，它：

1. 設定工作預算：`WORK_TIME = 0.75 * runtime.currentStepTime`（幀間隔的 75%）。
2. 遍歷 `runtime.threads`，對每個執行中或已讓出的執行緒呼叫 `stepThread(thread)`。
3. 只要有活動執行緒、工作預算未用完，並且要麼渦輪模式開啟要麼沒有積木請求螢幕重繪，就繼續迴圈。
4. 移除已完成的執行緒並返回它們。

`stepThread(thread)` 執行一個執行緒。如果執行緒已編譯，它交給編譯執行器；否則它從當前積木開始走直譯器，處理報告積木、C 積木分支、promise 和讓出。當積木請求重繪（或預算用完）時，序列器為本幀停止，並在下一幀從停下的地方繼續。

### Warp 模式 {#warp-mode}

Warp 模式（"執行時不重新整理螢幕"，也是自訂積木 warp 的基礎）讓一個部分完整執行到完成，不對重繪讓出。warp 執行緒使用執行緒自己的 `warpTimer` 對照 `Sequencer.WARP_TIME`（500 毫秒）計時，而不是共享的 `WORK_TIME` 預算，因此失控的 warp 迴圈不能永遠凍結頁面。

## 啟動執行緒

執行緒由執行時建立，而不是大多數程式碼直接建立。點選綠旗呼叫 `vm.greenFlag()`，它啟動每個綠旗帽子。觸發帽子（廣播、按鍵、擴充功能 `EVENT` 積木）透過 `runtime.startHats(opcode, optMatchFields, optTarget)`，它找到每個匹配的指令碼，尊重帽子的 `restartExistingThreads` 後設資料，並返回新執行緒。在編輯器中點選指令碼呼叫 `runtime.toggleScript`，並啟動一個保持線上程對映之外的臨時"堆疊點選"執行緒。執行緒啟動、停止和發光時，執行時發出 `*_GLOW_*`、`PROJECT_RUN_START` 和 `PROJECT_RUN_STOP` [事件](/api-reference/events)。要自己啟動執行緒或監視現有的執行緒，請參閱[執行時 API](/api-reference/runtime)。

## 編譯執行緒 {#compiled-threads}

Bilup 的編譯器將指令碼變成 JavaScript 生成器函式。執行緒編譯時，`isCompiled` 變為真，步進的是它的 `generator`，而不是直譯器走積木。上面的執行緒模型（狀態、warp、啟動和停止）不變；只有逐積木執行更快。編譯器預設開啟，可以從[專案設定](/advanced/disable-compiler)關閉。

## 另請參閱

- [執行時 API](/api-reference/runtime) 瞭解啟動執行緒、目標和 IO 裝置
- [積木註冊](/api-reference/block-registration)
- [VM API](/api-reference/vm-api)
- [內部：架構](/internals/architecture)
- [編譯擴充功能](/building-extensions/compiled/overview)
- [防卡死計時器](/advanced/warp-timer)和[移除限制](/advanced/remove-limits)

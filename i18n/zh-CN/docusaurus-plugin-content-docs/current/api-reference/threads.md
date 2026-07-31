---
title: 线程
sidebar_position: 6
---

项目是一组脚本，每个运行中的脚本是一个线程。运行时每帧对每个线程步进一点；正是这种步进让积木运行。本页描述 `scratch-vm/src/engine/` 中的 `Thread` 和 `Sequencer` 模型。Bilup 也可以将脚本编译为 JavaScript，这改变线程的运行方式，但不改变周围的模型。

## 线程是什么

`Thread`（`engine/thread.js`）是一个运行中的脚本。它重要的字段：

- `topBlock`：脚本顶部（帽子或第一个）积木的 ID。
- `target`：运行脚本的角色或舞台。
- `blockContainer`：线程从中执行的 `Blocks` 容器。通常是目标自己的积木，但积木区中点击的脚本从 `runtime.flyoutBlocks` 执行。编译器也读取它，因此空容器会跳过编译。
- `stack`：从顶部积木到当前执行积木的积木 ID。进入 C 积木（循环或 `如果`）会压入此栈；完成时弹出。
- `stackFrames`：每个栈级别一个 `_StackFrame`，持有每级别的执行状态（`warpMode`、`isLoop`、`justReported`、`waitingReporter`、过程 `params` 以及积木方法可以在让出期间使用的暂存 `executionContext`）。帧通过空闲列表池化和回收。
- `status`：线程的状态（见下文）。
- `requestScriptGlowInFrame` / `blockGlowInFrame`：脚本本帧是否应发光以及发光哪个积木 ID。运行时在发出发光事件时读取这些（见下文）。
- `warpTimer`：线程进入 warp 模式时创建的 `Timer`；请参阅[Warp 模式](#warp-mode)。
- `isKilled`：线程在中间被停止时设置，因此恢复的积木不会越过终点。
- `isCompiled`、`generator`、`procedures`：线程被编译为 JavaScript 时设置。

每个线程从其目标和顶部积木获得一个稳定 ID，`target.id & topBlock`（`Thread.getIdFromTargetAndBlock`）。

### 线程状态

`status` 是五个常量之一：

| 常量 | 值 | 含义 |
| --- | --- | --- |
| `Thread.STATUS_RUNNING` | 0 | 正常执行；逐积木步进。 |
| `Thread.STATUS_PROMISE_WAIT` | 1 | 等待异步积木的 promise。 |
| `Thread.STATUS_YIELD` | 2 | 已让出；下一步恢复。 |
| `Thread.STATUS_YIELD_TICK` | 3 | 为单个 tick 让出；恢复时清除。 |
| `Thread.STATUS_DONE` | 4 | 已完成；没有剩余积木。 |

### 栈

`Thread` 暴露解释器和 C 积木实现使用的栈辅助工具：`pushStack(blockId)`、`popStack()`、`peekStack()`、`peekStackFrame()`、`goToNextBlock()`、`reuseStackForNextBlock(blockId)`、`stopThisScript()`，以及过程参数辅助工具 `pushParam`、`getParam`、`initParams`。

## 序列器 {#the-sequencer}

`Sequencer`（`engine/sequencer.js`）运行线程。每帧运行时调用一次 `stepThreads()`，它：

1. 设置工作预算：`WORK_TIME = 0.75 * runtime.currentStepTime`（帧间隔的 75%）。
2. 遍历 `runtime.threads`，对每个运行中或已让出的线程调用 `stepThread(thread)`。
3. 只要有活动线程、工作预算未用完，并且要么涡轮模式开启要么没有积木请求屏幕重绘，就继续循环。
4. 移除已完成的线程并返回它们。

`stepThread(thread)` 运行一个线程。如果线程已编译，它交给编译执行器；否则它从当前积木开始走解释器，处理报告积木、C 积木分支、promise 和让出。当积木请求重绘（或预算用完）时，序列器为本帧停止，并在下一帧从停下的地方继续。

### Warp 模式 {#warp-mode}

Warp 模式（"运行时不刷新屏幕"，也是自定义积木 warp 的基础）让一个部分完整运行到完成，不对重绘让出。warp 线程使用线程自己的 `warpTimer` 对照 `Sequencer.WARP_TIME`（500 毫秒）计时，而不是共享的 `WORK_TIME` 预算，因此失控的 warp 循环不能永远冻结页面。

## 启动线程

线程由运行时创建，而不是大多数代码直接创建。点击绿旗调用 `vm.greenFlag()`，它启动每个绿旗帽子。触发帽子（广播、按键、扩展 `EVENT` 积木）通过 `runtime.startHats(opcode, optMatchFields, optTarget)`，它找到每个匹配的脚本，尊重帽子的 `restartExistingThreads` 元数据，并返回新线程。在编辑器中点击脚本调用 `runtime.toggleScript`，并启动一个保持在线程映射之外的临时"堆栈点击"线程。线程启动、停止和发光时，运行时发出 `*_GLOW_*`、`PROJECT_RUN_START` 和 `PROJECT_RUN_STOP` [事件](/api-reference/events)。要自己启动线程或监视现有的线程，请参阅[运行时 API](/api-reference/runtime)。

## 编译线程 {#compiled-threads}

Bilup 的编译器将脚本变成 JavaScript 生成器函数。线程编译时，`isCompiled` 变为真，步进的是它的 `generator`，而不是解释器走积木。上面的线程模型（状态、warp、启动和停止）不变；只有逐积木执行更快。编译器默认开启，可以从[项目设置](/advanced/disable-compiler)关闭。

## 另请参阅

- [运行时 API](/api-reference/runtime) 了解启动线程、目标和 IO 设备
- [积木注册](/api-reference/block-registration)
- [VM API](/api-reference/vm-api)
- [内部：架构](/internals/architecture)
- [编译扩展](/building-extensions/compiled/overview)
- [防卡死计时器](/advanced/warp-timer)和[移除限制](/advanced/remove-limits)

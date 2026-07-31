---
title: 运行时 API
sidebar_position: 5.5
---

`Runtime`（`scratch-vm/src/engine/runtime.js`）是实际运行项目的引擎。[`VirtualMachine`](/api-reference/vm-api) 拥有一个并将其暴露为 `vm.runtime`；扩展以 `Scratch.vm.runtime` 获得它。它持有每个目标、步进[线程](/api-reference/threads)、通过 IO 设备路由输入，并发出编辑器监听的[事件](/api-reference/events)。

`Runtime` 扩展 Node 的 `EventEmitter`，因此 `runtime.on(name, handler)` 和 `runtime.emit(...)` 直接工作。VM 以相同名称重新发出大多数运行时事件，因此 UI 代码通常监听 `vm`；想要原始流的扩展和内部代码监听 `runtime`。

本页涵盖扩展或 `window.vm` 控制台可以安全触及的运行时表面。任何以 `_` 前缀的内容都是内部的，不在此涵盖。

## 目标

"目标"是一个角色或舞台（一个 `RenderedTarget`）。运行时按执行顺序保留它们。

- `runtime.targets`：所有目标的数组，包括克隆，按图层/执行顺序。
- `runtime.getTargetForStage()`：舞台目标，如果没有则为 `undefined`。
- `runtime.getSpriteTargetByName(name)`：具有该名称的第一个原始（非克隆）角色。
- `runtime.getTargetById(id)`：按 ID 的目标（使用内部缓存）。
- `runtime.getTargetByDrawableId(drawableID)`：拥有给定渲染器可绘制对象的目标。
- `runtime.getEditingTarget()`：编辑器中当前选中的目标，或 `undefined`。

```js
// 在编辑器控制台中：
window.vm.runtime.getTargetForStage();
window.vm.runtime.getSpriteTargetByName('Sprite1');
```

## 克隆

- `runtime.clonesAvailable()`：是否还可以创建另一个克隆（计数达到 `runtimeOptions.maxClones` 后为 `false`）。
- `runtime.changeCloneCounter(delta)`：调整实时克隆计数。克隆/删除积木会调用这个；您很少需要直接使用。

克隆是 `runtime.targets` 中的普通目标；`stopAll()` 处理掉每个非原始克隆。

## IO 设备

`runtime.ioDevices` 分组虚拟输入设备。积木读取它们；宿主通过 [`vm.postIOData(device, data)`](/api-reference/vm-api) 供给它们。

| 设备 | 源码 | 值得注意的读取 |
| --- | --- | --- |
| `keyboard` | `io/keyboard.js` | `getKeyIsDown(key)` |
| `mouse` | `io/mouse.js` | `getScratchX()`、`getScratchY()`、`getIsDown()`、`getButtonIsDown(button)` |
| `mouseWheel` | `io/mouse-wheel.js` | 滚动增量 |
| `clock` | `io/clock.js` | `projectTimer()`、`resetProjectTimer()` |
| `cloud` | `io/cloud.js` | 云变量请求 |
| `userData` | `io/user_data.js` | `getUsername()` |
| `video` | `io/video.js` | 用于视频侦测扩展的摄像头帧 |

## 项目计时器

Scratch 的 `计时器` 积木读取 `runtime.ioDevices.clock`：

- `runtime.ioDevices.clock.projectTimer()`：计时器上次重置以来的秒数。
- `runtime.ioDevices.clock.resetProjectTimer()`：将其重置为零。`greenFlag()` 和 `dispose()` 会自动执行此操作。

## 绿旗与停止

- `runtime.greenFlag()`：停止一切，重置项目计时器，触发 `event_whenflagclicked` 帽子。发出 `PROJECT_START`。这就是 `vm.greenFlag()` 调用的内容。
- `runtime.stopAll()`：停止每个线程，处理掉所有克隆，并清空线程列表。发出 `PROJECT_STOP_ALL`。

## 启动线程（帽子）

- `runtime.startHats(requestedHatOpcode, optMatchFields, optTarget)`：为每个顶部积木是 `requestedHatOpcode` 帽子的脚本启动一个线程。`optMatchFields` 按字段值筛选（比较前大写，因此广播和按键只触发正确的脚本）；`optTarget` 将其限制为一个目标。返回新线程数组。它尊重帽子的 `restartExistingThreads` 元数据：`true` 重启匹配的运行中线程，`false` 在已有运行线程时跳过启动。这就是带 `HAT`/`EVENT` 积木的扩展让帽子触发的方式。请参阅[积木注册](/api-reference/block-registration)。
- `runtime.allScriptsDo(fn, optTarget)` / `runtime.allScriptsByOpcodeDo(opcode, fn, optTarget)`：迭代每个顶层脚本（可选按顶部积木操作码筛选）。`startHats` 构建在第二个之上。
- `runtime.toggleScript(topBlockId, opts)`：从其顶部积木启动（或对于已在运行的点击，停止）一个脚本，就像在编辑器中点击它一样。

这个引擎没有 `startHatsWithParams` 方法；请通过 `startHats` 的 `optMatchFields` 传递字段匹配器。

## 事件

`Runtime` 发出大量事件；扩展和宿主最常用的：

| 事件 | 触发时 |
| --- | --- |
| `PROJECT_START` | 绿旗被按下。 |
| `PROJECT_STOP_ALL` | 停止按钮被点击（或 `stopAll()` 运行）。 |
| `PROJECT_RUN_START` | 本 tick 线程从空闲变为活动。 |
| `PROJECT_RUN_STOP` | 本 tick 最后一个非监视器线程完成。 |
| `PROJECT_LOADED` | 项目完成加载。 |
| `PROJECT_CHANGED` | 项目以影响序列化的方式被编辑。 |
| `TURBO_MODE_ON` / `TURBO_MODE_OFF` | 涡轮模式切换。 |

`PROJECT_RUN_START` / `PROJECT_RUN_STOP` 是围绕非监视器线程计数的边缘触发事件，因此它们在每次空闲/活动转变时触发一次，而不是每个线程一次。完整列表请参阅[事件](/api-reference/events)。

## 监视器

监视器是显示在舞台上的值观察器。运行时持有它们的状态，编辑器从 `MONITORS_UPDATE` 事件渲染它。

- `runtime.requestAddMonitor(monitorRecord)`：添加监视器（如果 ID 存在则就地更新）。
- `runtime.requestUpdateMonitor(delta)`：按 ID 修补现有监视器；返回它是否存在。
- `runtime.requestRemoveMonitor(id)`：移除一个。
- `runtime.requestShowMonitor(id)` / `runtime.requestHideMonitor(id)`：切换可见性；各自返回监视器是否存在。
- `runtime.getMonitorState()`：当前的监视器状态映射。

## 视觉报告

- `runtime.visualReport(target, blockId, value)`：在点击的报告积木旁边显示值气泡。只在 `target` 是编辑目标时报告；发出 `VISUAL_REPORT`。当报告积木在工作区中被点击时，会为您调用。

## 重绘

- `runtime.requestRedraw()`：标记屏幕必须在序列器在本帧运行更多工作之前重绘。更改可见内容的积木会调用这个；一旦请求重绘，序列器就会在本帧停止步进（除非涡轮模式开启）。请参阅[线程：序列器](/api-reference/threads#the-sequencer)。

## 涡轮和编译器标志

这些由引擎读取，并通过 VM 的设置器设置（它们也发出更改事件）：

- `runtime.turboMode`：循环运行时不对重绘让出时为 `true`。通过 [`vm.setTurboMode`](/api-reference/vm-api) 设置。
- `runtime.runtimeOptions`：`{maxClones, miscLimits, fencing, caseSensitiveLists, unsafeOptimisations}`。通过 `vm.setRuntimeOptions` 设置。
- `runtime.compilerOptions`：`{enabled, warpTimer}`。通过 `vm.setCompilerOptions` 设置。`enabled` 是 [JavaScript 编译器](/api-reference/threads#compiled-threads)的开关；`warpTimer` 让 warp 循环即使在 warp 模式之外也尊重 warp 超时。

## 另请参阅

- [线程](/api-reference/threads) 了解这些方法驱动的线程和序列器模型
- [VM API](/api-reference/vm-api) 了解支撑上述标志的公开设置器
- [事件](/api-reference/events) 了解完整的事件列表
- [内部：架构](/internals/architecture)
- [构建扩展](/building-extensions/introduction)

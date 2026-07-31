---
title: 事件
sidebar_position: 8
---

`VirtualMachine` 扩展 Node 的 `EventEmitter`。编辑器和播放器监听这些事件以保持 UI 同步，您也可以：

```js
vm.on('PROJECT_CHANGED', () => {
    console.log('the project was edited');
});
```

VM 以相同名称重新发出运行时的大部分事件，因此您通常监听 `vm`。少数只在 `vm.runtime` 上触发；下面已注明。此列表取自 `scratch-vm/src/virtual-machine.js` 和 `scratch-vm/src/engine/runtime.js`。

## 播放与运行

| 事件 | 触发时 |
| --- | --- |
| `PROJECT_START` | 绿旗被按下。 |
| `PROJECT_RUN_START` | 线程本帧开始运行（从空闲到活动）。 |
| `PROJECT_RUN_STOP` | 所有线程已停止（从活动到空闲）。 |
| `PROJECT_CHANGED` | 项目以影响序列化的方式被编辑。 |
| `PROJECT_LOADED` | 项目完成加载。在 `vm.runtime` 上触发。 |
| `TURBO_MODE_ON` / `TURBO_MODE_OFF` | 涡轮模式被切换。 |
| `RUNTIME_STARTED` / `RUNTIME_STOPPED` | 运行时的步进循环开始或停止。 |

## 加载进度

| 事件 | 负载 |
| --- | --- |
| `LOAD_PROGRESS` | `{stage, loaded, total}`，其中 `stage` 是 `unzipping`、`parsing`、`checking`、`building`、`installing` 之一。 |
| `ASSET_PROGRESS` | 项目资产下载时的 `(finished, total)`。 |

## 目标、积木和工作区

| 事件 | 负载 |
| --- | --- |
| `targetsUpdate` | `{targetList, editingTarget}`。目标列表更改或选择更改。 |
| `workspaceUpdate` | 编辑目标的积木，用于重建积木工作区。 |
| `MONITORS_UPDATE` | 当前监视器（舞台观察器）状态。 |
| `BLOCK_DRAG_UPDATE` / `BLOCK_DRAG_END` | 积木正在 GUI 上拖动 / 拖动完成。 |
| `VISUAL_REPORT` | 要在被点击的报告积木旁边显示为气泡的值。 |
| `SCRIPT_GLOW_ON` / `SCRIPT_GLOW_OFF` | 脚本开始或停止发光。 |
| `BLOCK_GLOW_ON` / `BLOCK_GLOW_OFF` | 单个积木开始或停止发光。 |
| `PROJECT_STOP_ALL`、`STOP_FOR_TARGET` | 停止按钮被点击 / 一个目标被停止。在 `vm.runtime` 上触发。 |

## 扩展

| 事件 | 触发时 |
| --- | --- |
| `EXTENSION_ADDED` | 扩展的积木分类被注册。负载是分类信息。 |
| `EXTENSION_REMOVED` | 扩展被移除。 |
| `EXTENSIONS_REORDERED` | 扩展顺序更改。 |
| `EXTENSION_FIELD_ADDED` | 扩展注册了一个自定义字段类型。 |
| `BLOCKSINFO_UPDATE` | 扩展的积木被刷新（例如 locale 更改后）。 |
| `PERIPHERAL_LIST_UPDATE`、`USER_PICKED_PERIPHERAL`、`PERIPHERAL_CONNECTED`、`PERIPHERAL_DISCONNECTED`、`PERIPHERAL_REQUEST_ERROR`、`PERIPHERAL_CONNECTION_LOST_ERROR`、`PERIPHERAL_SCAN_TIMEOUT` | 外设扫描和连接生命周期。 |

## 设置已更改

这些在匹配的设置器运行后触发，因此 UI 可以更新：

| 事件 | 负载 |
| --- | --- |
| `RUNTIME_OPTIONS_CHANGED` | 当前的运行时选项。 |
| `COMPILER_OPTIONS_CHANGED` | 当前的编译器选项。 |
| `FRAMERATE_CHANGED` | 新的帧率。 |
| `INTERPOLATION_CHANGED` | 插值是否开启。 |
| `STAGE_SIZE_CHANGED` | `(width, height)`。 |
| `COMPILE_ERROR` | 脚本编译失败时的 `(target, error)`。 |
| `HAS_CLOUD_DATA_UPDATE` | 项目是否使用云变量。 |
| `MIC_LISTENING` | 麦克风是否活动。 |
| `LOCALE_CHANGED` | `setLocale` 之后的新 locale。 |

## 积木询问宿主

一些积木需要宿主 UI 响应。这些在 `vm.runtime` 上触发：

- `SAY`：角色说话或思考（`say`/`think` 积木）。
- `QUESTION`：一个"询问并等待"积木正在等待输入。宿主收集答案并在运行时上发出 `ANSWER` 事件以解除脚本阻塞。

## 另请参阅

- [VM API](/api-reference/vm-api)
- [线程](/api-reference/threads)
- [积木注册](/api-reference/block-registration)

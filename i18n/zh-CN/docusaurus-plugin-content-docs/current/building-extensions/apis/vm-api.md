---
title: VM API
sidebar_position: 3
---

# VM API

VM（虚拟机）运行项目。[非沙箱扩展](/building-extensions/unsandboxed)以 `Scratch.vm` 访问它，积木函数以 `util.runtime` 访问它（运行时是 `vm.runtime`）。

```js
if (!Scratch.extensions.unsandboxed) {
  throw new Error('This extension needs the VM');
}
const vm = Scratch.vm;
const runtime = vm.runtime;
```

这些是内部对象，不是冻结的公共 API。保护缺失的值（角色被删除、扩展卸载），并优先监听事件而不是轮询。这些方法中的大多数在 Bilup 和 TurboWarp 上都存在；Bilup 特有的行为在重要处注明。

## 项目控制

```js
vm.greenFlag();          // 按下绿旗
vm.stopAll();            // 停止所有脚本
vm.setTurboMode(true);   // 涡轮模式开/关
vm.setFramerate(60);     // 目标每秒帧数
vm.setInterpolation(true);
vm.setCompilerOptions({ enabled: true, warpTimer: false });
vm.setRuntimeOptions({ maxClones: 300, miscLimits: true, fencing: true });
vm.setStageSize(width, height);
```

Bilup 默认编译项目（`compilerOptions.enabled` 为 `true`）。帧率和舞台大小不限于 Scratch 的 30 FPS / 480x360。

## 目标

"目标"是一个角色、克隆体或舞台。

```js
runtime.targets;                          // 所有目标的数组（舞台 + 角色 + 克隆）
runtime.getTargetForStage();              // 舞台目标
runtime.getTargetById(id);                // 按内部 id
runtime.getSpriteTargetByName('Sprite1'); // 按名称的原始（非克隆）角色
vm.editingTarget;                         // 编辑器中当前打开的角色
```

目标属性和方法：

```js
const t = runtime.getSpriteTargetByName('Sprite1');
t.x; t.y; t.direction; t.size; t.visible;
t.getName();
t.isStage; t.isOriginal;
t.currentCostume;                         // 索引
t.sprite.costumes[t.currentCostume].name;

t.setXY(100, 50);
t.setDirection(90);
t.setSize(150);
```

### 克隆

```js
const original = runtime.getSpriteTargetByName('Sprite1');
const clone = original.makeClone();
if (clone) {
  runtime.addTarget(clone);
  clone.setXY(100, 50);
}

// 移除克隆（绝不是原始）
if (!clone.isOriginal) runtime.disposeTarget(clone);
```

## 变量和列表

变量和列表位于目标上。变量类型使用 `''`，列表使用 `'list'`。

```js
const stage = runtime.getTargetForStage();

const score = stage.lookupVariableByNameAndType('score', '');
if (score) score.value = 100;

const items = stage.lookupVariableByNameAndType('items', 'list');
if (items) items.value.push('new item');
```

全局变量和列表位于舞台上；角色局部的位于角色上。要枚举，请迭代 `target.variables` 并检查每个条目的 `.type`。

## 启动脚本

```js
// 启动每个"当绿旗被点击"帽子
runtime.startHats('event_whenflagclicked');

// 启动匹配字段的帽子
runtime.startHats('event_whenbroadcastreceived', { BROADCAST_OPTION: 'message1' });
```

`startHats` 返回启动的 `Thread` 对象。在运行中的积木内部，请使用 `util.startHats`。请参阅[事件和帽子](/building-extensions/hats)。

## 线程

```js
runtime.threads;              // 运行中的线程
runtime.stopForTarget(target); // 停止目标脚本

thread.target;   // 运行它的目标
thread.topBlock; // 顶部积木的 id
thread.status;   // 见下文
```

线程状态值：

| 值 | 常量 | 含义 |
|:-:|:--|:--|
| 0 | `STATUS_RUNNING` | 运行中 |
| 1 | `STATUS_PROMISE_WAIT` | 等待 Promise |
| 2 | `STATUS_YIELD` | 本帧已让出 |
| 3 | `STATUS_YIELD_TICK` | 让出直到下一个 tick |
| 4 | `STATUS_DONE` | 已完成 |

在积木内部，`util`（积木工具）是您对当前线程的句柄，而不是深入 `runtime.threads`：

- `util.thread` 是运行积木的 `Thread`。
- `util.yield()` 为本帧让出当前线程（从异步积木返回 Promise 是等待的常规方式；`util.yield()` 是手动等价物）。
- `util.yieldTick()` 让出直到下一个 tick。
- `util.startBranch(index, isLoop)` 运行 C 积木分支（请参阅[自定义 C 积木](/building-extensions/custom-c-blocks)）。

完整的线程模型、状态和序列器请参阅[线程参考](/api-reference/threads)。

## 事件

用 `vm.on(...)` 或 `runtime.on(...)` 监听：

| 事件 | 触发时 |
|:--|:--|
| `PROJECT_RUN_START` | 脚本开始运行 |
| `PROJECT_RUN_STOP` | 所有脚本已停止 |
| `PROJECT_LOADED` | 项目完成加载 |
| `PROJECT_CHANGED` | 项目被修改 |
| `targetWasCreated` | 创建目标（通常是克隆）；参数 `(newTarget, sourceTarget)` |
| `TARGETS_UPDATE` | 目标列表更改 |
| `BEFORE_EXECUTE` | 每帧，在脚本运行前（对谓词帽子有用） |
| `MONITORS_UPDATE` | 监视器值更改 |

```js
runtime.on('targetWasCreated', (target) => console.log('created', target.getName()));
vm.on('PROJECT_RUN_START', () => console.log('running'));
```

上表列出了扩展最常触及的事件。运行时事件的完整集合和生命周期请参阅[运行时参考](/api-reference/runtime)。

## 输入设备

```js
const mouse = runtime.ioDevices.mouse;
mouse.getClientX(); mouse.getClientY(); mouse.getIsDown();

const keyboard = runtime.ioDevices.keyboard;
keyboard.getKeyIsDown('space');

const clock = runtime.ioDevices.clock;
clock.projectTimer();       // 计时器重置以来的秒数
clock.resetProjectTimer();
```

## 舞台大小

```js
runtime.stageWidth;   // 当前逻辑宽度
runtime.stageHeight;  // 当前逻辑高度
vm.setStageSize(640, 360);
```

## 扩展管理

```js
const em = vm.extensionManager;
em.isExtensionLoaded('pen');   // 布尔值
em.getExtensionURLs();         // 已加载扩展的 URL
em.refreshBlocks('myextension'); // 更改积木信息后重新渲染积木区
```

## 按项目存储

`runtime.extensionStorage` 是保存在项目文件内部的对象。以您的扩展 ID 为键存储小的可 JSON 序列化设置：

```js
runtime.extensionStorage.myextension = { volume: 0.5 };
```

## 编译器内部

要直接生成 JavaScript（原生速度积木），Bilup 通过 `vm.exports.compiler` 暴露受支持的扩展编译器 API。这是它自己的主题；请参阅[编译扩展](/building-extensions/compiled/overview)。

## 另请参阅

- [Scratch 对象 API](/building-extensions/apis/scratch-api)
- [渲染器 API](/building-extensions/apis/renderer-api)
- [编译扩展](/building-extensions/compiled/overview)
- [运行时参考](/api-reference/runtime)
- [线程参考](/api-reference/threads)

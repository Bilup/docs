---
title: Scratch 对象 API
sidebar_position: 1
---

# Scratch 对象 API

全局 `Scratch` 对象是扩展与 Bilup 对话的方式。它携带注册函数、类型常量、转换辅助工具，以及（对于非沙箱扩展）对 VM 和权限 API 的直接访问。

沙箱扩展得到一个受限的 `Scratch`；VM、渲染器和积木工具仅限非沙箱。

## 注册与结构

```js
(function(Scratch) {
  'use strict';
  class MyExtension {
    getInfo() {
      return {
        id: 'myextension',
        name: 'My Extension',
        blocks: [
          {
            opcode: 'myBlock',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert [VALUE] to number',
            arguments: { VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '42' } }
          }
        ]
      };
    }
    myBlock(args) {
      return Scratch.Cast.toNumber(args.VALUE);
    }
  }
  Scratch.extensions.register(new MyExtension());
})(Scratch);
```

- `Scratch.extensions.register(instance)`：注册您的扩展。恰好调用一次。
- `Scratch.extensions.unsandboxed`：以非沙箱方式运行时为 `true`。在使用任何仅非沙箱的 API 之前检查它。

## 类型常量

### Scratch.BlockType

| 常量 | 值 | 含义 |
|:--|:--|:--|
| `COMMAND` | `command` | 堆叠积木，无返回值 |
| `REPORTER` | `reporter` | 返回字符串或数字的圆形积木 |
| `BOOLEAN` | `Boolean` | 返回真/假的六边形积木 |
| `HAT` | `hat` | 有条件地启动堆栈（请参阅[事件和帽子](/building-extensions/hats)） |
| `EVENT` | `event` | 在事件上启动堆栈；没有函数 |
| `CONDITIONAL` | `conditional` | `如果`/`否则` 风格 C 积木（请参阅[自定义 C 积木](/building-extensions/custom-c-blocks)） |
| `LOOP` | `loop` | `重复执行`/`重复执行无限次` 风格 C 积木 |
| `BUTTON` | `button` | 积木区按钮，不是真正的积木 |
| `LABEL` | `label` | 积木区中的文本标签，不是真正的积木 |
| `XML` | `xml` | 原始 Blockly XML |

### Scratch.ArgumentType

`STRING`、`NUMBER`、`BOOLEAN`、`COLOR`、`ANGLE`、`MATRIX`、`NOTE`、`COSTUME`、`SOUND`、`IMAGE`。每个接受什么请参阅[处理输入](/building-extensions/inputs)。

### Scratch.TargetType

`SPRITE`（`'sprite'`）和 `STAGE`（`'stage'`），与积木的 `filter` 一起使用。

## Scratch.Cast

Scratch 语义的转换。完整细节在[实用 API 页面](/building-extensions/apis/utility-apis)。

```js
Scratch.Cast.toNumber('3.14');   // 3.14
Scratch.Cast.toString(42);       // '42'
Scratch.Cast.toBoolean('false'); // false
Scratch.Cast.compare('10', '9'); // > 0
```

## Scratch.vm（仅非沙箱）

VM 实例。完整的表面请参阅[VM API 页面](/building-extensions/apis/vm-api)。

```js
const vm = Scratch.vm;
const runtime = vm.runtime;

vm.greenFlag();
vm.stopAll();
vm.setTurboMode(true);

runtime.targets;               // 所有角色和舞台
runtime.getTargetForStage();   // 舞台
vm.editingTarget;              // 编辑器中选中的角色

runtime.on('PROJECT_RUN_START', () => { /* ... */ });
```

## Scratch.renderer（仅非沙箱）

WebGL 渲染器。请参阅[渲染器 API 页面](/building-extensions/apis/renderer-api)。

```js
const renderer = Scratch.renderer;
renderer.draw();
const canvas = renderer.canvas;
```

## 积木工具（仅非沙箱）

非沙箱积木函数接收第二个参数 `util`，只在积木运行时有效（请参阅[非沙箱扩展](/building-extensions/unsandboxed)）。

```js
myBlock(args, util) {
  const target = util.target;   // 运行积木的角色
  const runtime = util.runtime; // 运行时
  const thread = util.thread;   // 运行中的线程
  const frame = util.stackFrame; // 此积木调用的暂存空间
}
```

常见用途：

```js
// 目标属性
util.target.x; util.target.y; util.target.direction; util.target.size;
util.target.setXY(100, 50);
util.target.setDirection(90);

// 变量和列表（变量类型为 ''，列表类型为 'list'）
const v = util.target.lookupVariableByNameAndType('score', '');
if (v) v.value = 100;

// 启动帽子/事件脚本（请参阅事件和帽子页面）
util.startHats('event_whenbroadcastreceived', { BROADCAST_OPTION: 'go' });

// C 积木分支（请参阅自定义 C 积木页面）
util.startBranch(1, true);
```

## 权限 API（仅非沙箱）

非沙箱扩展在接触网络或外部世界之前必须请求。为什么以及如何请参阅[非沙箱扩展](/building-extensions/unsandboxed)。

```js
// 网络
if (await Scratch.canFetch(url)) { /* WebSocket、Image 等 */ }
const res = await Scratch.fetch(url);

// 窗口 / 导航
if (await Scratch.canOpenWindow(url)) { /* ... */ }
await Scratch.openWindow(url);
if (await Scratch.canRedirect(url)) { /* ... */ }
await Scratch.redirect(url);

// 设备
await Scratch.canRecordAudio();
await Scratch.canRecordVideo();
await Scratch.canReadClipboard();
await Scratch.canNotify();
await Scratch.canGeolocate();
```

## 翻译

`Scratch.translate` 标记字符串以供翻译：

```js
const message = Scratch.translate({
  id: 'myextension.hello',
  default: 'Hello {name}!',
  description: 'Greeting'
}, { name: args.NAME });
```

## 直接编辑 Blockly

要进行深度编辑器自定义，您可以接触全局 `ScratchBlocks` 对象。详情请参阅[GUI API](/api-reference/gui-api)。

## 另请参阅

- [VM API](/building-extensions/apis/vm-api)
- [渲染器 API](/building-extensions/apis/renderer-api)
- [音频 API](/building-extensions/apis/audio-api)
- [实用 API](/building-extensions/apis/utility-apis)

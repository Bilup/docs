---
name: Scratch
---

# Scratch 对象 API

全局 `Scratch` 对象是扩展与 Scratch 运行时、VM 和实用函数交互的主要接口。此 API 提供对虚拟机、渲染器、参数/积木类型、类型转换工具和各种扩展功能的访问。

## 概述

`Scratch` 对象作为扩展开发的入口点，提供：
- 访问 VM 和运行时
- 积木和参数类型常量
- 数据类型转换和操作的实用函数
- 扩展注册功能
- 安全和权限 API（用于非沙盒化扩展）

## 基本结构

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
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '42'
              }
            }
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

## 核心属性

### `Scratch.vm`
**仅非沙盒化**

直接访问 Scratch 虚拟机实例。

```js
const vm = Scratch.vm;

// 访问运行时
const runtime = vm.runtime;
const targets = runtime.targets;
const stage = runtime.getTargetForStage();

// 控制执行
vm.greenFlag();
vm.stopAll();
vm.setTurboMode(true);

// 监听事件
vm.runtime.on('PROJECT_RUN_START', () => {
  console.log('Project started');
});
```

**常见 VM 操作：**
- `vm.greenFlag()` - 启动项目
- `vm.stopAll()` - 停止所有脚本
- `vm.setTurboMode(enabled)` - 启用/禁用加速模式
- `vm.runtime.targets` - 所有角色和舞台的数组
- `vm.runtime.getTargetForStage()` - 获取舞台目标
- `vm.editingTarget` - 编辑器中当前选中的角色

### `Scratch.renderer`
**仅非沙盒化**

直接访问 WebGL 渲染器实例。

```js
const renderer = Scratch.renderer;

// 触发布局重绘
renderer.draw();

// 访问画布尺寸
const canvas = renderer.canvas;
console.log(canvas.width, canvas.height);
```

### `Scratch.extensions`

扩展注册和元数据。

```js
// 注册扩展
Scratch.extensions.register(new MyExtension());

// 检查是否为非沙盒化（仅非沙盒化扩展）
if (Scratch.extensions.unsandboxed) {
  // 使用非沙盒化 API
}
```

### `Scratch.vm.extensionManager`
**仅非沙盒化**

管理已加载的扩展。用于动态积木更新。

```js
// 强制工具箱重新渲染
// 更改按钮文本时有用
// 强制工具箱刷新
vm.extensionManager.refreshBlocks(extensionId);
```

### UI 自定义

对于涉及积木编辑器本身（Blockly）的高级 UI 自定义，你可以访问全局 `ScratchBlocks` 对象。有关详细信息，请参阅 [GUI API](/api-reference/gui-api#scratchblocks-集成)。

## 类型常量

### `Scratch.ArgumentType`

定义积木可以接受的参数类型。

```js
const ArgumentType = Scratch.ArgumentType;

// 基本类型
ArgumentType.STRING    // 'string' - 文本输入
ArgumentType.NUMBER    // 'number' - 数字输入
ArgumentType.BOOLEAN   // 'Boolean' - 布尔输入（六边形）
ArgumentType.COLOR     // 'color' - 颜色选择器
ArgumentType.ANGLE     // 'angle' - 角度选择器（圆形）

// 特殊类型
ArgumentType.MATRIX    // 'matrix' - 矩阵/网格输入
ArgumentType.NOTE      // 'note' - 音符选择器
ArgumentType.COSTUME   // 'costume' - 造型下拉菜单
ArgumentType.SOUND     // 'sound' - 声音下拉菜单
ArgumentType.IMAGE     // 'image' - 内联图像显示
```

**示例用法：**
```js
{
  opcode: 'setColor',
  text: 'set pen color to [COLOR]',
  arguments: {
    COLOR: {
      type: Scratch.ArgumentType.COLOR,
      defaultValue: '#ff0000'
    }
  }
}
```

### `Scratch.BlockType`

定义积木的形状和行为。

```js
const BlockType = Scratch.BlockType;

// 基本积木类型
BlockType.COMMAND     // 'command' - 堆叠积木（圆角）
BlockType.REPORTER    // 'reporter' - 圆角返回值积木
BlockType.BOOLEAN     // 'Boolean' - 六边形布尔积木

// 控制流积木
BlockType.HAT         // 'hat' - 帽子积木（启动脚本）
BlockType.CONDITIONAL // 'conditional' - If/else 样式积木
BlockType.LOOP        // 'loop' - 重复执行样式积木

// 特殊类型
BlockType.EVENT       // 'event' - 事件帽子（无实现）
BlockType.BUTTON      // 'button' - UI 按钮（不是积木）
BlockType.LABEL       // 'label' - 文本标签（不是积木）
BlockType.XML         // 'xml' - 自定义 Blockly XML
```

**示例用法：**
```js
{
  opcode: 'checkCondition',
  blockType: Scratch.BlockType.BOOLEAN,
  text: 'is [VALUE] greater than 10?',
  arguments: {
    VALUE: {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: 5
    }
  }
}
```

### `Scratch.TargetType`

指定积木可以运行的角色/舞台。

```js
const TargetType = Scratch.TargetType;

TargetType.SPRITE  // 'sprite' - 仅限角色
TargetType.STAGE   // 'stage' - 仅限舞台

// 在积木定义中使用
{
  opcode: 'moveSteps',
  filter: [Scratch.TargetType.SPRITE], // 仅对角色显示
  // ...
}
```

## 实用工具函数

### `Scratch.Cast`

Scratch 中使用的数据类型转换工具。

```js
const Cast = Scratch.Cast;

// 数字转换
Cast.toNumber('3.14')        // 3.14
Cast.toNumber('abc')         // 0
Cast.toNumber(true)          // 1
Cast.toNumber(false)         // 0

// 字符串转换
Cast.toString(42)            // '42'
Cast.toString(true)          // 'true'
Cast.toString(null)          // ''

// 布尔值转换
Cast.toBoolean('true')       // true
Cast.toBoolean('false')      // false
Cast.toBoolean(0)            // false
Cast.toBoolean(1)            // true
Cast.toBoolean('')           // false

// 颜色转换
Cast.toRgbColorList('#ff0000')  // [255, 0, 0]
Cast.toRgbColorObject('#00ff00')  // {r: 0, g: 255, b: 0}

// 比较（Scratch 风格）
Cast.compare('10', '9')      // 1 (数字比较)
Cast.compare('apple', 'banana')  // -1 (字符串比较)
Cast.isInt(3.14)             // false
Cast.isInt(42)               // true
```

**实际示例：**
```js
myMathBlock(args) {
  const a = Scratch.Cast.toNumber(args.A);
  const b = Scratch.Cast.toNumber(args.B);
  return a + b;
}

myTextBlock(args) {
  const text = Scratch.Cast.toString(args.INPUT);
  return text.toUpperCase();
}
```

## 积木实用工具对象（仅非沙盒化）

当积木在非沙盒化扩展中运行时，它们会接收第二个 `util` 参数，提供对执行上下文的访问。

### 基本属性

```js
myBlock(args, util) {
  // 访问当前角色/目标
  const target = util.target;
  const spriteName = target.getName();
  
  // 访问运行时
  const runtime = util.runtime;
  const stage = runtime.getTargetForStage();
  
  // 访问当前线程
  const thread = util.thread;
  
  // 访问执行上下文
  const stackFrame = util.stackFrame;
}
```

### 目标操作

```js
// 获取角色属性
const x = util.target.x;
const y = util.target.y;
const direction = util.target.direction;
const size = util.target.size;

// 设置角色属性
util.target.setXY(100, 50);
util.target.setDirection(90);
util.target.setSize(150);

// 变量和列表
const variable = util.target.lookupVariableByNameAndType('my variable', '');
if (variable) {
  console.log('Variable value:', variable.value);
  variable.value = 'new value';
}

// 检查变量是否存在
const hasVar = !!util.target.lookupVariableByNameAndType('score', '');
const hasList = !!util.target.lookupVariableByNameAndType('items', 'list');
```

### 线程控制

```js
// 启动其他脚本
const startedThreads = util.startHats('event_whenbroadcastreceived', {
  BROADCAST_OPTION: 'my message'
});
// 注意：options 对象匹配帽子积木中的字段

// 控制积木执行
util.yield();        // 暂停此积木直到下一帧
util.yieldTick();    // 暂停直到下一个时钟周期

// 计时器工具
if (util.stackTimerNeedsInit()) {
  util.startStackTimer(1000); // 1 秒
  util.yield();
} else if (!util.stackTimerFinished()) {
  util.yield();
}
```

### 分支控制（用于 C 积木）

```js
// 用于条件/循环积木
util.startBranch(1, false);  // 启动第一个分支，非循环
util.startBranch(2, false);  // 启动第二个分支（else）
util.startBranch(1, true);   // 启动分支作为循环
```

## 运行时事件（仅非沙盒化）

监听 VM 事件以实现响应式扩展：

```js
const runtime = Scratch.vm.runtime;

// 项目生命周期
runtime.on('PROJECT_RUN_START', () => {
  console.log('Project started');
});

runtime.on('PROJECT_RUN_STOP', () => {
  console.log('Project stopped');
});

runtime.on('PROJECT_CHANGED', () => {
  console.log('Project modified');
});

// 目标事件
runtime.on('targetWasCreated', (target) => {
  console.log('New sprite:', target.getName());
});

runtime.on('TARGETS_UPDATE', () => {
  console.log('Sprite list changed');
});

// 变量事件
runtime.on('MONITORS_UPDATE', (monitors) => {
  console.log('Variable monitors updated');
});
```

## 安全 API（仅非沙盒化）

非沙盒化扩展可以访问各种安全受限的 API：

### 网络访问

```js
// 检查并发出网络请求
if (await Scratch.canFetch('https://api.example.com')) {
  const response = await Scratch.fetch('https://api.example.com/data');
  const data = await response.json();
}
```

### 窗口管理

```js
// 打开新窗口
if (await Scratch.canOpenWindow('https://example.com')) {
  Scratch.openWindow('https://example.com');
}

// 重定向当前页面
if (await Scratch.canRedirect('https://example.com')) {
  await Scratch.redirect('https://example.com');
}
```

### 设备访问

```js
// 检查各种权限
const canRecord = await Scratch.canRecordAudio();
const canCamera = await Scratch.canRecordVideo();
const canClipboard = await Scratch.canReadClipboard();
const canNotify = await Scratch.canNotify();
const canGeolocate = await Scratch.canGeolocate();
```

## 常见模式

### 变量管理

```js
getVariable(args, util) {
  const variable = util.target.lookupVariableByNameAndType(args.NAME, '');
  return variable ? variable.value : 0;
}

setVariable(args, util) {
  const variable = util.target.lookupVariableByNameAndType(args.NAME, '');
  if (variable) {
    variable.value = Scratch.Cast.toString(args.VALUE);
  }
}
```

### 列表操作

```js
getListItem(args, util) {
  const list = util.target.lookupVariableByNameAndType(args.LIST, 'list');
  if (list && list.value) {
    const index = Scratch.Cast.toNumber(args.INDEX) - 1; // Scratch 使用 1-based
    return list.value[index] || '';
  }
  return '';
}
```

### 帽子积木实现

```js
// 在 getInfo() 中
{
  opcode: 'whenSomething',
  blockType: Scratch.BlockType.HAT,
  text: 'when something happens',
  isEdgeActivated: false // 连续运行 vs 边缘触发
}

// 从其他地方启动帽子
setInterval(() => {
  Scratch.vm.runtime.startHats('myextension_whenSomething');
}, 1000);
```

### 异步操作

```js
async waitBlock(args, util) {
  const seconds = Scratch.Cast.toNumber(args.SECONDS);
  
  if (util.stackTimerNeedsInit()) {
    util.startStackTimer(seconds * 1000);
    util.yield();
  } else if (!util.stackTimerFinished()) {
    util.yield();
  }
  // 定时器完成时积木完成
}
```

## 错误处理

```js
myBlock(args, util) {
  try {
    // 你的积木逻辑
    const result = someOperation(args.INPUT);
    return result;
  } catch (error) {
    console.warn('Extension error:', error);
    return 0; // 返回合理的默认值
  }
}
```

## 最佳实践

1. **始终验证输入** 使用 `Scratch.Cast` 函数
2. **安全使用 `util.target`** - 访问前检查变量是否存在
3. **优雅处理错误** - 返回合理的默认值
4. **使用适当的积木类型** 实现你的功能
5. **尊重沙盒化** - 使用 VM API 前检查 `Scratch.extensions.unsandboxed`
6. **异步操作时尽早保存上下文**：

```js
// 良好做法 - 立即保存上下文
myAsyncBlock(args, util) {
  const target = util.target;
  const runtime = util.runtime;
  
  setTimeout(() => {
    // 使用保存的引用
    target.setXY(100, 100);
  }, 1000);
}

// 不良做法 - 回调运行时 util 可能已改变
myAsyncBlock(args, util) {
  setTimeout(() => {
    util.target.setXY(100, 100); // 可能无法正常工作
  }, 1000);
}
```

## 翻译支持

```js
// 使用 Scratch.translate 进行国际化
const message = Scratch.translate({
  id: 'myextension.hello',
  default: 'Hello {name}!',
  description: 'Greeting message'
}, {
  name: args.NAME
});
```

Scratch 对象 API 为创建功能强大、集成良好的扩展提供了基础，这些扩展可以与 Scratch 环境深度交互，同时保持适当的安全边界。
---
title: VM API 参考
sidebar_position: 2
---

# VM API 参考

Bilup 虚拟机(VM)是驱动 Scratch 项目的核心执行引擎。它提供对运行时环境的全面程序化访问，允许外部代码控制项目执行、操作角色和资源、监听事件并配置运行时行为。

## 概述

VM API 通过 `window.vm` 访问，提供以下功能：

- **项目控制**：启动、停止、暂停和管理项目执行
- **资源管理**：加载、修改和管理角色、造型和声音  
- **运行时配置**：控制性能设置、编译选项和舞台属性
- **事件系统**：监听运行时事件和状态变化
- **扩展集成**：注册自定义积木和功能
- **数据访问**：读取和修改项目变量、角色和积木

## 获取 VM 实例

VM 实例全局可用，可以通过多种方式访问：

```javascript
// 全局 VM 实例(最常见)
const vm = window.vm;

// 从 React Redux store
import { useSelector } from 'react-redux';
const vm = useSelector(state => state.scratchGui.vm);
```

## 核心架构

VM 由几个关键组件组成：

- **Runtime** (`vm.runtime`)：核心执行引擎和状态管理
- **Targets** (`vm.runtime.targets`)：角色和舞台对象
- **Sequencer** (`vm.runtime.sequencer`)：线程调度和执行控制
- **IO Devices** (`vm.runtime.ioDevices`)：输入/输出处理(键盘、鼠标等)
- **Extension Manager** (`vm.extensionManager`)：扩展加载和管理

## 项目控制

### 启动和停止

#### `vm.start()`
初始化并启动 VM 运行时。

```javascript
vm.start();
// 必须在项目执行前调用
```

#### `vm.greenFlag()`
触发绿旗事件，启动所有带有绿旗帽子积木的脚本。

```javascript
vm.greenFlag();
// 等效于点击绿旗按钮
vm.greenFlag();
// 启动项目并触发"当绿旗被点击"积木
```

#### `vm.stopAll()`
停止所有脚本和声音。

```javascript
vm.stopAll();
// 停止所有运行中的脚本和声音
```

### 项目加载

#### `vm.loadProject(projectData)`
从数据加载项目。

```javascript
// 从 .sb3 文件数据加载
const fileData = await file.arrayBuffer();
await vm.loadProject(fileData);

// 从 JSON 加载
const projectJson = { /* 项目数据 */ };
await vm.loadProject(JSON.stringify(projectJson));
```

**参数：**
- `projectData` (ArrayBuffer | string): .sb3 格式的项目数据或 JSON 字符串

**返回：** 项目加载完成时解析的 Promise

#### `vm.saveProjectSb3()`
导出当前项目为 .sb3 数据。

```javascript
const projectData = await vm.saveProjectSb3();
// 返回可保存为 .sb3 文件的 ArrayBuffer

// 保存到文件
const blob = new Blob([projectData], { type: 'application/octet-stream' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'project.sb3';
a.click();
```

**返回：** `Promise<ArrayBuffer>`; 包含 .sb3 项目数据

### 目标管理

#### `vm.runtime.targets`
所有目标(角色和舞台)的数组。

```javascript
const targets = vm.runtime.targets;
console.log('所有目标:', targets);
console.log('角色:', targets.filter(t => !t.isStage));
console.log('舞台:', targets.find(t => t.isStage));
```

**类型：** 目标对象数组

#### `vm.editingTarget`
当前选中的角色/舞台。

```javascript
const target = vm.editingTarget;
if (target) {
  console.log('当前编辑:', target.getName());
}
```

**类型：** 目标对象或 null

#### `vm.setEditingTarget(targetId)`
设置编辑目标。

```javascript
const sprite = vm.runtime.targets.find(t => t.getName() === 'Sprite1');
if (sprite) {
  vm.setEditingTarget(sprite.id);
}
```

**参数：**
- `targetId` (string): 要选择的目标 ID

#### `vm.deleteSprite(targetId)`
从项目中删除角色。

```javascript
// 按名称查找角色
const sprite = vm.runtime.targets.find(t => t.getName() === 'Sprite1' && !t.isStage);
if (sprite) {
  vm.deleteSprite(sprite.id);
}
```

**参数：**
- `targetId` (string): 要删除的角色 ID

**注意：** 无法删除舞台目标

#### `vm.exportSprite(targetId)`
将角色导出为 .sprite3 文件 blob。

```javascript
// 导出角色
const sprite = vm.runtime.targets.find(t => t.getName() === 'Sprite1');
if (sprite) {
  const spriteBlob = await vm.exportSprite(sprite.id);
  
  // 保存到文件
  const url = URL.createObjectURL(spriteBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sprite.getName()}.sprite3`;
  a.click();
}
```

**参数：**
- `targetId` (string): 要导出的角色 ID

**返回：** `Promise<Blob>` 包含 .sprite3 角色数据

### 运行时信息

#### `vm.getPlaygroundData()`
获取当前运行时状态。

```javascript
const data = vm.getPlaygroundData();
console.log('目标:', data.targets);
console.log('变量:', data.variables);
console.log('列表:', data.lists);
```

**返回：** 包含运行时状态的对象

#### `vm.runtime.getSpriteTargetByName(name)`
按名称获取角色目标。

```javascript
// 按名称查找角色
const sprite = vm.runtime.getSpriteTargetByName('Sprite1');
if (sprite && !sprite.isStage) {
  console.log('找到角色:', sprite.getName());
}
```

**参数：**
- `name` (string): 角色名称

**返回：** 目标对象或 null(如果未找到)

#### `vm.runtime.getTargetForStage()`
获取舞台目标。

```javascript
const stage = vm.runtime.getTargetForStage();
console.log('舞台目标:', stage.getName());
```

**返回：** 舞台目标对象

#### `vm.runtime._monitorState`
访问监视器(变量显示)状态。

```javascript
const monitorState = vm.runtime._monitorState;
console.log('监视器状态:', monitorState);
```

**类型：** 包含监视器状态信息的对象

#### `vm.runtime.monitorBlocks`
访问监视器积木容器。

```javascript
const monitorBlocks = vm.runtime.monitorBlocks;
console.log('监视器积木:', monitorBlocks);
```

**类型：** 监视器积木容器对象

## Target API

目标对象代表角色和舞台。

### 目标属性

```javascript
const target = vm.editingTarget;

// 基本属性
console.log(target.id);        // 唯一标识符
console.log(target.getName()); // 显示名称
console.log(target.isStage);   // 舞台为 true，角色为 false

// 位置和外观(仅限角色)
if (!target.isStage) {
  console.log(target.x);         // X 坐标
  console.log(target.y);         // Y 坐标
  console.log(target.direction); // 方向 (0-359)
  console.log(target.size);      // 大小百分比
  console.log(target.visible);   // 显示/隐藏
}

// 造型和声音
console.log(target.getCostumes());
console.log(target.getSounds());
console.log(target.getCurrentCostume());
```

### 目标方法

#### `target.setXY(x, y)`
设置角色位置。

```javascript
const sprite = vm.editingTarget;
if (sprite && !sprite.isStage) {
  sprite.setXY(100, 50);
}
```

#### `target.setDirection(direction)`
设置角色方向。

```javascript
sprite.setDirection(90); // 指向右边
```

#### `target.setSize(size)`
设置角色大小。

```javascript
sprite.setSize(150); // 原始大小的 150%
```

#### `target.setVisible(visible)`
设置角色显示/隐藏。

```javascript
sprite.setVisible(false); // 隐藏角色
```

#### `target.goToFront()`
将角色移动到最前面。

```javascript
sprite.goToFront();
```

#### `target.goToBack()`
将角色移动到最后面。

```javascript
sprite.goToBack();
```

## 事件系统

VM 会发出可监听的事件。

### 核心事件

#### `PROJECT_LOADED`
项目加载时触发。

```javascript
vm.on('PROJECT_LOADED', () => {
  console.log('项目加载成功');
});
```

#### `PROJECT_CHANGED`
项目被修改时触发。

```javascript
vm.on('PROJECT_CHANGED', () => {
  console.log('项目有未保存的更改');
});
```

#### `TARGETS_UPDATE`
目标(角色)被修改时触发。

```javascript
vm.on('TARGETS_UPDATE', (targets) => {
  console.log('目标已更新:', targets);
});
```

#### `VISUAL_REPORT`
每帧用于造型更新时触发。

```javascript
vm.on('VISUAL_REPORT', (data) => {
  // 更新自定义渲染器
  updateCustomStage(data);
});
```

#### `MONITORS_UPDATE`
变量监视器更新时触发。

```javascript
vm.on('MONITORS_UPDATE', (monitors) => {
  updateVariableDisplays(monitors);
});
```

### 运行时事件

#### `PROJECT_RUN_START`
项目开始运行。

```javascript
vm.on('PROJECT_RUN_START', () => {
  console.log('项目已启动');
});
```

#### `PROJECT_RUN_STOP`
项目停止运行。

```javascript
vm.on('PROJECT_RUN_STOP', () => {
  console.log('项目已停止');
});
```

#### `COMPILE_ERROR`
脚本编译错误发生。

```javascript
vm.on('COMPILE_ERROR', (target, error) => {
  console.error('目标编译错误:', target, error);
});
```

## 变量管理

### 获取变量

```javascript
// 获取目标的所有变量
const target = vm.editingTarget;
console.log('目标变量:', target.variables);

// 按名称和类型查找变量
const variable = target.lookupVariableByNameAndType('my variable', 'variable');
if (variable) {
  console.log('变量值:', variable.value);
}

// 从运行时获取某类型的所有变量名
const allVarNames = vm.runtime.getAllVarNamesOfType('variable');
console.log('所有变量名:', allVarNames);
```

### 设置变量

```javascript
// 设置变量值
const target = vm.editingTarget;
const variable = target.lookupVariableByNameAndType('score', 'variable');
if (variable) {
  variable.value = 100;
}
```

### 创建变量

```javascript
// 在目标上创建新变量
const target = vm.editingTarget;
target.createVariable('new-var-id', 'new variable', 'variable', false);

// 创建新全局变量
const newVar = vm.runtime.createNewGlobalVariable('global var', null, 'variable');
console.log('已创建变量:', newVar.name);
```

## 积木管理

### 获取积木

```javascript
// 获取目标的所有积木
const blocks = target.blocks;

// 获取特定积木
const block = blocks.getBlock(blockId);
console.log('积木操作码:', block.opcode);
console.log('积木输入:', block.inputs);
```

### 运行积木

```javascript
// 为积木创建并启动新线程
const target = vm.editingTarget;
vm.runtime._pushThread(blockId, target);

// 访问运行中的线程
console.log('活动线程:', vm.runtime.threads);

// 逐步执行线程(通常自动完成)
const doneThreads = vm.runtime.sequencer.stepThreads();
```

**注意：** 有关高级线程管理、监控和控制，请参阅 [线程 API 参考](./threads.md)。

## 扩展 API

用于 VM 内的扩展开发。

### 扩展注册

```javascript
class MyExtension {
  getInfo() {
    return {
      id: 'myextension',
      name: '我的扩展',
      blocks: [
        {
          opcode: 'myBlock',
          blockType: 'command',
          text: '做某事'
        }
      ]
    };
  }
  
  myBlock() {
    console.log('我的积木已执行!');
  }
}

// 注册扩展
vm.extensionManager.loadExtensionURL('myextension', MyExtension);
```

### 自定义积木

```javascript
// 定义自定义积木
{
  opcode: 'customCommand',
  blockType: 'command',
  text: '自定义命令，带 [TEXT] 和 [NUMBER]',
  arguments: {
    TEXT: {
      type: 'string',
      defaultValue: 'hello'
    },
    NUMBER: {
      type: 'number',
      defaultValue: 10
    }
  }
}

// 实现积木函数
customCommand(args) {
  console.log('文本:', args.TEXT);
  console.log('数字:', args.NUMBER);
}
```

## 性能监控

### 帧率

```javascript
let frameCount = 0;
let lastTime = performance.now();

vm.on('VISUAL_REPORT', () => {
  frameCount++;
  const now = performance.now();
  
  if (now - lastTime >= 1000) {
    const fps = frameCount;
    console.log('FPS:', fps);
    frameCount = 0;
    lastTime = now;
  }
});
```

### 脚本性能

```javascript
// 监控脚本执行时间
let executeStartTime;

vm.runtime.on('BEFORE_EXECUTE', () => {
  executeStartTime = performance.now();
});

vm.runtime.on('AFTER_EXECUTE', () => {
  const duration = performance.now() - executeStartTime;
  console.log('执行周期耗时:', duration + 'ms');
});
```

## 错误处理

### 捕获加载错误

```javascript
try {
  await vm.loadProject(projectData);
  console.log('项目加载成功');
} catch (error) {
  console.error('加载项目失败:', error);
  
  // 回退到空项目
  await vm.loadProject(getEmptyProject());
  
  // 对用户显示友好的错误提示
  showErrorMessage('无法加载项目。已启动空项目。');
}
```

### 监控编译错误

```javascript
vm.runtime.on('COMPILE_ERROR', (target, error) => {
  console.error('目标编译错误:', target.getName(), error);
  
  // 可以禁用此目标的编译器或显示用户反馈
  target.blocks.resetCache();
});
```

## 最佳实践

### 内存管理

```javascript
// 清理事件监听器
const cleanup = () => {
  vm.off('PROJECT_LOADED', handleProjectLoaded);
  vm.off('TARGETS_UPDATE', handleTargetsUpdate);
};

// 在组件卸载时调用清理
useEffect(() => cleanup, []);
```

### 性能

```javascript
// 对频繁操作进行防抖处理
const debouncedSave = debounce(() => {
  saveProject();
}, 1000);

vm.on('PROJECT_CHANGED', debouncedSave);
```

### 错误恢复

```javascript
// 为关键操作实现重试逻辑
const loadProjectWithRetry = async (data, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await vm.loadProject(data);
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

## 渲染器 API

### Canvas 访问

#### `vm.renderer.canvas`
访问主渲染画布。

```javascript
const canvas = vm.renderer.canvas;
console.log('画布尺寸:', canvas.width, 'x', canvas.height);

// Canvas 上下文(如果需要自定义渲染)
const ctx = canvas.getContext('2d');
```

#### `vm.renderer._nativeSize`
获取原始渲染大小。

```javascript
const [width, height] = vm.renderer._nativeSize;
console.log('原始尺寸:', width, 'x', height);
```

### 颜色采样

#### `vm.renderer.extractColor(x, y, radius)`
从画布上给定坐标提取像素颜色数据。

```javascript
// 提取屏幕坐标处的颜色
const colorData = vm.renderer.extractColor(100, 150, 1);

// 访问颜色组件
const color = colorData.color;
console.log('RGBA:', color.r, color.g, color.b, color.a);

// 获取原始像素数据
const pixels = colorData.data; // 像素数据的 Uint8Array
```

**参数：**
- `x` (number): 画布上的 X 坐标
- `y` (number): 画布上的 Y 坐标  
- `radius` (number): 采样半径(最小 1)

**返回：** 包含 `color` 和 `data` 属性的对象

### 图层管理

#### `vm.renderer.setLayerGroupOrdering(layers)`
设置渲染图层的顺序。

```javascript
// 默认图层顺序
const defaultLayers = ['background', 'video', 'pen', 'sprite'];
vm.renderer.setLayerGroupOrdering(defaultLayers);

// 自定义图层顺序(画笔在顶部)
const customLayers = ['background', 'video', 'sprite', 'pen'];
vm.renderer.setLayerGroupOrdering(customLayers);
```

**参数：**
- `layers` (Array\<String\>): 按渲染顺序排列的图层名称数组

**必需图层：** 'background', 'video', 'pen', 'sprite'


## 相关文档

- [GUI API 参考](gui-api)
- [扩展 API 参考](extension-api)
- [事件系统](events)
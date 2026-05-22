---
name: VM
---

# 虚拟机 API

VM(虚拟机)是运行 Scratch 项目的核心引擎。对于扩展开发者，VM 提供对项目执行、角色管理、积木解释和运行时事件的访问。此 API 主要通过 `Scratch.vm` 供非沙盒化扩展使用。

## 概述

VM 管理：
- 项目执行和控制
- 角色和目标管理
- 积木执行和编译
- 运行时事件和监控
- 扩展集成
- 资源和存储管理

## 访问 VM

```js
// 仅非沙盒化扩展
if (!Scratch.extensions.unsandboxed) {
  throw new Error('VM API 需要非沙盒化扩展');
}

const vm = Scratch.vm;
const runtime = vm.runtime;
```

## 项目控制

### 基本执行

```js
// 启动项目(绿旗)
vm.greenFlag();

// 停止所有脚本
vm.stopAll();

// 手动执行单步(用于调试)
vm.runtime._step();

// 检查项目是否正在运行
const isRunning = vm.runtime.threads.length > 0;
```

### 加速模式

```js
// 启用/禁用加速模式
vm.setTurboMode(true);   // 启用加速模式
vm.setTurboMode(false);  // 禁用加速模式

// 监听加速模式变化
vm.on('TURBO_MODE_ON', () => {
  console.log('加速模式已启用');
});

vm.on('TURBO_MODE_OFF', () => {
  console.log('加速模式已禁用');
});
```

### 性能选项

```js
// 设置帧率(30 或 60 FPS)
vm.setFramerate(60);

// 启用/禁用插值
vm.setInterpolation(true);

// 配置编译器选项
vm.setCompilerOptions({
  enabled: true,
  warpTimer: false
});

// 设置运行时选项
vm.setRuntimeOptions({
  maxClones: 300,
  miscLimits: true,
  fencing: true
});
```

## 项目管理

### 加载项目

```js
// 从 JSON 字符串加载项目
const projectData = '{"targets": [...], "meta": {...}}';
await vm.loadProject(projectData);

// 从文件缓冲区加载项目
const projectBuffer = new ArrayBuffer(/* project data */);
await vm.loadProject(projectBuffer);

// 清除当前项目
vm.clear();
```

### 项目信息

```js
// 获取项目为 JSON
const projectJson = vm.toJSON();

// 获取项目元数据
const runtime = vm.runtime;
const projectName = runtime.getTargetForStage().sprite.name;

// 检查项目是否有更改
vm.on('PROJECT_CHANGED', () => {
  console.log('项目有未保存的更改');
});
```

### 资源管理

```js
// 获取所有项目资源
const assets = vm.assets;

// 向角色添加造型
const targetId = 'sprite1';
const costumeData = {
  name: 'costume1',
  dataFormat: 'png',
  asset: assetBuffer,
  md5ext: 'hash.png'
};
await vm.addCostume(costumeData, targetId);

// 向角色添加声音
const soundData = {
  name: 'sound1',
  dataFormat: 'wav',
  asset: soundBuffer,
  md5ext: 'hash.wav'
};
await vm.addSound(soundData, targetId);

// 向舞台添加背景
await vm.addBackdrop('backdrop.png', backdropObject);
```

## 角色管理

### 访问角色

```js
const runtime = vm.runtime;

// 获取所有角色(角色 + 舞台)
const allTargets = runtime.targets;

// 获取舞台
const stage = runtime.getTargetForStage();

// 获取所有角色(不包括舞台)
const sprites = runtime.getSpriteTargets();

// 通过 ID 获取角色
const target = runtime.getTargetById('targetId');

// 通过名称获取角色
const namedTarget = runtime.getSpriteTargetByName('Sprite1');

// 获取当前正在编辑的角色
const editingTarget = vm.editingTarget;
```

### 角色属性

```js
// 角色属性
const target = runtime.getSpriteTargetByName('Sprite1');
if (target) {
  // 位置和外观
  console.log('位置:', target.x, target.y);
  console.log('方向:', target.direction);
  console.log('大小:', target.size);
  console.log('可见性:', target.visible);
  
  // 标识
  console.log('名称:', target.getName());
  console.log('是原始角色:', target.isOriginal);
  console.log('是舞台:', target.isStage);
  
  // 当前造型/背景
  console.log('当前造型:', target.currentCostume);
  console.log('造型名称:', target.sprite.costumes[target.currentCostume].name);
}
```

### 创建和管理克隆

```js
// 创建克隆
const originalSprite = runtime.getSpriteTargetByName('Sprite1');
if (originalSprite) {
  const clone = originalSprite.makeClone();
  if (clone) {
    runtime.addTarget(clone);
    
    // 设置克隆的位置
    clone.setXY(100, 50);
    clone.setDirection(90);
  }
}

// 查找角色的所有克隆
const clones = runtime.targets.filter(target => 
  !target.isStage && 
  !target.isOriginal && 
  target.sprite === originalSprite.sprite
);

// 删除克隆
const cloneToDelete = clones[0];
if (cloneToDelete && !cloneToDelete.isOriginal) {
  runtime.disposeTarget(cloneToDelete);
}
```

## 变量和数据

### 全局变量

```js
const stage = runtime.getTargetForStage();

// 访问变量
const variables = stage.variables;
for (const [id, variable] of Object.entries(variables)) {
  console.log(`${variable.name}: ${variable.value} (${variable.type})`);
}

// 获取特定变量
const scoreVar = stage.lookupVariableByNameAndType('score', '');
if (scoreVar) {
  console.log('分数:', scoreVar.value);
  scoreVar.value = 100;
}

// 创建新变量
stage.createVariable('newVar', 'myVariable', '');
```

### 角色变量

```js
const sprite = runtime.getSpriteTargetByName('Sprite1');
if (sprite) {
  // 局部变量
  const localVars = sprite.variables;
  
  // 获取/设置局部变量
  const localVar = sprite.lookupVariableByNameAndType('localScore', '');
  if (localVar) {
    localVar.value = 50;
  }
}
```

### 列表

```js
const stage = runtime.getTargetForStage();

// 访问列表
const lists = Object.values(stage.variables).filter(v => v.type === 'list');

// 获取特定列表
const itemsList = stage.lookupVariableByNameAndType('items', 'list');
if (itemsList) {
  console.log('列表内容:', itemsList.value);
  
  // 修改列表
  itemsList.value.push('新项目');
  itemsList.value[0] = '第一项';
}
```

## 积木执行

### 启动脚本

```js
// 启动帽子积木
const startedThreads = runtime.startHats('event_whenflagclicked');
console.log(`启动了 ${startedThreads.length} 个线程`);

// 带条件启动帽子积木
const broadcastThreads = runtime.startHats('event_whenbroadcastreceived', {
  BROADCAST_OPTION: 'message1'
});

// 启动特定的积木栈
const blockId = 'some-block-id';
const target = runtime.getSpriteTargetByName('Sprite1');
const thread = runtime._pushThread(blockId, target);
```

### 手动线程管理
**高级 / 内部**

为了更精细的控制，你可以手动推送线程并检查它们的状态。

```js
// 手动启动线程
// _pushThread(blockId, target, opts)
const thread = runtime._pushThread(startBlockId, target, {
  stackClick: true // 作为栈点击处理(如果正在运行则重新启动)
});

// 线程状态常量
// 0: RUNNING
// 1: PROMISE_WAIT
// 2: YIELD
// 3: YIELD_TICK
// 4: DONE
if (thread.status === 4) {
  console.log('线程已完成');
}
```

### 线程管理

```js
// 获取所有运行中的线程
const threads = runtime.threads;
console.log(`${threads.length} 个线程正在运行`);

// 查找特定角色的线程
const spriteThreads = threads.filter(thread => 
  thread.target.getName() === 'Sprite1'
);

// 停止特定角色的线程
const target = runtime.getSpriteTargetByName('Sprite1');
runtime.stopForTarget(target);

// 线程属性
threads.forEach(thread => {
  console.log('线程角色:', thread.target.getName());
  console.log('顶部积木:', thread.topBlock);
  console.log('状态:', thread.status);
  console.log('是否已编译:', thread.isCompiled);
});
```

## 运行时事件

### 项目生命周期

```js
// 项目执行
vm.on('PROJECT_RUN_START', () => {
  console.log('项目开始运行');
});

vm.on('PROJECT_RUN_STOP', () => {
  console.log('项目已停止');
});

vm.on('PROJECT_CHANGED', () => {
  console.log('项目已被修改');
});

// 项目加载
vm.on('PROJECT_LOADED', () => {
  console.log('项目加载完成');
});
```

### 角色事件

```js
runtime.on('targetWasCreated', (target, originalTarget) => {
  console.log('新角色已创建:', target.getName());
  if (originalTarget) {
    console.log('克隆自:', originalTarget.getName());
  }
});

runtime.on('TARGETS_UPDATE', (emitProjectChanged) => {
  console.log('角色列表已更新');
  if (emitProjectChanged) {
    console.log('项目应标记为已更改');
  }
});
```

### 积木事件

```js
// 积木发光(视觉反馈)
runtime.on('SCRIPT_GLOW_ON', (glowData) => {
  console.log('脚本发光中:', glowData.id);
});

runtime.on('SCRIPT_GLOW_OFF', (glowData) => {
  console.log('脚本停止发光:', glowData.id);
});

runtime.on('BLOCK_GLOW_ON', (glowData) => {
  console.log('积木发光中:', glowData.id);
});

runtime.on('BLOCK_GLOW_OFF', (glowData) => {
  console.log('积木停止发光:', glowData.id);
});
```

### 监视器事件

```js
runtime.on('MONITORS_UPDATE', (monitors) => {
  console.log('变量监视器已更新:', monitors.length);
  monitors.forEach(monitor => {
    console.log(`${monitor.opcode}: ${monitor.value}`);
  });
});
```

## 扩展集成

### 扩展管理

```js
const extensionManager = vm.extensionManager;

// 检查扩展是否已加载
const isLoaded = extensionManager.isExtensionLoaded('pen');

// 获取已加载的扩展
const loadedExtensions = extensionManager.getLoadedExtensions();

// 加载扩展(非沙盒化)
if (extensionManager.loadExtensionURL) {
  await extensionManager.loadExtensionURL('https://example.com/extension.js');
}
```

### 扩展存储

```js
// 访问扩展特定存储
const extensionId = 'myextension';
const storage = runtime.extensionStorage[extensionId] || {};

// 存储数据
storage.settings = { volume: 0.5, enabled: true };
runtime.extensionStorage[extensionId] = storage;

// 扩展存储会随项目持久化
```

## I/O 和设备

### 输入设备

```js
// 鼠标
const mouse = runtime.ioDevices.mouse;
console.log('鼠标位置:', mouse.getClientX(), mouse.getClientY());
console.log('鼠标按下:', mouse.getIsDown());

// 键盘
const keyboard = runtime.ioDevices.keyboard;
console.log('空格键按下:', keyboard.getKeyIsDown(32));

// 通过名称检查按键
const spacePressed = keyboard.getKeyIsDown('space');
```

### 时钟和计时

```js
const clock = runtime.ioDevices.clock;

// 获取当前时间
const currentTime = clock.projectTimer();

// 重置计时器
clock.resetProjectTimer();

// 获取系统时间
const systemTime = clock.systemTime();
```

## 编译和性能

### 编译器状态

```js
// 检查编译器是否已启用
const compilerEnabled = runtime.compilerOptions.enabled;

// 获取编译错误
vm.on('COMPILE_ERROR', (target, error) => {
  console.log('编译错误于', target.getName(), ':', error);
});

// 预编译项目
if (runtime.precompile) {
  runtime.precompile();
}

### 编译器访问
**高级 / 内部**

非沙盒化扩展可以通过 `vm.exports` 访问编译器基础设施。这主要用于[编译器补丁](../advanced-techniques/compiler-patching.md)。

```js
// 检查编译器导出
if (vm.exports) {
    // 访问生成器
    const JSGenerator = vm.exports.JSGenerator;
    const IRGenerator = vm.exports.IRGenerator;
    
    // 访问辅助类
    const { TypedInput, TYPE_UNKNOWN } = JSGenerator.exports;
}
```

> [!WARNING]
> 编译器 API 是内部的，可能会发生变化。使用前请务必检查是否存在。

### 运行时钩子
**高级**

为了深度集成，你可以钩入运行时进程。有关详细信息，请参阅 [GUI API](/api-reference/gui-api#运行时钩子)：
- `runtime._convertBlockForScratchBlocks`(自定义积木序列化)
- `ScratchBlocks` 集成
```

### 性能监控

```js
// 启用性能分析
if (runtime.enableProfiling) {
  runtime.enableProfiling();
}

// 监控帧率
vm.on('FRAMERATE_CHANGED', (framerate) => {
  console.log('帧率已更改:', framerate);
});

// 监控运行时间
console.log('当前运行时间:', runtime.currentStepTime);
```

## 高级功能

### 舞台尺寸

```js
// 设置自定义舞台尺寸
vm.setStageSize(640, 360);

// 监听舞台尺寸变化
vm.on('STAGE_SIZE_CHANGED', (width, height) => {
  console.log('舞台尺寸已更改:', width, 'x', height);
});

// 获取当前舞台尺寸
console.log('舞台尺寸:', runtime.stageWidth, 'x', runtime.stageHeight);
```

### 云变量

```js
// 检查云变量
vm.on('HAS_CLOUD_DATA_UPDATE', (hasCloudData) => {
  if (hasCloudData) {
    console.log('项目有云变量');
  }
});

// 访问云变量限制
console.log('云变量限制:', runtime.cloudOptions.limit);
```

### 调试模式

```js
// 启用调试模式
vm.enableDebug();

// 禁用调试模式
vm.disableDebug();

// 检查调试状态
const debugEnabled = runtime.debug;
```

## 实用示例

### 自定义报告器扩展

```js
class SystemInfoExtension {
  getInfo() {
    return {
      id: 'systeminfo',
      name: 'System Info',
      blocks: [
        {
          opcode: 'getProjectInfo',
          blockType: Scratch.BlockType.REPORTER,
          text: 'project [INFO]',
          arguments: {
            INFO: {
              type: Scratch.ArgumentType.STRING,
              menu: 'INFO_MENU'
            }
          }
        }
      ],
      menus: {
        INFO_MENU: {
          items: ['name', 'sprite count', 'thread count', 'framerate']
        }
      }
    };
  }

  getProjectInfo(args) {
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    
    switch (args.INFO) {
      case 'name':
        return runtime.getTargetForStage().sprite.name;
      case 'sprite count':
        return runtime.targets.length - 1; // 排除舞台
      case 'thread count':
        return runtime.threads.length;
      case 'framerate':
        return runtime.frameRate || 30;
      default:
        return '';
    }
  }
}
```

### 事件监听器扩展

```js
class EventMonitorExtension {
  constructor() {
    this.eventLog = [];
    this.setupListeners();
  }

  setupListeners() {
    const vm = Scratch.vm;
    const runtime = vm.runtime;

    runtime.on('targetWasCreated', (target) => {
      this.eventLog.push(`克隆已创建: ${target.getName()}`);
    });

    vm.on('PROJECT_RUN_START', () => {
      this.eventLog.push('项目已启动');
    });

    vm.on('PROJECT_RUN_STOP', () => {
      this.eventLog.push('项目已停止');
    });
  }

  getInfo() {
    return {
      id: 'eventmonitor',
      name: 'Event Monitor',
      blocks: [
        {
          opcode: 'getLastEvent',
          blockType: Scratch.BlockType.REPORTER,
          text: 'last event'
        },
        {
          opcode: 'clearEvents',
          blockType: Scratch.BlockType.COMMAND,
          text: 'clear event log'
        }
      ]
    };
  }

  getLastEvent() {
    return this.eventLog[this.eventLog.length - 1] || '';
  }

  clearEvents() {
    this.eventLog = [];
  }
}
```

## 错误处理

```js
// 安全的 VM 访问
function safeVMOperation(operation) {
  try {
    if (!Scratch.extensions.unsandboxed) {
      console.warn('VM API 需要非沙盒化扩展');
      return null;
    }
    
    const vm = Scratch.vm;
    if (!vm) {
      console.warn('VM 不可用');
      return null;
    }
    
    return operation(vm);
  } catch (error) {
    console.error('VM 操作失败:', error);
    return null;
  }
}

// 用法
const spriteCount = safeVMOperation(vm => vm.runtime.targets.length - 1);
```

## 最佳实践

1. **访问 VM API 前检查非沙盒化状态**
2. **完美处理缺失的角色** - 角色可能会被删除
3. **尽可能监听事件而不是轮询**
4. **为异步操作安全存储引用**
5. **尊重项目状态** - 执行期间不要修改
6. **在线程安全的操作中操作正在运行的项目**
7. **插件禁用时清理事件监听器**

VM API 提供了对 Scratch 执行引擎的深度访问，使扩展能够与正在运行的项目创建复杂的交互。在使用这些 API 时要负责任，以在保持稳定性和性能的同时增强 Scratch 体验。
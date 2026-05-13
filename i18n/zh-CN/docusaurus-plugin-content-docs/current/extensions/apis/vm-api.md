---
name: VM
---

# 虚拟机 API

VM（虚拟机）是运行 Scratch 项目的核心引擎。对于扩展开发者，VM 提供对项目执行、角色管理、积木解释和运行时事件的访问。此 API 主要通过 `Scratch.vm` 供非沙盒化扩展使用。

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
// 启动项目（绿旗）
vm.greenFlag();

// 停止所有脚本
vm.stopAll();

// 手动执行单步（用于调试）
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
// 设置帧率（30 或 60 FPS）
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
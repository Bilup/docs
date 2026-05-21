---
title: 事件
sidebar_position: 5
---

# 事件系统

Bilup 提供了全面的事件系统，用于组件、插件和扩展之间的通信。

## 概述

事件系统支持：
- 组件间通信
- 插件与编辑器事件的集成
- 扩展生命周期管理
- 状态更改通知
- 用户交互跟踪

## Redux 事件

### 状态更改事件
监听 Redux 状态更改：

```javascript
// 监听所有状态更改
addon.tab.redux.addEventListener('statechanged', (event) => {
  const { action, prev, next } = event.detail;
  console.log('动作:', action.type);
});

// 筛选特定动作
addon.tab.redux.addEventListener('statechanged', (event) => {
  const { action } = event.detail;
  
  switch (action.type) {
    case 'scratch-gui/targets/SET_TARGET':
      handleTargetChange(action.targetId);
      break;
    case 'scratch-gui/mode/SET_PLAYER':
      handleModeChange(action.isPlayerOnly);
      break;
  }
});
```

### 常见 Redux 动作

```javascript
// 目标(角色/舞台)选择
'scratch-gui/targets/SET_TARGET'
'scratch-gui/targets/UPDATE_TARGET_LIST'

// 项目状态
'scratch-gui/project-state/SET_PROJECT_TITLE'
'scratch-gui/project-state/SET_PROJECT_SAVED'

// 编辑器模式
'scratch-gui/mode/SET_PLAYER'
'scratch-gui/mode/SET_FULLSCREEN'

// 积木工作区
'scratch-gui/workspace-blocks/UPDATE_BLOCKS'
'scratch-gui/workspace-blocks/SET_BLOCKS'

// 模态框
'scratch-gui/modals/OPEN_MODAL'
'scratch-gui/modals/CLOSE_MODAL'
```

## DOM 事件

### 编辑器导航
跟踪 URL 和导航更改：

```javascript
addon.tab.addEventListener('urlChange', (event) => {
  const { oldURL, newURL } = event.detail;
  
  if (newURL.includes('/editor')) {
    console.log('进入编辑器模式');
  } else if (newURL.includes('/player')) {
    console.log('进入播放器模式');
  }
});
```

### 组件事件
监听特定组件交互：

```javascript
// 积木工作区事件
addon.tab.addEventListener('workspaceUpdate', (event) => {
  console.log('工作区已更新:', event.detail);
});

// 舞台事件
addon.tab.addEventListener('stageClick', (event) => {
  const { x, y } = event.detail;
  console.log(`舞台点击位置: (${x}, ${y})`);
});

// 角色列表事件
addon.tab.addEventListener('spriteSelected', (event) => {
  console.log('角色已选中:', event.detail.spriteId);
});
```

## 自定义事件

### 派发事件
创建并派发自定义事件：

```javascript
// 简单的自定义事件
addon.tab.dispatchEvent(new CustomEvent('myEvent', {
  detail: { data: 'example' }
}));

// 包含多个数据的复杂事件
addon.tab.dispatchEvent(new CustomEvent('projectAnalyzed', {
  detail: {
    spriteCount: 5,
    blockCount: 127,
    complexity: 'medium',
    timestamp: Date.now()
  }
}));
```

### 事件监听器
监听自定义事件：

```javascript
// 监听特定的自定义事件
addon.tab.addEventListener('projectAnalyzed', (event) => {
  const { spriteCount, blockCount, complexity } = event.detail;
  updateProjectStats(spriteCount, blockCount, complexity);
});

// 通用事件监听器
addon.tab.addEventListener('myEvent', handleMyEvent);

function handleMyEvent(event) {
  console.log('收到自定义事件:', event.detail);
}
```

## 扩展事件

### 扩展生命周期
跟踪扩展的加载和卸载：

```javascript
// 扩展已加载
vm.runtime.on('EXTENSION_ADDED', (extensionId) => {
  console.log('扩展已加载:', extensionId);
});

// 扩展已移除
vm.runtime.on('EXTENSION_REMOVED', (extensionId) => {
  console.log('扩展已移除:', extensionId);
});
```

### 积木事件
监控积木执行和交互：

```javascript
// 积木执行开始
vm.runtime.on('BLOCK_GLOW_ON', (blockId) => {
  console.log('积木执行中:', blockId);
});

// 积木执行结束
vm.runtime.on('BLOCK_GLOW_OFF', (blockId) => {
  console.log('积木执行完成:', blockId);
});

// 积木已添加到工作区
vm.runtime.on('BLOCKS_ADDED', (blockIds) => {
  console.log('积木已添加:', blockIds);
});
```

## 项目事件

### 项目生命周期
跟踪项目的加载、保存和更改：

```javascript
// 项目已加载
vm.runtime.on('PROJECT_LOADED', () => {
  console.log('项目加载成功');
});

// 项目已保存
addon.tab.addEventListener('projectSaved', (event) => {
  console.log('项目已保存:', event.detail.title);
});

// 项目已修改
addon.tab.addEventListener('projectModified', (event) => {
  console.log('项目有未保存的更改');
});
```

### 资源事件
监控造型和声音更改：

```javascript
// 造型已添加
vm.runtime.on('COSTUME_ADDED', (costumeId, targetId) => {
  console.log(`造型 ${costumeId} 已添加到 ${targetId}`);
});

// 声音已添加
vm.runtime.on('SOUND_ADDED', (soundId, targetId) => {
  console.log(`声音 ${soundId} 已添加到 ${targetId}`);
});
```

## 性能事件

### 监控性能
跟踪运行时性能指标：

```javascript
// 帧率变化
vm.runtime.on('FRAMERATE_CHANGED', (fps) => {
  console.log('FPS:', fps);
});

// 编译事件
vm.runtime.on('COMPILE_START', () => {
  console.log('编译开始');
});

vm.runtime.on('COMPILE_END', (success, errors) => {
  if (success) {
    console.log('编译成功');
  } else {
    console.error('编译错误:', errors);
  }
});
```

## 事件最佳实践

### 内存管理
正确清理事件监听器：

```javascript
export default async function ({ addon }) {
  const handleStateChange = (event) => {
    // 处理事件
  };
  
  // 添加监听器
  addon.tab.redux.addEventListener('statechanged', handleStateChange);
  
  // 插件禁用时清理
  addon.onDisabled = () => {
    addon.tab.redux.removeEventListener('statechanged', handleStateChange);
  };
}
```

### 事件筛选
筛选事件以避免性能问题：

```javascript
let lastUpdate = 0;
const THROTTLE_MS = 100;

addon.tab.redux.addEventListener('statechanged', (event) => {
  const now = Date.now();
  if (now - lastUpdate < THROTTLE_MS) {
    return; // 跳过此更新
  }
  lastUpdate = now;
  
  // 处理事件
  handleStateChange(event);
});
```

### 错误处理
优雅地处理事件监听器中的错误：

```javascript
addon.tab.addEventListener('myEvent', (event) => {
  try {
    processEvent(event.detail);
  } catch (error) {
    console.error('处理事件时出错:', error);
    // 回退行为
  }
});
```

## 事件文档

### 创建事件文档
为其他开发者记录自定义事件：

```javascript
/**
 * 项目分析完成时派发
 * @event projectAnalyzed
 * @type {CustomEvent}
 * @property {Object} detail - 事件数据
 * @property {number} detail.spriteCount - 角色数量
 * @property {number} detail.blockCount - 积木总数
 * @property {string} detail.complexity - 项目复杂度等级
 */
```

## 相关文档

- [插件 API 参考](./addon-api)
- [VM API 参考](./vm-api)
- [GUI API 参考](./gui-api)
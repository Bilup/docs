---
title: 插件 API
sidebar_position: 4
---

# 插件 API

插件 API 提供了通过插件系统修改和扩展 Bilup 界面和行为的工具。

## 概述

插件 API 允许开发者：
- 修改 Bilup 用户界面
- 向编辑器添加新功能
- 自定义外观和行为
- 与外部服务和工具集成

## 基本插件结构

```javascript
// userscript.js
export default async function ({ addon, msg, console }) {
  // 插件初始化代码
  console.log('插件已加载:', addon.info.name);
  
  // 添加自定义功能
  addon.tab.addEventListener('urlChange', handleUrlChange);
  
  function handleUrlChange(event) {
    console.log('URL 已更改:', event.detail.newURL);
  }
}
```

## API 对象

### addon.tab
用于 DOM 操作和编辑器交互的接口：

```javascript
// 等待元素
const blocksPalette = await addon.tab.waitForElement('[class*="blocks_blocks"]');

// 添加自定义样式
addon.tab.addStyle(`
  .my-custom-class {
    background: var(--ui-primary);
  }
`);

// 监听事件
addon.tab.addEventListener('urlChange', callback);
addon.tab.addEventListener('statechanged', callback);

// Redux 状态访问
const currentMode = addon.tab.redux.state.scratchGui.mode;
```

### addon.settings
访问插件配置：

```javascript
// 获取设置值
const isEnabled = addon.settings.get('enabled');
const maxItems = addon.settings.get('maxItems');

// 监听设置更改
addon.settings.addEventListener('change', (event) => {
  console.log('设置已更改:', event.detail);
});
```

### addon.info
当前插件的元数据：

```javascript
console.log('插件 ID:', addon.info.id);
console.log('插件名称:', addon.info.name);
console.log('版本:', addon.info.version);
```

## DOM 操作

### 元素选择
安全地等待和选择 DOM 元素：

```javascript
// 等待特定元素
const menuBar = await addon.tab.waitForElement('[class*="menu-bar"]');
const stageArea = await addon.tab.waitForElement('[class*="stage"]');

// 选择现有元素
const blocks = addon.tab.querySelector('[class*="blocks_blocks"]');
```

### 添加自定义元素

```javascript
// 创建并添加自定义按钮
const customButton = document.createElement('button');
customButton.textContent = msg('my-button');
customButton.className = 'my-addon-button';
customButton.addEventListener('click', handleButtonClick);

// 找到插入点并添加按钮
const menuBar = await addon.tab.waitForElement('[class*="menu-bar"]');
menuBar.appendChild(customButton);
```

## 事件系统

### 内置事件

```javascript
// URL 导航更改
addon.tab.addEventListener('urlChange', (event) => {
  const { oldURL, newURL } = event.detail;
  console.log(`导航: ${oldURL} → ${newURL}`);
});

// Redux 状态更改
addon.tab.addEventListener('statechanged', (event) => {
  const { action, prev, next } = event.detail;
  if (action.type === 'scratch-gui/targets/SET_TARGET') {
    console.log('目标已更改:', action.targetId);
  }
});
```

### 自定义事件

```javascript
// 调用自定义事件
addon.tab.dispatchEvent(new CustomEvent('myAddonEvent', {
  detail: { data: 'example' }
}));

// 监听自定义事件
addon.tab.addEventListener('myAddonEvent', (event) => {
  console.log('自定义事件:', event.detail);
});
```

## 上下文菜单

### 积木上下文菜单
向积木的右键菜单添加项目：

```javascript
addon.tab.createBlockContextMenu((items, target) => {
  if (target.isStage === false) {
    items.push({
      enabled: true,
      text: msg('duplicate-sprite'),
      callback: () => {
        // 复制角色功能
      },
      separator: true
    });
  }
});
```

## 存储

### 本地存储
跨会话持久化数据：

```javascript
// 存储数据
await addon.storage.setItem('myData', { count: 42 });

// 检索数据
const data = await addon.storage.getItem('myData');
console.log('存储的计数:', data?.count);

// 删除数据
await addon.storage.removeItem('myData');
```

## 本地化

### 消息函数
支持多种语言：

```javascript
// 简单消息
const buttonText = msg('save-project');

// 带参数的消息
const confirmText = msg('confirm-delete', { name: spriteName });

// 条件消息
const statusText = msg(isOnline ? 'online-status' : 'offline-status');
```

### 消息文件
在 `addons-l10n/` 中定义翻译：

```json
// en.json
{
  "my-addon/save-project": "Save Project",
  "my-addon/confirm-delete": "Delete {name}?",
  "my-addon/online-status": "Connected",
  "my-addon/offline-status": "Disconnected"
}
```

## 设置集成

### 设置类型
定义可配置选项：

```json
// 在插件清单中
"settings": [
  {
    "name": "启用功能",
    "id": "enabled",
    "type": "boolean",
    "default": true
  },
  {
    "name": "最大项目数",
    "id": "maxItems", 
    "type": "positive_integer",
    "default": 10,
    "min": 1,
    "max": 100
  },
  {
    "name": "配色方案",
    "id": "colorScheme",
    "type": "select",
    "options": [
      { "value": "auto", "name": "自动" },
      { "value": "light", "name": "亮色" },
      { "value": "dark", "name": "暗色" }
    ],
    "default": "auto"
  }
]
```

## 性能最佳实践

1. **使用 waitForElement()** 而不是轮询
2. **缓存 DOM 查询**(如果可能)
3. **插件禁用时移除事件监听器**
4. **防抖频繁操作**
5. **对动画使用 requestAnimationFrame**

## 生命周期管理

```javascript
export default async function ({ addon }) {
  // 初始化
  console.log('插件启动');
  
  // 设置功能
  const cleanup = setupFeatures();
  
  // 禁用时清理
  addon.onDisabled = () => {
    console.log('插件停止');
    cleanup();
  };
}

function setupFeatures() {
  // 设置代码
  
  return () => {
    // 清理代码
  };
}
```

## 相关文档

- [插件开发指南](../gui-internals/addons/home)
- [GUI API 参考](./gui-api)
- [扩展 API 参考](./extension-api)
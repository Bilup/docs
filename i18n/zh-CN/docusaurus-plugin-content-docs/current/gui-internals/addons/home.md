---
title: 插件系统
sidebar_position: 1
---

# 插件系统

Bilup 的插件系统基于 [Scratch Addons 浏览器扩展](https://scratchaddons.com/)，提供了扩展和自定义 Bilup 编辑器界面和功能的方式。

## 架构概述

插件系统由几个关键组件组成：

- **插件管理器**: 加载和管理插件生命周期
- **设置存储**: 插件设置的持久存储
- **Redux 集成**: 将插件连接到 Bilup 的状态管理
- **事件系统**: 允许插件监听和响应编辑器事件
- **API 层**: 为插件提供与 Bilup 交互的安全接口

## 插件类型

### 用户脚本
在 Bilup 编辑器上下文中运行的 JavaScript 代码，用于添加功能：

```javascript
// 示例 userscript.js
export default async function ({ addon, msg }) {
  // 添加自定义菜单项
  addon.tab.createBlockContextMenu((items, target) => {
    items.push({
      enabled: target.isStage === false,
      text: msg("rename-sprite"),
      callback: () => {
        // 自定义功能
      }
    });
  });
}
```

### 用户样式
用于自定义 Bilup 界面的 CSS 修改：

```css
/* 示例 userstyle.css */
[class*="stage_stage-wrapper"] {
  border: 2px solid var(--ui-primary);
  border-radius: 8px;
}

.sa-editor-dark-mode [class*="blocks_blocks"] {
  background-color: #1e1e1e !important;
}
```

## 清单格式

每个插件需要一个 `addon.json` 清单文件：

```json
{
  "name": "Editor Dark Mode",
  "description": "Bilup 编辑器的深色主题",
  "credits": [
    {
      "name": "Bilup Team"
    }
  ],
  "userscripts": [
    {
      "url": "userscript.js",
      "matches": ["https://editor.bilup.org/*"]
    }
  ],
  "userstyles": [
    {
      "url": "userstyle.css", 
      "matches": ["https://editor.bilup.org/*"],
      "if": {
        "settings": {
          "dark": true
        }
      }
    }
  ],
  "settings": [
    {
      "name": "Dark mode",
      "id": "dark",
      "type": "boolean",
      "default": true
    }
  ],
  "tags": ["theme", "dark", "editor"],
  "enabledByDefault": false,
  "versionAdded": "1.0.0",
  "updateUserstylesOnSettingsChange": true
}
```

## 设置系统

插件可以定义可配置的设置：

### 设置类型

**布尔设置**
```json
{
  "name": "Enable feature",
  "id": "enabled",
  "type": "boolean", 
  "default": true
}
```

**选择设置**
```json
{
  "name": "Theme variant",
  "id": "variant",
  "type": "select",
  "options": [
    {
      "value": "blue",
      "name": "Blue"
    },
    {
      "value": "green", 
      "name": "Green"
    }
  ],
  "default": "blue"
}
```

**正整数设置**
```json
{
  "name": "Animation speed",
  "id": "speed",
  "type": "positive_integer",
  "default": 100,
  "min": 50,
  "max": 500
}
```

## 插件 API

插件接收一个 API 对象，可以访问 Bilup 功能：

### 核心 API 结构

```javascript
export default async function ({ addon, msg, console }) {
  // addon.tab - DOM 和 UI 操作
  // addon.settings - 访问插件设置
  // msg() - 本地化函数
  // console - 安全的控制台日志
}
```

### Tab API

`addon.tab` 对象提供与编辑器交互的方法：

```javascript
// 等待特定元素出现
const blocksPalette = await addon.tab.waitForElement('[class*="blocks_blocks"]');

// 添加自定义 CSS 类
addon.tab.addStyle(`
  .my-custom-style {
    background: red;
  }
`);

// 监听 URL 变化
addon.tab.addEventListener('urlChange', (event) => {
  console.log('URL changed to:', event.detail.newURL);
});

// Redux 状态访问
const currentMode = addon.tab.redux.state.scratchGui.mode;
```

### 事件处理

```javascript
// 监听角色选择变化
addon.tab.redux.addEventListener('statechanged', (event) => {
  if (event.detail.action.type === 'scratch-gui/targets/SET_TARGET') {
    const newTarget = event.detail.action.targetId;
    // 处理角色变化
  }
});
```

### 上下文菜单

```javascript
// 向积木上下文菜单添加项目
addon.tab.createBlockContextMenu((items, target) => {
  if (target.isStage === false) {
    items.push({
      enabled: true,
      text: msg("duplicate-sprite"),
      callback: () => {
        // 复制角色功能
      }
    });
  }
});
```

## 内置插件

Bilup 包含几个内置插件：
### 开发者工具
- **Editor DevTools**: 积木检查和调试工具
- **Sprite/Costume Browser**: 增强的资源管理
- **Performance Monitor**: 跟踪帧率和内存使用

### 界面增强
- **Dark Mode**: 编辑器界面的深色主题
- **Compact Mode**: 缩小间距以适应小屏幕
- **Custom Block Colors**: 个性化积木类别颜色

### 工作流程改进
- **Auto-Save**: 定期项目保存
- **Block Finder**: 在工作区搜索和高亮积木
- **Mouse Wheel Volume**: 使用滚轮调整音量

### 可访问性
- **High Contrast**: 改善颜色对比度以提高可见性
- **Keyboard Navigation**: 增强键盘快捷键
- **Screen Reader Support**: 更好的辅助技术兼容性

## 本地化

插件通过消息文件支持多种语言：

```javascript
// 在 userscript.js 中
export default async function ({ addon, msg }) {
  // 使用 msg() 函数处理可翻译文本
  const buttonText = msg("save-project");
  const confirmText = msg("confirm-delete", { name: spriteName });
}
```

消息文件存储在 `addons-l10n/` 目录中：
```json
// en.json
{
  "save-project": "Save Project",
  "confirm-delete": "Delete {name}?"
}

// es.json  
{
  "save-project": "Guardar Proyecto",
  "confirm-delete": "¿Eliminar {name}?"
}
```

## 开发和测试

### 本地开发
可以通过修改以下文件来本地开发和测试插件：
```
scratch-gui/src/addons/addons/[addon-id]/
```

### 设置界面
插件设置可以通过 Bilup 设置面板中的"插件"部分访问。

### 调试
使用提供的 `console` 对象进行安全日志记录：

```javascript
export default async function ({ addon, console }) {
  console.log("Addon initialized");
  console.warn("Deprecated feature used");
  console.error("Failed to load resource");
}
```

## 限制和兼容性

### 安全限制
- 插件在与 Bilup 相同的上下文中运行，但访问权限有限
- 无法访问敏感浏览器 API（如文件系统或网络）
- 无法在插件沙箱外执行任意代码

### 更新机制
插件从上游 Scratch Addons 项目获取，并应用 Bilup 兼容性补丁。更改通常应贡献到上游，而不是直接在 Bilup 中进行。

## 性能考虑

### 最佳实践
- 使用 `waitForElement()` 而不是轮询 DOM 元素
- 禁用插件时移除事件监听器
- 最小化 DOM 查询并尽可能缓存结果
- 尽可能使用 CSS 动画而不是 JavaScript 动画

### 资源管理
```javascript
export default async function ({ addon }) {
  const observer = new MutationObserver(callback);
  
  // 禁用插件时清理
  addon.onDisabled = () => {
    observer.disconnect();
  };
}
```

插件系统提供了强大的方式来扩展 Bilup，同时保持与更广泛的 Scratch Addons 生态系统的兼容性。
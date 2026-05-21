---
title: GUI 主题
sidebar_position: 3
---

# GUI 主题

GUI 主题控制整体界面外观 - 背景、文本颜色和组件样式。它们位于 `src/lib/themes/gui/`。

## 可用主题

Bilup 包含三个内置 GUI 主题：

- **light**: 默认明亮界面
- **dark**: 深色界面配浅色文本
- **midnight**: 深色主题的更深版本

## 结构

每个 GUI 主题导出 `guiColors` 和 `blockColors`：

```javascript
// src/lib/themes/gui/dark.js
const guiColors = {
    'color-scheme': 'dark',
    'ui-primary': '#111111',
    'ui-secondary': '#1e1e1e',
    'ui-tertiary': '#2e2e2e',
    'text-primary': '#eeeeee',
    'menu-bar-background': '#333333',
    'input-background': '#1e1e1e',
    'page-background': '#111111',
    // ...更多属性
};

const blockColors = {
    insertionMarker: '#cccccc'
};

export { guiColors, blockColors };
```

## 关键颜色属性

### 核心界面

- `color-scheme`: 'light' 或 'dark'(影响浏览器行为)
- `ui-primary`: 主背景颜色
- `ui-secondary`: 次要背景(面板、侧边栏)
- `ui-tertiary`: 第三级背景(按钮、输入)

### 文本颜色

- `text-primary`: 主文本颜色
- `link-color`: 链接文本颜色

### 组件背景

- `menu-bar-background`: 顶部菜单栏
- `input-background`: 文本输入和表单字段
- `popover-background`: 下拉菜单和工具提示
- `page-background`: 主页面背景

### 模态窗口

- `ui-modal-overlay`: 背景覆盖(带透明度)
- `ui-modal-background`: 模态窗口背景
- `ui-modal-foreground`: 模态文本颜色
- `ui-modal-header-background`: 模态标题背景

### 特效

- `filter-icon-black`: 黑色图标的 CSS 滤镜
- `filter-icon-gray`: 灰色图标的 CSS 滤镜
- `filter-icon-white`: 白色图标的 CSS 滤镜

## 创建自定义 GUI 主题

### 1. 创建主题文件

创建 `src/lib/themes/gui/custom.js`：

```javascript
const guiColors = {
    'color-scheme': 'light', // 或 'dark'
    
    // 核心界面
    'ui-primary': '#f5f5f5',
    'ui-secondary': '#e0e0e0',
    'ui-tertiary': '#d0d0d0',
    
    // 文本
    'text-primary': '#333333',
    
    // 组件
    'menu-bar-background': '#2196F3',
    'input-background': '#ffffff',
    'page-background': '#fafafa',
    
    // 模态框
    'ui-modal-overlay': '#000000aa',
    'ui-modal-background': '#ffffff',
    'ui-modal-foreground': '#333333',
    
    // 链接
    'link-color': '#1976D2',
    
    // 图标滤镜(根据您的配色方案调整)
    'filter-icon-black': 'none',
    'filter-icon-gray': 'grayscale(100%) brightness(0.7)',
    'filter-icon-white': 'brightness(0) invert(100%)'
};

const blockColors = {
    insertionMarker: '#666666',
    fieldBackground: '#ffffff'
};

export { guiColors, blockColors };
```

### 2. 在索引中注册

添加到 `src/lib/themes/index.js`：

```javascript
import * as guiCustom from './gui/custom';

const GUI_CUSTOM = 'custom';
const GUI_MAP = {
    [GUI_LIGHT]: guiLight,
    [GUI_DARK]: guiDark,
    [GUI_MIDNIGHT]: guiMidnight,
    [GUI_CUSTOM]: guiCustom
};
```

## 深色主题考虑事项

创建深色主题时：

### 颜色对比度

确保足够的对比度以实现可访问性：

```javascript
const guiColors = {
    'text-primary': '#eeeeee',      // 深色背景上的浅色文本
    'ui-primary': '#111111',        // 深色背景
    'input-background': '#1e1e1e',  // 输入略浅一点
};
```

### 图标滤镜

为深色背景调整图标颜色：

```javascript
const guiColors = {
    'filter-icon-black': 'invert(100%)',           // 使黑色图标变白
    'filter-icon-gray': 'grayscale(100%) brightness(1.7)', // 加亮灰色图标
    'filter-icon-white': 'brightness(0) invert(100%)'      // 保持白色图标为白色
};
```

### 积木颜色

深色主题可能需要不同的积木插入标记：

```javascript
const blockColors = {
    insertionMarker: '#cccccc',    // 深色背景上的浅色标记
    fieldBackground: '#2e2e2e'     // 深色字段背景
};
```

## CSS 集成

GUI 颜色作为 CSS 自定义属性应用：

```css
:root {
    --ui-primary: #111111;
    --text-primary: '#eeeeee';
    --menu-bar-background: '#333333';
}

.menu-bar {
    background-color: var(--menu-bar-background);
    color: var(--text-primary);
}

.modal {
    background-color: var(--ui-modal-background);
    color: var(--ui-modal-foreground);
}
```

## 主题检测

组件可以检测当前主题：

```javascript
const isDark = theme.isDark(); // 如果 color-scheme 是 'dark' 则返回 true

// 基于主题的条件样式
const buttonStyle = {
    border: isDark ? '1px solid #555' : '1px solid #ccc'
};
```

## 浏览器集成

`color-scheme` 属性影响浏览器行为：

```css
/* 由主题系统自动应用 */
html {
    color-scheme: dark; /* 或 light */
}
```

这告诉浏览器：
- 使用适当的滚动条颜色
- 为表单控件应用深色/浅色模式
- 为未样式化的元素调整默认颜色
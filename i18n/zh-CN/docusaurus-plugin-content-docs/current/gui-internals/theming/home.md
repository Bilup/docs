---
title: 主题概述
sidebar_position: 1
---

# Bilup 主题系统

Bilup 的主题系统由三个独立的组件组成，可以混合搭配：

- **[Accent Colors](./accent-colors)** - 主色调方案(红色、蓝色、紫色等)
- **[GUI Themes](./gui-themes)** - 界面外观(浅色、深色、午夜)
- **[Block Themes](./block-themes)** - 积木颜色和外观(three、dark、high-contrast)

## 架构

主题在 `src/lib/themes/index.js` 中组合：

```javascript
class Theme {
    constructor(accent, gui, blocks, menuBarAlign, wallpaper, fonts) {
        this.accent = accent;     // 颜色主题(红色、蓝色等)
        this.gui = gui;           // 界面主题(浅色、深色、午夜)
        this.blocks = blocks;     // 积木外观(three、dark、high-contrast)
        this.menuBarAlign = menuBarAlign;
        this.wallpaper = wallpaper;
        this.fonts = fonts;
    }
}
```

## 工作原理

1. **模块化设计**：每个组件(accent、GUI、blocks)都是独立的
2. **颜色合并**：颜色按优先级解析：Accent → GUI → Base
3. **CSS 变量**：主题在文档根目录上设置 CSS 自定义属性
4. **动态应用**：主题可以在运行时更改

## 文件结构

```
src/lib/themes/
├── index.js              # 主主题系统
├── guiHelpers.js         # 主题应用逻辑
├── accent/               # 主题色定义
├── gui/                  # 界面主题
└── blocks/               # 积木主题
```

## 预设组合

Bilup 包含这些预设主题组合：

```javascript
Theme.light = new Theme('red', 'light', 'three');
Theme.dark = new Theme('red', 'dark', 'three');  
Theme.midnight = new Theme('red', 'midnight', 'three');
Theme.highContrast = new Theme('red', 'light', 'high-contrast');
```

## 下一步

- [了解 Accent Colors](./accent-colors) - 添加新的配色方案
- [探索 GUI Themes](./gui-themes) - 自定义界面外观
- [理解 Block Themes](./block-themes) - 修改积木颜色

```javascript
import * as accentPurple from './accent/purple';

const ACCENTS = [
    // ...现有主题色...
    {
        name: 'Purple',
        accent: accentPurple,
        description: 'Purple accent color',
        id: 'tw.accent.purple'
    }
];
```

## GUI Themes

GUI 主题控制界面颜色。位于 `src/lib/themes/gui/`。

### 结构

每个 GUI 主题导出 `guiColors` 和 `blockColors`：

```javascript
// src/lib/themes/gui/dark.js
const guiColors = {
    'color-scheme': 'dark',
    'ui-primary': '#111111',
    'ui-secondary': '#1e1e1e',
    'text-primary': '#eeeeee',
    'menu-bar-background': '#333333',
    // ...更多属性
};

const blockColors = {
    insertionMarker: '#cccccc'
};

export { guiColors, blockColors };
```

### 可用的 GUI 主题
- **light**: 默认浅色界面
- **dark**: 深色界面配浅色文字
- **midnight**: 深色主题的更深版本

## Block Themes

积木主题控制积木外观。位于 `src/lib/themes/blocks/`。

### 结构

```javascript
// src/lib/themes/blocks/three.js
const blockColors = {
    motion: {
        primary: '#4C97FF',
        secondary: '#4280D7',
        tertiary: '#3373CC'
    },
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6',
        tertiary: '#774DCB'
    }
    // ...其他积木类别
};

export { blockColors };
```

### 可用的积木主题
- **three**: 默认 Scratch 3.0 颜色
- **dark**: 深色优化的积木颜色
- **high-contrast**: 无障碍聚焦颜色
- **custom**: 插件修改的颜色

## 主题应用

主题通过 `guiHelpers.js` 应用：

```javascript
import { applyGuiColors } from './guiHelpers';

const theme = new Theme('blue', 'dark', 'three');
applyGuiColors(theme);
```

### 颜色解析

颜色按优先级解析：
1. Accent 颜色
2. GUI 主题颜色
3. 基础浅色主题颜色(后备)

```javascript
theme.getGuiColors() // 合并 accent + gui + base 颜色
theme.getBlockColors() // 合并 accent + gui + block 颜色
```

## CSS 集成

主题在文档根目录上设置 CSS 自定义属性：

```css
:root {
    --looks-secondary: hsla(215, 100%, 65%, 1);
    --ui-primary: #111111;
    --text-primary: #eeeeee;
}
```

组件引用这些变量：

```css
.menu-bar {
    background-color: var(--menu-bar-background);
    color: var(--text-primary);
}
```

## 预设主题

Bilup 包含预设组合：

```javascript
Theme.light = new Theme('red', 'light', 'three');
Theme.dark = new Theme('red', 'dark', 'three');  
Theme.midnight = new Theme('red', 'midnight', 'three');
Theme.highContrast = new Theme('red', 'light', 'high-contrast');
```

## 文件位置

```
src/lib/themes/
├── index.js              # 主主题系统
├── guiHelpers.js         # 主题应用逻辑
├── accent/               # 主题色定义
│   ├── red.js
│   ├── blue.js
│   └── ...
├── gui/                  # 界面主题
│   ├── light.js
│   ├── dark.js
│   └── midnight.js
└── blocks/               # 积木主题
    ├── three.js
    ├── dark.js
    └── high-contrast.js
```

这个模块化系统允许用户独立地将任何主题色与任何 GUI 主题和积木主题混合使用。

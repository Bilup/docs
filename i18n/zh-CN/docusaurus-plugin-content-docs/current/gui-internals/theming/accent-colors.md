---
title: 强调色
sidebar_position: 2
---

# 强调色

强调色定义了 Bilup 界面中使用的主色调方案。它们位于 `src/lib/themes/accent/`，可以与任何 GUI 或积木主题混合使用。

## 可用强调色

Bilup 包含许多内置强调色：

- **基础颜色**: Red, Orange, Yellow, Green, Blue, Purple, Pink
- **骄傲主题**: Rainbow, Trans, Gay, Rotur
- **渐变主题**: Sunset, Ocean, Aurora, Cosmic, Fire, Nebula, Lavender, Mint, Cherry, Sky, Forest, Coral

## 结构

每个强调文件导出 `guiColors` 和 `blockColors`：

```javascript
// src/lib/themes/accent/blue.js
const guiColors = {
    'looks-secondary': 'hsla(215, 100%, 65%, 1)',
    'looks-transparent': 'hsla(215, 100%, 65%, 0.35)',
    'looks-light-transparent': 'hsla(215, 100%, 65%, 0.15)',
    'looks-secondary-dark': 'hsla(215, 60%, 50%, 1)'
};

const blockColors = {};

export { guiColors, blockColors };
```

## 添加新强调色

### 1. 创建强调色文件

创建 `src/lib/themes/accent/purple.js`：

```javascript
const guiColors = {
    'looks-secondary': 'hsla(270, 100%, 65%, 1)',
    'looks-transparent': 'hsla(270, 100%, 65%, 0.35)',
    'looks-light-transparent': 'hsla(270, 100%, 65%, 0.15)',
    'looks-secondary-dark': 'hsla(270, 60%, 50%, 1)'
};

const blockColors = {
    // 可选：覆盖特定积木颜色
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6',
        tertiary: '#774DCB'
    }
};

export { guiColors, blockColors };
```

### 2. 在索引中注册

添加到 `src/lib/themes/index.js`：

```javascript
import * as accentPurple from './accent/purple';

const ACCENTS = [
    // ...现有强调色...
    {
        name: 'Purple',
        accent: accentPurple,
        description: 'Purple accent color',
        id: 'tw.accent.purple'
    }
];
```

## 颜色属性

### GUI 颜色

强调色主要影响这些 GUI 属性：

- `looks-secondary`: UI 元素的主强调色
- `looks-transparent`: 半透明版本（35% 不透明度）
- `looks-light-transparent`: 浅色透明版本（15% 不透明度）
- `looks-secondary-dark`: 用于对比的深色变体

### 积木颜色

强调色可以覆盖特定积木类别的颜色：

```javascript
const blockColors = {
    motion: {
        primary: '#4C97FF',    // 主积木颜色
        secondary: '#4280D7',  // 积木轮廓/阴影
        tertiary: '#3373CC'    // 深色变体
    },
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6',
        tertiary: '#774DCB'
    }
    // ...其他类别
};
```

## 颜色解析

强调色按此优先级应用：

1. **强调色**（最高优先级）
2. GUI 主题颜色
3. 基础主题颜色（后备）

示例解析：
```javascript
// 如果强调色定义了 'looks-secondary'，则使用它
// 否则，使用 GUI 主题的 'looks-secondary'
// 否则，使用基础浅色主题的 'looks-secondary'
theme.getGuiColors()['looks-secondary']
```

## 特殊强调色类型

### 渐变强调色

某些强调色使用渐变而不是纯色：

```javascript
// src/lib/themes/accent/sunset.js
const guiColors = {
    'looks-secondary': 'linear-gradient(135deg, #ff6b6b, #feca57)',
    'looks-transparent': 'linear-gradient(135deg, rgba(255,107,107,0.35), rgba(254,202,87,0.35))',
    // ...
};
```

### 骄傲旗帜强调色

骄傲主题的强调色通常使用多种颜色或图案：

```javascript
// src/lib/themes/accent/rainbow.js
const guiColors = {
    'looks-secondary': 'linear-gradient(90deg, #e40303, #ff8c00, #ffed00, #008018, #004cff, #732982)',
    // ...
};
```

## 在组件中的使用

强调色通过 CSS 变量自动应用于组件：

```css
.accent-button {
    background-color: var(--looks-secondary);
    border-color: var(--looks-secondary-dark);
}

.accent-button:hover {
    background-color: var(--looks-secondary-dark);
}
```

## 测试

通过创建主题实例测试您的强调色：

```javascript
import { Theme } from './index';

const testTheme = new Theme('purple', 'light', 'three');
console.log(testTheme.getGuiColors()['looks-secondary']); // 应显示紫色
```
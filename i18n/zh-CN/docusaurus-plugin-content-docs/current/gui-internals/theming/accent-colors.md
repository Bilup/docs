---
title: 主题色
sidebar_position: 2
---

# 主题色

主题色定义了 Bilup 界面中使用的主色调方案。它们位于 `src/lib/themes/accent/`，可以与任何 GUI 或积木主题混合使用。

## 可用的主题色

Bilup 包含许多内置主题色：

- **基础颜色**：Red、Orange、Yellow、Green、Green Tea、Pale Blue、Blue、Purple、Eggplant
- **渐变颜色**：Rainbow

## 结构

每个主题色文件导出 `guiColors` 和 `blockColors`：

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

## 添加新主题色

### 1. 创建主题色文件

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
    // ...现有主题色...
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

主题色主要影响以下 GUI 属性：

- `looks-secondary`：UI 元素的主主题色
- `looks-transparent`：半透明版本(35% 不透明度)
- `looks-light-transparent`：浅色透明版本(15% 不透明度)
- `looks-secondary-dark`：用于对比的深色变体

### 积木颜色

主题色可以覆盖特定积木类别的颜色：

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

主题色按以下优先级应用：

1. **主题色**(最高优先级)
2. GUI 主题颜色
3. 基础主题颜色(后备)

解析示例：
```javascript
// 如果主题色定义了 'looks-secondary'，则使用它
// 否则，使用 GUI 主题的 'looks-secondary'
// 否则，使用基础浅色主题的 'looks-secondary'
theme.getGuiColors()['looks-secondary']
```

## 特殊主题色类型

### 渐变主题色

某些主题色使用渐变而非纯色：

```javascript
const guiColors = {
    'looks-secondary': 'linear-gradient(135deg, #ff6b6b, #feca57)',
    'looks-transparent': 'linear-gradient(135deg, rgba(255,107,107,0.35), rgba(254,202,87,0.35))',
    // ...
};
```

### 多色主题色

某些主题色使用多种颜色或图案：

```javascript
const guiColors = {
    'looks-secondary': 'linear-gradient(90deg, #e40303, #ff8c00, #ffed00, #008018, #004cff, #732982)',
    // ...
};
```

## 在组件中的使用

主题色通过 CSS 变量自动应用于组件：

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

通过创建主题实例来测试您的主题色：

```javascript
import { Theme } from './index';

const testTheme = new Theme('purple', 'light', 'three');
console.log(testTheme.getGuiColors()['looks-secondary']); // 应显示紫色
```

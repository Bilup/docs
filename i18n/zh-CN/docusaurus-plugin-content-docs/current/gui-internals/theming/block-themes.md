---
title: 积木主题
sidebar_position: 4
---

# 积木主题

积木主题控制工作区中编码积木的颜色和外观。它们位于 `src/lib/themes/blocks/`。

## 可用主题

Bilup 包含多个内置积木主题：

- **three**: 默认 Scratch 3.0 颜色
- **dark**: 深色优化积木颜色
- **high-contrast**: 可访问性专注的高对比度颜色
- **custom**: 插件修改的颜色

## 结构

积木主题导出 `blockColors` 对象，包含每个积木类别的颜色：

```javascript
// src/lib/themes/blocks/three.js
const blockColors = {
    motion: {
        primary: '#4C97FF',    // 主积木颜色
        secondary: '#4280D7',  // 积木轮廓/边框
        tertiary: '#3373CC'    // 深色变体
    },
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6',
        tertiary: '#774DCB'
    },
    sounds: {
        primary: '#CF63CF',
        secondary: '#C94FC9',
        tertiary: '#BD42BD'
    },
    control: {
        primary: '#FFAB19',
        secondary: '#EC9C13',
        tertiary: '#CF8B17'
    },
    event: {
        primary: '#FFBF00',
        secondary: '#E6AC00',
        tertiary: '#CC9900'
    },
    sensing: {
        primary: '#5CB1D6',
        secondary: '#47A8D1',
        tertiary: '#2E8EB8'
    },
    operators: {
        primary: '#59C059',
        secondary: '#46B946',
        tertiary: '#389438'
    },
    data: {
        primary: '#FF8C1A',
        secondary: '#FF8000',
        tertiary: '#DB6E00'
    },
    // 特殊元素
    insertionMarker: '#000000',
    fieldBackground: '#ffffff'
};

export { blockColors };
```

## 积木类别

### 核心类别

- **motion**: 运动和方向积木
- **looks**: 外观和造型积木
- **sounds**: 音乐积木
- **control**: 流程控制(循环、条件)
- **event**: 事件处理积木
- **sensing**: 输入和检测积木
- **operators**: 数学和逻辑运算
- **data**: 变量和列表

### 特殊颜色

- **insertionMarker**: 积木插入指示器的颜色
- **fieldBackground**: 输入字段的背景颜色
- **text**: 积木内的文本颜色
- **workspace**: 工作区背景颜色

## 创建自定义积木主题

### 1. 创建主题文件

创建 `src/lib/themes/blocks/custom.js`：

```javascript
const blockColors = {
    motion: {
        primary: '#FF6B6B',    // 自定义红色用于运动
        secondary: '#FF5252',
        tertiary: '#F44336'
    },
    looks: {
        primary: '#4ECDC4',    // 自定义蓝绿色用于外观
        secondary: '#26A69A',
        tertiary: '#00796B'
    },
    sounds: {
        primary: '#FFD93D',    // 自定义黄色用于声音
        secondary: '#FFC107',
        tertiary: '#FF8F00'
    },
    control: {
        primary: '#A8E6CF',    // 自定义绿色用于控制
        secondary: '#81C784',
        tertiary: '#4CAF50'
    },
    event: {
        primary: '#FFB74D',    // 自定义橙色用于事件
        secondary: '#FF9800',
        tertiary: '#F57C00'
    },
    sensing: {
        primary: '#BA68C8',    // 自定义紫色用于侦测
        secondary: '#9C27B0',
        tertiary: '#7B1FA2'
    },
    operators: {
        primary: '#64B5F6',    // 自定义蓝色用于运算
        secondary: '#2196F3',
        tertiary: '#1976D2'
    },
    data: {
        primary: '#F06292',    // 自定义粉色用于数据
        secondary: '#E91E63',
        tertiary: '#C2185B'
    },
    
    // 特殊元素
    insertionMarker: '#333333',
    fieldBackground: '#ffffff',
    text: '#ffffff'
};

const extensions = {
    // 可以在此定义扩展特定颜色
    pen: {
        primary: '#0FBD8C',
        secondary: '#0DA57A',
        tertiary: '#0B8E69'
    }
};

export { blockColors, extensions };
```

### 2. 在索引中注册

添加到 `src/lib/themes/index.js`：

```javascript
import * as blocksCustom from './blocks/custom';

const BLOCKS_CUSTOM_NEW = 'custom-new';
const BLOCKS_MAP = {
    [BLOCKS_THREE]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: blocksThree.blockColors,
        extensions: blocksThree.extensions,
        customExtensionColors: {},
        useForStage: true
    },
    // ...现有主题...
    [BLOCKS_CUSTOM_NEW]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: blocksCustom.blockColors,
        extensions: blocksCustom.extensions || {},
        customExtensionColors: {},
        useForStage: true
    }
};
```

## 高对比度主题

高对比度主题专为可访问性设计：

```javascript
// src/lib/themes/blocks/high-contrast.js
const blockColors = {
    motion: {
        primary: '#000080',    // 深蓝色
        secondary: '#000070',
        tertiary: '#000060'
    },
    looks: {
        primary: '#800080',    // 深紫色
        secondary: '#700070',
        tertiary: '#600060'
    },
    // 使用高对比度颜色，清晰区分
};
```

## 深色积木主题

深色主题优化了深色 GUI 主题的颜色：

```javascript
// src/lib/themes/blocks/dark.js
const blockColors = {
    motion: {
        primary: '#6BB3FF',    // 深色背景上更亮的蓝色
        secondary: '#5AA3EF',
        tertiary: '#4993DF'
    },
    // 颜色为深色背景而增亮和调整
    insertionMarker: '#ffffff',  // 深色背景上的白色标记
    fieldBackground: '#2e2e2e'   // 深色字段背景
};
```

## 扩展颜色

积木主题可以为扩展定义颜色：

```javascript
const extensions = {
    pen: {
        primary: '#0FBD8C',
        secondary: '#0DA57A',
        tertiary: '#0B8E69'
    },
    music: {
        primary: '#D65CD6',
        secondary: '#BD42BD',
        tertiary: '#A428A4'
    }
};

const customExtensionColors = {
    // 特定扩展 ID 的颜色
    'my-custom-extension': {
        primary: '#FF6B6B',
        secondary: '#FF5252',
        tertiary: '#F44336'
    }
};
```

## 舞台集成

某些积木主题针对舞台区域优化：

```javascript
const BLOCKS_MAP = {
    [BLOCKS_THREE]: {
        // ...
        useForStage: true    // 对舞台积木使用此主题
    },
    [BLOCKS_DARK]: {
        // ...
        useForStage: false   // 不在舞台上使用(改用浅色主题)
    }
};
```

## 颜色应用

积木颜色通过 CSS 变量应用：

```css
.block-motion {
    background-color: var(--motion-primary);
    border-color: var(--motion-secondary);
}

.block-motion:hover {
    background-color: var(--motion-tertiary);
}
```

## 测试积木颜色

测试您的积木主题：

```javascript
import { Theme } from './index';

const testTheme = new Theme('red', 'light', 'custom');
const blockColors = testTheme.getBlockColors();
console.log(blockColors.motion.primary); // 应显示您的自定义颜色
```
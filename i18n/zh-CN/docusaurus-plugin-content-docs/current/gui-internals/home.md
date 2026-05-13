---
slug: /gui-internals/
title: GUI 内部概述
sidebar_position: 1
---

# Bilup GUI 内部架构

本节提供 Bilup GUI 架构、内部系统和组件结构的全面文档。无论您是为 Bilup 贡献代码、构建插件，还是创建自定义修改，本指南都将深入了解一切工作原理。

## 架构概述

Bilup 的 GUI 遵循现代基于 React 的架构，包含几个关键层：

```
┌─────────────────────────────────────────────┐
│                 React App                   │
├─────────────────────────────────────────────┤
│               Redux Store                   │
│         (状态管理)                          │
├─────────────────────────────────────────────┤
│              HOCs & Containers              │
│        (数据流 & 副作用)                     │
├─────────────────────────────────────────────┤
│             React Components               │
│           (UI & 展示)                       │
├─────────────────────────────────────────────┤
│              Addon System                  │
│        (扩展 & 自定义)                      │
├─────────────────────────────────────────────┤
│             Theme Engine                   │
│          (样式 & 主题)                      │
└─────────────────────────────────────────────┘
```

## 核心包

### 主要仓库

- **[scratch-gui](https://github.com/Bilup/scratch-gui)** - 主 GUI 实现
- **[scratch-vm](https://github.com/Bilup/scratch-vm)** - 虚拟机和运行时
- **[scratch-render](https://github.com/Bilup/scratch-render)** - 渲染引擎
- **[scratch-blocks](https://github.com/Bilup/scratch-blocks)** - 可视化积木编辑器
- **[scratch-paint](https://github.com/Bilup/scratch-paint)** - 造型/背景编辑器

### 包依赖关系

```mermaid
graph TD
    A[scratch-gui] --> B[scratch-vm]
    A --> C[scratch-render]
    A --> D[scratch-blocks]
    A --> E[scratch-paint]
    A --> F[scratch-audio]
    B --> C
    B --> G[scratch-parser]
    D --> H[scratch-svg-renderer]
```

## 文件结构

```
scratch-gui/
├── src/
│   ├── components/          # React UI 组件
│   ├── containers/          # Redux 连接的容器
│   ├── lib/                 # 工具库
│   ├── reducers/            # Redux 归约器
│   ├── addons/              # 插件系统
│   ├── css/                 # 全局样式
│   └── index.js             # 入口点
├── static/                  # 静态资源
├── test/                    # 测试文件
└── webpack.config.js        # 构建配置
```

## 关键概念

### 组件层次结构

GUI 遵循清晰的组件层次结构：

1. **App Container** - 根应用包装器
2. **GUI Component** - 主界面布局
3. **Feature Containers** - 积木、舞台、角色等
4. **UI Components** - 按钮、模态框、菜单等
5. **Addon Components** - 增强功能

### 状态管理

Bilup 使用 Redux 进行集中式状态管理：

- **Project State** - 当前项目、加载状态
- **Editor State** - 活动选项卡、选中角色
- **UI State** - 模态框可见性、设置
- **VM State** - 运行时信息
- **Addon State** - 插件配置

### 数据流

```
用户操作 → 组件 → 容器 → Action → 归约器 → Store → 组件
```

### 事件系统

组件通过以下方式通信：

- **Redux Actions** - 状态更改
- **VM Events** - 运行时事件
- **Addon Hooks** - 扩展点
- **DOM Events** - 用户交互

## 主要系统

### [核心组件](/gui-internals/components/gui-component)
包括主 GUI 组件、积木编辑器、舞台和角色管理等基本 UI 构建块。

### [容器与 HOC](/gui-internals/containers/overview)
连接 Redux 的容器和高阶组件，管理数据流和副作用。

### [状态管理](/gui-internals/state/redux-store)
全面的 Redux store 设置、归约器、动作和中间件，用于管理应用状态。

### [插件系统](/gui-internals/addons/home)
强大的扩展系统，允许自定义功能、UI 修改和行为更改。

### [主题与样式](/gui-internals/theming/home)
动态主题系统，支持 CSS 变量、自定义主题和外观定制。

### 性能与优化
性能监控、优化技术和调试工具。

## 开发模式

### 组件设计

Bilup 组件遵循以下模式：

```jsx
// 使用钩子的函数组件
const MyComponent = ({ prop1, prop2 }) => {
    const [state, setState] = useState(initialState);
    
    useEffect(() => {
        // 副作用
    }, [dependencies]);
    
    return (
        <div className={styles.container}>
```

## 开始探索

选择以下主题之一开始深入了解：

- [架构详解](architecture.md) - 深入了解系统架构
- [核心组件](components/gui-component.md) - 主要 UI 组件
- [容器模式](containers/overview.md) - 数据绑定模式
- [状态管理](state/redux-store.md) - Redux 集成
- [插件系统](addons/home.md) - 扩展框架
- [主题系统](theming/home.md) - 样式定制
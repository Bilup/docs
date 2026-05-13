---
slug: /development/
title: 开发概述
sidebar_position: 1
---

# Bilup 开发指南

欢迎阅读 Bilup 开发文档！这份全面的指南涵盖了使用 Bilup、为 Bilup 开发以及在 Bilup 上开发所需了解的一切。

## 开发路径

### 🚀 [入门指南](./getting-started.md)
设置开发环境并了解 Bilup 项目结构。

### 🏗️ [项目结构](./project-structure.md)
了解代码库组织以及不同组件如何协同工作。

### ⚙️ [构建与运行](./building-running.md)
从源代码构建 Bilup 并运行开发服务器的详细说明。

### 🧩 [扩展开发](../extensions/introduction.md)
创建与 Scratch 编程环境集成的自定义积木和扩展。

### 🌐 [全局对象](./globals.md)
了解 Bilup 环境中可用的全局对象和 API。

### 🔧 [测试](./testing.md)
了解 Bilup 开发的测试策略、工具和最佳实践。

### 🤝 [贡献](./contributing.md)
为 Bilup 贡献的指南，包括代码标准和拉取请求流程。

## 开发者快速入门

### 前提条件

开始之前，请确保你拥有：

- **Node.js 18+** 和 npm
- **Git** 版本控制工具
- **现代浏览器**（Chrome、Firefox、Safari、Edge）
- **代码编辑器**（推荐 VS Code）

### 设置开发环境

```bash
# 克隆主仓库
git clone https://github.com/Bilup/scratch-gui.git
cd scratch-gui

# 安装依赖
npm ci

# 启动开发服务器
npm start
```

你的开发环境将在 `http://localhost:8601/` 可用。

### 开发工作流程

1. **分叉并克隆**你要贡献的仓库
2. **创建分支**用于你的功能或 bug 修复
3. **进行更改**并进行适当测试
4. **彻底测试**使用自动化和手动测试
5. **提交拉取请求**遵循我们的指南

## Bilup 开发者架构

### 仓库结构

Bilup 由多个相互连接的仓库组成：

```
Bilup 生态系统
├── scratch-gui/          # 主 GUI 应用
├── scratch-vm/           # 虚拟机和运行时
├── scratch-render/       # 图形渲染引擎
├── scratch-blocks/       # 可视化积木编辑器
├── scratch-paint/        # 造型/背景编辑器
├── packager/             # 基于 Web 的项目打包器
└── docs/                 # 文档（本网站）
```

### 关键技术

- **React 18** - 用户界面框架
- **Redux** - 状态管理
- **Webpack 5** - 构建系统和打包
- **Jest** - 测试框架
- **ESLint/Prettier** - 代码质量工具
- **PostCSS** - CSS 处理
- **Workbox** - 服务工作者和 PWA 功能

### 开发堆栈

```
┌─────────────────────────────────────────┐
│            开发工具                      │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │  Hot Reload │ │   Source Maps       ││
│  │   DevServer │ │   Debugging Tools   ││
│  └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              构建流程                    │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │   Webpack   │ │      PostCSS        ││
│  │   Babel     │ │   Optimization      ││
│  └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              前端堆栈                    │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │    React    │ │       Redux         ││
│  │     JSX     │ │   State Management  ││
│  └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────┘
```

## 开发类型

### 1. 核心开发
为 Bilup 的核心功能做出贡献：

- **Bug 修复**现有功能
- **性能改进**和优化  
- **新功能**核心平台
- **安全增强**和漏洞修复

### 2. 扩展开发
创建自定义积木和功能：

- **自定义积木**用于特定用例
- **硬件集成**（传感器、电机等）
- **API 集成**（Web 服务、数据库）
- **教育扩展**用于学习环境

### 3. 插件开发
增强 Bilup 界面：

- **编辑器增强**（新工具、改进的工作流）
- **视觉修改**（主题、布局、样式）
- **生产力工具**（快捷方式、自动化、辅助工具）
- **无障碍改进**（屏幕阅读器、键盘导航）

### 4. 主题开发
创建自定义视觉主题：

- **配色方案**满足不同偏好
- **布局修改**用于特定工作流
- **无障碍主题**（高对比度、大字体）
- **品牌主题**用于组织

## 开发环境设置

### 推荐的 VS Code 扩展

```json
{
    "recommendations": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-json",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense"
    ]
}
```

### 环境配置

创建 `.env.local` 用于开发设置：

```bash
# 开发环境变量
NODE_ENV=development
REACT_APP_DEBUG=true
REACT_APP_ENABLE_HOT_RELOAD=true
REACT_APP_ADDON_DEV_MODE=true

# 可选：自定义 API 端点
REACT_APP_CLOUD_HOST=wss://clouddata.bilup.org
REACT_APP_ASSET_HOST=https://assets.scratch.mit.edu
```

### Git 配置

设置 Git hooks 确保代码质量：

```bash
# 安装 pre-commit hooks
npm run prepare

# 配置 Git 用户（如果尚未完成）
git config user.name "你的名字"
git config user.email "your.email@example.com"
```
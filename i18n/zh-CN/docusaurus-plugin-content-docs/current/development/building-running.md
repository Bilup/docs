---
title: 构建与运行
sidebar_position: 4
---

# 构建与运行 Bilup

本指南涵盖如何从源代码构建 Bilup 并在本地运行以进行开发、测试或贡献。

## 前提条件

### 必需软件

#### Node.js 和 npm
- **Node.js**: 版本 16.x 或更高
- **npm**: 版本 7.x 或更高（随 Node.js 一起安装）
- **检查版本**:
```bash
node --version  # 应为 v16.x.x 或更高
npm --version   # 应为 7.x.x 或更高
```

#### Git
- **Git**: 用于克隆仓库
- **检查版本**:
```bash
git --version  # 任何最新版本
```

#### 可选工具
- **Yarn**: 替代包管理器
- **Docker**: 用于容器化开发
- **Visual Studio Code**: 推荐编辑器

### 系统要求
- **RAM**: 最低 4GB，推荐 8GB
- **存储**: 所有仓库需要 2GB 可用空间
- **CPU**: 推荐现代多核处理器
- **操作系统**: Windows 10+、macOS 10.14+ 或 Linux

## 仓库设置

### 克隆仓库
Bilup 由多个协同工作的仓库组成：

```bash
# 创建主目录
mkdir bilup-dev
cd bilup-dev

# 克隆主仓库
git clone https://github.com/Bilup/scratch-gui.git
git clone https://github.com/Bilup/scratch-vm.git
git clone https://github.com/Bilup/scratch-blocks.git

# 可选：克隆额外仓库
git clone https://github.com/Bilup/packager.git
git clone https://github.com/Bilup/docs.git
```

### 仓库结构
```
bilup-dev/
├── scratch-gui/        # 主界面
├── scratch-vm/         # 虚拟机
├── scratch-blocks/     # 积木定义
├── packager/          # 项目打包器
└── docs/              # 文档
```

## 构建组件

### 构建 scratch-vm（虚拟机）

```bash
cd scratch-vm

# 安装依赖
npm install

# 为开发构建
npm run build

# 为生产构建
npm run build:prod

# 监听模式（更改时重建）
npm run watch
```

### 构建 scratch-blocks（积木定义）

```bash
cd scratch-blocks

# 安装依赖
npm install

# 构建垂直积木
npm run build:vertical

# 构建水平积木  
npm run build:horizontal

# 构建两者
npm run build

# 监听模式
npm run watch
```

### 构建 scratch-gui（主界面）

```bash
cd scratch-gui

# 安装依赖
npm install

# 链接本地依赖（如果使用本地 scratch-vm/scratch-blocks）
npm link ../scratch-vm
npm link ../scratch-blocks

# 为开发构建
npm run build

# 为生产构建
npm run build:prod
```

## 开发工作流

### 运行开发服务器

#### 启动 GUI 开发服务器
```bash
cd scratch-gui

# 启动开发服务器
npm start

# 自定义端口
npm start -- --port 8602

# 启用热重载
npm run start:hot
```

#### 访问开发环境
- **URL**: http://localhost:8601 (默认)
- **热重载**: 更改自动应用
- **调试模式**: 浏览器开发者工具可用

### 开发脚本

#### 常见 npm 脚本
```bash
# 安装所有依赖
npm install

# 启动开发服务器
npm start

# 运行测试
npm test

# 在监听模式下运行测试
npm run test:watch

# 代码检查
npm run lint

# 修复代码检查问题
npm run lint:fix

# 为生产构建
npm run build

# 分析包大小
npm run analyze
```

### 链接本地依赖

#### 使用 npm link
```bash
# 在 scratch-vm 目录中
npm link

# 在 scratch-gui 目录中
npm link scratch-vm
```

#### 使用相对路径（package.json）
```json
{
  "dependencies": {
    "scratch-vm": "file:../scratch-vm",
    "scratch-blocks": "file:../scratch-blocks"
  }
}
```
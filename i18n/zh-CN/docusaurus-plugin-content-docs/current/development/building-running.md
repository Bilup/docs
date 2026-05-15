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

## 生产构建

### 生产构建流程

#### 构建所有组件
```bash
# 构建 scratch-vm
cd scratch-vm
npm run build:prod

# 构建 scratch-blocks
cd ../scratch-blocks
npm run build

# 构建 scratch-gui
cd ../scratch-gui
npm run build:prod
```

#### 优化选项
```bash
# 启用 source maps
BUILD_MODE=production GENERATE_SOURCEMAP=true npm run build

# 禁用 source maps（文件更小）
GENERATE_SOURCEMAP=false npm run build

# 分析包大小
npm run analyze
```

### 静态文件生成

#### 生成静态文件
```bash
# 构建用于托管的静态文件
npm run build

# 文件生成在 build/ 目录
ls build/
# static/         # CSS、JS 和媒体文件
# index.html      # 主 HTML 文件
# manifest.json   # Web 应用清单
```

#### 部署准备
```bash
# 创建部署包
tar -czf bilup-build.tar.gz -C build .

# 或 zip 文件
cd build && zip -r ../bilup-build.zip .
```

## 测试

### 运行测试

#### 单元测试
```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- --testNamePattern="sprite"

# 在监听模式下运行测试
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

#### 集成测试
```bash
# 运行集成测试
npm run test:integration

# 运行特定集成测试
npm run test:integration -- --grep "load project"
```

#### 端到端测试
```bash
# 安装 E2E 依赖
npm install -g cypress

# 运行 E2E 测试
npm run test:e2e

# 打开 Cypress GUI
npm run cypress:open
```

### 测试配置

#### Jest 配置（jest.config.js）
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  moduleNameMapping: {
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js'
  ]
};
```

#### 测试工具
```javascript
// test/setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// 全局测试工具
global.vm = require('scratch-vm');
```

## 调试

### 开发调试

#### 浏览器开发者工具
1. **F12**：打开开发者工具
2. **Sources 选项卡**：设置断点
3. **Console 选项卡**：查看日志和错误
4. **Network 选项卡**：监控请求
5. **Performance 选项卡**：分析性能

#### VS Code 调试
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Bilup",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/webpack-dev-server",
      "args": ["--config", "webpack.config.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### 调试脚本
```bash
# 使用 Node.js 检查器调试
node --inspect-brk ./node_modules/.bin/webpack-dev-server

# 调试测试
node --inspect-brk ./node_modules/.bin/jest --runInBand

# 调试特定测试
node --inspect-brk ./node_modules/.bin/jest --runInBand test/specific-test.js
```

## 性能优化

### 开发性能

#### 构建速度优化
```javascript
// webpack.config.js 修改以加快构建速度
module.exports = {
  // 使用缓存加快重建速度
  cache: {
    type: 'filesystem'
  },
  
  // 针对开发优化
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  
  // 减少包检查
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  }
};
```

#### 内存管理
```bash
# 增加 Node.js 内存限制
export NODE_OPTIONS="--max_old_space_size=4096"
npm start

# 或内联
NODE_OPTIONS="--max_old_space_size=4096" npm start
```

### 生产优化

#### 包分析
```bash
# 分析包大小
npm run analyze

# 替代分析工具
npx webpack-bundle-analyzer build/static/js/*.js
```

#### 优化技术
- **代码分割**：分割包以加快加载
- **Tree Shaking**：移除未使用的代码
- **压缩**：压缩 JavaScript 和 CSS
- **压缩**：启用 gzip 压缩

## 故障排除

### 常见构建问题

#### Node 模块问题
```bash
# 清除 node_modules 并重新安装
rm -rf node_modules package-lock.json
npm install

# 清除 npm 缓存
npm cache clean --force
```

#### 端口冲突
```bash
# 查找使用端口的进程
lsof -i :8601

# 终止进程
kill -9 <PID>

# 使用不同端口
npm start -- --port 8602
```

#### 内存问题
```bash
# 增加 Node.js 内存
export NODE_OPTIONS="--max_old_space_size=8192"

# 检查内存使用
node -p "process.memoryUsage()"
```

### 构建错误

#### 缺少依赖
```bash
# 检查缺少的 peer 依赖
npm ls

# 安装缺少的依赖
npm install <missing-package>
```

#### TypeScript 错误
```bash
# 不构建进行类型检查
npx tsc --noEmit

# 修复 TypeScript 配置
# 根据需要编辑 tsconfig.json
```

#### Webpack 错误
```bash
# 调试 webpack 配置
npx webpack --mode development --verbose

# 清除 webpack 缓存
rm -rf node_modules/.cache
```

## 持续集成

### GitHub Actions 设置
```yaml
# .github/workflows/build.yml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
```

### 本地 CI 模拟
```bash
# 在本地运行与 CI 相同的步骤
npm ci           # 清洁安装
npm run lint     # 代码检查
npm test         # 运行测试
npm run build    # 构建项目
```

本地构建和运行 Bilup 使你能够完全控制开发环境，并能够有效地为项目做出贡献！
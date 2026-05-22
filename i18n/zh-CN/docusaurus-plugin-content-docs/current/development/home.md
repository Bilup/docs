---
slug: /development/
title: 开发概述
sidebar_position: 1
---

# Bilup 开发指南

欢迎阅读 Bilup 开发文档! 这份全面的指南涵盖了使用 Bilup、为 Bilup 开发以及在 Bilup 上开发所需了解的一切。

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
- **现代浏览器**(Chrome、Firefox、Safari、Edge)
- **代码编辑器**(推荐 VS Code)

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
└── docs/                 # 文档(本网站)
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
- **硬件集成**(传感器、电机等)
- **API 集成**(Web 服务、数据库)
- **教育扩展**用于学习环境

### 3. 插件开发
增强 Bilup 界面：

- **编辑器增强**(新工具、改进的工作流)
- **视觉修改**(主题、布局、样式)
- **生产力工具**(快捷方式、自动化、辅助工具)
- **无障碍改进**(屏幕阅读器、键盘导航)

### 4. 主题开发
创建自定义视觉主题：

- **配色方案**满足不同偏好
- **布局修改**用于特定工作流
- **无障碍主题**(高对比度、大字体)
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

# 配置 Git 用户(如果尚未完成)
git config user.name "你的名字"
git config user.email "your.email@example.com"
```

## 调试和开发工具

### 浏览器 DevTools 集成

Bilup 提供了增强的调试功能：

```javascript
// 在浏览器控制台中可用
window.vm          // Scratch VM 实例
window.reduxStore  // Redux store
window.ScratchBlocks // Blockly 实例
window.addons      // 插件系统

// 调试辅助函数
window.debug = {
    vm: window.vm,
    store: window.reduxStore,
    enableVerboseLogging: () => { /* ... */ },
    dumpState: () => console.log(window.reduxStore.getState())
};
```

### 开发标志

通过 URL 参数启用开发功能：

```
http://localhost:8601/?debug=true&logging=verbose&addon_dev=true
```

可用标志：
- `debug=true` - 启用调试模式
- `logging=verbose` - 详细控制台日志
- `addon_dev=true` - 启用插件开发工具
- `profiling=true` - 启用性能分析

## 测试策略

### 测试类型

1. **单元测试** - 单个组件和函数测试
2. **集成测试** - 组件交互测试
3. **端到端测试** - 完整用户工作流程测试
4. **视觉回归测试** - UI 一致性测试
5. **性能测试** - 加载和执行时间测试

### 运行测试

```bash
# 运行所有测试
npm test

# 在监听模式下运行测试
npm run test:watch

# 运行特定测试文件
npm test -- Button.test.js

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行端到端测试
npm run test:e2e
```

## 代码质量标准

### ESLint 配置

Bilup 遵循严格的 lint 规则：

```json
{
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    "rules": {
        "indent": ["error", 4],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-unused-vars": "error",
        "react/prop-types": "error"
    }
}
```

### 代码格式化

Prettier 配置以保持一致的格式：

```json
{
    "printWidth": 100,
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "singleQuote": true,
    "quoteProps": "as-needed",
    "trailingComma": "none"
}
```

## 性能指南

### 包大小管理

- **代码分割** - 用于大型组件
- **Tree shaking** - 清除死代码
- **动态导入** - 用于可选功能
- **资源优化** - 用于图像和字体

### 运行时性能

- **React.memo** - 用于昂贵组件
- **useMemo/useCallback** - 用于昂贵计算
- **虚拟滚动** - 用于大型列表
- **防抖** - 用于高频事件

### 内存管理

- **事件监听器清理** - 在 useEffect 清理中
- **订阅管理** - 用于 Redux 连接
- **图像加载优化** - 懒加载
- **垃圾回收意识** - 在长时间运行操作中

## 安全注意事项

### 输入验证

```javascript
// 始终验证用户输入
const validateProjectData = (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error('无效的项目数据');
    }
    // 额外验证...
};
```

### 内容安全策略

开发环境 CSP：

```javascript
const csp = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-eval'"], // VM 需要
    "style-src": ["'self'", "'unsafe-inline'"], // 主题需要
    "img-src": ["'self'", "data:", "blob:"],
    "connect-src": ["'self'", "wss://clouddata.bilup.org"]
};
```

## 文档标准

### 代码文档

```javascript
/**
 * 将项目加载到 VM
 * @param {Object} projectData - 要加载的项目数据
 * @param {boolean} [showProgress=true] - 是否显示加载进度
 * @returns {Promise<void>} 项目加载完成时解析的 Promise
 * @throws {Error} 当项目数据无效时
 */
async function loadProject(projectData, showProgress = true) {
    // 实现...
}
```

### 组件文档

```jsx
/**
 * 具有一致样式的按钮组件
 * 
 * @component
 * @example
 * <Button onClick={handleClick} variant="primary">
 *   点击我
 * </Button>
 */
const Button = ({ 
    children, 
    onClick, 
    variant = 'default',
    disabled = false 
}) => {
    // 实现...
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['default', 'primary', 'secondary']),
    disabled: PropTypes.bool
};
```

## 社区开发

### 开源贡献

Bilup 是开源的，欢迎贡献：

1. **Issues** - 报告错误和请求功能
2. **Pull Requests** - 提交代码改进
3. **Discussions** - 分享想法并获得帮助
4. **Documentation** - 改进指南和示例

### 代码审核流程

1. **自动化检查**必须通过(测试、linting、构建)
2. **维护者手动审核**
3. **在多个浏览器和设备上测试**
4. **必要时更新文档**
5. **批准后合并**

### 发布流程

1. **发布前功能冻结**
2. **综合测试阶段**
3. **发布候选版本创建**
4. **社区反馈收集**
5. **最终发布和分发**

准备好开始开发了吗?选择你的路径：

- **Bilup 新手?** 从 [入门指南](./getting-started.md) 开始
- **想创建扩展?** 查看 [扩展开发](../extensions/introduction.md)
- **准备贡献?** 阅读我们的 [贡献指南](./contributing.md)

---

*有关具体的实现细节和高级主题，请探索本开发指南中的各个部分。*
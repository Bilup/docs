---
title: 项目结构
sidebar_position: 3
---

# Bilup 项目结构

了解 Bilup 的项目结构对于有效开发至关重要。本指南解释了代码库的组织方式以及不同组件如何交互。

## 仓库概述

Bilup 由多个相互连接的仓库组成：

```
Bilup 生态系统
├── scratch-gui/          # 主 GUI 应用(基于 React 的编辑器)
├── scratch-vm/           # 虚拟机和运行时引擎
├── scratch-render/       # 基于 WebGL 的渲染引擎  
├── scratch-blocks/       # 可视化积木编辑器(基于 Blockly)
├── scratch-paint/        # 造型和背景编辑器
├── scratch-audio/        # Web Audio API 实现
├── packager/             # 基于 Web 的项目打包器
└── docs/                 # 文档网站(本网站)
```

## scratch-gui 结构

主 GUI 仓库包含基于 React 的编辑器界面：

```
scratch-gui/
├── src/                          # 源代码
│   ├── components/               # React UI 组件
│   │   ├── gui/                  # 主 GUI 组件
│   │   ├── blocks/               # 积木编辑器集成
│   │   ├── stage/                # 舞台显示组件
│   │   ├── sprite-selector/      # 角色管理 UI
│   │   ├── menu-bar/             # 顶部菜单栏
│   │   └── ...                   # 其他 UI 组件
│   ├── containers/               # Redux 连接的容器
│   │   ├── gui.jsx               # 主 GUI 容器
│   │   ├── blocks.jsx            # 积木编辑器容器
│   │   ├── stage.jsx             # 舞台容器
│   │   └── ...                   # 其他容器
│   ├── lib/                      # 工具库
│   │   ├── themes/               # 主题系统
│   │   ├── storage.js            # 项目存储
│   │   ├── vm-manager-hoc.jsx    # VM 集成
│   │   └── ...                   # 其他工具
│   ├── reducers/                 # Redux reducers
│   │   ├── gui.js                # 主 GUI 状态
│   │   ├── project-state.js      # 项目加载状态
│   │   ├── targets.js            # 角色/舞台状态
│   │   └── ...                   # 其他 reducers
│   ├── addons/                   # 插件系统
│   │   ├── api.js                # 插件 API 实现
│   │   ├── hooks.js              # 集成钩子
│   │   ├── generated/            # 生成的插件文件
│   │   └── addons/               # 各个插件实现
│   ├── css/                      # 全局样式表
│   │   ├── colors.css            # 颜色定义
│   │   ├── units.css             # 尺寸和间距单位
│   │   └── ...                   # 其他全局样式
│   └── index.js                  # 应用入口点
├── static/                       # 静态资源
│   ├── favicon.ico               # 网站图标
│   ├── blocks-media/             # 积木图标和媒体
│   └── example-extensions/       # 示例扩展文件
├── test/                         # 测试文件
│   ├── unit/                     # 单元测试
│   ├── integration/              # 集成测试
│   └── fixtures/                 # 测试数据和模拟
├── webpack.config.js             # Webpack 构建配置
├── package.json                  # NPM 依赖和脚本
└── README.md                     # 仓库文档
```

## 组件架构

### 组件层次结构

```
App
└── GUI (主界面)
    ├── MenuBar
    │   ├── File Menu
    │   ├── Edit Menu
    │   ├── Settings
    │   └── Theme Selector
    ├── GUI Body
    │   ├── Editor Panel (Left)
    │   │   ├── Tabs (Code/Costumes/Sounds)
    │   │   ├── Blocks Workspace
    │   │   ├── Costume Editor
    │   │   └── Sound Editor
    │   └── Stage Panel (Right)
    │       ├── Stage Header
    │       ├── Stage Canvas
    │       └── Target Pane
    │           ├── Sprite Selector
    │           └── Stage Selector
    └── Modals & Overlays
        ├── Extension Library
        ├── Costume Library
        ├── Sound Library
        ├── Settings Modal
        └── Alerts
```

### 文件命名规范

组件遵循一致的命名模式：

```
src/components/component-name/
├── component-name.jsx        # 主组件文件
├── component-name.css        # 组件样式
└── index.js                  # 导出文件(可选)

src/containers/
├── component-name.jsx        # Redux 连接的容器
└── component-name-hoc.jsx    # 高阶组件

src/lib/
├── utility-name.js           # 工具函数
└── utility-name-hoc.jsx      # 工具 HOC
```

## 状态管理结构

### Redux Store 组织

```javascript
{
    // 主 GUI 状态
    scratchGui: {
        projectState: {           // 项目加载/保存状态
            loadingState: 'SHOWING_WITH_ID',
            projectId: '12345',
            error: null
        },
        editorTab: {              // 活动编辑器标签
            activeTabIndex: 0     // 0=blocks, 1=costumes, 2=sounds
        },
        targets: {                // 角色和舞台
            sprites: {...},
            stage: {...},
            editingTarget: 'sprite1'
        },
        mode: {                   // 显示模式
            isFullScreen: false,
            isPlayerOnly: false,
            isEmbedded: false
        },
        modals: {                 // 模态框可见性
            extensionLibrary: false,
            costumeLibrary: false,
            soundLibrary: false
        },
        alerts: {                 // 通知
            visible: true,
            alertsList: []
        },
        theme: {                  // 主题状态
            theme: 'dark'
        },
        tw: {                     // Bilup 特定状态
            customStageSize: { width: 480, height: 360 },
            isWindowFullScreen: false
        }
    },
    
    // 本地化状态
    locales: {
        locale: 'en',
        isRtl: false,
        messages: {...}
    },
    
    // 绘画编辑器状态(活动时)
    scratchPaint: {
        brushes: {...},
        selectedItems: [...],
        undoStack: [...]
    }
}
```

### 动作类型

Action 遵循模式 `CATEGORY/ACTION_NAME` ：

```javascript
// GUI 动作
'gui/SET_EDITING_TARGET'
'gui/ACTIVATE_TAB' 
'gui/SET_FULL_SCREEN'

// 项目动作
'project/LOAD_PROJECT_START'
'project/LOAD_PROJECT_SUCCESS'
'project/LOAD_PROJECT_ERROR'

// Modal actions
'modals/OPEN_EXTENSION_LIBRARY'
'modals/CLOSE_COSTUME_LIBRARY'

// Theme actions
'theme/SET_THEME'
'theme/LOAD_CUSTOM_THEME'
```

## 插件系统结构

### 插件组织

```
src/addons/
├── api.js                        # 插件 API 实现
├── hooks.js                      # 插件集成钩子
├── generated/                    # 自动生成的文件
│   ├── addon-entries.js          # 插件入口点
│   └── addon-manifests.js        # 插件元数据
└── addons/                       # 单个插件实现
    ├── editor-devtools/           # 示例插件
    │   ├── addon.json             # 插件清单
    │   ├── _runtime_entry.js      # 运行时入口点
    │   ├── userscript.js          # 主插件代码
    │   └── style.css              # 插件样式
    └── ...                        # 其他插件
```

### 插件清单结构

```json
{
    "name": "编辑器开发工具",
    "description": "块编辑器的开发者工具",
    "tags": ["development", "debugging"],
    "enabledByDefault": false,
    "userscripts": [
        {
            "url": "userscript.js",
            "matches": ["projects"]
        }
    ],
    "userstyles": [
        {
            "url": "style.css",
            "matches": ["projects"]
        }
    ],
    "settings": [
        {
            "id": "showConsole",
            "name": "显示控制台",
            "type": "boolean",
            "default": true
        }
    ]
}
```

## 构建系统结构

### Webpack 配置

构建系统使用具有多个专业配置的 Webpack：

```javascript
// webpack.config.js 结构
module.exports = {
    entry: {
        app: './src/index.js',
        // 动态插件条目自动添加
    },

    resolve: {
        alias: {
            // 开发包别名
            'scratch-vm': path.resolve(__dirname, '../scratch-vm/src'),
            'scratch-render': path.resolve(__dirname, '../scratch-render/src')
        }
    },

    module: {
        rules: [
            // JavaScript/JSX 处理
            {
                test: /\.jsx?$/,
                use: ['babel-loader']
            },

            // CSS 模块处理
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:5]'
                        }
                    },
                    'postcss-loader'
                ]
            },

            // 资源处理
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: ['file-loader']
            }
        ]
    },

    plugins: [
        // 插件处理插件
        new AddonManifestPlugin(),

        // 开发工具
        new webpack.HotModuleReplacementPlugin(),

        // 生产优化
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
```

### 构建脚本

Package.json 定义了多个构建命令：

```json
{
    "scripts": {
        "start": "webpack-dev-server --mode development",
        "build": "webpack --mode production",
        "test": "jest",
        "lint": "eslint src/",
        "format": "prettier --write src/",
        "pull": "node scripts/pull-addons.js"
    }
}
```

## 开发环境

### 本地开发设置

对于使用链接包进行本地开发：

```bash
# 克隆代码库
git clone https://github.com/Bilup/scratch-gui.git
git clone https://github.com/Bilup/scratch-vm.git
git clone https://github.com/Bilup/scratch-render.git

# 链接 VM 和 Render 到 GUI
cd scratch-vm && npm link
cd ../scratch-render && npm link
cd ../scratch-gui && npm link scratch-vm scratch-render

# 安装依赖并启动
npm ci
npm start
```

### 环境变量

开发环境可以自定义：

```bash
# .env.local
NODE_ENV=development
REACT_APP_DEBUG=true
REACT_APP_ADDON_DEV_MODE=true

# 可选的包覆盖
REACT_APP_VM_ORIGIN=http://localhost:8073
REACT_APP_RENDER_ORIGIN=http://localhost:8074
```

### 开发工具集成

```javascript
// 开发模式工具
if (process.env.NODE_ENV === 'development') {
    // 暴露调试工具
    window.vm = vm;
    window.reduxStore = store;
    window.ScratchBlocks = ScratchBlocks;

    // 启用 React DevTools
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};

    // 启用 Redux DevTools
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
```

## 测试结构

### 测试组织

```
test/
├── unit/                         # 单元测试
│   ├── components/               # 组件测试
│   ├── reducers/                 # Reducer 测试
│   └── lib/                      # 工具测试
├── integration/                  # 集成测试
│   ├── gui-integration.test.js   # 完整 GUI 测试
│   ├── vm-integration.test.js    # VM 集成测试
│   └── addon-integration.test.js # 插件系统测试
├── e2e/                          # 端到端测试
│   ├── basic-functionality.test.js
│   ├── project-loading.test.js
│   └── addon-functionality.test.js
├── fixtures/                     # 测试数据
│   ├── projects/                 # 示例项目
│   ├── assets/                   # 测试资源
│   └── mocks/                    # 模拟数据
└── setup/                        # 测试配置
    ├── jest.config.js
    ├── test-utils.js
    └── enzyme-adapter.js
```

### 测试工具

```javascript
// test/setup/test-utils.js
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../src/reducers';

export const renderWithRedux = (
    ui,
    { initialState, store = createStore(rootReducer, initialState) } = {}
) => {
    return {
        ...render(<Provider store={store}>{ui}</Provider>),
        store,
    };
};
```

## 文档结构

本文档站点使用 Docusaurus 构建，组织如下：

```
docs/
├── docs/                         # 文档内容
│   ├── getting-started/          # 入门指南
│   ├── user-guide/               # 用户文档
│   ├── development/              # 开发指南
│   ├── gui-internals/            # 技术内部文档
│   ├── api-reference/            # API 文档
│   └── legacy/                   # 保留的旧内容
├── src/                          # 自定义组件和页面
├── static/                       # 静态资源
├── docusaurus.config.js          # 站点配置
├── sidebars.js                   # 导航结构
└── package.json                  # 依赖和脚本
```

了解此结构将帮助你有效地导航代码库并为 Bilup 开发做出贡献。每个部分都有特定的目的和与其他组件的清晰接口。

---

*有关特定开发工作流程，请参阅 [构建和运行](./building-running.md) 指南。*

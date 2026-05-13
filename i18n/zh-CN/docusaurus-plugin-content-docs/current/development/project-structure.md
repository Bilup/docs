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
├── scratch-gui/          # 主 GUI 应用（基于 React 的编辑器）
├── scratch-vm/           # 虚拟机和运行时引擎
├── scratch-render/       # 基于 WebGL 的渲染引擎  
├── scratch-blocks/       # 可视化积木编辑器（基于 Blockly）
├── scratch-paint/        # 造型和背景编辑器
├── scratch-audio/        # Web Audio API 实现
├── packager/             # 基于 Web 的项目打包器
└── docs/                 # 文档网站（本网站）
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

### 文件命名约定

组件遵循一致的命名模式：

```
src/components/component-name/
├── component-name.jsx        # 主组件文件
├── component-name.css        # 组件样式
└── index.js                  # 导出文件（可选）

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
    
    // 绘画编辑器状态（活动时）
    scratchPaint: {
        brushes: {...},
        selectedItems: [...],
        undoStack: [...]
    }
}
```

### 动作类型

动作遵循模式 `CATEGORY/ACTION_NAME`：

```javascript
// GUI 动作
'gui/SET_EDITING_TARGET'
'gui/ACTIVATE_TAB' 
'gui/SET_FULL_SCREEN'

// 项目动作
'project/LOAD_PROJECT_START'
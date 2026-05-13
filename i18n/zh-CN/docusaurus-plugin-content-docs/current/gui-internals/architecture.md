---
title: 架构深入解析
sidebar_position: 2
---

# Bilup GUI 架构

本文深入介绍 Bilup 的 GUI 架构、设计模式和核心系统。

## 系统架构

### 高层概述

Bilup 遵循分层架构模式，关注点清晰分离：

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  React Components │ │    CSS Modules   │ │  Theme Engine   ││
│  │  (UI 元素)        │ │   (样式)         │ │  (外观)         ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Containers    │ │      HOCs       │ │   Middleware    ││
│  │ (数据绑定)       │ │ (横切关注点)     │ │ (副作用)        ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      State Management Layer                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  Redux Store    │ │    Reducers      │ │     Actions     ││
│  │ (全局状态)       │ │ (状态逻辑)        │ │  (状态更改)      ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        Engine Layer                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Scratch VM    │ │ Scratch Render  │ │ Scratch Blocks  ││
│  │   (运行时)       │ │ (图形)           │ │ (编辑器)        ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 核心设计原则

1. **单向数据流** - 数据向下流动，事件向上流动
2. **组件组合** - 小而可重用的组件
3. **关注点分离** - 清晰的职责边界
4. **不可变状态** - 可预测的状态变更
5. **声明式 UI** - 描述 UI 应该是什么样子
6. **性能优先** - 优化渲染和更新

## 组件架构

### 组件层次结构

```
App
├── GUI (主界面)
│   ├── MenuBar
│   ├── GUI Body
│   │   ├── Blocks Panel
│   │   │   ├── Blocks Tabs
│   │   │   └── Blocks Workspace
│   │   └── Stage Panel
│   │       ├── Stage Header
│   │       ├── Stage Wrapper
│   │       │   └── Stage Canvas
│   │       └── Target Pane
│   │           ├── Sprite Selector
│   │           └── Stage Selector
│   └── Modals
│       ├── Extension Library
│       ├── Costume Library
│       ├── Sound Library
│       └── Settings Modal
└── Global Components
    ├── Alerts
    ├── Drag Layer
    └── Connection Modal
```

### 组件类型

#### 展示组件
专注于外观的纯 UI 组件：

```jsx
// 示例：按钮组件
const Button = ({ children, onClick, disabled, className }) => (
    <button
        className={classNames(styles.button, className)}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
);
```

#### 容器组件
连接到 Redux store 获取数据：

```jsx
// 示例：连接的角色选择器
const SpriteSelectorContainer = connect(
    state => ({
        sprites: state.targets.sprites,
        selectedSprite: state.targets.editingTarget
    }),
    dispatch => ({
        onSelectSprite: id => dispatch(setEditingTarget(id))
    })
)(SpriteSelector);
```

#### 高阶组件 (HOCs)
用额外功能包装组件：

```jsx
// 示例：错误边界 HOC
const withErrorBoundary = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
            return { hasError: true };
        }

        render() {
            if (this.state.hasError) {
                return <ErrorDisplay />;
            }
            return <WrappedComponent {...this.props} />;
        }
    };
};
```

## 状态管理架构

### Redux Store 结构

```js
{
    // 项目和加载状态
    scratchGui: {
        projectState: {
            loadingState: 'SHOWING_WITH_ID',
            projectId: '12345',
            error: null
        },

        // 编辑器状态
        editorTab: {
            activeTabIndex: 0 // 0=代码, 1=造型, 2=声音
        },

        // 目标(角色/舞台)状态
        targets: {
            sprites: {...},
            stage: {...},
            editingTarget: 'sprite1'
        },

        // UI 状态
        mode: {
            isFullScreen: false,
            isPlayerOnly: false,
            isEmbedded: false
        },

        // 模态框可见性
        modals: {
            extensionLibrary: false,
            costumeLibrary: false,
            soundLibrary: false,
            settings: false
        },

        // 警告和通知
        alerts: {
            visible: true,
            alertsList: []
        },

        // Bilup 特定状态
        tw: {
            theme: 'dark',
            customStageSize: { width: 480, height: 360 },
            isWindowFullScreen: false
        }
    },

    // 本地化
    locales: {
        locale: 'en',
        isRtl: false,
        messages: {...}
    }
}
```

### 数据流模式

#### 标准 Redux 流程
```
用户操作 → 组件 → 容器 → Action Creator → 归约器 → Store → 组件
```

#### VM 集成流程
```
VM 事件 → VM 监听器 HOC → Redux Action → 归约器 → Store → 组件
```

#### 插件集成流程
```
插件 → 插件 API → 组件修改/事件 → Redux/VM 集成
```

## 引擎集成

### VM (虚拟机) 集成

GUI 通过定义良好的接口与 Scratch VM 通信：

```jsx
class GUI extends React.Component {
    componentDidMount() {
        // 初始化 VM 监听器
        this.props.vm.on('PROJECT_LOADED', this.handleProjectLoaded);
        this.props.vm.on('PROJECT_START', this.handleProjectStart);
        this.props.vm.on('PROJECT_STOP_ALL', this.handleProjectStop);

        // 设置渲染器
        this.props.vm.attachRenderer(this.renderer);
        this.props.vm.attachAudioEngine(this.audioEngine);
    }

    handleProjectLoaded = () => {
        this.props.onProjectLoaded();
        this.updateTargets();
    };
}
```

### 渲染器集成

图形渲染由 scratch-render 处理：

```jsx
class Stage extends React.Component {
    componentDidMount() {
        // 初始化渲染器
        this.renderer = new ScratchRender(this.canvas);
        this.props.vm.attachRenderer(this.renderer);

        // 设置事件处理器
        this.attachMouseEvents();
        this.attachKeyboardEvents();
    }

    attachMouseEvents() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
    }
}
```

### 积木集成

可视化积木编辑器与 Blockly 集成：

```jsx
class Blocks extends React.Component {
    componentDidMount() {
        // 初始化 Blockly 工作区
        this.ScratchBlocks = VMScratchBlocks(this.props.vm);
        this.workspace = this.ScratchBlocks.inject(this.blocksContainer);

        // 设置积木变化监听器
        this.workspace.addChangeListener(this.handleBlocksChange);
    }

    handleBlocksChange = (event) => {
        if (event.type === 'create' || event.type === 'delete') {
            this.updateVM();
        }
    };
}
```

## 插件系统架构

### 插件加载管道

```
插件清单 → 插件加载器 → 运行时入口 → API 注入 → 组件修改
```

### 插件 API 结构

```js
class AddonAPI {
    constructor(addonId, tab) {
        this.addonId = addonId;
        this.tab = tab;
        this.settings = new AddonSettings(addonId);
        this.msg = new AddonMessage(addonId);
    }

    // 用于 DOM 操作的 Tab API
    get tab() {
        return {
            waitForElement: (selector) => {...},
            appendToSharedSpace: (config) => {...},
            createEditorModal: (config) => {...}
        };
    }

    // 设置 API
    get settings() {
        return {
            get: (key) => {...},
            addEventListener: (type, callback) => {...}
        };
    }
}
```

### 插件集成点

插件可以在多个层面集成：

1. **DOM 操作** - 直接 UI 修改
2. **组件包装** - 高阶组件注入
3. **Redux 集成** - 状态监控和修改
4. **VM 集成** - 运行时行为修改
5. **CSS 注入** - 样式修改

## 主题系统架构

### CSS 变量系统

Bilup 使用 CSS 自定义属性进行主题化：

```css
:root {
    /* 颜色调色板 */
    --ui-primary: #4c97ff;
    --ui-secondary: #855cd6;
    --ui-white: #ffffff;
    --ui-black: #000000;

    /* 语义颜色 */
    --text-primary: var(--ui-black);
    --background-primary: var(--ui-white);
    --border-color: #d9d9d9;

    /* 组件特定 */
    --menu-bar-background: var(--ui-primary);
    --blocks-background: #f9f9f9;
    --stage-background: var(--ui-white);
}

[theme="dark"] {
    --text-primary: var(--ui-white);
    --background-primary: #1e1e1e;
    --border-color: #404040;
}
```

### 主题引擎

```js
class ThemeManager {
    constructor() {
        this.themes = new Map();
        this.currentTheme = 'light';
    }

    registerTheme(name, variables) {
        this.themes.set(name, variables);
    }

    applyTheme(name) {
        const theme = this.themes.get(name);
        if (!theme) return;

        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });

        this.currentTheme = name;
    }
}
```

## 性能架构

### 渲染优化

1. **React.memo** - 防止不必要的重渲染
2. **useMemo/useCallback** - 记忆化昂贵计算
3. **虚拟滚动** - 高效处理大型列表
4. **代码分割** - 按需加载组件

### 内存管理

```js
class ComponentManager {
    componentDidMount() {
        // 设置监听器
        this.vm.on('PROJECT_LOADED', this.handleProjectLoaded);
    }

    componentWillUnmount() {
        // 清理监听器防止内存泄漏
        this.vm.off('PROJECT_LOADED', this.handleProjectLoaded);

        // 取消待处理请求
        this.abortController.abort();
    }
}
```

### 包优化

- **Tree Shaking** - 移除未使用的代码
- **代码分割** - 按路由/功能分割包
- **动态导入** - 按需加载插件
- **资源优化** - 压缩图像和字体

## 错误处理架构

### 错误边界

```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // 记录错误到监控服务
        console.error('Component Error:', error, errorInfo);

        // 报告到分析服务
        this.reportError(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}
```

### 全局错误处理

```js
// 全局错误处理器
window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    // 报告到监控服务
});

// 未处理的 Promise 拒绝处理器
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // 报告到监控服务
});
```

## 测试架构

### 测试策略

1. **单元测试** - 单个组件行为
2. **集成测试** - 组件交互
3. **端到端测试** - 完整用户流程
4. **视觉回归测试** - UI 一致性
5. **性能测试** - 渲染时间和内存使用

### 测试结构

```js
// 组件测试示例
describe('Button Component', () => {
    it('正确渲染', () => {
        const { getByText } = render(
            <Button onClick={jest.fn()}>
                点击我
            </Button>
        );

        expect(getByText('点击我')).toBeInTheDocument();
    });

    it('点击时调用 onClick', () => {
        const handleClick = jest.fn();
        const { getByText } = render(
            <Button onClick={handleClick}>
                点击我
            </Button>
        );

        fireEvent.click(getByText('点击我'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
```

## 安全架构

### 内容安全策略

```js
// CSP 配置
const cspDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'"], // VM 需要
    styleSrc: ["'self'", "'unsafe-inline'"], // 主题需要
    imgSrc: ["'self'", "data:", "blob:"],
    connectSrc: ["'self'", "https://api.scratch.mit.edu"]
};
```

### 插件安全

```js
// 插件沙箱
class AddonSandbox {
    executeAddon(addonCode, api) {
        // 创建受限环境
        const sandbox = {
            addon: api,
            console: this.createRestrictedConsole(),
            // 无法直接访问 window, document
        };

        // 在沙箱中执行
        const execute = new Function(
            'addon', 'console',
            addonCode
        );

        execute(sandbox.addon, sandbox.console);
    }
}
```

此架构为 Bilup 强大、可扩展且高性能的 GUI 系统提供了基础。每一层都有清晰的职责和接口，实现了可维护和可扩展的开发。

---

*具体实现细节请参阅各个组件和系统文档部分。*

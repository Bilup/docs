---
slug: /api-reference/
title: API 参考概述
sidebar_position: 1
---

# Bilup API 参考

本节提供 Bilup 中所有可用 API 的全面文档，包括虚拟机 API、GUI API、扩展 API 和插件 API。

## API 分类

### 🔧 [VM API](./vm-api.md)
虚拟机 API 提供对项目执行、角色和运行时行为的程序化控制。

### 🎨 [GUI API](./gui-api.md)
GUI API 允许与用户界面交互，包括组件、模态框和编辑器状态。

### 🧩 [扩展 API](./extension-api.md)
扩展 API 支持创建与 Scratch 编程环境集成的自定义积木和扩展。

### 🔌 [插件 API](./addon-api.md)
插件 API 提供用于修改和扩展 Bilup 界面和行为的工具。

### 📡 [事件](./events.md)
用于在 Bilup 中监听和派发事件的综合事件系统文档。

### 🧵 [线程 API](./threads.md)
高级线程管理，用于控制脚本执行、监控线程和管理执行流程。

### 🛠️ [工具函数](./utilities.md)
Bilup 代码库中可用的工具函数和辅助函数集合。

## 快速开始

### 访问 API

Bilup 公开了几个全局对象用于 API 访问：

```javascript
// 虚拟机实例
const vm = window.vm;

// GUI 状态的 Redux store(注意：ReduxStore 中的 R 大写)
const store = window.ReduxStore;

// Scratch 积木(可用时)
const ScratchBlocks = window.ScratchBlocks;

// 注意：window.addons 不作为全局变量可用。
// 插件在插件上下文中有自己的 API。
```

### 基本用法示例

#### VM API 示例
```javascript
// 启动项目
vm.start();

// 获取所有角色
const sprites = vm.runtime.targets.filter(target => !target.isStage);

// 监听项目事件
vm.on('PROJECT_START', () => {
    console.log('项目已启动!');
});
```

#### GUI API 示例
```javascript
// 访问 Redux store(注意：ReduxStore 中的 R 大写)
const state = store.getState();

// 获取当前编辑目标
const editingTarget = state.scratchGui.targets.editingTarget;

// 派发动作
store.dispatch({
    type: 'SET_EDITING_TARGET',
    targetId: 'sprite1'
});
```

#### 扩展 API 示例
```javascript
class MyExtension {
    getInfo() {
        return {
            id: 'myextension',
            name: '我的扩展',
            blocks: [
                {
                    opcode: 'myBlock',
                    blockType: 'command',
                    text: '我的自定义积木'
                }
            ]
        };
    }
    
    myBlock() {
        console.log('自定义积木已执行!');
    }
}
```

#### 插件 API 示例
```javascript
export default async function ({ addon, msg }) {
    // 等待元素出现
    const button = await addon.tab.waitForElement('.green-flag');
    
    // 添加点击监听器
    button.addEventListener('click', () => {
        console.log('绿旗被点击!');
    });
    
    // 添加 CSS
    addon.tab.addCSS(`
        .green-flag {
            background-color: red !important;
        }
    `);
}
```

## API 设计原则

### 一致性
所有 Bilup API 遵循一致的模式：

- **命名**：方法使用 camelCase，事件使用 kebab-case
- **参数**：复杂参数使用对象，简单参数使用基本类型
- **返回值**：异步操作返回 Promise，同步操作返回直接值
- **错误处理**：一致的错误类型和消息

### 向后兼容性
Bilup 保持向后兼容性：

- **弃用警告**：旧 API 在移除前显示警告
- **过渡期**：提供足够的迁移时间
- **文档**：提供清晰的 API 变更迁移指南

### 类型安全
所有 API 都提供 TypeScript 定义：

```typescript
interface VMAPI {
    start(): void;
    stop(): void;
    greenFlag(): void;
    runtime: Runtime;
}

interface ExtensionInfo {
    id: string;
    name: string;
    blocks: BlockDefinition[];
    menus?: MenuDefinition[];
}
```

## 认证与安全

### 扩展安全
扩展在不同的安全上下文中运行：

```javascript
// 沙盒化扩展(安全，有限访问)
class SafeExtension {
    // 有限的 API 访问
    // 无 DOM 访问
    // 无网络访问(除了已批准的域名)
}

// 非沙盒化扩展(功能强大，需要用户许可)
class PowerfulExtension {
    // 完整的 API 访问
    // 允许 DOM 操作
    // 允许网络访问
}
```

### 插件安全
插件对 Bilup 内部有受控访问：

```javascript
// 插件清单安全设置
{
    "permissions": ["DOM", "CSS", "redux"],
    "unsafeAccess": false,
    "trustedDomains": ["example.com"]
}
```

## 速率限制

某些 API 有速率限制以防止滥用：

```javascript
// VM 操作：每秒 1000 次调用
vm.runtime.startHats(...); // 有限速

// GUI 更新：最大 60 FPS
store.dispatch(...); // 为性能进行批处理

// 网络请求：每秒 10 次
fetch('https://api.example.com'); // 有限速
```

## 错误处理

### 错误类型

```javascript
// VM 错误
class VMError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'VMError';
        this.code = code;
    }
}

// GUI 错误  
class GUIError extends Error {
    constructor(message, component) {
        super(message);
        this.name = 'GUIError';
        this.component = component;
    }
}

// 扩展错误
class ExtensionError extends Error {
    constructor(message, extensionId) {
        super(message);
        this.name = 'ExtensionError';
        this.extensionId = extensionId;
    }
}
```

### 错误处理模式

```javascript
// 同步操作的 try-catch
try {
    vm.start();
} catch (error) {
    if (error instanceof VMError) {
        console.error('VM 错误:', error.message);
    }
}

// 异步操作的 Promise catch
vm.loadProject(projectData)
    .then(() => console.log('项目已加载'))
    .catch(error => console.error('加载失败:', error));

// 基于事件的错误处理
vm.on('ERROR', (error) => {
    console.error('VM 错误:', error);
});
```

## 性能考虑

### 高效 API 使用

```javascript
// ❌ 低效：多个单独调用
sprites.forEach(sprite => {
    // 注意：vm.runtime.setEditingTarget 不存在
    // 改用正确的目标选择方法
    vm.runtime.targets.forEach(target => {
        if (target.id === sprite.id) {
            // 对目标执行操作
        }
    });
});

// ✅ 高效：单次迭代
vm.runtime.targets.forEach(target => {
    if (!target.isStage) {
        // 执行角色操作
    }
});
```

### 内存管理

```javascript
// ❌ 内存泄漏：未移除监听器
vm.on('PROJECT_START', myHandler);

// ✅ 正确清理
vm.on('PROJECT_START', myHandler);
// 稍后...
vm.off('PROJECT_START', myHandler);
```

## 调试 API

### 调试模式

```javascript
// 启用调试模式
window.DEBUG = true;

// VM 检查工具(这些是您可以访问的示例)
window.vmDebug = {
    inspectTarget: (targetId) => vm.runtime.getTargetById(targetId),
    inspectRuntime: () => vm.runtime,
    inspectTargets: () => vm.runtime.targets
};

// GUI 检查工具  
window.guiDebug = {
    inspectState: () => window.ReduxStore.getState(),
    inspectComponent: (selector) => document.querySelector(selector)
};
```

### 开发工具

```javascript
// VM 检查工具
window.vmDebug = {
    inspectTarget: (targetId) => vm.runtime.getTargetById(targetId),
    inspectRuntime: () => vm.runtime,
    inspectTargets: () => vm.runtime.targets
};

// GUI 检查工具  
window.guiDebug = {
    inspectState: () => window.ReduxStore.getState(),
    inspectComponent: (selector) => document.querySelector(selector)
};
```

## API 版本控制

Bilup 对 API 变更使用语义化版本控制：

```javascript
// 检查 API 版本
const apiVersion = window.Bilup.API_VERSION; // "2.1.0"

// 版本兼容性检查
if (semver.gte(apiVersion, '2.0.0')) {
    // 使用新 API 功能
    vm.runtime.newFeature();
} else {
    // 回退到旧 API
    vm.runtime.oldFeature();
}
```

## 迁移指南

当 API 变更时，提供迁移指南：

### 从 v1.x 到 v2.x
```javascript
// 旧 API (v1.x)
vm.loadProject(projectData, callback);

// 新 API (v2.x)
await vm.loadProject(projectData);
```

### 扩展 API 变更
```javascript
// 旧扩展 API
class OldExtension {
    getBlocks() { /* ... */ }
}

// 新扩展 API  
class NewExtension {
    getInfo() { /* ... */ }
}
```

## 最佳实践

### API 使用指南

1. **在使用高级功能前检查 API 可用性**
2. **使用适当的错误消息优雅地处理错误**
3. **在组件卸载时清理资源**
4. **对多个相关更改使用批处理操作**
5. **遵循扩展和插件的安全指南**

### 性能提示

1. **限制高频操作**以避免使系统过载
2. **对昂贵计算使用记忆化**
3. **对大数据集实现延迟加载**
4. **监控内存使用**并正确清理

### 安全考虑

1. **在传递给 API 之前验证所有输入**
2. **对不受信任的扩展使用沙盒模式**
3. **为插件请求最小权限**
4. **在显示前清理用户内容**

---

*有关特定 API 的详细信息，请使用侧边栏导航到各个 API 文档页面。*
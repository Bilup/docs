---
title: 工具函数
sidebar_position: 6
---

# 可用工具函数

本页记录了 Bilup 代码库中实际可用的工具函数和辅助函数。

## 项目操作

### 项目加载和保存
以下项目操作可通过 VM 和 GUI API 使用：

```javascript
// 加载项目（通过 VM API 可用）
await vm.loadProject(projectData);

// 保存项目状态
const projectData = vm.toJSON();

// 下载项目为 SB3（通过 GUI 组件）
// 这通常由 GUI 组件如 SB3Downloader 处理
```

## 浏览器 API 和 DOM 工具函数

### 基本 DOM 操作
标准 DOM API 可用于插件开发：

```javascript
// 元素选择
const element = document.querySelector('.selector');
const elements = document.querySelectorAll('.selector');

// 元素创建
const button = document.createElement('button');
button.textContent = '点击我';
button.className = 'custom-button';

// 事件处理
element.addEventListener('click', handleClick);
```

### 插件专用工具函数
插件通过插件 API 可访问专用工具函数：

```javascript
export default async function ({ addon, msg }) {
    // 等待元素（插件专用工具）
    const button = await addon.tab.waitForElement('.green-flag');
    
    // 添加 CSS（插件专用工具）
    addon.tab.addCSS(`
        .green-flag {
            background-color: red !important;
        }
    `);
    
    // 通过插件上下文访问 VM
    const vm = addon.tab.traps.vm;
}
```

## 可用的第三方工具函数

### Lodash 函数
代码库中提供了一些 lodash 工具函数：

```javascript
import bindAll from 'lodash.bindall';

// 将方法绑定到实例
bindAll(this, ['method1', 'method2']);
```

### 存储 API
通过 Storage API 进行浏览器存储：

```javascript
// 本地存储
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');

// 会话存储  
sessionStorage.setItem('key', 'value');
```

## Redux Store 操作

### 访问 Store
Redux store 全局可用：

```javascript
// 访问 store（注意：ReduxStore 中的 R 大写）
const store = window.ReduxStore;

// 获取当前状态
const state = store.getState();

// 派发动作
store.dispatch({
    type: 'ACTION_TYPE',
    payload: data
});
```

### 常见状态选择器
```javascript
// 获取 VM 状态
const vm = state.scratchGui.vm;

// 获取当前项目状态
const projectState = state.scratchGui.projectState;

// 获取目标/角色
const targets = state.scratchGui.targets;
```

## VM 工具函数

### 目标管理
```javascript
// 获取所有目标
const targets = vm.runtime.targets;

// 获取角色（非舞台目标）
const sprites = vm.runtime.targets.filter(target => !target.isStage);

// 获取舞台
const stage = vm.runtime.targets.find(target => target.isStage);

// 按 ID 获取目标
const target = vm.runtime.getTargetById(targetId);
```

### 项目控制
```javascript
// 启动/停止项目
vm.start();
vm.stop();

// 绿旗
vm.greenFlag();

// 设置 turbo 模式
vm.setTurboMode(true);
```

## 事件处理

### VM 事件
```javascript
// 监听 VM 事件
vm.on('PROJECT_LOADED', () => {
    console.log('项目已加载');
});

vm.on('PROJECT_CHANGED', () => {
    console.log('项目已更改');
});

vm.on('PROJECT_START', () => {
    console.log('项目已启动');
});

vm.on('PROJECT_STOP_ALL', () => {
    console.log('项目已停止');
});
```

### 标准 DOM 事件
```javascript
// 标准事件监听器
document.addEventListener('keydown', handleKeyDown);
window.addEventListener('resize', handleResize);
element.addEventListener('click', handleClick);
```

## 文件操作

### 文件 API
现代浏览器提供 File API 访问：

```javascript
// 文件输入处理
const input = document.createElement('input');
input.type = 'file';
input.accept = '.sb3,.sb2';

input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            // 处理文件数据
        };
        reader.readAsArrayBuffer(file);
    }
});
```

### Blob 和 URL 操作
```javascript
// 创建 blob
const blob = new Blob([data], { type: 'application/json' });

// 创建下载 URL
const url = URL.createObjectURL(blob);

// 触发下载
const a = document.createElement('a');
a.href = url;
a.download = 'project.sb3';
a.click();

// 清理
URL.revokeObjectURL(url);
```

## 性能考虑

### 内存管理
```javascript
// 清理事件监听器
element.removeEventListener('click', handler);

// 清理 VM 监听器
vm.off('PROJECT_LOADED', handler);

// 清理对象 URL
URL.revokeObjectURL(url);
```

### 高效操作
```javascript
// 对动画使用 requestAnimationFrame
function animate() {
    // 动画代码
    requestAnimationFrame(animate);
}

// 对频繁事件使用防抖（手动实现）
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

## 可用全局变量

Bilup 中可用的全局变量如下：

```javascript
// VM 实例
window.vm

// Redux store（注意：R 大写）
window.ReduxStore  

// Scratch Blocks（积木加载时可用）
window.ScratchBlocks

// 调试标志
window.DEBUG
```

## 最佳实践

### 错误处理
```javascript
try {
    // 有风险的操作
    vm.loadProject(projectData);
} catch (error) {
    console.error('操作失败:', error);
    // 适当处理错误
}
```

### 异步操作
```javascript
// 对 Promise 使用 async/await
async function loadProject() {
    try {
        await vm.loadProject(projectData);
        console.log('项目加载成功');
    } catch (error) {
        console.error('加载项目失败:', error);
    }
}
```

### 资源清理
```javascript
// 始终清理资源
function cleanup() {
    // 移除事件监听器
    element.removeEventListener('click', handler);
    
    // 清除定时/间隔
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    
    // 移除 VM 监听器
    vm.off('PROJECT_LOADED', handler);
}
```

## 相关文档

- [VM API 参考](./vm-api)
- [插件 API 参考](./addon-api)  
- [GUI API 参考](./gui-api)
- [开发指南](../development)
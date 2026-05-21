---
title: GUI API 参考
sidebar_position: 2
---

# GUI API 参考

Bilup GUI 提供对界面组件、主题、项目管理和 VM 集成的程序化访问。此 API 主要用于扩展、插件和高级集成。

## 核心 GUI 实例

### Redux Store 访问

GUI 状态通过 Redux 管理，可通过全局 store 访问：

```javascript
// 访问 Redux store(注意：ReduxStore 中的 R 大写)
const store = window.ReduxStore;

// 获取当前状态
const state = store.getState();

// 访问 GUI 状态的不同部分
const projectState = state.scratchGui.projectState;
const targets = state.scratchGui.targets;
const projectChanged = state.scratchGui.projectChanged;
```

## ScratchBlocks 集成

### window.ScratchBlocks

访问 ScratchBlocks/Blockly 工作区(可用时)：

```javascript
// 访问 ScratchBlocks(可用时)
const ScratchBlocks = window.ScratchBlocks;

if (ScratchBlocks) {
    // 访问主工作区
    const workspace = ScratchBlocks.getMainWorkspace();
    
    // 获取工作区中的所有积木
    const blocks = workspace.getAllBlocks();
}
```

### 加载 ScratchBlocks

ScratchBlocks 由 GUI 懒加载。当打开积木标签时可用：

```javascript
// ScratchBlocks 在积木加载后可用
if (window.ScratchBlocks) {
    console.log('ScratchBlocks is available');
} else {
    console.log('ScratchBlocks not yet loaded');
}
```

## 状态管理

### Redux 状态访问

通过 Redux store 访问和修改 GUI 状态：

```javascript
// 获取当前状态
const state = store.getState();

// 获取当前主题
const currentTheme = state.scratchGui.theme.theme;

// 派发动作以更改状态
store.dispatch({
    type: 'scratch-gui/theme/SET_THEME',
    theme: 'dark'
});

// 可用主题
const themes = ['light', 'dark', 'midnight'];
```

### 状态结构

Redux 状态包含各种 GUI 相关数据：

```javascript
const guiState = {
    // 项目状态
    projectState: state.scratchGui.projectState,
    
    // 主题信息
    theme: state.scratchGui.theme,
    
    // VM 实例
    vm: state.scratchGui.vm,
    
    // 项目标题和元数据
    projectTitle: state.scratchGui.projectTitle,
    projectChanged: state.scratchGui.projectChanged
};
```

### 常见动作

派发常见的 GUI 动作：

```javascript
// 设置编辑目标
store.dispatch({
    type: 'scratch-gui/targets/SET_EDITING_TARGET',
    targetId: 'sprite1'
});

// 设置项目标题
store.dispatch({
    type: 'scratch-gui/project-title/SET_PROJECT_TITLE',
    title: 'My Project'
});

// 将项目标记为已更改
store.dispatch({
    type: 'scratch-gui/project-changed/SET_PROJECT_CHANGED'
});
```

## 项目管理

### 项目状态

通过 Redux 访问项目信息：

```javascript
const state = store.getState().scratchGui.projectState;

// 项目属性
const projectId = state.projectId;
const loadingState = state.loadingState;

// 从状态的不同位置获取项目标题
const projectTitle = store.getState().scratchGui.projectTitle;
const hasUnsavedChanges = store.getState().scratchGui.projectChanged;
```

### 项目动作

项目操作通常由组件处理，而不是直接的 API 调用：

```javascript
// 项目动作通过 Redux reducers 处理
// 大多数项目操作需要用户交互

// 示例：请求新项目(内部使用)
store.dispatch({
    type: 'scratch-gui/project-state/START_FETCHING_NEW'
});

// 项目加载通常由文件上传组件处理
// 而不是直接的 API 调用
```

## VM 集成

### 虚拟机访问

访问 Scratch VM 实例：

```javascript
// 从 Redux 状态获取 VM 实例
const vm = store.getState().scratchGui.vm;

// 或从全局直接访问
const vm = window.vm;

// VM 操作
vm.greenFlag(); // 启动项目
vm.stopAll();   // 停止项目
vm.setTurboMode(true); // 启用 turbo 模式

// 加载项目数据
await vm.loadProject(projectData);
```

### 目标管理

管理角色和舞台：

```javascript
// 获取目标(角色 + 舞台)
const targets = vm.runtime.targets;
const stage = vm.runtime.getTargetForStage();
const sprites = vm.runtime.getSpriteTargets();

// 获取编辑目标
const editingTarget = vm.editingTarget;

// 设置编辑目标
vm.setEditingTarget(targetId);
```

### 监视器

控制变量和列表监视器：

```javascript
// 获取监视器
const monitors = vm.runtime._monitorState;

// 显示/隐藏监视器
vm.requestAddMonitor({
    id: 'variableId',
    spriteName: null, // null 表示全局变量
    opcode: 'data_variable'
});

vm.requestRemoveMonitor('variableId');
```

## GUI 组件

### 模态框管理

控制模态对话框：

```javascript
// 打开模态框
store.dispatch({ type: 'scratch-gui/modals/OPEN_EXTENSION_LIBRARY' });
store.dispatch({ type: 'scratch-gui/modals/OPEN_COSTUME_LIBRARY' });

// 关闭模态框
store.dispatch({ type: 'scratch-gui/modals/CLOSE_EXTENSION_LIBRARY' });
store.dispatch({ type: 'scratch-gui/modals/CLOSE_COSTUME_LIBRARY' });
```

### 标签管理

在编辑器标签之间切换：

```javascript
// 标签索引
const BLOCKS_TAB = 0;
const COSTUMES_TAB = 1; 
const SOUNDS_TAB = 2;

// 激活标签
store.dispatch({
    type: 'scratch-gui/editor-tab/ACTIVATE_TAB',
    activeTabIndex: COSTUMES_TAB
});
```

### 舞台尺寸控制

管理舞台尺寸：

```javascript
// 设置舞台尺寸模式
store.dispatch({
    type: 'scratch-gui/stage-size/SET_STAGE_SIZE',
    stageSize: 'large' // 'small', 'large'
});

// 自定义舞台尺寸
store.dispatch({
    type: 'scratch-gui/custom-stage-size/SET_CUSTOM_STAGE_SIZE',
    width: 480,
    height: 360
});
```

## 扩展集成

### 自定义扩展

加载自定义扩展：

```javascript
// 从 URL 加载扩展
vm.extensionManager.loadExtensionURL('https://example.com/extension.js');

// 从文本加载扩展
vm.extensionManager.loadExtensionFromText(extensionCode, 'extensionName');
```

### 扩展库

管理扩展库可见性：

```javascript
// 显示扩展库
store.dispatch({
    type: 'scratch-gui/modals/OPEN_EXTENSION_LIBRARY'
});

// 处理扩展选择
const handleExtensionSelect = (extensionId) => {
    vm.extensionManager.loadExtensionIdSync(extensionId);
};
```

## 事件处理

### GUI 事件

监听 GUI 状态变化：

```javascript
// 订阅 store 变化
const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    // 处理状态变化
});

// 完成后取消订阅
unsubscribe();
```

### VM 事件

监听 VM 事件：

```javascript
// 项目事件
vm.on('PROJECT_LOADED', () => {
    console.log('Project loaded');
});

vm.on('PROJECT_CHANGED', () => {
    console.log('Project modified');
});

// 目标事件  
vm.on('targetsUpdate', (data) => {
    console.log('Targets updated:', data.targetList);
});

// 监视器事件
vm.on('MONITORS_UPDATE', (monitors) => {
    console.log('Monitors updated:', monitors);
});
```

## 资源管理

### 造型操作

管理角色造型：

```javascript
// 向目标添加造型
vm.addCostume(costumeId, costume, targetId);

// 删除造型
vm.deleteCostume(costumeId);

// 设置活动造型
vm.setActiveCostume(targetId, costumeId);
```

### 声音操作

管理角色声音：

```javascript
// 向目标添加声音
vm.addSound(sound, targetId);

// 删除声音
vm.deleteSound(soundId);

// 播放声音
vm.runtime.audioEngine.playSound(sound);
```

## 性能监控

### 指标访问

访问性能数据：

```javascript
// 运行时指标
const metrics = vm.runtime.stats;
console.log('FPS:', metrics.fps);
console.log('Frame count:', metrics.frameCount);

// 工作区指标
const workspaceMetrics = store.getState().scratchGui.workspaceMetrics;
```

### 内存使用

监控内存消耗：

```javascript
// 检查内存使用
if (performance.memory) {
    console.log('Used heap:', performance.memory.usedJSHeapSize);
    console.log('Total heap:', performance.memory.totalJSHeapSize);
}
```

## 错误处理

### 错误边界

处理 GUI 错误：

```javascript
// 设置错误处理
window.addEventListener('error', (event) => {
    console.error('GUI Error:', event.error);
});

// React 错误边界
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise:', event.reason);
});
```

### VM 错误处理

处理 VM 运行时错误：

```javascript
vm.on('RUNTIME_ERROR', (error) => {
    console.error('VM Runtime Error:', error);
});

vm.on('COMPILE_ERROR', (error) => {
    console.error('VM Compile Error:', error);  
});
```

## 开发工具

### 调试工具

访问调试功能：

```javascript
// 启用调试模式
window.DEBUG = true;

// 访问内部组件
window._gui = gui;
window._vm = vm;
window._blockly = blockly;

// 性能分析
window.guiProfiler = {
    startProfile: () => performance.mark('profile-start'),
    endProfile: () => {
        performance.mark('profile-end');
        performance.measure('profile', 'profile-start', 'profile-end');
    }
};
```

### Redux DevTools

当 Redux DevTools 可用时：

```javascript
// 访问 Redux DevTools
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__;
if (devTools) {
    // DevTools 可用
    console.log('Redux DevTools detected');
}
```

## 类型定义

TypeScript 用户参考：

```typescript
interface GUIInstance {
    store: ReduxStore;
    getBlockly(): Promise<ScratchBlocks>;
    getBlocklyEagerly(): Promise<ScratchBlocks>;
    handleFileUpload(file: File): void;
    setCustomTheme(theme: ThemeConfig): void;
}

interface ThemeConfig {
    name: string;
    gui: GUITheme;
    blocks: BlockTheme;
    accent: AccentTheme;
    id: string;
}

interface VMInstance {
    runtime: Runtime;
    editingTarget: Target;
    greenFlag(): void;
    stopAll(): void;
    loadProject(data: ArrayBuffer): Promise<void>;
    setTurboMode(enabled: boolean): void;
}
```

## 渲染器 API 访问

### Canvas 操作

访问渲染器画布和坐标转换：

```javascript
// 获取画布尺寸
const canvas = vm.renderer.canvas;
const width = canvas.width;
const height = canvas.height;

// 访问原生尺寸
const nativeSize = vm.renderer._nativeSize; // [width, height]

// 提取坐标处的像素颜色
const colorData = vm.renderer.extractColor(x, y, radius);
const pixelColor = colorData.color; // {r, g, b, a}
```

### 图层管理

控制渲染图层顺序：

```javascript
// 设置图层组顺序
vm.renderer.setLayerGroupOrdering(['background', 'video', 'pen', 'sprite']);

// 访问图层配置
const layerGroups = vm.renderer._layerGroups;
```

## 高级运行时 API

### 目标管理

访问和操作角色与舞台：

```javascript
// 按名称获取角色
const sprite = vm.runtime.getSpriteTargetByName('Sprite1');

// 获取舞台目标
const stage = vm.runtime.getTargetForStage();

// 删除角色
vm.deleteSprite(targetId);

// 导出角色
const spriteBlob = await vm.exportSprite(targetId);
```

### 项目操作

保存和加载项目：

```javascript
// 保存项目为 SB3 blob
const projectBlob = await vm.saveProjectSb3();

// 从缓冲区加载项目
await vm.loadProject(arrayBuffer);

// 获取项目为 JSON
const projectData = vm.toJSON();
```

### 造型和声音管理

管理目标资源：

```javascript
// 按索引删除造型
target.deleteCostume(costumeIndex);

// 按名称获取造型索引
const index = target.getCostumeIndexByName('costume1');

// 按索引删除声音  
target.deleteSound(soundIndex);

// 访问角色声音
const sounds = target.sprite.sounds;
```

### 帧率控制

控制动画帧率：

```javascript
// 设置无限制帧率
vm.runtime.frameLoop.framerate = 60;
vm.runtime.frameLoop._restart();
```

## 高级线程管理

### 线程控制

VM 运行时提供高级线程管理功能，用于控制脚本执行：

```javascript
// 获取所有活动线程
const activeThreads = vm.runtime.threads;

// 检查线程是否活动
const isActive = vm.runtime.isActiveThread(thread);

// 停止特定线程
thread.stopThisScript();

// 重启线程
vm.runtime._restartThread(thread);

// 推送新线程执行
const newThread = vm.runtime._pushThread(blockId, target, options);
```

### 线程属性

线程对象包含执行状态和上下文：

```javascript
// 线程属性
console.log(thread.topBlock);      // 起始积木 ID
console.log(thread.target);        // 目标角色/舞台
console.log(thread.blockContainer); // 积木容器
console.log(thread.stack);         // 执行栈
console.log(thread.stackFrames);   // 栈帧

// 线程状态常量
const Thread = vm.runtime.sequencer.constructor.prototype.constructor;
console.log(Thread.STATUS_RUNNING);
console.log(Thread.STATUS_YIELD);
console.log(Thread.STATUS_DONE);
```

### 自定义线程数据存储

在线程上下文中存储自定义数据：

```javascript
// 在线程中存储数据
if (!thread.customStorage) thread.customStorage = {};
thread.customStorage['myKey'] = 'myValue';

// 检索存储的数据
const value = thread.customStorage?.['myKey'];
```

### 线程执行控制

控制线程步进和执行：

```javascript
// 手动步进线程
vm.runtime.sequencer.stepThread(thread);

// 控制线程步进
thread.dontStepJustThisOneTime = true; // 跳过下一步

// 强制线程编译(如果启用编译器)
if (thread.tryCompile) {
    thread.tryCompile();
}
```

### 脚本监控

监控和跟踪脚本执行：

```javascript
// 创建线程注册表进行监控
const monitoredThreads = {};

// 注册线程进行监控
monitoredThreads['myThreadId'] = thread;

// 检查监控线程是否运行
const isRunning = vm.runtime.isActiveThread(monitoredThreads['myThreadId']);

// 获取线程脚本中的积木
const topBlock = thread.topBlock;
const blocks = thread.blockContainer;
let currentBlock = blocks.getBlock(topBlock);
const blockIds = [];

while (currentBlock) {
    blockIds.push(currentBlock.id);
    currentBlock = currentBlock.next ? blocks.getBlock(currentBlock.next) : null;
}
```

### 积木发光控制

控制积木的视觉反馈：

```javascript
// 使积木发光
vm.runtime.glowBlock(blockId, true);

// 停止积木发光
vm.runtime.glowBlock(blockId, false);

// 静默发光(内部使用)
vm.runtime.quietGlow(blockId);
```

### 脚本管理

管理脚本及其执行：

```javascript
// 切换脚本开启/关闭
vm.runtime.toggleScript(blockId, target);

// 获取目标中的所有脚本
const scripts = target.blocks.getScripts();

// 添加新脚本
target.blocks._addScript(topBlockId);

// 删除脚本
target.blocks._deleteScript(topBlockId);
```

## Redux 状态结构

### GUI 模式信息

通过 Redux 访问编辑器状态：

```javascript
const guiState = window.ReduxStore.getState().scratchGui;

// 检查编辑器模式
const isEmbedded = guiState.mode?.isEmbedded;
const isPlayerOnly = guiState.mode?.isPlayerOnly;
const isFullscreen = guiState.mode?.isFullScreen;
const hasEverEnteredEditor = guiState.mode?.hasEverEnteredEditor;

// 获取主题信息
const currentTheme = guiState.theme?.theme;
```

### 打包检测

检测是否在打包环境中运行：

```javascript
// 检查是否在 Bilup Packager 中运行
const isPackaged = !window.ReduxStore?.getState && !!window.scaffolding?.vm;
```

此 API 提供对 Bilup GUI 功能的全面访问，同时保持与底层 Scratch 架构的兼容性。

## 积木操作

高级积木管理和操作：

```javascript
// 按 ID 获取积木
const block = target.blocks.getBlock(blockId);

// 创建新积木
target.blocks.createBlock(blockData);

// 删除积木
delete target.blocks._blocks[blockId];

// 获取积木的分支(子堆栈)
const branchBlockId = target.blocks.getBranch(blockId, index);

// 获取序列中的下一个积木
const nextBlockId = target.blocks.getNextBlock(blockId);

// 克隆积木结构
function cloneBlock(blockId, target) {
    const block = target.blocks.getBlock(blockId);
    if (!block) return [];
    
    let clonedBlocks = [block];
    
    // 克隆输入
    Object.values(block.inputs || {}).forEach(input => {
        if (input.block) clonedBlocks.push(...cloneBlock(input.block, target));
        if (input.shadow && input.shadow !== input.block) {
            clonedBlocks.push(...cloneBlock(input.shadow, target));
        }
    });
    
    // 克隆字段引用
    Object.values(block.fields || {}).forEach(field => {
        if (field.id) clonedBlocks.push(...cloneBlock(field.id, target));
    });
    
    return clonedBlocks;
}
```

### ScratchBlocks 集成

使用可视化积木编辑器：

```javascript
// 获取主工作区
const workspace = window.ScratchBlocks?.getMainWorkspace();

if (workspace) {
    // 获取工作区中的所有积木
    const allBlocks = workspace.getAllBlocks();
    
    // 按类型获取积木
    const motionBlocks = allBlocks.filter(block => block.type.startsWith('motion_'));
    
    // 设置积木警告
    const block = workspace.getBlockById(blockId);
    if (block) {
        block.setWarningText('Warning message', 'warningId');
        block.setTooltip('Tooltip text');
    }
    
    // 监听工作区更新
    vm.on('workspaceUpdate', () => {
        console.log('Workspace updated');
    });
}
```

### 运行时钩子

通过钩子修改运行时行为：

```javascript
// 钩子到 ScratchBlocks 的积木转换
const originalConvert = vm.runtime._convertBlockForScratchBlocks;
vm.runtime._convertBlockForScratchBlocks = function(blockInfo, categoryInfo) {
    // 在转换前修改积木信息
    if (blockInfo.customProperty) {
        blockInfo.outputShape = 3; // 自定义输出形状
    }
    
    return originalConvert.call(this, blockInfo, categoryInfo);
};

// 钩子到线程步进
const sequencer = vm.runtime.sequencer;
const originalStep = sequencer.stepThread;
sequencer.stepThread = function(thread) {
    // 步进前的自定义逻辑
    if (thread.skipThisStep) {
        thread.skipThisStep = false;
        return;
    }
    
    return originalStep.call(this, thread);
};
```
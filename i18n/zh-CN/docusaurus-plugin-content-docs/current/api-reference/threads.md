---
title: 线程 API
sidebar_position: 7
---

# 线程管理 API

Bilup 提供了广泛的线程管理功能，用于高级脚本控制和执行。此 API 允许你在运行时监控、控制和操作脚本的执行。

## 概述

Bilup 中的线程代表正在执行的脚本。每个运行的脚本(从绿旗、积木点击、广播等)都会创建一个线程，管理其执行状态、栈帧和局部变量。

## 线程基础

### 什么是线程？

线程是脚本的执行上下文。它包含：
- 脚本的执行栈
- 当前正在执行的积木
- 局部变量和存储
- 执行状态(运行中、暂停、完成)
- Warp 模式状态

### 访问线程

```javascript
// 获取所有活动线程
const allThreads = vm.runtime.threads;

// 获取特定目标的线程
const targetThreads = vm.runtime.threads.filter(thread => 
    thread.target === specificTarget
);

// 检查线程是否活动
const isRunning = vm.runtime.isActiveThread(someThread);
```

## 线程监控

### 基本线程信息

```javascript
// 线程属性
const thread = vm.runtime.threads[0];

console.log(thread.topBlock);        // 顶层积木的 ID
console.log(thread.target);          // 运行线程的目标(角色/舞台)
console.log(thread.isKilled);        // 线程是否已停止
console.log(thread.stack);           // 当前执行栈
console.log(thread.stackClick);      // 是否通过点击积木启动
console.log(thread.updateMonitor);   // 是否应更新变量监视器
```

### 线程状态

```javascript
// 线程状态常量
const ThreadStatus = {
    RUNNING: 0,
    PROMISE_WAIT: 1,
    YIELD: 2,
    YIELD_TICK: 3,
    DONE: 4
};

// 检查线程状态
if (thread.status === ThreadStatus.RUNNING) {
    console.log('线程正在运行');
} else if (thread.status === ThreadStatus.DONE) {
    console.log('线程已完成执行');
}
```

## 线程控制

### 启动线程

```javascript
// 从积木启动新线程
const newThread = vm.runtime._pushThread(
    blockId,           // 要从其开始的积木 ID
    target,            // 要在其上运行的目标
    {
        stackClick: true,      // 标记为点击启动
        updateMonitor: false   // 不更新监视器
    }
);

// 如果可用，启用编译
if (vm.runtime.compilerOptions.enabled) {
    newThread.tryCompile();
}
```

### 停止线程

```javascript
// 停止特定线程
thread.stopThisScript();

// 强制终止线程
vm.runtime._stopThread(thread);

// 停止所有线程
vm.runtime.stopAll();

// 停止目标的所有线程
vm.runtime.stopForTarget(target);
```

### 重新启动线程

```javascript
// 重新启动线程(如果可能)
vm.runtime._restartThread(thread);

// 通过创建新线程强制重新启动
const restartedThread = vm.runtime._pushThread(
    thread.topBlock,
    thread.target,
    { stackClick: true }
);
```

## 高级线程管理

### 线程监控系统

创建监控系统以跟踪特定线程：

```javascript
// 线程监控存储
const monitoredThreads = {};

// 用自定义 ID 监控线程
function monitorThread(threadId, thread) {
    monitoredThreads[threadId] = thread;
    
    // 添加自定义属性
    thread.customStorage = {};
    thread.monitorId = threadId;
}

// 检查监控线程是否正在运行
function isMonitoredThreadRunning(threadId) {
    const thread = monitoredThreads[threadId];
    return thread && vm.runtime.isActiveThread(thread);
}

// 停止监控线程
function stopMonitoredThread(threadId) {
    const thread = monitoredThreads[threadId];
    if (thread) {
        thread.stopThisScript();
    }
}
```

### 自定义线程存储

在线程中存储数据以在积木间持久化：

```javascript
// 在线程中存储数据
function storeInThread(thread, key, value) {
    if (!thread.customStorage) {
        thread.customStorage = {};
    }
    thread.customStorage[key] = value;
}

// 从线程检索数据
function getFromThread(thread, key) {
    if (!thread.customStorage) {
        thread.customStorage = {};
    }
    return thread.customStorage[key];
}

// 在自定义积木中的示例用法
function myCustomBlock(args, util) {
    const thread = util.thread;
    
    // 存储一些状态
    storeInThread(thread, 'counter', 
        (getFromThread(thread, 'counter') || 0) + 1
    );
    
    return getFromThread(thread, 'counter');
}
```

## 栈帧管理

### 理解栈帧

栈帧表示脚本嵌套每个级别的执行上下文：

```javascript
// 访问当前栈帧
const currentFrame = thread.peekStackFrame();

console.log(currentFrame.isLoop);          // 是否在循环积木中
console.log(currentFrame.warpMode);        // 是否在 warp 模式
console.log(currentFrame.params);          // 积木参数
console.log(currentFrame.executionContext); // 执行上下文
```

### 栈帧创建

```javascript
// 创建新栈帧(高级用法)
const StackFrame = vm.runtime.sequencer.constructor.StackFrame;

const newFrame = new StackFrame(warpMode);
newFrame.op = blockInfo;
newFrame.params = blockParams;

// 推送到线程栈
thread.pushStackFrame(newFrame);
```

## 积木执行控制

### 控制积木执行

```javascript
// 跳转到下一个积木
thread.goToNextBlock();

// 获取当前正在执行的积木
const currentBlock = thread.peekStack();

// 推送新积木执行
thread.pushStack(blockId);

// 从栈弹出当前积木
const poppedBlock = thread.popStack();
```

### 分支执行

```javascript
// 执行特定分支(子栈)
const branchBlockId = target.blocks.getBranch(parentBlockId);
if (branchBlockId) {
    thread.pushStack(branchBlockId);
}

// 使用自定义目标执行分支
function executeBranchInTarget(branchId, newTarget) {
    const newThread = vm.runtime._pushThread(
        branchId,
        newTarget,
        { stackClick: true }
    );
    return newThread;
}
```

## 内联执行

### 内联运行代码

创建立即执行并返回值的线程：

```javascript
function executeInline(blockId, target, parentThread) {
    // 创建用于内联执行的模拟线程
    const inlineThread = new parentThread.constructor(
        parentThread.topBlock,
        target,
        { stackClick: false, updateMonitor: false }
    );
    
    // 设置线程属性
    inlineThread.topBlock = blockId;
    inlineThread.stack = [blockId];
    inlineThread.target = target;
    inlineThread.blockContainer = target.blocks;
    
    // 立即执行
    const sequencer = vm.runtime.sequencer;
    sequencer.stepThread(inlineThread);
    
    // 如果完成则返回结果
    if (inlineThread.status === 4) { // DONE
        return inlineThread.inlineReturn || '';
    }
    
    // 处理异步执行
    return new Promise((resolve) => {
        vm.runtime.on('AFTER_EXECUTE', function checkComplete() {
            if (inlineThread.status === 4 || inlineThread.inlineReturn !== undefined) {
                vm.runtime.off('AFTER_EXECUTE', checkComplete);
                resolve(inlineThread.inlineReturn || '');
            }
        });
    });
}
```

## 线程事件

### 监听线程事件

```javascript
// 监听线程生命周期事件
vm.runtime.on('THREAD_STEP_UPDATE', (threads) => {
    console.log('线程已更新:', threads.length);
});

vm.runtime.on('AFTER_EXECUTE', () => {
    console.log('执行周期完成');
});

// 监控特定线程完成
function waitForThreadCompletion(thread) {
    return new Promise((resolve) => {
        function checkThread() {
            if (!vm.runtime.isActiveThread(thread)) {
                resolve();
                return;
            }
            vm.runtime.once('AFTER_EXECUTE', checkThread);
        }
        checkThread();
    });
}
```

## 实用示例

### 示例 1：脚本管理器

```javascript
class ScriptManager {
    constructor() {
        this.monitoredThreads = {};
    }
    
    // 用自定义 ID 监控线程
    monitorThread(threadId, thread) {
        this.monitoredThreads[threadId] = thread;
        thread.customStorage = {};
    }
    
    // 检查线程是否运行
    isThreadRunning(threadId) {
        const thread = this.monitoredThreads[threadId];
        return thread && vm.runtime.isActiveThread(thread);
    }
    
    // 停止线程
    stopThread(threadId) {
        const thread = this.monitoredThreads[threadId];
        if (thread) {
            thread.stopThisScript();
        }
    }
    
    // 重新启动线程
    restartThread(threadId) {
        const thread = this.monitoredThreads[threadId];
        if (thread) {
            const newThread = vm.runtime._pushThread(
                thread.topBlock,
                thread.target,
                { stackClick: true }
            );
            this.monitoredThreads[threadId] = newThread;
        }
    }
    
    // 获取角色中的所有脚本
    getScriptsInSprite(threadId) {
        const thread = this.monitoredThreads[threadId];
        if (thread) {
            return thread.blockContainer.getScripts();
        }
        return [];
    }
}

// 使用
const scriptManager = new ScriptManager();

// 在自定义积木中
function monitorThisScript(args, util) {
    scriptManager.monitorThread(args.ID, util.thread);
}
```

### 示例 2：跨角色执行

```javascript
function runCodeInSprite(spriteNameOrTarget, blockId) {
    // 找到目标角色
    let target;
    if (typeof spriteNameOrTarget === 'string') {
        if (spriteNameOrTarget === '_stage_') {
            target = vm.runtime.getTargetForStage();
        } else {
            target = vm.runtime.getSpriteTargetByName(spriteNameOrTarget);
        }
    } else {
        target = spriteNameOrTarget;
    }
    
    if (!target) {
        console.warn('目标未找到:', spriteNameOrTarget);
        return null;
    }
    
    // 在目标角色中创建并启动线程
    const thread = vm.runtime._pushThread(
        blockId,
        target,
        { stackClick: true }
    );
    
    return thread;
}
```

## 性能考虑

### 线程优化

```javascript
// 批处理线程操作
function batchThreadOperations(operations) {
    vm.runtime.requestUpdateState(); // 批处理期间阻止更新
    
    operations.forEach(op => op());
    
    vm.runtime.requestBlocksUpdate(); // 最后更新一次
}

// 高效线程监控
function efficientThreadMonitor() {
    const activeThreads = vm.runtime.threads.filter(
        thread => thread.status === 0 // 仅运行中
    );
    
    // 仅处理运行中的线程
    activeThreads.forEach(thread => {
        // 监控逻辑
    });
}
```

### 内存管理

```javascript
// 清理已完成的线程
function cleanupCompletedThreads() {
    Object.keys(monitoredThreads).forEach(threadId => {
        const thread = monitoredThreads[threadId];
        if (!vm.runtime.isActiveThread(thread)) {
            delete monitoredThreads[threadId];
        }
    });
}

// 定期调用
setInterval(cleanupCompletedThreads, 5000);
```

## 安全和安全准则

### 线程安全指南

1. **操作前始终检查线程有效性**
2. **清理引用**以防止内存泄漏
3. **避免线程监控中的无限循环**
4. **对可能失败的线程操作使用 try-catch**

```javascript
// 安全线程操作
function safeThreadOperation(thread, operation) {
    try {
        if (vm.runtime.isActiveThread(thread)) {
            return operation(thread);
        }
    } catch (error) {
        console.warn('线程操作失败:', error);
    }
    return null;
}
```


## 相关 API

- [VM API 参考](./vm-api) - 核心 VM 功能
- [运行时信息](./vm-api#运行时信息) - 运行时管理
- [积木管理](./vm-api#积木管理) - 积木操作
- [扩展 API](./extension-api) - 自定义积木创建

## 最佳实践

1. **选择性监控** - 仅监控需要控制的线程
2. **正确清理** - 移除对已完成线程的引用
3. **优雅处理错误** - 线程操作可能失败
4. **彻底测试** - 线程操作可能破坏项目
5. **记录自定义存储** - 使线程数据使用清晰

此 API 提供强大的线程控制功能，但应谨慎使用，因为不当的线程操作可能会破坏项目执行。

## 高级运行时集成

### 线程原型扩展

扩展可以向 Thread 原型添加方法以进行高级控制：

```javascript
// 向线程添加 break 功能
Thread.prototype.breakCurrentLoop = function() {
    const blocks = this.blockContainer;
    const stackFrame = this.peekStackFrame();
    
    // 找到当前循环帧
    const frameData = Thread.getLoopFrame(this, false);
    if (!frameData) return; // 不在循环中
    
    const loopFrameBlock = frameData[0];
    const afterLoop = blocks.getBlock(loopFrameBlock).next;
    
    // 移除积木直到到达循环积木
    let currentBlock;
    while ((currentBlock = this.stack.at(-1)) !== loopFrameBlock) {
        if (blocks.getBlock(currentBlock)?.opcode === 'procedures_call') return;
        this.popStack();
    }
    
    // 移除循环积木并在其后继续
    this.popStack();
    if (afterLoop) {
        this.pushStack(afterLoop);
    }
};

// 添加 continue 功能
Thread.prototype.continueCurrentLoop = function() {
    const blocks = this.blockContainer;
    const frameData = Thread.getLoopFrame(this, true);
    if (!frameData) return;
    
    const loopBlock = frameData[0];
    
    // 弹出栈直到到达循环积木
    let currentBlock;
    while (this.stack[0] && (currentBlock = this.stack.at(-1)) !== loopBlock) {
        if (blocks.getBlock(currentBlock)?.opcode === 'procedures_call') return;
        this.popStack();
    }
    
    // Yield 并重启动循环
    this.status = Thread.STATUS_YIELD;
};
```

### 循环帧检测

在执行栈中查找循环和可中断积木：

```javascript
// 向 Thread 类添加静态方法
Thread.getLoopFrame = function(thread, iterableOnly = false) {
    const stackFrames = thread.stackFrames;
    const frameCount = stackFrames.length;
    
    for (let i = frameCount - 1; i >= 0; i--) {
        if (i < 0) break;
        
        const frame = stackFrames[i];
        const isValidFrame = iterableOnly 
            ? frame.isIterable
            : (frame.isLoop || frame.isBreakable || frame.isIterable);
            
        if (isValidFrame) {
            return [frame.op.id, i]; // [blockId, frameIndex]
        }
    }
    
    return false; // 未找到循环帧
};
```

### 自定义栈帧属性

使用自定义执行上下文数据扩展栈帧：

```javascript
// 在自定义积木实现中
function myCustomBlock(args, util) {
    const frame = util.stackFrame;
    
    // 向帧添加自定义属性
    frame.myCustomProperty = 'value';
    frame.isBreakable = true;
    frame.isIterable = true;
    
    // 访问父帧上下文
    const parentFrame = getParentFrame(util.thread, util.thread.peekStack());
    if (parentFrame.someProperty) {
        // 处理继承行为
    }
    
    // 在执行上下文中存储数据
    if (!frame.executionContext) {
        frame.executionContext = {};
    }
    frame.executionContext.customData = args.VALUE;
}

// 查找父帧的辅助函数
function getParentFrame(thread, childFrameId) {
    const frameIndex = thread.stackFrames.findIndex(
        frame => frame?.op?.id === childFrameId
    );
    const parentIndex = frameIndex - 1;
    return (thread.stackFrames[parentIndex] || { executionContext: {} }).executionContext;
}
```
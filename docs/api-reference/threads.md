---
title: Threads API
sidebar_position: 7
---

# Thread Management API

MistWarp provides extensive thread management capabilities for advanced script control and execution. This API allows you to monitor, control, and manipulate the execution of scripts at runtime.

## Overview

Threads in MistWarp represent executing scripts. Each script that runs (from green flag, block click, broadcast, etc.) creates a thread that manages its execution state, stack frames, and local variables.

## Thread Basics

### What is a Thread?

A thread is an execution context for a script. It contains:
- The script's execution stack
- Current block being executed
- Local variables and storage
- Execution state (running, paused, done)
- Warp mode status

### Accessing Threads

```javascript
// Get all active threads
const allThreads = vm.runtime.threads;

// Get threads for a specific target
const targetThreads = vm.runtime.threads.filter(thread => 
    thread.target === specificTarget
);

// Check if a thread is active
const isRunning = vm.runtime.isActiveThread(someThread);
```

## Thread Monitoring

### Basic Thread Information

```javascript
// Thread properties
const thread = vm.runtime.threads[0];

console.log(thread.topBlock);        // ID of the top-level block
console.log(thread.target);          // Target (sprite/stage) running the thread
console.log(thread.isKilled);        // Whether thread has been stopped
console.log(thread.stack);           // Current execution stack
console.log(thread.stackClick);      // Was started by clicking a block
console.log(thread.updateMonitor);   // Should update variable monitors
```

### Thread Status

```javascript
// Thread status constants
const ThreadStatus = {
    RUNNING: 0,
    PROMISE_WAIT: 1,
    YIELD: 2,
    YIELD_TICK: 3,
    DONE: 4
};

// Check thread status
if (thread.status === ThreadStatus.RUNNING) {
    console.log('Thread is actively running');
} else if (thread.status === ThreadStatus.DONE) {
    console.log('Thread has finished execution');
}
```

## Thread Control

### Starting Threads

```javascript
// Start a new thread from a block
const newThread = vm.runtime._pushThread(
    blockId,           // ID of block to start from
    target,            // Target to run on
    {
        stackClick: true,      // Mark as clicked
        updateMonitor: false   // Don't update monitors
    }
);

// Enable compilation if available
if (vm.runtime.compilerOptions.enabled) {
    newThread.tryCompile();
}
```

### Stopping Threads

```javascript
// Stop a specific thread
thread.stopThisScript();

// Force kill a thread
vm.runtime._stopThread(thread);

// Stop all threads
vm.runtime.stopAll();

// Stop all threads for a target
vm.runtime.stopForTarget(target);
```

### Restarting Threads

```javascript
// Restart a thread (if possible)
vm.runtime._restartThread(thread);

// Force restart by creating new thread
const restartedThread = vm.runtime._pushThread(
    thread.topBlock,
    thread.target,
    { stackClick: true }
);
```

## Advanced Thread Management

### Thread Monitoring System

Create a monitoring system to track specific threads:

```javascript
// Thread monitoring storage
const monitoredThreads = {};

// Monitor a thread with custom ID
function monitorThread(threadId, thread) {
    monitoredThreads[threadId] = thread;
    
    // Add custom properties
    thread.customStorage = {};
    thread.monitorId = threadId;
}

// Check if monitored thread is running
function isMonitoredThreadRunning(threadId) {
    const thread = monitoredThreads[threadId];
    return thread && vm.runtime.isActiveThread(thread);
}

// Stop monitored thread
function stopMonitoredThread(threadId) {
    const thread = monitoredThreads[threadId];
    if (thread) {
        thread.stopThisScript();
    }
}
```

### Custom Thread Storage

Store data within threads for persistence across blocks:

```javascript
// Store data in a thread
function storeInThread(thread, key, value) {
    if (!thread.customStorage) {
        thread.customStorage = {};
    }
    thread.customStorage[key] = value;
}

// Retrieve data from a thread
function getFromThread(thread, key) {
    if (!thread.customStorage) {
        thread.customStorage = {};
    }
    return thread.customStorage[key];
}

// Example usage in a custom block
function myCustomBlock(args, util) {
    const thread = util.thread;
    
    // Store some state
    storeInThread(thread, 'counter', 
        (getFromThread(thread, 'counter') || 0) + 1
    );
    
    return getFromThread(thread, 'counter');
}
```

## Stack Frame Management

### Understanding Stack Frames

Stack frames represent the execution context at each level of script nesting:

```javascript
// Access current stack frame
const currentFrame = thread.peekStackFrame();

console.log(currentFrame.isLoop);          // Is in a loop block
console.log(currentFrame.warpMode);        // Is in warp mode
console.log(currentFrame.params);          // Block parameters
console.log(currentFrame.executionContext); // Execution context
```

### Stack Frame Creation

```javascript
// Create a new stack frame (advanced usage)
const StackFrame = vm.runtime.sequencer.constructor.StackFrame;

const newFrame = new StackFrame(warpMode);
newFrame.op = blockInfo;
newFrame.params = blockParams;

// Push to thread stack
thread.pushStackFrame(newFrame);
```

## Block Execution Control

### Controlling Block Execution

```javascript
// Skip to next block
thread.goToNextBlock();

// Get current block being executed
const currentBlock = thread.peekStack();

// Push a new block to execute
thread.pushStack(blockId);

// Pop current block from stack
const poppedBlock = thread.popStack();
```

### Branch Execution

```javascript
// Execute a specific branch (substack)
const branchBlockId = target.blocks.getBranch(parentBlockId);
if (branchBlockId) {
    thread.pushStack(branchBlockId);
}

// Execute branch with custom target
function executeBranchInTarget(branchId, newTarget) {
    const newThread = vm.runtime._pushThread(
        branchId,
        newTarget,
        { stackClick: true }
    );
    return newThread;
}
```

## Inline Execution

### Running Code Inline

Create threads that execute and return values immediately:

```javascript
function executeInline(blockId, target, parentThread) {
    // Create spoofed thread for inline execution
    const inlineThread = new parentThread.constructor(
        parentThread.topBlock,
        target,
        { stackClick: false, updateMonitor: false }
    );
    
    // Set up thread properties
    inlineThread.topBlock = blockId;
    inlineThread.stack = [blockId];
    inlineThread.target = target;
    inlineThread.blockContainer = target.blocks;
    
    // Execute immediately
    const sequencer = vm.runtime.sequencer;
    sequencer.stepThread(inlineThread);
    
    // Return result if completed
    if (inlineThread.status === 4) { // DONE
        return inlineThread.inlineReturn || '';
    }
    
    // Handle async execution
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

## Thread Events

### Listening to Thread Events

```javascript
// Listen for thread lifecycle events
vm.runtime.on('THREAD_STEP_UPDATE', (threads) => {
    console.log('Threads updated:', threads.length);
});

vm.runtime.on('AFTER_EXECUTE', () => {
    console.log('Execution cycle completed');
});

// Monitor for specific thread completion
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

## Practical Examples

### Example 1: Script Manager

```javascript
class ScriptManager {
    constructor() {
        this.monitoredThreads = {};
    }
    
    // Monitor a thread with a custom ID
    monitorThread(threadId, thread) {
        this.monitoredThreads[threadId] = thread;
        thread.customStorage = {};
    }
    
    // Check if thread is running
    isThreadRunning(threadId) {
        const thread = this.monitoredThreads[threadId];
        return thread && vm.runtime.isActiveThread(thread);
    }
    
    // Stop thread
    stopThread(threadId) {
        const thread = this.monitoredThreads[threadId];
        if (thread) {
            thread.stopThisScript();
        }
    }
    
    // Restart thread
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
    
    // Get all scripts in sprite
    getScriptsInSprite(threadId) {
        const thread = this.monitoredThreads[threadId];
        if (thread) {
            return thread.blockContainer.getScripts();
        }
        return [];
    }
}

// Usage
const scriptManager = new ScriptManager();

// In a custom block
function monitorThisScript(args, util) {
    scriptManager.monitorThread(args.ID, util.thread);
}
```

### Example 2: Cross-Sprite Execution

```javascript
function runCodeInSprite(spriteNameOrTarget, blockId) {
    // Find target sprite
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
        console.warn('Target not found:', spriteNameOrTarget);
        return null;
    }
    
    // Create and start thread in target sprite
    const thread = vm.runtime._pushThread(
        blockId,
        target,
        { stackClick: true }
    );
    
    return thread;
}
```

## Performance Considerations

### Thread Optimization

```javascript
// Batch thread operations
function batchThreadOperations(operations) {
    vm.runtime.requestUpdateState(); // Prevent updates during batch
    
    operations.forEach(op => op());
    
    vm.runtime.requestBlocksUpdate(); // Update once at end
}

// Efficient thread monitoring
function efficientThreadMonitor() {
    const activeThreads = vm.runtime.threads.filter(
        thread => thread.status === 0 // RUNNING only
    );
    
    // Process only running threads
    activeThreads.forEach(thread => {
        // Monitor logic here
    });
}
```

### Memory Management

```javascript
// Clean up completed threads
function cleanupCompletedThreads() {
    Object.keys(monitoredThreads).forEach(threadId => {
        const thread = monitoredThreads[threadId];
        if (!vm.runtime.isActiveThread(thread)) {
            delete monitoredThreads[threadId];
        }
    });
}

// Call periodically
setInterval(cleanupCompletedThreads, 5000);
```

## Security and Safety

### Thread Safety Guidelines

1. **Always check thread validity** before operations
2. **Clean up references** to prevent memory leaks
3. **Avoid infinite loops** in thread monitoring
4. **Use try-catch** for thread operations that might fail

```javascript
// Safe thread operation
function safeThreadOperation(thread, operation) {
    try {
        if (vm.runtime.isActiveThread(thread)) {
            return operation(thread);
        }
    } catch (error) {
        console.warn('Thread operation failed:', error);
    }
    return null;
}
```


## Related APIs

- [VM API Reference](./vm-api) - Core VM functionality
- [Runtime Information](./vm-api#runtime-information) - Runtime management
- [Block Management](./vm-api#block-management) - Block manipulation
- [Extension API](./extension-api) - Custom block creation

## Best Practices

1. **Monitor selectively** - Only monitor threads you need to control
2. **Clean up properly** - Remove references to completed threads
3. **Handle errors gracefully** - Thread operations can fail
4. **Test thoroughly** - Thread manipulation can break projects
5. **Document custom storage** - Make thread data usage clear

This API provides powerful thread control capabilities but should be used carefully as improper thread manipulation can destabilize project execution.

## Advanced Runtime Integration

### Thread Prototype Extensions

Extensions can add methods to the Thread prototype for advanced control:

```javascript
// Add break functionality to threads
Thread.prototype.breakCurrentLoop = function() {
    const blocks = this.blockContainer;
    const stackFrame = this.peekStackFrame();
    
    // Find the current loop frame
    const frameData = Thread.getLoopFrame(this, false);
    if (!frameData) return; // Not in a loop
    
    const loopFrameBlock = frameData[0];
    const afterLoop = blocks.getBlock(loopFrameBlock).next;
    
    // Remove blocks until we reach the loop block
    let currentBlock;
    while ((currentBlock = this.stack.at(-1)) !== loopFrameBlock) {
        if (blocks.getBlock(currentBlock)?.opcode === 'procedures_call') return;
        this.popStack();
    }
    
    // Remove the loop block and continue after it
    this.popStack();
    if (afterLoop) {
        this.pushStack(afterLoop);
    }
};

// Add continue functionality
Thread.prototype.continueCurrentLoop = function() {
    const blocks = this.blockContainer;
    const frameData = Thread.getLoopFrame(this, true);
    if (!frameData) return;
    
    const loopBlock = frameData[0];
    
    // Pop stack until we're at the loop block
    let currentBlock;
    while (this.stack[0] && (currentBlock = this.stack.at(-1)) !== loopBlock) {
        if (blocks.getBlock(currentBlock)?.opcode === 'procedures_call') return;
        this.popStack();
    }
    
    // Yield and restart the loop
    this.status = Thread.STATUS_YIELD;
};
```

### Loop Frame Detection

Find loop and breakable blocks in the execution stack:

```javascript
// Add static method to Thread class
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
    
    return false; // No loop frame found
};
```

### Custom Stack Frame Properties

Extend stack frames with custom execution context data:

```javascript
// In a custom block implementation
function myCustomBlock(args, util) {
    const frame = util.stackFrame;
    
    // Add custom properties to the frame
    frame.myCustomProperty = 'value';
    frame.isBreakable = true;
    frame.isIterable = true;
    
    // Access parent frame context
    const parentFrame = getParentFrame(util.thread, util.thread.peekStack());
    if (parentFrame.someProperty) {
        // Handle inherited behavior
    }
    
    // Store data in execution context
    if (!frame.executionContext) {
        frame.executionContext = {};
    }
    frame.executionContext.customData = args.VALUE;
}

// Helper to find parent frame
function getParentFrame(thread, childFrameId) {
    const frameIndex = thread.stackFrames.findIndex(
        frame => frame?.op?.id === childFrameId
    );
    const parentIndex = frameIndex - 1;
    return (thread.stackFrames[parentIndex] || { executionContext: {} }).executionContext;
}
```

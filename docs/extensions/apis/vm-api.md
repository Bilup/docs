---
name: VM
---

# Virtual Machine API

The VM (Virtual Machine) is the core engine that runs Scratch projects. For extension developers, the VM provides access to project execution, sprite management, block interpretation, and runtime events. This API is primarily available to unsandboxed extensions through `Scratch.vm`.

## Overview

The VM manages:
- Project execution and control
- Sprite and target management
- Block execution and compilation
- Runtime events and monitoring
- Extension integration
- Asset and storage management

## Accessing the VM

```js
// Unsandboxed extensions only
if (!Scratch.extensions.unsandboxed) {
  throw new Error('VM API requires unsandboxed extension');
}

const vm = Scratch.vm;
const runtime = vm.runtime;
```

## Project Control

### Basic Execution

```js
// Start the project (green flag)
vm.greenFlag();

// Stop all scripts
vm.stopAll();

// Step execution manually (for debugging)
vm.runtime._step();

// Check if project is running
const isRunning = vm.runtime.threads.length > 0;
```

### Turbo Mode

```js
// Enable/disable turbo mode
vm.setTurboMode(true);   // Enable turbo mode
vm.setTurboMode(false);  // Disable turbo mode

// Listen for turbo mode changes
vm.on('TURBO_MODE_ON', () => {
  console.log('Turbo mode enabled');
});

vm.on('TURBO_MODE_OFF', () => {
  console.log('Turbo mode disabled');
});
```

### Performance Options

```js
// Set framerate (30 or 60 FPS)
vm.setFramerate(60);

// Enable/disable interpolation
vm.setInterpolation(true);

// Configure compiler options
vm.setCompilerOptions({
  enabled: true,
  warpTimer: false
});

// Set runtime options
vm.setRuntimeOptions({
  maxClones: 300,
  miscLimits: true,
  fencing: true
});
```

## Project Management

### Loading Projects

```js
// Load project from JSON string
const projectData = '{"targets": [...], "meta": {...}}';
await vm.loadProject(projectData);

// Load project from file buffer
const projectBuffer = new ArrayBuffer(/* project data */);
await vm.loadProject(projectBuffer);

// Clear current project
vm.clear();
```

### Project Information

```js
// Get project as JSON
const projectJson = vm.toJSON();

// Get project metadata
const runtime = vm.runtime;
const projectName = runtime.getTargetForStage().sprite.name;

// Check if project has changes
vm.on('PROJECT_CHANGED', () => {
  console.log('Project has unsaved changes');
});
```

### Asset Management

```js
// Get all project assets
const assets = vm.assets;

// Add costume to sprite
const targetId = 'sprite1';
const costumeData = {
  name: 'costume1',
  dataFormat: 'png',
  asset: assetBuffer,
  md5ext: 'hash.png'
};
await vm.addCostume(costumeData, targetId);

// Add sound to sprite
const soundData = {
  name: 'sound1',
  dataFormat: 'wav',
  asset: soundBuffer,
  md5ext: 'hash.wav'
};
await vm.addSound(soundData, targetId);

// Add backdrop to stage
await vm.addBackdrop('backdrop.png', backdropObject);
```

## Target Management

### Accessing Targets

```js
const runtime = vm.runtime;

// Get all targets (sprites + stage)
const allTargets = runtime.targets;

// Get stage
const stage = runtime.getTargetForStage();

// Get all sprites (excluding stage)
const sprites = runtime.getSpriteTargets();

// Get target by ID
const target = runtime.getTargetById('targetId');

// Get target by name
const namedTarget = runtime.getSpriteTargetByName('Sprite1');

// Get currently editing target
const editingTarget = vm.editingTarget;
```

### Target Properties

```js
// Sprite properties
const target = runtime.getSpriteTargetByName('Sprite1');
if (target) {
  // Position and appearance
  console.log('Position:', target.x, target.y);
  console.log('Direction:', target.direction);
  console.log('Size:', target.size);
  console.log('Visible:', target.visible);
  
  // Identity
  console.log('Name:', target.getName());
  console.log('Is original:', target.isOriginal);
  console.log('Is stage:', target.isStage);
  
  // Current costume/backdrop
  console.log('Current costume:', target.currentCostume);
  console.log('Costume name:', target.sprite.costumes[target.currentCostume].name);
}
```

### Creating and Managing Clones

```js
// Create a clone
const originalSprite = runtime.getSpriteTargetByName('Sprite1');
if (originalSprite) {
  const clone = originalSprite.makeClone();
  if (clone) {
    runtime.addTarget(clone);
    
    // Position the clone
    clone.setXY(100, 50);
    clone.setDirection(90);
  }
}

// Find all clones of a sprite
const clones = runtime.targets.filter(target => 
  !target.isStage && 
  !target.isOriginal && 
  target.sprite === originalSprite.sprite
);

// Delete a clone
const cloneToDelete = clones[0];
if (cloneToDelete && !cloneToDelete.isOriginal) {
  runtime.disposeTarget(cloneToDelete);
}
```

## Variables and Data

### Global Variables

```js
const stage = runtime.getTargetForStage();

// Access variables
const variables = stage.variables;
for (const [id, variable] of Object.entries(variables)) {
  console.log(`${variable.name}: ${variable.value} (${variable.type})`);
}

// Get specific variable
const scoreVar = stage.lookupVariableByNameAndType('score', '');
if (scoreVar) {
  console.log('Score:', scoreVar.value);
  scoreVar.value = 100;
}

// Create new variable
stage.createVariable('newVar', 'myVariable', '');
```

### Sprite Variables

```js
const sprite = runtime.getSpriteTargetByName('Sprite1');
if (sprite) {
  // Local variables
  const localVars = sprite.variables;
  
  // Get/set local variable
  const localVar = sprite.lookupVariableByNameAndType('localScore', '');
  if (localVar) {
    localVar.value = 50;
  }
}
```

### Lists

```js
const stage = runtime.getTargetForStage();

// Access lists
const lists = Object.values(stage.variables).filter(v => v.type === 'list');

// Get specific list
const itemsList = stage.lookupVariableByNameAndType('items', 'list');
if (itemsList) {
  console.log('List contents:', itemsList.value);
  
  // Modify list
  itemsList.value.push('new item');
  itemsList.value[0] = 'first item';
}
```

## Block Execution

### Starting Scripts

```js
// Start hat blocks
const startedThreads = runtime.startHats('event_whenflagclicked');
console.log(`Started ${startedThreads.length} threads`);

// Start hat blocks with conditions
const broadcastThreads = runtime.startHats('event_whenbroadcastreceived', {
  BROADCAST_OPTION: 'message1'
});

// Start specific block stack
const blockId = 'some-block-id';
const target = runtime.getSpriteTargetByName('Sprite1');
const thread = runtime._pushThread(blockId, target);
```

### Manual Thread Management
**Advanced / Internal**

For more granular control, you can manually push threads and inspect their status.

```js
// Manually start a thread
// _pushThread(blockId, target, opts)
const thread = runtime._pushThread(startBlockId, target, {
  stackClick: true // Treat as a stack click (restarts if running)
});

// Thread Status Constants
// 0: RUNNING
// 1: PROMISE_WAIT
// 2: YIELD
// 3: YIELD_TICK
// 4: DONE
if (thread.status === 4) {
  console.log('Thread finished');
}
```

### Thread Management

```js
// Get all running threads
const threads = runtime.threads;
console.log(`${threads.length} threads running`);

// Find threads by target
const spriteThreads = threads.filter(thread => 
  thread.target.getName() === 'Sprite1'
);

// Stop threads for specific target
const target = runtime.getSpriteTargetByName('Sprite1');
runtime.stopForTarget(target);

// Thread properties
threads.forEach(thread => {
  console.log('Thread target:', thread.target.getName());
  console.log('Top block:', thread.topBlock);
  console.log('Status:', thread.status);
  console.log('Is compiled:', thread.isCompiled);
});
```

## Runtime Events

### Project Lifecycle

```js
// Project execution
vm.on('PROJECT_RUN_START', () => {
  console.log('Project started running');
});

vm.on('PROJECT_RUN_STOP', () => {
  console.log('Project stopped');
});

vm.on('PROJECT_CHANGED', () => {
  console.log('Project has been modified');
});

// Project loading
vm.on('PROJECT_LOADED', () => {
  console.log('Project finished loading');
});
```

### Target Events

```js
runtime.on('targetWasCreated', (target, originalTarget) => {
  console.log('New target created:', target.getName());
  if (originalTarget) {
    console.log('Cloned from:', originalTarget.getName());
  }
});

runtime.on('TARGETS_UPDATE', (emitProjectChanged) => {
  console.log('Target list updated');
  if (emitProjectChanged) {
    console.log('Project should be marked as changed');
  }
});
```

### Block Events

```js
// Block glow (visual feedback)
runtime.on('SCRIPT_GLOW_ON', (glowData) => {
  console.log('Script glowing:', glowData.id);
});

runtime.on('SCRIPT_GLOW_OFF', (glowData) => {
  console.log('Script glow off:', glowData.id);
});

runtime.on('BLOCK_GLOW_ON', (glowData) => {
  console.log('Block glowing:', glowData.id);
});

runtime.on('BLOCK_GLOW_OFF', (glowData) => {
  console.log('Block glow off:', glowData.id);
});
```

### Monitor Events

```js
runtime.on('MONITORS_UPDATE', (monitors) => {
  console.log('Variable monitors updated:', monitors.length);
  monitors.forEach(monitor => {
    console.log(`${monitor.opcode}: ${monitor.value}`);
  });
});
```

## Extension Integration

### Extension Management

```js
const extensionManager = vm.extensionManager;

// Check if extension is loaded
const isLoaded = extensionManager.isExtensionLoaded('pen');

// Get loaded extensions
const loadedExtensions = extensionManager.getLoadedExtensions();

// Load extension (unsandboxed)
if (extensionManager.loadExtensionURL) {
  await extensionManager.loadExtensionURL('https://example.com/extension.js');
}
```

### Extension Storage

```js
// Access extension-specific storage
const extensionId = 'myextension';
const storage = runtime.extensionStorage[extensionId] || {};

// Store data
storage.settings = { volume: 0.5, enabled: true };
runtime.extensionStorage[extensionId] = storage;

// Extension storage persists with the project
```

## I/O and Devices

### Input Devices

```js
// Mouse
const mouse = runtime.ioDevices.mouse;
console.log('Mouse position:', mouse.getClientX(), mouse.getClientY());
console.log('Mouse down:', mouse.getIsDown());

// Keyboard
const keyboard = runtime.ioDevices.keyboard;
console.log('Space pressed:', keyboard.getKeyIsDown(32));

// Check key by name
const spacePressed = keyboard.getKeyIsDown('space');
```

### Clock and Timing

```js
const clock = runtime.ioDevices.clock;

// Get current time
const currentTime = clock.projectTimer();

// Reset timer
clock.resetProjectTimer();

// Get system time
const systemTime = clock.systemTime();
```

## Compilation and Performance

### Compiler Status

```js
// Check if compiler is enabled
const compilerEnabled = runtime.compilerOptions.enabled;

// Get compilation errors
vm.on('COMPILE_ERROR', (target, error) => {
  console.log('Compilation error in', target.getName(), ':', error);
});

// Precompile project
if (runtime.precompile) {
  runtime.precompile();
}

### Compiler Access
**Advanced / Internal**

Unsandboxed extensions can access the compiler infrastructure through `vm.exports`. This is primarily used for [Compiler Patching](../advanced-techniques/compiler-patching.md).

```js
// Check for compiler exports
if (vm.exports) {
    // Access generators
    const JSGenerator = vm.exports.JSGenerator;
    const IRGenerator = vm.exports.IRGenerator;
    
    // Access helper classes
    const { TypedInput, TYPE_UNKNOWN } = JSGenerator.exports;
}
```

> [!WARNING]
> Compiler APIs are internal and subject to change. Always check for existence before use.

### Runtime Hooks
**Advanced**

For deep integration, you can hook into runtime processes. See [GUI API](/api-reference/gui-api#runtime-hooks) for details on:
- `runtime._convertBlockForScratchBlocks` (Custom block serialization)
- `ScratchBlocks` integration
```

### Performance Monitoring

```js
// Enable profiling
if (runtime.enableProfiling) {
  runtime.enableProfiling();
}

// Monitor frame rate
vm.on('FRAMERATE_CHANGED', (framerate) => {
  console.log('Framerate changed to:', framerate);
});

// Monitor step time
console.log('Current step time:', runtime.currentStepTime);
```

## Advanced Features

### Stage Size

```js
// Set custom stage size
vm.setStageSize(640, 360);

// Listen for stage size changes
vm.on('STAGE_SIZE_CHANGED', (width, height) => {
  console.log('Stage size changed:', width, 'x', height);
});

// Get current stage size
console.log('Stage size:', runtime.stageWidth, 'x', runtime.stageHeight);
```

### Cloud Variables

```js
// Check for cloud variables
vm.on('HAS_CLOUD_DATA_UPDATE', (hasCloudData) => {
  if (hasCloudData) {
    console.log('Project has cloud variables');
  }
});

// Access cloud variable limit
console.log('Cloud variable limit:', runtime.cloudOptions.limit);
```

### Debug Mode

```js
// Enable debug mode
vm.enableDebug();

// Disable debug mode  
vm.disableDebug();

// Check debug status
const debugEnabled = runtime.debug;
```

## Practical Examples

### Custom Reporter Extension

```js
class SystemInfoExtension {
  getInfo() {
    return {
      id: 'systeminfo',
      name: 'System Info',
      blocks: [
        {
          opcode: 'getProjectInfo',
          blockType: Scratch.BlockType.REPORTER,
          text: 'project [INFO]',
          arguments: {
            INFO: {
              type: Scratch.ArgumentType.STRING,
              menu: 'INFO_MENU'
            }
          }
        }
      ],
      menus: {
        INFO_MENU: {
          items: ['name', 'sprite count', 'thread count', 'framerate']
        }
      }
    };
  }

  getProjectInfo(args) {
    const vm = Scratch.vm;
    const runtime = vm.runtime;
    
    switch (args.INFO) {
      case 'name':
        return runtime.getTargetForStage().sprite.name;
      case 'sprite count':
        return runtime.targets.length - 1; // Exclude stage
      case 'thread count':
        return runtime.threads.length;
      case 'framerate':
        return runtime.frameRate || 30;
      default:
        return '';
    }
  }
}
```

### Event Listener Extension

```js
class EventMonitorExtension {
  constructor() {
    this.eventLog = [];
    this.setupListeners();
  }

  setupListeners() {
    const vm = Scratch.vm;
    const runtime = vm.runtime;

    runtime.on('targetWasCreated', (target) => {
      this.eventLog.push(`Clone created: ${target.getName()}`);
    });

    vm.on('PROJECT_RUN_START', () => {
      this.eventLog.push('Project started');
    });

    vm.on('PROJECT_RUN_STOP', () => {
      this.eventLog.push('Project stopped');
    });
  }

  getInfo() {
    return {
      id: 'eventmonitor',
      name: 'Event Monitor',
      blocks: [
        {
          opcode: 'getLastEvent',
          blockType: Scratch.BlockType.REPORTER,
          text: 'last event'
        },
        {
          opcode: 'clearEvents',
          blockType: Scratch.BlockType.COMMAND,
          text: 'clear event log'
        }
      ]
    };
  }

  getLastEvent() {
    return this.eventLog[this.eventLog.length - 1] || '';
  }

  clearEvents() {
    this.eventLog = [];
  }
}
```

## Error Handling

```js
// Safe VM access
function safeVMOperation(operation) {
  try {
    if (!Scratch.extensions.unsandboxed) {
      console.warn('VM API requires unsandboxed extension');
      return null;
    }
    
    const vm = Scratch.vm;
    if (!vm) {
      console.warn('VM not available');
      return null;
    }
    
    return operation(vm);
  } catch (error) {
    console.error('VM operation failed:', error);
    return null;
  }
}

// Usage
const spriteCount = safeVMOperation(vm => vm.runtime.targets.length - 1);
```

## Best Practices

1. **Check unsandboxed status** before accessing VM APIs
2. **Handle missing targets gracefully** - sprites can be deleted
3. **Listen to events** rather than polling when possible
4. **Store references safely** for async operations
5. **Respect project state** - don't modify during execution
6. **Use thread-safe operations** when manipulating running projects
7. **Clean up event listeners** when extension is disabled

The VM API provides deep access to Scratch's execution engine, enabling extensions to create sophisticated interactions with running projects. Use these APIs responsibly to enhance the Scratch experience while maintaining stability and performance.

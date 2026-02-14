---
title: GUI API Reference
sidebar_position: 2
---

# GUI API Reference

The MistWarp GUI provides programmatic access to interface components, themes, project management, and VM integration. This API is primarily used by extensions, addons, and advanced integrations.

## Core GUI Instance

### Redux Store Access

The GUI state is managed through Redux and is accessible via the global store:

```javascript
// Access the Redux store (note: capital R in ReduxStore)
const store = window.ReduxStore;

// Get current state
const state = store.getState();

// Access different parts of the GUI state
const projectState = state.scratchGui.projectState;
const targets = state.scratchGui.targets;
const projectChanged = state.scratchGui.projectChanged;
```

## ScratchBlocks Integration

### window.ScratchBlocks

Access to the ScratchBlocks/Blockly workspace when available:

```javascript
// Access ScratchBlocks when available
const ScratchBlocks = window.ScratchBlocks;

if (ScratchBlocks) {
    // Access the main workspace
    const workspace = ScratchBlocks.getMainWorkspace();
    
    // Get all blocks in workspace
    const blocks = workspace.getAllBlocks();
}
```

### Loading ScratchBlocks

ScratchBlocks is loaded lazily by the GUI. It becomes available when the blocks tab is opened:

```javascript
// ScratchBlocks is available after blocks are loaded
if (window.ScratchBlocks) {
    console.log('ScratchBlocks is available');
} else {
    console.log('ScratchBlocks not yet loaded');
}
```

## State Management

### Redux State Access

Access and modify GUI state through the Redux store:

```javascript
// Get current state
const state = store.getState();

// Get current theme
const currentTheme = state.scratchGui.theme.theme;

// Dispatch actions to change state
store.dispatch({
    type: 'scratch-gui/theme/SET_THEME',
    theme: 'dark'
});

// Available themes
const themes = ['light', 'dark', 'midnight'];
```

### State Structure

The Redux state contains various GUI-related data:

```javascript
const guiState = {
    // Project state
    projectState: state.scratchGui.projectState,
    
    // Theme information
    theme: state.scratchGui.theme,
    
    // VM instance
    vm: state.scratchGui.vm,
    
    // Project title and metadata
    projectTitle: state.scratchGui.projectTitle,
    projectChanged: state.scratchGui.projectChanged
};
```

### Common Actions

Dispatch common GUI actions:

```javascript
// Set editing target
store.dispatch({
    type: 'scratch-gui/targets/SET_EDITING_TARGET',
    targetId: 'sprite1'
});

// Set project title
store.dispatch({
    type: 'scratch-gui/project-title/SET_PROJECT_TITLE',
    title: 'My Project'
});

// Set project as changed
store.dispatch({
    type: 'scratch-gui/project-changed/SET_PROJECT_CHANGED'
```

## Project Management

### Project State

Access project information through Redux:

```javascript
const state = store.getState().scratchGui.projectState;

// Project properties
const projectId = state.projectId;
const loadingState = state.loadingState;

// Get project title from different location in state
const projectTitle = store.getState().scratchGui.projectTitle;
const hasUnsavedChanges = store.getState().scratchGui.projectChanged;
```

### Project Actions

Project operations are typically handled by components rather than direct API calls:

```javascript
// Project actions are handled through Redux reducers
// Most project operations require user interaction

// Example: Request new project (used internally)
store.dispatch({
    type: 'scratch-gui/project-state/START_FETCHING_NEW'
});

// Project loading is typically handled by file upload components
// rather than direct API calls
```

## VM Integration

### Virtual Machine Access

Access the Scratch VM instance:

```javascript
// Get VM instance from Redux state
const vm = store.getState().scratchGui.vm;

// Or access directly from global
const vm = window.vm;

// VM operations
vm.greenFlag(); // Start project
vm.stopAll();   // Stop project
vm.setTurboMode(true); // Enable turbo mode

// Load project data
await vm.loadProject(projectData);
```

### Target Management

Manage sprites and stage:

```javascript
// Get targets (sprites + stage)
const targets = vm.runtime.targets;
const stage = vm.runtime.getTargetForStage();
const sprites = vm.runtime.getSpriteTargets();

// Get editing target
const editingTarget = vm.editingTarget;

// Set editing target
vm.setEditingTarget(targetId);
```

### Monitors

Control variable and list monitors:

```javascript
// Get monitors
const monitors = vm.runtime._monitorState;

// Show/hide monitor
vm.requestAddMonitor({
    id: 'variableId',
    spriteName: null, // null for global
    opcode: 'data_variable'
});

vm.requestRemoveMonitor('variableId');
```

## GUI Components

### Modal Management

Control modal dialogs:

```javascript
// Open modals
store.dispatch({ type: 'scratch-gui/modals/OPEN_EXTENSION_LIBRARY' });
store.dispatch({ type: 'scratch-gui/modals/OPEN_COSTUME_LIBRARY' });

// Close modals
store.dispatch({ type: 'scratch-gui/modals/CLOSE_EXTENSION_LIBRARY' });
store.dispatch({ type: 'scratch-gui/modals/CLOSE_COSTUME_LIBRARY' });
```

### Tab Management

Switch between editor tabs:

```javascript
// Tab indices
const BLOCKS_TAB = 0;
const COSTUMES_TAB = 1; 
const SOUNDS_TAB = 2;

// Activate tab
store.dispatch({
    type: 'scratch-gui/editor-tab/ACTIVATE_TAB',
    activeTabIndex: COSTUMES_TAB
});
```

### Stage Size Control

Manage stage dimensions:

```javascript
// Set stage size mode
store.dispatch({
    type: 'scratch-gui/stage-size/SET_STAGE_SIZE',
    stageSize: 'large' // 'small', 'large'
});

// Custom stage size
store.dispatch({
    type: 'scratch-gui/custom-stage-size/SET_CUSTOM_STAGE_SIZE',
    width: 480,
    height: 360
});
```

## Extension Integration

### Custom Extensions

Load custom extensions:

```javascript
// Load extension from URL
vm.extensionManager.loadExtensionURL('https://example.com/extension.js');

// Load extension from text
vm.extensionManager.loadExtensionFromText(extensionCode, 'extensionName');
```

### Extension Library

Manage extension library visibility:

```javascript
// Show extension library
store.dispatch({
    type: 'scratch-gui/modals/OPEN_EXTENSION_LIBRARY'
});

// Handle extension selection
const handleExtensionSelect = (extensionId) => {
    vm.extensionManager.loadExtensionIdSync(extensionId);
};
```

## Event Handling

### GUI Events

Listen to GUI state changes:

```javascript
// Subscribe to store changes
const unsubscribe = store.subscribe(() => {
    const state = store.getState();
    // Handle state changes
});

// Unsubscribe when done
unsubscribe();
```

### VM Events

Listen to VM events:

```javascript
// Project events
vm.on('PROJECT_LOADED', () => {
    console.log('Project loaded');
});

vm.on('PROJECT_CHANGED', () => {
    console.log('Project modified');
});

// Target events  
vm.on('targetsUpdate', (data) => {
    console.log('Targets updated:', data.targetList);
});

// Monitor events
vm.on('MONITORS_UPDATE', (monitors) => {
    console.log('Monitors updated:', monitors);
});
```

## Asset Management

### Costume Operations

Manage sprite costumes:

```javascript
// Add costume to target
vm.addCostume(costumeId, costume, targetId);

// Delete costume
vm.deleteCostume(costumeId);

// Set active costume
vm.setActiveCostume(targetId, costumeId);
```

### Sound Operations

Manage sprite sounds:

```javascript
// Add sound to target
vm.addSound(sound, targetId);

// Delete sound
vm.deleteSound(soundId);

// Play sound
vm.runtime.audioEngine.playSound(sound);
```

## Performance Monitoring

### Metrics Access

Access performance data:

```javascript
// Runtime metrics
const metrics = vm.runtime.stats;
console.log('FPS:', metrics.fps);
console.log('Frame count:', metrics.frameCount);

// Workspace metrics
const workspaceMetrics = store.getState().scratchGui.workspaceMetrics;
```

### Memory Usage

Monitor memory consumption:

```javascript
// Check memory usage
if (performance.memory) {
    console.log('Used heap:', performance.memory.usedJSHeapSize);
    console.log('Total heap:', performance.memory.totalJSHeapSize);
}
```

## Error Handling

### Error Boundaries

Handle GUI errors:

```javascript
// Set up error handling
window.addEventListener('error', (event) => {
    console.error('GUI Error:', event.error);
});

// React error boundary
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise:', event.reason);
});
```

### VM Error Handling

Handle VM runtime errors:

```javascript
vm.on('RUNTIME_ERROR', (error) => {
    console.error('VM Runtime Error:', error);
});

vm.on('COMPILE_ERROR', (error) => {
    console.error('VM Compile Error:', error);  
});
```

## Development Tools

### Debug Utilities

Access debugging features:

```javascript
// Enable debug mode
window.DEBUG = true;

// Access internal components
window._gui = gui;
window._vm = vm;
window._blockly = blockly;

// Performance profiling
window.guiProfiler = {
    startProfile: () => performance.mark('profile-start'),
    endProfile: () => {
        performance.mark('profile-end');
        performance.measure('profile', 'profile-start', 'profile-end');
    }
};
```

### Redux DevTools

When Redux DevTools are available:

```javascript
// Access Redux DevTools
const devTools = window.__REDUX_DEVTOOLS_EXTENSION__;
if (devTools) {
    // DevTools are available
    console.log('Redux DevTools detected');
}
```

## Type Definitions

For TypeScript users:

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

## Renderer API Access

### Canvas Operations
Access to renderer canvas and coordinate conversion:

```javascript
// Get canvas dimensions
const canvas = vm.renderer.canvas;
const width = canvas.width;
const height = canvas.height;

// Access native size
const nativeSize = vm.renderer._nativeSize; // [width, height]

// Extract pixel color at coordinates
const colorData = vm.renderer.extractColor(x, y, radius);
const pixelColor = colorData.color; // {r, g, b, a}
```

### Layer Management
Control rendering layer ordering:

```javascript
// Set layer group ordering
vm.renderer.setLayerGroupOrdering(['background', 'video', 'pen', 'sprite']);

// Access layer configuration
const layerGroups = vm.renderer._layerGroups;
```

## Advanced Runtime APIs

### Target Management
Access and manipulate sprites and stage:

```javascript
// Get sprite by name
const sprite = vm.runtime.getSpriteTargetByName('Sprite1');

// Get stage target
const stage = vm.runtime.getTargetForStage();

// Delete sprite
vm.deleteSprite(targetId);

// Export sprite
const spriteBlob = await vm.exportSprite(targetId);
```

### Project Operations
Save and load projects:

```javascript
// Save project as SB3 blob
const projectBlob = await vm.saveProjectSb3();

// Load project from buffer
await vm.loadProject(arrayBuffer);

// Get project as JSON
const projectData = vm.toJSON();
```

### Costume and Sound Management
Manage target assets:

```javascript
// Delete costume by index
target.deleteCostume(costumeIndex);

// Get costume index by name
const index = target.getCostumeIndexByName('costume1');

// Delete sound by index  
target.deleteSound(soundIndex);

// Access sprite sounds
const sounds = target.sprite.sounds;
```

### Frame Rate Control
Control animation frame rate:

```javascript
// Set unclamped frame rate
vm.runtime.frameLoop.framerate = 60;
vm.runtime.frameLoop._restart();
```

## Advanced Thread Management

### Thread Control

The VM runtime provides advanced thread management capabilities for controlling script execution:

```javascript
// Get all active threads
const activeThreads = vm.runtime.threads;

// Check if a thread is active
const isActive = vm.runtime.isActiveThread(thread);

// Stop a specific thread
thread.stopThisScript();

// Restart a thread
vm.runtime._restartThread(thread);

// Push a new thread for execution
const newThread = vm.runtime._pushThread(blockId, target, options);
```

### Thread Properties

Thread objects contain execution state and context:

```javascript
// Thread properties
console.log(thread.topBlock);      // Starting block ID
console.log(thread.target);        // Target sprite/stage
console.log(thread.blockContainer); // Block container
console.log(thread.stack);         // Execution stack
console.log(thread.stackFrames);   // Stack frames

// Thread status constants
const Thread = vm.runtime.sequencer.constructor.prototype.constructor;
console.log(Thread.STATUS_RUNNING);
console.log(Thread.STATUS_YIELD);
console.log(Thread.STATUS_DONE);
```

### Custom Thread Data Storage

Store custom data in thread context:

```javascript
// Store data in thread
if (!thread.customStorage) thread.customStorage = {};
thread.customStorage['myKey'] = 'myValue';

// Retrieve stored data
const value = thread.customStorage?.['myKey'];
```

### Thread Execution Control

Control thread stepping and execution:

```javascript
// Manually step a thread
vm.runtime.sequencer.stepThread(thread);

// Control thread stepping
thread.dontStepJustThisOneTime = true; // Skip next step

// Force thread compilation (if compiler enabled)
if (thread.tryCompile) {
    thread.tryCompile();
}
```

### Script Monitoring

Monitor and track script execution:

```javascript
// Create a thread registry for monitoring
const monitoredThreads = {};

// Register a thread for monitoring
monitoredThreads['myThreadId'] = thread;

// Check if monitored thread is running
const isRunning = vm.runtime.isActiveThread(monitoredThreads['myThreadId']);

// Get blocks in a thread's script
const topBlock = thread.topBlock;
const blocks = thread.blockContainer;
let currentBlock = blocks.getBlock(topBlock);
const blockIds = [];

while (currentBlock) {
    blockIds.push(currentBlock.id);
    currentBlock = currentBlock.next ? blocks.getBlock(currentBlock.next) : null;
}
```

### Block Glow Control

Control visual feedback for blocks:

```javascript
// Make a block glow
vm.runtime.glowBlock(blockId, true);

// Stop block glow
vm.runtime.glowBlock(blockId, false);

// Quiet glow (internal use)
vm.runtime.quietGlow(blockId);
```

### Script Management

Manage scripts and their execution:

```javascript
// Toggle script on/off
vm.runtime.toggleScript(blockId, target);

// Get all scripts in a target
const scripts = target.blocks.getScripts();

// Add a new script
target.blocks._addScript(topBlockId);

// Delete a script
target.blocks._deleteScript(topBlockId);
```

## Redux State Structure

### GUI Mode Information
Access editor state through Redux:

```javascript
const guiState = window.ReduxStore.getState().scratchGui;

// Check editor mode
const isEmbedded = guiState.mode?.isEmbedded;
const isPlayerOnly = guiState.mode?.isPlayerOnly;
const isFullscreen = guiState.mode?.isFullScreen;
const hasEverEnteredEditor = guiState.mode?.hasEverEnteredEditor;

// Get theme information
const currentTheme = guiState.theme?.theme;
```

### Packaging Detection
Detect if running in packaged environment:

```javascript
// Check if running in TurboWarp Packager
const isPackaged = !window.ReduxStore?.getState && !!window.scaffolding?.vm;
```

This API provides comprehensive access to MistWarp's GUI functionality while maintaining compatibility with the underlying Scratch architecture.

## Block Manipulation

Advanced block management and manipulation:

```javascript
// Get block by ID
const block = target.blocks.getBlock(blockId);

// Create a new block
target.blocks.createBlock(blockData);

// Delete a block
delete target.blocks._blocks[blockId];

// Get block's branch (substack)
const branchBlockId = target.blocks.getBranch(blockId, index);

// Get next block in sequence
const nextBlockId = target.blocks.getNextBlock(blockId);

// Clone block structure
function cloneBlock(blockId, target) {
    const block = target.blocks.getBlock(blockId);
    if (!block) return [];
    
    let clonedBlocks = [block];
    
    // Clone inputs
    Object.values(block.inputs || {}).forEach(input => {
        if (input.block) clonedBlocks.push(...cloneBlock(input.block, target));
        if (input.shadow && input.shadow !== input.block) {
            clonedBlocks.push(...cloneBlock(input.shadow, target));
        }
    });
    
    // Clone field references
    Object.values(block.fields || {}).forEach(field => {
        if (field.id) clonedBlocks.push(...cloneBlock(field.id, target));
    });
    
    return clonedBlocks;
}
```

### ScratchBlocks Integration

Work with the visual block editor:

```javascript
// Get main workspace
const workspace = window.ScratchBlocks?.getMainWorkspace();

if (workspace) {
    // Get all blocks in workspace
    const allBlocks = workspace.getAllBlocks();
    
    // Get blocks by type
    const motionBlocks = allBlocks.filter(block => block.type.startsWith('motion_'));
    
    // Set block warnings
    const block = workspace.getBlockById(blockId);
    if (block) {
        block.setWarningText('Warning message', 'warningId');
        block.setTooltip('Tooltip text');
    }
    
    // Listen for workspace updates
    vm.on('workspaceUpdate', () => {
        console.log('Workspace updated');
    });
}
```

### Runtime Hooks

Modify runtime behavior through hooks:

```javascript
// Hook into block conversion for ScratchBlocks
const originalConvert = vm.runtime._convertBlockForScratchBlocks;
vm.runtime._convertBlockForScratchBlocks = function(blockInfo, categoryInfo) {
    // Modify block info before conversion
    if (blockInfo.customProperty) {
        blockInfo.outputShape = 3; // Custom output shape
    }
    
    return originalConvert.call(this, blockInfo, categoryInfo);
};

// Hook into thread stepping
const sequencer = vm.runtime.sequencer;
const originalStep = sequencer.stepThread;
sequencer.stepThread = function(thread) {
    // Custom logic before stepping
    if (thread.skipThisStep) {
        thread.skipThisStep = false;
        return;
    }
    
    return originalStep.call(this, thread);
};
```

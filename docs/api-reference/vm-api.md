# VM API Reference

The MistWarp Virtual Machine (VM) is the core execution engine that powers Scratch projects. It provides comprehensive programmatic access to the runtime environment, allowing external code to control project execution, manipulate sprites and assets, listen for events, and configure runtime behavior.

## Overview

The VM API is accessible through `window.vm` and provides the following capabilities:

- **Project Control**: Start, stop, pause, and manage project execution
- **Asset Management**: Load, modify, and manage sprites, costumes, and sounds  
- **Runtime Configuration**: Control performance settings, compilation options, and stage properties
- **Event System**: Listen for runtime events and state changes
- **Extension Integration**: Register custom blocks and functionality
- **Data Access**: Read and modify project variables, sprites, and blocks

## Getting the VM Instance

The VM instance is globally available and can be accessed in several ways:

```javascript
// Global VM instance (most common)
const vm = window.vm;

// From React Redux store
import { useSelector } from 'react-redux';
const vm = useSelector(state => state.scratchGui.vm);
```

## Core Architecture

The VM consists of several key components:

- **Runtime** (`vm.runtime`): Core execution engine and state management
- **Targets** (`vm.runtime.targets`): Sprites and stage objects
- **Sequencer** (`vm.runtime.sequencer`): Thread scheduler and execution controller
- **IO Devices** (`vm.runtime.ioDevices`): Input/output handlers (keyboard, mouse, etc.)
- **Extension Manager** (`vm.extensionManager`): Extension loading and management

## Project Control

### Starting and Stopping

#### `vm.start()`
Initializes and starts the VM runtime.

```javascript
vm.start();
// Must be called before project execution
```

#### `vm.greenFlag()`
Triggers the green flag event, starting all scripts with green flag hat blocks.

```javascript
vm.greenFlag();
// Equivalent to clicking the green flag button
vm.greenFlag();
// Starts project and triggers "when green flag clicked" blocks
```

#### `vm.stopAll()`
Stop all scripts and sounds.

```javascript
vm.stopAll();
// Stops all running scripts and sounds
```

### Project Loading

#### `vm.loadProject(projectData)`
Load a project from data.

```javascript
// Load from .sb3 file data
const fileData = await file.arrayBuffer();
await vm.loadProject(fileData);

// Load from JSON
const projectJson = { /* project data */ };
await vm.loadProject(JSON.stringify(projectJson));
```

**Parameters:**
- `projectData` (ArrayBuffer | string): Project data in .sb3 format or JSON string

**Returns:** Promise that resolves when project is loaded

#### `vm.saveProjectSb3()`
Export current project as .sb3 data.

```javascript
const projectData = await vm.saveProjectSb3();
// Returns ArrayBuffer that can be saved as .sb3 file

// Save to file
const blob = new Blob([projectData], { type: 'application/octet-stream' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'project.sb3';
a.click();
```

**Returns:** `Promise<ArrayBuffer>;` containing .sb3 project data

### Target Management

#### `vm.runtime.targets`
Array of all targets (sprites and stage).

```javascript
const targets = vm.runtime.targets;
console.log('All targets:', targets);
console.log('Sprites:', targets.filter(t => !t.isStage));
console.log('Stage:', targets.find(t => t.isStage));
```

**Type:** Array of target objects

#### `vm.editingTarget`
Currently selected sprite/stage.

```javascript
const target = vm.editingTarget;
if (target) {
  console.log('Currently editing:', target.getName());
}
```

**Type:** Target object or null

#### `vm.setEditingTarget(targetId)`
Set the editing target.

```javascript
const sprite = vm.runtime.targets.find(t => t.getName() === 'Misty');
if (sprite) {
  vm.setEditingTarget(sprite.id);
}
```

**Parameters:**
- `targetId` (string): ID of target to select

#### `vm.deleteSprite(targetId)`
Delete a sprite from the project.

```javascript
// Find sprite by name
const sprite = vm.runtime.targets.find(t => t.getName() === 'Sprite1' && !t.isStage);
if (sprite) {
  vm.deleteSprite(sprite.id);
}
```

**Parameters:**
- `targetId` (string): ID of the sprite to delete

**Note:** Cannot delete the stage target

#### `vm.exportSprite(targetId)`
Export a sprite as a .sprite3 file blob.

```javascript
// Export sprite
const sprite = vm.runtime.targets.find(t => t.getName() === 'Sprite1');
if (sprite) {
  const spriteBlob = await vm.exportSprite(sprite.id);
  
  // Save to file
  const url = URL.createObjectURL(spriteBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${sprite.getName()}.sprite3`;
  a.click();
}
```

**Parameters:**
- `targetId` (string): ID of the sprite to export

**Returns:** `Promise<Blob>` containing .sprite3 sprite data

### Runtime Information

#### `vm.getPlaygroundData()`
Get current runtime state.

```javascript
const data = vm.getPlaygroundData();
console.log('Targets:', data.targets);
console.log('Variables:', data.variables);
console.log('Lists:', data.lists);
```

**Returns:** Object containing runtime state

#### `vm.runtime.getSpriteTargetByName(name)`
Get a sprite target by its name.

```javascript
// Find sprite by name
const sprite = vm.runtime.getSpriteTargetByName('Sprite1');
if (sprite && !sprite.isStage) {
  console.log('Found sprite:', sprite.getName());
}
```

**Parameters:**
- `name` (string): Name of the sprite

**Returns:** Target object or null if not found

#### `vm.runtime.getTargetForStage()`
Get the stage target.

```javascript
const stage = vm.runtime.getTargetForStage();
console.log('Stage target:', stage.getName());
```

**Returns:** Stage target object

#### `vm.runtime._monitorState`
Access monitor (variable display) state.

```javascript
const monitorState = vm.runtime._monitorState;
console.log('Monitor state:', monitorState);
```

**Type:** Object containing monitor state information

#### `vm.runtime.monitorBlocks`
Access monitor blocks container.

```javascript
const monitorBlocks = vm.runtime.monitorBlocks;
console.log('Monitor blocks:', monitorBlocks);
```

**Type:** Monitor blocks container object

## Target API

Target objects represent sprites and the stage.

### Target Properties

```javascript
const target = vm.editingTarget;

// Basic properties
console.log(target.id);        // Unique identifier
console.log(target.getName()); // Display name
console.log(target.isStage);   // true for stage, false for sprites

// Position and appearance (sprites only)
if (!target.isStage) {
  console.log(target.x);         // X position
  console.log(target.y);         // Y position
  console.log(target.direction); // Direction (0-359)
  console.log(target.size);      // Size percentage
  console.log(target.visible);   // Visibility
}

// Costumes and sounds
console.log(target.getCostumes());
console.log(target.getSounds());
console.log(target.getCurrentCostume());
```

### Target Methods

#### `target.setXY(x, y)`
Set sprite position.

```javascript
const sprite = vm.editingTarget;
if (sprite && !sprite.isStage) {
  sprite.setXY(100, 50);
}
```

#### `target.setDirection(direction)`
Set sprite direction.

```javascript
sprite.setDirection(90); // Point right
```

#### `target.setSize(size)`
Set sprite size.

```javascript
sprite.setSize(150); // 150% of original size
```

#### `target.setVisible(visible)`
Set sprite visibility.

```javascript
sprite.setVisible(false); // Hide sprite
```

#### `target.goToFront()`
Move sprite to front layer.

```javascript
sprite.goToFront();
```

#### `target.goToBack()`
Move sprite to back layer.

```javascript
sprite.goToBack();
```

## Event System

The VM emits events that can be listened to.

### Core Events

#### `PROJECT_LOADED`
Fired when a project is loaded.

```javascript
vm.on('PROJECT_LOADED', () => {
  console.log('Project loaded successfully');
});
```

#### `PROJECT_CHANGED`
Fired when project is modified.

```javascript
vm.on('PROJECT_CHANGED', () => {
  console.log('Project has unsaved changes');
});
```

#### `TARGETS_UPDATE`
Fired when targets (sprites) are modified.

```javascript
vm.on('TARGETS_UPDATE', (targets) => {
  console.log('Targets updated:', targets);
});
```

#### `VISUAL_REPORT`
Fired on each frame for visual updates.

```javascript
vm.on('VISUAL_REPORT', (data) => {
  // Update custom renderer
  updateCustomStage(data);
});
```

#### `MONITORS_UPDATE`
Fired when variable monitors update.

```javascript
vm.on('MONITORS_UPDATE', (monitors) => {
  updateVariableDisplays(monitors);
});
```

### Runtime Events

#### `PROJECT_RUN_START`
Project starts running.

```javascript
vm.on('PROJECT_RUN_START', () => {
  console.log('Project started');
});
```

#### `PROJECT_RUN_STOP`
Project stops running.

```javascript
vm.on('PROJECT_RUN_STOP', () => {
  console.log('Project stopped');
});
```

#### `COMPILE_ERROR`
Script compilation error occurs.

```javascript
vm.on('COMPILE_ERROR', (target, error) => {
  console.error('Compile error in target:', target, error);
});
```

## Variable Management

### Getting Variables

```javascript
// Get all variables for a target
const target = vm.editingTarget;
console.log('Target variables:', target.variables);

// Look up variable by name and type
const variable = target.lookupVariableByNameAndType('my variable', 'variable');
if (variable) {
  console.log('Variable value:', variable.value);
}

// Get all variable names of a type from runtime
const allVarNames = vm.runtime.getAllVarNamesOfType('variable');
console.log('All variable names:', allVarNames);
```

### Setting Variables

```javascript
// Set variable value
const target = vm.editingTarget;
const variable = target.lookupVariableByNameAndType('score', 'variable');
if (variable) {
  variable.value = 100;
}
```

### Creating Variables

```javascript
// Create new variable on target
const target = vm.editingTarget;
target.createVariable('new-var-id', 'new variable', 'variable', false);

// Create new global variable
const newVar = vm.runtime.createNewGlobalVariable('global var', null, 'variable');
console.log('Created variable:', newVar.name);
```

## Block Management

### Getting Blocks

```javascript
// Get all blocks for target
const blocks = target.blocks;

// Get specific block
const block = blocks.getBlock(blockId);
console.log('Block opcode:', block.opcode);
console.log('Block inputs:', block.inputs);
```

### Running Blocks

```javascript
// Create and start a new thread for a block
const target = vm.editingTarget;
vm.runtime._pushThread(blockId, target);

// Access running threads
console.log('Active threads:', vm.runtime.threads);

// Step through threads (this is normally done automatically)
const doneThreads = vm.runtime.sequencer.stepThreads();
```

**Note:** For advanced thread management, monitoring, and control, see the [Threads API Reference](./threads.md).

## Extension API

For extension development within the VM.

### Extension Registration

```javascript
class MyExtension {
  getInfo() {
    return {
      id: 'myextension',
      name: 'My Extension',
      blocks: [
        {
          opcode: 'myBlock',
          blockType: 'command',
          text: 'do something'
        }
      ]
    };
  }
  
  myBlock() {
    console.log('My block executed!');
  }
}

// Register extension
vm.extensionManager.loadExtensionURL('myextension', MyExtension);
```

### Custom Blocks

```javascript
// Define custom block
{
  opcode: 'customCommand',
  blockType: 'command',
  text: 'custom command with [TEXT] and [NUMBER]',
  arguments: {
    TEXT: {
      type: 'string',
      defaultValue: 'hello'
    },
    NUMBER: {
      type: 'number',
      defaultValue: 10
    }
  }
}

// Implement block function
customCommand(args) {
  console.log('Text:', args.TEXT);
  console.log('Number:', args.NUMBER);
}
```

## Performance Monitoring

### Frame Rate

```javascript
let frameCount = 0;
let lastTime = performance.now();

vm.on('VISUAL_REPORT', () => {
  frameCount++;
  const now = performance.now();
  
  if (now - lastTime >= 1000) {
    const fps = frameCount;
    console.log('FPS:', fps);
    frameCount = 0;
    lastTime = now;
  }
});
```

### Script Performance

```javascript
// Monitor script execution timing
let executeStartTime;

vm.runtime.on('BEFORE_EXECUTE', () => {
  executeStartTime = performance.now();
});

vm.runtime.on('AFTER_EXECUTE', () => {
  const duration = performance.now() - executeStartTime;
  console.log('Execution cycle took:', duration + 'ms');
});
```

## Error Handling

### Catching Load Errors

```javascript
try {
  await vm.loadProject(projectData);
  console.log('Project loaded successfully');
} catch (error) {
  console.error('Failed to load project:', error);
  
  // Fall back to empty project
  await vm.loadProject(getEmptyProject());
  
  // Show user-friendly error
  showErrorMessage('Could not load project. Started with empty project.');
}
```

### Monitoring Compilation Errors

```javascript
vm.runtime.on('COMPILE_ERROR', (target, error) => {
  console.error('Compilation error in target:', target.getName(), error);
  
  // Could disable compiler for this target or show user feedback
  target.blocks.resetCache();
});
```

## Best Practices

### Memory Management

```javascript
// Clean up event listeners
const cleanup = () => {
  vm.off('PROJECT_LOADED', handleProjectLoaded);
  vm.off('TARGETS_UPDATE', handleTargetsUpdate);
};

// Call cleanup when component unmounts
useEffect(() => cleanup, []);
```

### Performance

```javascript
// Debounce frequent operations
const debouncedSave = debounce(() => {
  saveProject();
}, 1000);

vm.on('PROJECT_CHANGED', debouncedSave);
```

### Error Recovery

```javascript
// Implement retry logic for critical operations
const loadProjectWithRetry = async (data, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await vm.loadProject(data);
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

## Renderer API

### Canvas Access

#### `vm.renderer.canvas`
Access to the main rendering canvas.

```javascript
const canvas = vm.renderer.canvas;
console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

// Canvas context (if needed for custom rendering)
const ctx = canvas.getContext('2d');
```

#### `vm.renderer._nativeSize`
Get the native rendering size.

```javascript
const [width, height] = vm.renderer._nativeSize;
console.log('Native size:', width, 'x', height);
```

### Color Sampling

#### `vm.renderer.extractColor(x, y, radius)`
Extract pixel color data from the canvas at given coordinates.

```javascript
// Extract color at screen coordinates
const colorData = vm.renderer.extractColor(100, 150, 1);

// Access color components
const color = colorData.color;
console.log('RGBA:', color.r, color.g, color.b, color.a);

// Get raw pixel data
const pixels = colorData.data; // Uint8Array of pixel data
```

**Parameters:**
- `x` (number): X coordinate on canvas
- `y` (number): Y coordinate on canvas  
- `radius` (number): Sampling radius (minimum 1)

**Returns:** Object with `color` and `data` properties

### Layer Management

#### `vm.renderer.setLayerGroupOrdering(layers)`
Set the order of rendering layers.

```javascript
// Default layer order
const defaultLayers = ['background', 'video', 'pen', 'sprite'];
vm.renderer.setLayerGroupOrdering(defaultLayers);

// Custom layer order (pen on top)
const customLayers = ['background', 'video', 'sprite', 'pen'];
vm.renderer.setLayerGroupOrdering(customLayers);
```

**Parameters:**
- `layers` (Array\<String\>): Array of layer names in render order

**Required layers:** 'background', 'video', 'pen', 'sprite'


## Related Documentation

- [GUI API Reference](gui-api)
- [Extension API Reference](extension-api)
- [Event System](events)

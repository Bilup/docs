---
name: Scratch
---

# Scratch Object API

The global `Scratch` object is the primary interface for extensions to interact with the Scratch runtime, VM, and utility functions. This API provides access to the virtual machine, renderer, argument/block types, casting utilities, and various extension capabilities.

## Overview

The `Scratch` object serves as the entry point for extension development, providing:
- Access to the VM and runtime
- Block and argument type constants
- Utility functions for data casting and manipulation
- Extension registration capabilities
- Security and permissions APIs (for unsandboxed extensions)

## Basic Structure

```js
(function(Scratch) {
  'use strict';

  class MyExtension {
    getInfo() {
      return {
        id: 'myextension',
        name: 'My Extension',
        blocks: [
          {
            opcode: 'myBlock',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert [VALUE] to number',
            arguments: {
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '42'
              }
            }
          }
        ]
      };
    }

    myBlock(args) {
      return Scratch.Cast.toNumber(args.VALUE);
    }
  }

  Scratch.extensions.register(new MyExtension());
})(Scratch);
```

## Core Properties

### `Scratch.vm`
**Unsandboxed Only**

Direct access to the Scratch Virtual Machine instance.

```js
const vm = Scratch.vm;

// Access runtime
const runtime = vm.runtime;
const targets = runtime.targets;
const stage = runtime.getTargetForStage();

// Control execution
vm.greenFlag();
vm.stopAll();
vm.setTurboMode(true);

// Listen to events
vm.runtime.on('PROJECT_RUN_START', () => {
  console.log('Project started');
});
```

**Common VM Operations:**
- `vm.greenFlag()` - Start the project
- `vm.stopAll()` - Stop all scripts
- `vm.setTurboMode(enabled)` - Enable/disable turbo mode
- `vm.runtime.targets` - Array of all sprites and stage
- `vm.runtime.getTargetForStage()` - Get the stage target
- `vm.editingTarget` - Currently selected sprite in editor

### `Scratch.renderer`
**Unsandboxed Only**

Direct access to the WebGL renderer instance.

```js
const renderer = Scratch.renderer;

// Trigger redraw
renderer.draw();

// Access canvas dimensions
const canvas = renderer.canvas;
console.log(canvas.width, canvas.height);
```

### `Scratch.extensions`

Extension registration and metadata.

```js
// Register an extension
Scratch.extensions.register(new MyExtension());

// Check if unsandboxed (unsandboxed extensions only)
if (Scratch.extensions.unsandboxed) {
  // Use unsandboxed APIs
}
```

### `Scratch.vm.extensionManager`
**Unsandboxed Only**

Manages loaded extensions. Useful for dynamic block updates.

```js
// Force the toolbox to re-render
// Useful when changing button text
// Force a toolbox refresh
vm.extensionManager.refreshBlocks(extensionId);
```

### UI Customization

For advanced UI customization involving the block editor itself (Blockly), you can access the global `ScratchBlocks` object. See [GUI API](/api-reference/gui-api#scratchblocks-integration) for details.

## Type Constants

### `Scratch.ArgumentType`

Defines the types of arguments that blocks can accept.

```js
const ArgumentType = Scratch.ArgumentType;

// Basic types
ArgumentType.STRING    // 'string' - Text input
ArgumentType.NUMBER    // 'number' - Numeric input
ArgumentType.BOOLEAN   // 'Boolean' - Boolean input (hexagonal)
ArgumentType.COLOR     // 'color' - Color picker
ArgumentType.ANGLE     // 'angle' - Angle picker (circular)

// Special types
ArgumentType.MATRIX    // 'matrix' - Matrix/grid input
ArgumentType.NOTE      // 'note' - Musical note picker
ArgumentType.COSTUME   // 'costume' - Costume dropdown
ArgumentType.SOUND     // 'sound' - Sound dropdown
ArgumentType.IMAGE     // 'image' - Inline image display
```

**Example usage:**
```js
{
  opcode: 'setColor',
  text: 'set pen color to [COLOR]',
  arguments: {
    COLOR: {
      type: Scratch.ArgumentType.COLOR,
      defaultValue: '#ff0000'
    }
  }
}
```

### `Scratch.BlockType`

Defines the shapes and behaviors of blocks.

```js
const BlockType = Scratch.BlockType;

// Basic block types
BlockType.COMMAND     // 'command' - Stack block (rounded)
BlockType.REPORTER    // 'reporter' - Round reporter block
BlockType.BOOLEAN     // 'Boolean' - Hexagonal boolean block

// Control flow blocks
BlockType.HAT         // 'hat' - Hat block (starts scripts)
BlockType.CONDITIONAL // 'conditional' - If/else style block
BlockType.LOOP        // 'loop' - Repeat/forever style block

// Special types
BlockType.EVENT       // 'event' - Event hat (no implementation)
BlockType.BUTTON      // 'button' - UI button (not a block)
BlockType.LABEL       // 'label' - Text label (not a block)
BlockType.XML         // 'xml' - Custom Blockly XML
```

**Example usage:**
```js
{
  opcode: 'checkCondition',
  blockType: Scratch.BlockType.BOOLEAN,
  text: 'is [VALUE] greater than 10?',
  arguments: {
    VALUE: {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: 5
    }
  }
}
```

### `Scratch.TargetType`

Specifies which sprites/stage a block can run on.

```js
const TargetType = Scratch.TargetType;

TargetType.SPRITE  // 'sprite' - Only sprites
TargetType.STAGE   // 'stage' - Only the stage

// Usage in block definition
{
  opcode: 'moveSteps',
  filter: [Scratch.TargetType.SPRITE], // Only show for sprites
  // ...
}
```

## Utility Functions

### `Scratch.Cast`

Data type conversion utilities used throughout Scratch.

```js
const Cast = Scratch.Cast;

// Number conversion
Cast.toNumber('3.14')        // 3.14
Cast.toNumber('abc')         // 0
Cast.toNumber(true)          // 1
Cast.toNumber(false)         // 0

// String conversion
Cast.toString(42)            // '42'
Cast.toString(true)          // 'true'
Cast.toString(null)          // ''

// Boolean conversion
Cast.toBoolean('true')       // true
Cast.toBoolean('false')      // false
Cast.toBoolean(0)            // false
Cast.toBoolean(1)            // true
Cast.toBoolean('')           // false

// Color conversion
Cast.toRgbColorList('#ff0000')  // [255, 0, 0]
Cast.toRgbColorObject('#00ff00')  // {r: 0, g: 255, b: 0}

// Comparison (Scratch-style)
Cast.compare('10', '9')      // 1 (numeric comparison)
Cast.compare('apple', 'banana')  // -1 (string comparison)
Cast.isInt(3.14)             // false
Cast.isInt(42)               // true
```

**Practical example:**
```js
myMathBlock(args) {
  const a = Scratch.Cast.toNumber(args.A);
  const b = Scratch.Cast.toNumber(args.B);
  return a + b;
}

myTextBlock(args) {
  const text = Scratch.Cast.toString(args.INPUT);
  return text.toUpperCase();
}
```

## Block Utility Object (Unsandboxed Only)

When blocks run in unsandboxed extensions, they receive a second `util` parameter providing access to the execution context.

### Basic Properties

```js
myBlock(args, util) {
  // Access the current sprite/target
  const target = util.target;
  const spriteName = target.getName();
  
  // Access the runtime
  const runtime = util.runtime;
  const stage = runtime.getTargetForStage();
  
  // Access the current thread
  const thread = util.thread;
  
  // Access execution context
  const stackFrame = util.stackFrame;
}
```

### Target Manipulation

```js
// Get sprite properties
const x = util.target.x;
const y = util.target.y;
const direction = util.target.direction;
const size = util.target.size;

// Set sprite properties
util.target.setXY(100, 50);
util.target.setDirection(90);
util.target.setSize(150);

// Variables and lists
const variable = util.target.lookupVariableByNameAndType('my variable', '');
if (variable) {
  console.log('Variable value:', variable.value);
  variable.value = 'new value';
}

// Check if variable exists
const hasVar = !!util.target.lookupVariableByNameAndType('score', '');
const hasList = !!util.target.lookupVariableByNameAndType('items', 'list');
```

### Thread Control

```js
// Start other scripts
const startedThreads = util.startHats('event_whenbroadcastreceived', {
  BROADCAST_OPTION: 'my message'
});
// Note: options object matches the fields in the hat block

// Control block execution
util.yield();        // Pause this block until next frame
util.yieldTick();    // Pause until next tick

// Timer utilities
if (util.stackTimerNeedsInit()) {
  util.startStackTimer(1000); // 1 second
  util.yield();
} else if (!util.stackTimerFinished()) {
  util.yield();
}
```

### Branch Control (for C-blocks)

```js
// For conditional/loop blocks
util.startBranch(1, false);  // Start first branch, not a loop
util.startBranch(2, false);  // Start second branch (else)
util.startBranch(1, true);   // Start branch as loop
```

## Runtime Events (Unsandboxed Only)

Listen to VM events for reactive extensions:

```js
const runtime = Scratch.vm.runtime;

// Project lifecycle
runtime.on('PROJECT_RUN_START', () => {
  console.log('Project started');
});

runtime.on('PROJECT_RUN_STOP', () => {
  console.log('Project stopped');
});

runtime.on('PROJECT_CHANGED', () => {
  console.log('Project modified');
});

// Target events
runtime.on('targetWasCreated', (target) => {
  console.log('New sprite:', target.getName());
});

runtime.on('TARGETS_UPDATE', () => {
  console.log('Sprite list changed');
});

// Variable events
runtime.on('MONITORS_UPDATE', (monitors) => {
  console.log('Variable monitors updated');
});
```

## Security APIs (Unsandboxed Only)

Unsandboxed extensions have access to various security-gated APIs:

### Network Access

```js
// Check and make network requests
if (await Scratch.canFetch('https://api.example.com')) {
  const response = await Scratch.fetch('https://api.example.com/data');
  const data = await response.json();
}
```

### Window Management

```js
// Open new windows
if (await Scratch.canOpenWindow('https://example.com')) {
  Scratch.openWindow('https://example.com');
}

// Redirect current page
if (await Scratch.canRedirect('https://example.com')) {
  await Scratch.redirect('https://example.com');
}
```

### Device Access

```js
// Check various permissions
const canRecord = await Scratch.canRecordAudio();
const canCamera = await Scratch.canRecordVideo();
const canClipboard = await Scratch.canReadClipboard();
const canNotify = await Scratch.canNotify();
const canGeolocate = await Scratch.canGeolocate();
```

## Common Patterns

### Variable Management

```js
getVariable(args, util) {
  const variable = util.target.lookupVariableByNameAndType(args.NAME, '');
  return variable ? variable.value : 0;
}

setVariable(args, util) {
  const variable = util.target.lookupVariableByNameAndType(args.NAME, '');
  if (variable) {
    variable.value = Scratch.Cast.toString(args.VALUE);
  }
}
```

### List Operations

```js
getListItem(args, util) {
  const list = util.target.lookupVariableByNameAndType(args.LIST, 'list');
  if (list && list.value) {
    const index = Scratch.Cast.toNumber(args.INDEX) - 1; // Scratch uses 1-based
    return list.value[index] || '';
  }
  return '';
}
```

### Hat Block Implementation

```js
// In getInfo()
{
  opcode: 'whenSomething',
  blockType: Scratch.BlockType.HAT,
  text: 'when something happens',
  isEdgeActivated: false // Runs continuously vs. edge-triggered
}

// Start the hat from elsewhere
setInterval(() => {
  Scratch.vm.runtime.startHats('myextension_whenSomething');
}, 1000);
```

### Async Operations

```js
async waitBlock(args, util) {
  const seconds = Scratch.Cast.toNumber(args.SECONDS);
  
  if (util.stackTimerNeedsInit()) {
    util.startStackTimer(seconds * 1000);
    util.yield();
  } else if (!util.stackTimerFinished()) {
    util.yield();
  }
  // Block completes when timer finishes
}
```

## Error Handling

```js
myBlock(args, util) {
  try {
    // Your block logic
    const result = someOperation(args.INPUT);
    return result;
  } catch (error) {
    console.warn('Extension error:', error);
    return 0; // Return sensible default
  }
}
```

## Best Practices

1. **Always validate inputs** using `Scratch.Cast` functions
2. **Use `util.target` safely** - check if variables exist before accessing
3. **Handle errors gracefully** - return sensible defaults
4. **Use appropriate block types** for your functionality
5. **Respect sandboxing** - check `Scratch.extensions.unsandboxed` before using VM APIs
6. **Save context early** when using async operations:

```js
// Good - save context immediately
myAsyncBlock(args, util) {
  const target = util.target;
  const runtime = util.runtime;
  
  setTimeout(() => {
    // Use saved references
    target.setXY(100, 100);
  }, 1000);
}

// Bad - util may change by the time callback runs
myAsyncBlock(args, util) {
  setTimeout(() => {
    util.target.setXY(100, 100); // May not work correctly
  }, 1000);
}
```

## Translation Support

```js
// Use Scratch.translate for internationalization
const message = Scratch.translate({
  id: 'myextension.hello',
  default: 'Hello {name}!',
  description: 'Greeting message'
}, {
  name: args.NAME
});
```

The Scratch object API provides the foundation for creating powerful, integrated extensions that can interact deeply with the Scratch environment while maintaining appropriate security boundaries.

---
title: Scratch object API
sidebar_position: 1
---

# Scratch object API

The global `Scratch` object is how an extension talks to MistWarp. It carries the registration function, the type constants, casting helpers, and (for unsandboxed extensions) direct access to the VM and permission APIs.

Sandboxed extensions get a limited `Scratch`; the VM, renderer, and block utility are unsandboxed only.

## Registration and structure

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
            arguments: { VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: '42' } }
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

- `Scratch.extensions.register(instance)`: register your extension. Call it exactly once.
- `Scratch.extensions.unsandboxed`: `true` when running unsandboxed. Check it before using any unsandboxed-only API.

## Type constants

### Scratch.BlockType

| Constant | Value | Meaning |
|:--|:--|:--|
| `COMMAND` | `command` | Stack block, no return value |
| `REPORTER` | `reporter` | Round block returning a string or number |
| `BOOLEAN` | `Boolean` | Hexagonal block returning true/false |
| `HAT` | `hat` | Conditionally starts a stack (see [Events and hats](/building-extensions/hats)) |
| `EVENT` | `event` | Starts a stack on an event; has no function |
| `CONDITIONAL` | `conditional` | `if`/`else` style C block (see [Custom C blocks](/building-extensions/custom-c-blocks)) |
| `LOOP` | `loop` | `repeat`/`forever` style C block |
| `BUTTON` | `button` | A palette button, not a real block |
| `LABEL` | `label` | A text label in the palette, not a real block |
| `XML` | `xml` | Raw Blockly XML |

### Scratch.ArgumentType

`STRING`, `NUMBER`, `BOOLEAN`, `COLOR`, `ANGLE`, `MATRIX`, `NOTE`, `COSTUME`, `SOUND`, `IMAGE`. See [Dealing with inputs](/building-extensions/inputs) for what each accepts.

### Scratch.TargetType

`SPRITE` (`'sprite'`) and `STAGE` (`'stage'`), used with a block's `filter`.

## Scratch.Cast

Scratch-semantic conversions. Full detail on the [Utility APIs page](/building-extensions/apis/utility-apis).

```js
Scratch.Cast.toNumber('3.14');   // 3.14
Scratch.Cast.toString(42);       // '42'
Scratch.Cast.toBoolean('false'); // false
Scratch.Cast.compare('10', '9'); // > 0
```

## Scratch.vm (unsandboxed only)

The VM instance. See the [VM API page](/building-extensions/apis/vm-api) for the full surface.

```js
const vm = Scratch.vm;
const runtime = vm.runtime;

vm.greenFlag();
vm.stopAll();
vm.setTurboMode(true);

runtime.targets;               // all sprites and the stage
runtime.getTargetForStage();   // the stage
vm.editingTarget;              // sprite selected in the editor

runtime.on('PROJECT_RUN_START', () => { /* ... */ });
```

## Scratch.renderer (unsandboxed only)

The WebGL renderer. See the [Renderer API page](/building-extensions/apis/renderer-api).

```js
const renderer = Scratch.renderer;
renderer.draw();
const canvas = renderer.canvas;
```

## The block utility (unsandboxed only)

Unsandboxed block functions receive a second parameter, `util`, valid only while the block runs (see [Unsandboxed extensions](/building-extensions/unsandboxed)).

```js
myBlock(args, util) {
  const target = util.target;   // the sprite running the block
  const runtime = util.runtime; // the runtime
  const thread = util.thread;   // the running thread
  const frame = util.stackFrame; // scratch space for this block invocation
}
```

Common uses:

```js
// Target properties
util.target.x; util.target.y; util.target.direction; util.target.size;
util.target.setXY(100, 50);
util.target.setDirection(90);

// Variables and lists (type '' for a variable, 'list' for a list)
const v = util.target.lookupVariableByNameAndType('score', '');
if (v) v.value = 100;

// Start hat/event scripts (see the Events and hats page)
util.startHats('event_whenbroadcastreceived', { BROADCAST_OPTION: 'go' });

// C-block branches (see the Custom C blocks page)
util.startBranch(1, true);
```

## Permission APIs (unsandboxed only)

Unsandboxed extensions must ask before reaching the network or the outside world. See [Unsandboxed extensions](/building-extensions/unsandboxed) for why and how.

```js
// Network
if (await Scratch.canFetch(url)) { /* WebSocket, Image, etc. */ }
const res = await Scratch.fetch(url);

// Windows / navigation
if (await Scratch.canOpenWindow(url)) { /* ... */ }
await Scratch.openWindow(url);
if (await Scratch.canRedirect(url)) { /* ... */ }
await Scratch.redirect(url);

// Devices
await Scratch.canRecordAudio();
await Scratch.canRecordVideo();
await Scratch.canReadClipboard();
await Scratch.canNotify();
await Scratch.canGeolocate();
```

## Translation

`Scratch.translate` marks strings for translation:

```js
const message = Scratch.translate({
  id: 'myextension.hello',
  default: 'Hello {name}!',
  description: 'Greeting'
}, { name: args.NAME });
```

## Editing Blockly directly

For deep editor customization you can reach the global `ScratchBlocks` object. See the [GUI API](/api-reference/gui-api) for details.

## See also

- [VM API](/building-extensions/apis/vm-api)
- [Renderer API](/building-extensions/apis/renderer-api)
- [Audio API](/building-extensions/apis/audio-api)
- [Utility APIs](/building-extensions/apis/utility-apis)

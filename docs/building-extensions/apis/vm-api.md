---
title: VM API
sidebar_position: 3
---

# VM API

The VM (virtual machine) runs the project. It is available to [unsandboxed extensions](/building-extensions/unsandboxed) as `Scratch.vm`, and to block functions as `util.runtime` (the runtime is `vm.runtime`).

```js
if (!Scratch.extensions.unsandboxed) {
  throw new Error('This extension needs the VM');
}
const vm = Scratch.vm;
const runtime = vm.runtime;
```

These are internal objects, not a frozen public API. Guard for missing values (sprites get deleted, extensions unload) and prefer listening to events over polling. Most of these methods exist on both MistWarp and TurboWarp; MistWarp-specific behavior is noted where it matters.

## Project control

```js
vm.greenFlag();          // press the green flag
vm.stopAll();            // stop all scripts
vm.setTurboMode(true);   // turbo mode on/off
vm.setFramerate(60);     // target frames per second
vm.setInterpolation(true);
vm.setCompilerOptions({ enabled: true, warpTimer: false });
vm.setRuntimeOptions({ maxClones: 300, miscLimits: true, fencing: true });
vm.setStageSize(width, height);
```

MistWarp compiles projects by default (`compilerOptions.enabled` is `true`). Framerate and stage size are not limited to Scratch's 30 FPS / 480x360.

## Targets

A "target" is a sprite, a clone, or the stage.

```js
runtime.targets;                          // array of all targets (stage + sprites + clones)
runtime.getTargetForStage();              // the stage target
runtime.getTargetById(id);                // by internal id
runtime.getSpriteTargetByName('Sprite1'); // the original (non-clone) sprite by name
vm.editingTarget;                         // the sprite currently open in the editor
```

Target properties and methods:

```js
const t = runtime.getSpriteTargetByName('Sprite1');
t.x; t.y; t.direction; t.size; t.visible;
t.getName();
t.isStage; t.isOriginal;
t.currentCostume;                         // index
t.sprite.costumes[t.currentCostume].name;

t.setXY(100, 50);
t.setDirection(90);
t.setSize(150);
```

### Clones

```js
const original = runtime.getSpriteTargetByName('Sprite1');
const clone = original.makeClone();
if (clone) {
  runtime.addTarget(clone);
  clone.setXY(100, 50);
}

// remove a clone (never the original)
if (!clone.isOriginal) runtime.disposeTarget(clone);
```

## Variables and lists

Variables and lists live on a target. Use `''` as the type for a variable, `'list'` for a list.

```js
const stage = runtime.getTargetForStage();

const score = stage.lookupVariableByNameAndType('score', '');
if (score) score.value = 100;

const items = stage.lookupVariableByNameAndType('items', 'list');
if (items) items.value.push('new item');
```

Global variables and lists live on the stage; sprite-local ones on the sprite. To enumerate, iterate `target.variables` and check each entry's `.type`.

## Starting scripts

```js
// Start every "when flag clicked" hat
runtime.startHats('event_whenflagclicked');

// Start hats matching a field
runtime.startHats('event_whenbroadcastreceived', { BROADCAST_OPTION: 'message1' });
```

`startHats` returns the started `Thread` objects. Inside a running block, use `util.startHats` instead. See [Events and hats](/building-extensions/hats).

## Threads

```js
runtime.threads;              // running threads
runtime.stopForTarget(target); // stop a target's scripts

thread.target;   // the target running it
thread.topBlock; // id of the top block
thread.status;   // see below
```

Thread status values:

| Value | Constant | Meaning |
|:-:|:--|:--|
| 0 | `STATUS_RUNNING` | Running |
| 1 | `STATUS_PROMISE_WAIT` | Waiting on a Promise |
| 2 | `STATUS_YIELD` | Yielded this frame |
| 3 | `STATUS_YIELD_TICK` | Yielded until next tick |
| 4 | `STATUS_DONE` | Finished |

From inside a block, `util` (the block utility) is your handle on the current thread rather than reaching into `runtime.threads`:

- `util.thread` is the `Thread` running the block.
- `util.yield()` yields the current thread for this frame (returning a Promise from an async block is the usual way to wait; `util.yield()` is the manual equivalent).
- `util.yieldTick()` yields until the next tick.
- `util.startBranch(index, isLoop)` runs a C-block branch (see [Custom C blocks](/building-extensions/custom-c-blocks)).

For the full thread model, statuses, and the sequencer, see the [Threads reference](/api-reference/threads).

## Events

Listen with `vm.on(...)` or `runtime.on(...)`:

| Event | Fires when |
|:--|:--|
| `PROJECT_RUN_START` | Scripts begin running |
| `PROJECT_RUN_STOP` | All scripts have stopped |
| `PROJECT_LOADED` | A project finished loading |
| `PROJECT_CHANGED` | The project was modified |
| `targetWasCreated` | A target (often a clone) is created; args `(newTarget, sourceTarget)` |
| `TARGETS_UPDATE` | The target list changed |
| `BEFORE_EXECUTE` | Each frame, before scripts run (useful for predicate hats) |
| `MONITORS_UPDATE` | Monitor values changed |

```js
runtime.on('targetWasCreated', (target) => console.log('created', target.getName()));
vm.on('PROJECT_RUN_START', () => console.log('running'));
```

The table above lists the events extensions reach for most often. For the full set of runtime events and lifecycle, see the [Runtime reference](/api-reference/runtime).

## Input devices

```js
const mouse = runtime.ioDevices.mouse;
mouse.getClientX(); mouse.getClientY(); mouse.getIsDown();

const keyboard = runtime.ioDevices.keyboard;
keyboard.getKeyIsDown('space');

const clock = runtime.ioDevices.clock;
clock.projectTimer();       // seconds since timer reset
clock.resetProjectTimer();
```

## Stage size

```js
runtime.stageWidth;   // current logical width
runtime.stageHeight;  // current logical height
vm.setStageSize(640, 360);
```

## Extension management

```js
const em = vm.extensionManager;
em.isExtensionLoaded('pen');   // boolean
em.getExtensionURLs();         // loaded extension URLs
em.refreshBlocks('myextension'); // re-render the palette after changing block info
```

## Per-project storage

`runtime.extensionStorage` is an object saved inside the project file. Store small JSON-serializable settings keyed by your extension ID:

```js
runtime.extensionStorage.myextension = { volume: 0.5 };
```

## Compiler internals

To generate JavaScript directly (native-speed blocks), MistWarp exposes a supported compiler-extension API via `vm.exports.compiler`. That is its own topic; see [Compiled extensions](/building-extensions/compiled/overview).

## See also

- [Scratch object API](/building-extensions/apis/scratch-api)
- [Renderer API](/building-extensions/apis/renderer-api)
- [Compiled extensions](/building-extensions/compiled/overview)
- [Runtime reference](/api-reference/runtime)
- [Threads reference](/api-reference/threads)

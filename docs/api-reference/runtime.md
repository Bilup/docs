---
title: Runtime API
sidebar_position: 5.5
---

`Runtime` (`scratch-vm/src/engine/runtime.js`) is the engine that actually runs a project. The
[`VirtualMachine`](/api-reference/vm-api) owns one and exposes it as `vm.runtime`; extensions get
it as `Scratch.vm.runtime`. It holds every target, steps the [threads](/api-reference/threads),
routes input through IO devices, and emits the [events](/api-reference/events) the editor listens
to.

`Runtime` extends Node's `EventEmitter`, so `runtime.on(name, handler)` and `runtime.emit(...)`
work directly. The VM re-emits most runtime events under the same name, so UI code usually listens
on `vm`; extensions and internal code that want the raw stream listen on `runtime`.

This page covers the runtime surface an extension or the `window.vm` console can safely reach.
Anything prefixed with `_` is internal and not covered here.

## Targets

A "target" is a sprite or the stage (a `RenderedTarget`). The runtime keeps them in execution
order.

- `runtime.targets`: the array of all targets, including clones, in layer/execution order.
- `runtime.getTargetForStage()`: the stage target, or `undefined` if there is none.
- `runtime.getSpriteTargetByName(name)`: the first original (non-clone) sprite with that name.
- `runtime.getTargetById(id)`: a target by its ID (uses an internal cache).
- `runtime.getTargetByDrawableId(drawableID)`: the target owning a given renderer drawable.
- `runtime.getEditingTarget()`: the target currently selected in the editor, or `undefined`.

```js
// In the editor console:
window.vm.runtime.getTargetForStage();
window.vm.runtime.getSpriteTargetByName('Sprite1');
```

## Clones

- `runtime.clonesAvailable()`: whether another clone may be created (`false` once the count hits
  `runtimeOptions.maxClones`).
- `runtime.changeCloneCounter(delta)`: adjust the live clone count. The clone/delete blocks call
  this; you rarely need it directly.

Clones are ordinary targets in `runtime.targets`; `stopAll()` disposes every non-original one.

## IO devices

`runtime.ioDevices` groups the virtual input devices. Blocks read them; the host feeds them
through [`vm.postIOData(device, data)`](/api-reference/vm-api).

| Device | Source | Notable reads |
| --- | --- | --- |
| `keyboard` | `io/keyboard.js` | `getKeyIsDown(key)` |
| `mouse` | `io/mouse.js` | `getScratchX()`, `getScratchY()`, `getIsDown()`, `getButtonIsDown(button)` |
| `mouseWheel` | `io/mouse-wheel.js` | scroll deltas |
| `clock` | `io/clock.js` | `projectTimer()`, `resetProjectTimer()` |
| `cloud` | `io/cloud.js` | cloud-variable requests |
| `userData` | `io/user_data.js` | `getUsername()` |
| `video` | `io/video.js` | camera frames for the video-sensing extension |

## The project timer

The Scratch `timer` block reads `runtime.ioDevices.clock`:

- `runtime.ioDevices.clock.projectTimer()`: seconds since the timer was last reset.
- `runtime.ioDevices.clock.resetProjectTimer()`: reset it to zero. `greenFlag()` and `dispose()`
  do this automatically.

## Green flag and stopping

- `runtime.greenFlag()`: stop everything, reset the project timer, fire `event_whenflagclicked`
  hats. Emits `PROJECT_START`. This is what `vm.greenFlag()` calls.
- `runtime.stopAll()`: stop every thread, dispose all clones, and clear the thread list. Emits
  `PROJECT_STOP_ALL`.

## Starting threads (hats)

- `runtime.startHats(requestedHatOpcode, optMatchFields, optTarget)`: start a thread for every
  script whose top block is a hat with `requestedHatOpcode`. `optMatchFields` filters by field
  value (uppercased before comparison, so broadcasts and key presses only fire the right scripts);
  `optTarget` limits it to one target. Returns the array of new threads. It honors the hat's
  `restartExistingThreads` metadata: `true` restarts a matching running thread, `false` skips
  starting if one is already running. This is how extensions with `HAT`/`EVENT` blocks make their
  hats fire. See [Block registration](/api-reference/block-registration).
- `runtime.allScriptsDo(fn, optTarget)` / `runtime.allScriptsByOpcodeDo(opcode, fn, optTarget)`:
  iterate over every top-level script (optionally filtered by top-block opcode). `startHats` is
  built on the second one.
- `runtime.toggleScript(topBlockId, opts)`: start (or, for a click already running, stop) a script
  from its top block, as clicking it in the editor does.

There is no `startHatsWithParams` method in this engine; pass field matchers through
`startHats`'s `optMatchFields` instead.

## Events

`Runtime` emits a large set of events; the ones extensions and hosts use most:

| Event | Fires when |
| --- | --- |
| `PROJECT_START` | The green flag was pressed. |
| `PROJECT_STOP_ALL` | The stop button was hit (or `stopAll()` ran). |
| `PROJECT_RUN_START` | Threads went from idle to active this tick. |
| `PROJECT_RUN_STOP` | The last non-monitor thread finished this tick. |
| `PROJECT_LOADED` | A project finished loading. |
| `PROJECT_CHANGED` | The project was edited in a serialization-affecting way. |
| `TURBO_MODE_ON` / `TURBO_MODE_OFF` | Turbo mode toggled. |

`PROJECT_RUN_START` / `PROJECT_RUN_STOP` are edge-triggered off the non-monitor thread count, so
they fire once per idle/active transition, not once per thread. See the full list in
[Events](/api-reference/events).

## Monitors

Monitors are the value watchers shown on the stage. The runtime holds their state and the editor
renders it from the `MONITORS_UPDATE` event.

- `runtime.requestAddMonitor(monitorRecord)`: add a monitor (updates in place if the ID exists).
- `runtime.requestUpdateMonitor(delta)`: patch an existing monitor by ID; returns whether it
  existed.
- `runtime.requestRemoveMonitor(id)`: remove one.
- `runtime.requestShowMonitor(id)` / `runtime.requestHideMonitor(id)`: toggle visibility; each
  returns whether the monitor existed.
- `runtime.getMonitorState()`: the current monitor state map.

## Visual report

- `runtime.visualReport(target, blockId, value)`: show a value bubble next to a clicked reporter
  block. Only reports when `target` is the editing target; emits `VISUAL_REPORT`. Called for you
  when a reporter is clicked in the workspace.

## Redraw

- `runtime.requestRedraw()`: mark that the screen must repaint before the sequencer runs more
  work this frame. A block that changes something visible calls this; the sequencer stops stepping
  for the frame once a redraw is requested (unless turbo mode is on). See
  [Threads: the sequencer](/api-reference/threads#the-sequencer).

## Turbo and compiler flags

These are read by the engine and set through the VM's setters (which also emit change events):

- `runtime.turboMode`: `true` when loops run without yielding to redraw. Set via
  [`vm.setTurboMode`](/api-reference/vm-api).
- `runtime.runtimeOptions`: `{maxClones, miscLimits, fencing, caseSensitiveLists,
  unsafeOptimisations}`. Set via `vm.setRuntimeOptions`.
- `runtime.compilerOptions`: `{enabled, warpTimer}`. Set via `vm.setCompilerOptions`. `enabled` is
  the on/off switch for the [JavaScript compiler](/api-reference/threads#compiled-threads);
  `warpTimer` makes warp loops honor the warp timeout even outside warp mode.

## See also

- [Threads](/api-reference/threads) for the thread and sequencer model these methods drive
- [VM API](/api-reference/vm-api) for the public setters that back the flags above
- [Events](/api-reference/events) for the complete event list
- [Internals: architecture](/internals/architecture)
- [Building Extensions](/building-extensions/introduction)

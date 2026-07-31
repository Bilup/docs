---
title: Events
sidebar_position: 8
---

`VirtualMachine` extends Node's `EventEmitter`. The editor and player listen to these events to
keep the UI in sync, and you can too:

```js
vm.on('PROJECT_CHANGED', () => {
    console.log('the project was edited');
});
```

The VM re-emits most of the runtime's events under the same name, so you usually listen on `vm`.
A few things fire only on `vm.runtime`; those are noted below. This list is drawn from
`scratch-vm/src/virtual-machine.js` and `scratch-vm/src/engine/runtime.js`.

## Playback and running

| Event | Fires when |
| --- | --- |
| `PROJECT_START` | The green flag is pressed. |
| `PROJECT_RUN_START` | Threads begin running this frame (was idle, now active). |
| `PROJECT_RUN_STOP` | All threads have stopped (was active, now idle). |
| `PROJECT_CHANGED` | The project was edited in a way that affects serialization. |
| `PROJECT_LOADED` | A project finished loading. Fires on `vm.runtime`. |
| `TURBO_MODE_ON` / `TURBO_MODE_OFF` | Turbo mode was toggled. |
| `RUNTIME_STARTED` / `RUNTIME_STOPPED` | The runtime's step loop started or stopped. |

## Loading progress

| Event | Payload |
| --- | --- |
| `LOAD_PROGRESS` | `{stage, loaded, total}` where `stage` is one of `unzipping`, `parsing`, `checking`, `building`, `installing`. |
| `ASSET_PROGRESS` | `(finished, total)` as project assets download. |

## Targets, blocks, and the workspace

| Event | Payload |
| --- | --- |
| `targetsUpdate` | `{targetList, editingTarget}`. The list of targets changed or the selection changed. |
| `workspaceUpdate` | The editing target's blocks, for rebuilding the block workspace. |
| `MONITORS_UPDATE` | The current monitor (stage watcher) state. |
| `BLOCK_DRAG_UPDATE` / `BLOCK_DRAG_END` | A block is being dragged over the GUI / a drag finished. |
| `VISUAL_REPORT` | A value to show as a bubble next to a clicked reporter. |
| `SCRIPT_GLOW_ON` / `SCRIPT_GLOW_OFF` | A script started or stopped glowing. |
| `BLOCK_GLOW_ON` / `BLOCK_GLOW_OFF` | A single block started or stopped glowing. |
| `PROJECT_STOP_ALL`, `STOP_FOR_TARGET` | The stop button was hit / one target was stopped. Fire on `vm.runtime`. |

## Extensions

| Event | Fires when |
| --- | --- |
| `EXTENSION_ADDED` | An extension's block category was registered. Payload is the category info. |
| `EXTENSION_REMOVED` | An extension was removed. |
| `EXTENSIONS_REORDERED` | Extension order changed. |
| `EXTENSION_FIELD_ADDED` | An extension registered a custom field type. |
| `BLOCKSINFO_UPDATE` | An extension's blocks were refreshed (for example after a locale change). |
| `PERIPHERAL_LIST_UPDATE`, `USER_PICKED_PERIPHERAL`, `PERIPHERAL_CONNECTED`, `PERIPHERAL_DISCONNECTED`, `PERIPHERAL_REQUEST_ERROR`, `PERIPHERAL_CONNECTION_LOST_ERROR`, `PERIPHERAL_SCAN_TIMEOUT` | Peripheral scanning and connection lifecycle. |

## Settings that changed

These fire after the matching setter runs, so the UI can update:

| Event | Payload |
| --- | --- |
| `RUNTIME_OPTIONS_CHANGED` | The current runtime options. |
| `COMPILER_OPTIONS_CHANGED` | The current compiler options. |
| `FRAMERATE_CHANGED` | The new frame rate. |
| `INTERPOLATION_CHANGED` | Whether interpolation is on. |
| `STAGE_SIZE_CHANGED` | `(width, height)`. |
| `COMPILE_ERROR` | `(target, error)` when a script fails to compile. |
| `HAS_CLOUD_DATA_UPDATE` | Whether the project uses cloud variables. |
| `MIC_LISTENING` | Whether the microphone is active. |
| `LOCALE_CHANGED` | The new locale, after `setLocale`. |

## Blocks that ask the host something

Some blocks need the host UI to respond. These fire on `vm.runtime`:

- `SAY`: a sprite says or thinks something (`say`/`think` blocks).
- `QUESTION`: an `ask and wait` block is waiting for input. The host collects an answer and emits
  an `ANSWER` event on the runtime to unblock the script.

## See also

- [VM API](/api-reference/vm-api)
- [Threads](/api-reference/threads)
- [Block registration](/api-reference/block-registration)

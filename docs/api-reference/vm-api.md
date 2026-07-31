---
title: VM API
sidebar_position: 2
---

`VirtualMachine` is the engine that runs a project. It loads and saves projects, controls
playback, manages sprites/costumes/sounds, and holds the [`Runtime`](/api-reference/threads)
that actually executes blocks. When the editor or player is open, the live instance is on
`window.vm` (see the [overview](/api-reference/overview)).

The class lives in `scratch-vm/src/virtual-machine.js` and is the default export of the
`scratch-vm` package:

```js
import VirtualMachine from 'scratch-vm';
const vm = new VirtualMachine();
vm.start();
```

`VirtualMachine` extends Node's `EventEmitter`, so you listen with `vm.on(name, handler)`.
See [Events](/api-reference/events) for what it emits.

## Lifecycle

- `start()`: begin the runtime's step loop. Call this once before anything else.
- `quit()`: shut the runtime down and release handles. Meant for test teardown; do not use the
  runtime afterward. `stop()` is a deprecated alias.
- `greenFlag()`: start all green-flag scripts, as if the flag was clicked.
- `stopAll()`: stop every running thread and activity (the stop-sign button).
- `clear()`: dispose the current project's data and reset to an empty runtime.

## Loading projects

- `loadProject(input)` returns a `Promise`. `input` may be a JSON string, a plain project
  object, or an `ArrayBuffer`/typed array holding an `.sb`, `.sb2`, or `.sb3` file. The VM
  validates the input, deserializes it, loads any extensions it needs, and installs the
  targets. Scratch 1 (`.sb`) files are converted automatically.
- `downloadProjectId(id)`: fetch a project by ID through the attached storage module and load
  it. Requires storage to be attached (see below).
- `fromJSON(json)`: deprecated wrapper around `loadProject`; use `loadProject` instead.

```js
const buffer = await fetch('project.sb3').then(r => r.arrayBuffer());
await vm.loadProject(buffer);
vm.greenFlag();
```

## Saving and exporting

- `saveProjectSb3(type, options)`: returns a `Promise` for a compressed `.sb3`. `type` is any
  JSZip output type (defaults to `'blob'`). `options.allowOptimization` (default `true`)
  controls block/comment ID optimization.
- `saveProjectSb3Stream(type, options)`: returns a JSZip `StreamHelper` for the same data, for
  streaming large projects.
- `saveProjectSb3DontZip(options)`: returns a `Record<string, Uint8Array>` mapping file name to
  raw bytes, skipping zip creation. The returned buffers are the VM's own; do not mutate them
  (except `project.json`, which is freshly built).
- `toJSON(optTargetId, serializationOptions)`: serialize the whole project, or a single sprite
  if `optTargetId` is given, to a JSON string.
- `exportSprite(targetId, optZipType)`: returns a `Promise` for a `.sprite3` zip of one sprite
  and its assets.
- `serializeAssets(targetId)`: returns `[{fileName, fileContent}]` for the project's assets (or
  one target's).
- `assets` (getter): the array of every asset object currently in the runtime.

## Targets, sprites, and the editing target

The "editing target" is the sprite or stage currently selected in an editor. Block edits from
the workspace route to it.

- `editingTarget`: the currently selected `Target` (a `RenderedTarget`), or `null`.
- `setEditingTarget(targetId)`: switch which target is being edited. Emits `targetsUpdate` and
  `workspaceUpdate`.
- `addSprite(input)`: add a sprite from `.sprite2`/`.sprite3` data (string, object, or
  ArrayBuffer). Returns a `Promise`.
- `renameSprite(targetId, newName)`: rename a sprite (names are de-duplicated automatically).
- `deleteSprite(targetId)`: delete a sprite and its clones. Returns a function that restores it.
- `duplicateSprite(targetId)`: returns a `Promise` that resolves once the copy is added.
- `reorderTarget(targetIndex, newIndex)`: move a target in the list. Returns whether it changed.
- `postSpriteInfo(data)`: update the editing/drag target's info (`x`, `y`, `direction`, `size`,
  `visible`, `rotationStyle`).
- `startDrag(targetId)` / `stopDrag(targetId)`: put a target into or out of a drag state so
  blocks stop or resume affecting its position.
- `setVariableValue(targetId, variableId, value)` / `getVariableValue(targetId, variableId)`:
  write or read a variable by ID. `setVariableValue` returns whether it succeeded;
  `getVariableValue` returns the value or `null`.

## Costumes, sounds, and backdrops

These act on the editing target unless a target ID is passed. Most return a `Promise`.

- `addCostume(md5ext, costumeObject, optTargetId, optVersion)`,
  `addCostumeFromLibrary(md5ext, costumeObject)`, `duplicateCostume(costumeIndex)`,
  `renameCostume(costumeIndex, newName)`, `deleteCostume(costumeIndex)` (returns a restore
  function or `null`).
- `updateBitmap(costumeIndex, bitmap, rotationCenterX, rotationCenterY, bitmapResolution)` and
  `updateSvg(costumeIndex, svg, rotationCenterX, rotationCenterY)`: replace a costume's image.
- `getCostume(costumeIndex)`: the costume's SVG string, or a data URI for PNG/JPG.
- `getExportedCostume(costumeObject)` / `getExportedCostumeBase64(costumeObject)`: raw bytes /
  base64 for saving a costume to disk.
- `addSound(soundObject, optTargetId)`, `duplicateSound(soundIndex)`,
  `renameSound(soundIndex, newName)`, `deleteSound(soundIndex)` (returns a restore function or
  `null`).
- `getSoundBuffer(soundIndex)` / `updateSoundBuffer(soundIndex, newBuffer, soundEncoding)`: read
  or replace a sound's decoded audio.
- `addBackdrop(md5ext, backdropObject)`: add a backdrop to the stage.
- `reorderCostume(targetId, costumeIndex, newIndex)` /
  `reorderSound(targetId, soundIndex, newIndex)`: reorder; each returns whether it succeeded.

## Playback modes and runtime options

- `setTurboMode(on)`: turbo mode (loops do not yield to redraw).
- `setCompatibilityMode(on)`: 30 TPS "2.0" timing.
- `setFramerate(fps)`: target frame rate. MistWarp allows arbitrary values.
- `setInterpolation(enabled)`: frame interpolation, which smooths motion above the project's
  native frame rate.
- `setStageSize(width, height)`: custom stage dimensions.
- `setRuntimeOptions(options)` / `setCompilerOptions(options)`: toggle runtime behaviors (fencing,
  clone/list limits, miscellaneous limits) and compiler behaviors (enable/disable the compiler,
  warp timer). Each merges into the current options and emits a `*_CHANGED` event.
- `setInEditor(inEditor)`, `convertToPackagedRuntime()`: used by the editor and the packager to
  tell the runtime which environment it is in.
- `enableDebug()` / `disableDebug()`: toggle the debugger's extra instrumentation.

## Attaching subsystems

The VM does not create its renderer, audio engine, or storage; the host attaches them.

- `attachRenderer(renderer)` and the `renderer` getter (returns the attached `RenderWebGL` or
  `undefined`).
- `attachAudioEngine(audioEngine)`.
- `attachStorage(storage)`: a `scratch-storage` instance, needed for `downloadProjectId` and for
  loading library assets.
- `attachV2BitmapAdapter(adapter)`: converts Scratch 2 bitmaps to Scratch 3 bitmaps.
- `setCloudProvider(provider)` / `setVideoProvider(provider)`: wire up cloud-variable and camera
  backends.
- `postIOData(device, data)`: feed input into a virtual I/O device (`keyboard`, `mouse`,
  `mouseWheel`, `userData`, and so on).
- `setLocale(locale, messages)`: change the VM's language; returns a `Promise` that resolves once
  blocks are refreshed.

## Extensions and peripherals

- `extensionManager`: the `ExtensionManager`. Use it to load built-in and custom extensions.
- `securityManager`: the security manager that gates what unsandboxed extensions may do.
- `scanForPeripheral(extensionId)`, `connectPeripheral(extensionId, peripheralId)`,
  `disconnectPeripheral(extensionId)`, `getPeripheralIsConnected(extensionId)`: control hardware
  peripherals for extensions like micro:bit and EV3.
- `exports`: internal classes exposed for extension authors, including `Sprite`,
  `RenderedTarget`, `Variable`, `JSZip`, and `exports.compiler.register(...)` for registering
  compiled-block descriptors. The functions named `these_broke_before_and_will_break_again` and
  `i_will_not_ask_for_help_when_these_break` reach into unstable compiler internals; the names
  are the warning.

## Advanced: how a load actually runs

`loadProject` validates the input, then calls `deserializeProject`, which clears the runtime and
picks `sb2` or `sb3` deserialization by `projectVersion`. The results (targets plus the set of
extensions they use) go to `installTargets`, which waits for async extensions, loads the required
extensions through the `extensionManager` and `securityManager`, adds each target to the runtime,
sorts execution order by `layerOrder`, selects an editing target, and emits `targetsUpdate` and
`workspaceUpdate`. Load progress is reported through the `LOAD_PROGRESS` event with stages
`unzipping`, `parsing`, `checking`, `building`, and `installing`.

## See also

- [Events](/api-reference/events) for the full event list
- [Threads](/api-reference/threads) for the runtime and sequencer
- [Extension API](/api-reference/extension-api) for writing extensions
- [Embedding](/advanced/embedding) and the [packager](/packager/overview) for shipping projects

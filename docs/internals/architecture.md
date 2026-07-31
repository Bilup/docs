---
title: Architecture
sidebar_position: 2
---

# Architecture

MistWarp looks like one app but is really a set of independent packages wired together at build time. This page is the top-down map: what the packages are, how a project flows from blocks in the workspace to pixels on the stage, how it is saved and loaded, and where the editor, the addons, the theme engine, and the community layer sit around that core. The later pages in this section zoom into individual pieces; start here to see how they connect.

## The packages

MistWarp is a fork of TurboWarp, which is a fork of Scratch, and it inherits Scratch's split into separate npm packages. Each is its own repository, developed independently and linked into the editor build.

- **scratch-gui** is the editor and the community site: a React plus Redux application bundled by webpack. It owns the interface, the Redux store, the theme engine, the addon framework, and the community SPA. Everything you see is scratch-gui; almost everything in this Internals section is about it.
- **scratch-vm** is the engine. It is plain JavaScript, no React. It owns the runtime, the targets (sprites and the stage), the blocks, the threads, the interpreter, and the JS compiler. It is the source of truth for what a project actually does.
- **scratch-render** draws the stage onto a WebGL canvas. The VM owns a renderer instance and tells it where every sprite, costume, and pen mark goes.
- **scratch-blocks** is a fork of Google's Blockly. It draws the block workspace and the palette and turns block edits into changes the VM applies.
- **scratch-paint** is the costume and backdrop editor (a paint program). It has its own Redux store, which is why the editor's store has a separate `scratchPaint` slice.
- **scratch-audio** plays and processes sound: the VM hands it audio buffers and effect parameters.

In development these are symlinked into scratch-gui with `pnpm run link` so a change in, say, scratch-vm shows up in the editor without republishing. See [Project Structure](/contributing/project-structure) for the workspace layout.

## How the pieces talk

At runtime the editor holds exactly one VM instance. scratch-gui does not run projects itself; it drives the VM and mirrors the parts of the VM's state that the interface needs into Redux.

```
User
 |
 v
scratch-gui (React components + Redux store)
 |            ^
 | calls      | events -> Redux actions
 v            |
scratch-vm  (Runtime, Targets, Blocks, Sequencer, Compiler/Interpreter)
 |   |   |
 |   |   +--> scratch-audio   (sound playback)
 |   +------> scratch-render   (WebGL stage)
 +----------> scratch-blocks   (workspace + palette, edits flow back to the VM)
```

The interaction is a loop. A user does something in a component; a container either dispatches a Redux action or calls a method on the VM. The VM does the work and emits events. `vmListenerHOC` translates those events into Redux actions, connected components re-render, and the interface catches up to the runtime. Because the VM is the source of truth, Redux never tries to hold the whole project; it holds a mirror of the slices the UI reads.

The next sections follow a project through that loop: from the workspace into the runtime, out to the renderer, and back to disk.

## From blocks to execution

Blocks live in two places that stay in sync. In the workspace, **scratch-blocks** owns the visual blocks. In the VM, each target has a `blocks` container (`scratch-vm/src/engine/blocks.js`) that stores the same scripts as plain data keyed by block id. When you drag or edit a block, scratch-blocks fires an event, the VM applies the corresponding change to its block container, and the two representations stay aligned. MistWarp builds the workspace from the VM's block objects rather than round-tripping XML, so this bridge is the real coupling point (the palette and shadow inputs are built lazily).

Running a project means running threads. When a hat block fires (green flag, key press, broadcast), the runtime starts a **thread** (`engine/thread.js`) for that script. On every frame the **sequencer** (`engine/sequencer.js`) steps every active thread for a slice of a time budget (`WORK_TIME`, three quarters of the frame) and then yields so the frame can render. That step-a-little, render, step-a-little cadence is what makes scripts appear to run in parallel. The thread and sequencer model is documented in full under [Threads](/api-reference/threads).

Each thread runs one of two ways:

- **Interpreted.** `engine/execute.js` walks the block tree directly, looking up each opcode's function and calling it. This is the always-available path and how a script runs the first time it is stepped.
- **Compiled.** MistWarp's JS compiler (`scratch-vm/src/compiler/`) turns a script into a real JavaScript function. `compile.js` runs an intermediate-representation generator (`irgen.js`), an optimizer (`iroptimizer.js`), and a JS generator (`jsgen.js`); the generated function is executed by `jsexecute.js`. Compiled scripts run far faster than interpreted ones. Compilation is on by default (`runtime.compilerOptions.enabled`) and can be turned off in settings, in which case everything falls back to the interpreter.

Both paths produce the same visible behavior; the compiler is a speed layer over the same semantics. The runtime, its options, and how it decides to compile are covered in the [VM API](/api-reference/vm-api).

## Rendering the stage

The runtime does not draw anything. Each target keeps its position, costume, size, effects, and pen state, and reports them to **scratch-render**, which draws every sprite as a textured quad on a shared WebGL canvas. The VM owns that canvas; scratch-gui only positions it and paints overlays on top, variable and list monitors, the drag layer, the green-flag click catcher, so those never touch WebGL. When a target moves or switches costume, the VM tells the renderer, and the next frame reflects it. Costume and backdrop editing is a separate concern handled by **scratch-paint** on the Costumes and Sounds tabs.

## Saving and loading

A project is serialized to the **sb3** format, a ZIP containing a `project.json` plus asset files (costumes as SVG or PNG, sounds as WAV or MP3), each asset named by the MD5 hash of its bytes.

- **Serialize.** `scratch-vm/src/serialization/sb3.js` walks the runtime, targets, blocks, variables, and monitors and writes `project.json`; the assets are collected from each target's costumes and sounds. The editor zips these into an `.sb3`. The older `sb2.js` handles importing legacy Scratch 2 projects.
- **Deserialize.** Loading reverses this: parse `project.json`, rebuild targets and their block containers, and load each referenced asset by hash. `validate-project.js` sanity-checks the JSON on the way in.
- **Storage.** Assets are content-addressed, so the same costume shared by many sprites is stored once. The editor's storage layer resolves an asset hash to its bytes, whether from the sb3, from the backend, or from the built-in library.

Where the bytes physically live depends on how the project was opened: a local file, the built-in project fetcher, or the community backend. The publish pipeline (create, upload the sb3 and thumbnail, then share) is described below and in [Project Management](/editor/project-management) and [Packaging](/editor/packaging).

## The editor shell

The React side is a container-and-component split. **Components** (`src/components/`) render markup and take everything as props; they do not know Redux exists. **Containers** (`src/containers/`) connect components to the Redux store and to the VM. That split is the backbone of scratch-gui and is covered in [Components](/internals/components) and [Containers](/internals/containers).

Interface state lives in a single Redux store, built in `src/lib/components/app-state-hoc.jsx` from three top-level reducers: `scratchGui` (the big editor tree, assembled in `src/reducers/gui.js`), `locales` (language and RTL), and `scratchPaint` (the paint editor's store). `AppStateHOC` also seeds a restricted initial state for the player, full-screen, and embed modes, notifies the addon system after every action, and exposes the store on `window.ReduxStore`. The full list of slices is in [State Management](/internals/state).

The top-level component is composed in `src/containers/gui.jsx`. The connected `GUI` is wrapped in a stack of higher-order components, one per cross-cutting concern, using redux's `compose` purely as a function-composition helper:

```js
const WrappedGui = compose(
    LocalizationHOC,
    ErrorBoundaryHOC('Top Level App'),
    TWThemeManagerHOC,
    TWFullScreenResizerHOC,
    FontLoaderHOC,
    ProjectFetcherHOC,
    SB3PostMessageHOC,
    TitledHOC,
    ProjectSaverHOC,
    vmListenerHOC,
    vmManagerHOC,
    SBFileUploaderHOC,
    cloudManagerHOC
)(ConnectedGUI);
```

Each HOC owns one job: localization, the crash boundary, applying the theme (placed early so icons recolor before first paint), full-screen resizing, font loading, fetching and saving projects, loading from `postMessage` and local files, cloud variables, and the two VM-bridge HOCs. The VM bridge is `vmManagerHOC` (drives the VM: attaches audio, starts it, loads project data) and `vmListenerHOC` (listens to VM events and dispatches Redux actions). The VM instance itself is created once in the `vm` reducer (`src/reducers/vm.js`) and kept in the store as a stable reference, reachable from any container as `state.scratchGui.vm`.

The rendered `GUIComponent` (`src/components/gui/gui.jsx`) lays out the menu bar, the code / costumes / sounds tabs, the blocks workspace, the stage, the target pane, and every modal. When `isPlayerOnly` is set it renders just the stage, which is how the player and the embed reuse the editor's code. See the [Editor Interface](/editor/interface) and [Workspace](/editor/workspace) pages for the user-facing tour.

## Addons, windows, and theming

Two editor subsystems sit alongside the React tree rather than inside it.

- **Addons** (`src/addons/`) are small editor features ported from Scratch Addons. A single `SettingsStore` holds every addon's enabled flag and settings, persisted to `localStorage`; addons subscribe and react when a setting changes. Some addons open floating panels through a shared window system that renders either an in-page window or, in the desktop app, a real OS window. See [The Addons System](/internals/addons-system).
- **Theming** (`src/lib/themes/`) turns a `Theme` object into CSS custom properties written onto `document.documentElement`, plus block colors fed to scratch-blocks. Because the properties are unprefixed (`--ui-primary`, `--text-primary`), any component consumes them with `var(...)`, and the community site must prefix its own properties `--mw-*` to avoid collisions. See [Theming](/internals/theming).

## The identity and community layer

MistWarp is not local-only. scratch-gui also ships the community site (`src/community/`) from the same webpack build, and the editor has hooks into it.

Identity is Rotur-based (`src/lib/rotur/identity.js` is the single source of truth for both apps). A user logs in with a Rotur token, which is exchanged for a 7-day MistWarp session token; both apps subscribe to that state and logout clears it. The frontend calls the backend at `https://mwapi.mistium.com/api` with Bearer-token auth. Rotur social features (posts, likes, follows, avatars) go straight to `https://api.rotur.dev`.

Publishing a project is upload-first: the editor creates a project record, uploads the sb3 and a thumbnail (the server unzips it and stores content-addressed assets), and the user shares it on the site. Settings and themes sync to the account with last-write-wins. These flows are backed by the `rotur` and `collaboration` Redux slices (see [State Management](/internals/state)) and are out of scope for this Internals section, which focuses on the editor engine; they are noted here so the whole picture is visible.

## See also

- [Components](/internals/components)
- [Containers](/internals/containers)
- [State Management](/internals/state)
- [Theming](/internals/theming)
- [The Addons System](/internals/addons-system)
- [Threads](/api-reference/threads) and the [VM API](/api-reference/vm-api)
- [Project Structure](/contributing/project-structure)

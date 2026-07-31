---
title: State Management
sidebar_position: 5
---

# State Management

The editor keeps its interface state in a single Redux store. This page lists the actual reducers that make up that store and explains how action creators, selectors, and middleware fit around them.

## Store shape

The store is created in `src/lib/components/app-state-hoc.jsx` from three top-level reducers:

- **`scratchGui`** is the editor state tree, built in `src/reducers/gui.js`.
- **`locales`** holds the active language and RTL flag (`src/reducers/locales.js`).
- **`scratchPaint`** is the costume editor's own store, imported from scratch-paint.

Almost everything the editor touches is under `scratchGui`. That slice is itself assembled with `combineReducers` in `src/reducers/gui.js`, one child reducer per file in `src/reducers/`.

## The reducers

Every entry below is a real slice combined into `scratchGui`, with the file that defines it in `src/reducers/`. Reading state means `state.scratchGui.<slice>`.

**Project lifecycle**

- `projectState` (`project-state.js`) tracks loading, saving, and error states of the current project, and exports selectors such as `getIsError` and `getIsShowingProject`.
- `projectTitle` (`project-title.js`) is the project name.
- `projectChanged` (`project-changed.js`) tracks whether there are unsaved changes.
- `autosave` (`autosave.js`) holds autosave state.

**Runtime and VM**

- `vm` (`vm.js`) holds the single VM instance (created once here) and nothing else serializable.
- `vmStatus` (`vm-status.js`) mirrors running, started, and turbo state.
- `tw` (`tw.js`) holds TurboWarp runtime options: framerate, interpolation, compiler options, compile errors, cloud-variable presence, and platform-mismatch details.

**Targets and monitors**

- `targets` (`targets.js`) is the sprite and stage list and which target is being edited.
- `hoveredTarget` (`hovered-target.js`) tracks the hovered sprite for drag and drop.
- `monitors` (`monitors.js`) holds the variable and list monitors, and `monitorLayout` (`monitor-layout.js`) tracks their positions.

**Editor layout and tabs**

- `mode` (`mode.js`) is the big one for layout: `isPlayerOnly`, `isFullScreen`, `isEmbedded`. It decides whether the full editor or just the player renders.
- `editorTab` (`editor-tab.js`) is the active tab (code, costumes, sounds).
- `stageSize` (`stage-size.js`) and `customStageSize` (`custom-stage-size.js`) control stage dimensions.
- `workspaceMetrics` (`workspace-metrics.js`) remembers blocks-workspace scroll and zoom per target.
- `toolbox` (`toolbox.js`) holds the block palette XML state.

**Modals, menus, and overlays**

- `modals` (`modals.js`) is a map of which modals are open (libraries, settings, git, restore points, fonts, assets, the debugger, and more), toggled by `openModal` / `closeModal` action creators.
- `menus` (`menus.js`) tracks which menu-bar dropdowns are open.
- `cards` (`cards.js`) is the tutorial card deck, `alerts` (`alerts.js`) is the alert queue, and `toast` (`toast.js`) is transient toast messages.
- `connectionModal` (`connection-modal.js`) is peripheral-connection state.
- `colorPicker` (`color-picker.js`) backs the eyedropper.
- `micIndicator` (`mic-indicator.js`) is the microphone level indicator.
- `onboarding` (`onboarding.js`) drives the first-run onboarding flow.

**Drag, restore, and history**

- `blockDrag` (`block-drag.js`) and `assetDrag` (`asset-drag.js`) track drags in progress.
- `restoreDeletion` (`restore-deletion.js`) backs the "restore last deleted" action.
- `timeTravel` (`time-travel.js`) holds the block-theme "year", used to re-key the blocks workspace.

**Theming**

- `theme` (`theme.js`) holds the current `Theme` object and applies its colors when it changes.
- `mwProjectTheme` (`mw-project-theme.js`) backs the prompt for applying a theme embedded in a project. See [Theming](/internals/theming).

**MistWarp additions and misc**

- `rotur` (`rotur.js`) holds Rotur account and session state used by the community integration.
- `collaboration` (`collaboration.js`) holds live-collaboration state.
- `shortcuts` (`shortcuts.js`) holds the keyboard-shortcut configuration.
- `fontsLoaded` (`fonts-loaded.js`) tracks font loading, and `timeout` (`timeout.js`) is a small shared timeout slice.

## Action creators and selectors

Each reducer file follows the same convention: it defines its action-type constants and reducer, and exports the reducer as default plus its action creators (and sometimes selectors and its `initialState`). For example `theme.js` exports `setTheme`, `vm.js` exports `setVM`, and `project-state.js` exports selectors like `getIsError` alongside its actions.

Containers import these directly. `mapStateToProps` reads slices (or calls a selector), and `mapDispatchToProps` wraps an imported action creator so the component receives a plain callback. See [Containers](/internals/containers) for the pattern.

## Initial state and render modes

`gui.js` also exports `guiInitialState` plus helpers that transform it for restricted views: `initPlayer`, `initFullScreen`, and `initEmbedded`. `AppStateHOC` applies these before creating the store so the same reducers can back the full editor, the player, or an embed, differing only in the `mode` slice.

## Middleware

The `scratchGui` store is enhanced with one middleware, `guiMiddleware`, defined in `gui.js`. It is `redux-throttle` configured to coalesce rapidly repeated actions (leading and trailing, 300 ms), which keeps high-frequency updates from the VM from overwhelming React. `AppStateHOC` also wraps the combined reducer to notify the addon system after every action (`AddonHooks.appStateReducer`) and exposes the store on `window.ReduxStore` for debugging and for addons.

## See also

- [Containers](/internals/containers)
- [Architecture](/internals/architecture)
- [Theming](/internals/theming)
- [The Addons System](/internals/addons-system)

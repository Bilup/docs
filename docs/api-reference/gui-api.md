---
title: GUI API
sidebar_position: 3
---

`scratch-gui` is the React application that renders the MistWarp editor and player (and also
serves the community site). Its package entry point, `scratch-gui/src/index.js`, exports the
pieces you need to mount the editor or a player in your own React app.

For most embedding you do not need this. If you only want to show a project on a page, use the
[packager](/packager/overview) or an [embed iframe](/advanced/embedding). Reach for the GUI API
when you are building your own React host around the editor.

## What the package exports

```js
import GUI, {
    AppStateHOC,
    setAppElement,
    guiReducers,
    guiInitialState,
    guiMiddleware,
    initEmbedded,
    initPlayer,
    initFullScreen,
    initLocale,
    localesInitialState,
    remixProject,
    setFullScreen,
    setPlayer
} from 'scratch-gui';
```

- `GUI` (default export): the top-level editor component (`containers/gui.jsx`).
- `AppStateHOC`: a higher-order component that wraps `GUI` with the Redux store, the locale
  provider, and error boundaries. Wrap your root component with it so the GUI has the state it
  needs.
- `setAppElement`: re-exported from `react-modal`; call it with your app's root element so modals
  attach correctly for accessibility.
- `guiReducers`, `guiInitialState`, `guiMiddleware`: the Redux reducer map (`locales`,
  `scratchGui`, `scratchPaint`), the initial state, and the middleware. Use these if you build the
  store yourself instead of relying on `AppStateHOC`.
- `localesInitialState`, `initLocale`: locale state and a helper to set the active locale on a
  state object.
- `initPlayer`, `initFullScreen`, `initEmbedded`: helpers that mutate an initial state to start in
  player-only, full-screen, or embedded mode.
- `setPlayer(isPlayerOnly)`, `setFullScreen(isFullScreen)`: Redux action creators to switch modes
  at runtime.
- `remixProject`: Redux action creator that puts the project into a remixed state.

## Minimal editor

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import GUI, {AppStateHOC, setAppElement} from 'scratch-gui';

const WrappedGUI = AppStateHOC(GUI);

const appTarget = document.getElementById('app');
setAppElement(appTarget);

ReactDOM.render(<WrappedGUI />, appTarget);
```

## Player only

Pass `isPlayerOnly` (and optionally full-screen) through props, or start from a player initial
state:

```jsx
import GUI, {AppStateHOC, initPlayer, guiInitialState} from 'scratch-gui';

const WrappedGUI = AppStateHOC(GUI);
const initialState = initPlayer(guiInitialState);

<WrappedGUI isPlayerOnly initialState={initialState} projectId="0" />
```

## Getting at the VM

The `GUI` component creates and owns a [`VirtualMachine`](/api-reference/vm-api). In a running
build it is exposed on `window.vm` (set by `src/lib/components/vm-manager-hoc.jsx`), and the
Redux store is on `window.ReduxStore` (see `src/lib/components/app-state-hoc.jsx`). Inside the
GUI's Redux state, the VM lives at `state.scratchGui.vm`. You can also pass your own `vm` instance
in as a prop.

## Advanced

`AppStateHOC` composes several providers so the rest of the tree can assume they exist; if you
skip it you must supply the Redux store (built from `guiReducers` / `guiMiddleware`), the locale
data, and a modal root yourself. The `initEmbedded` / `initPlayer` / `initFullScreen` helpers only
adjust the initial Redux state; switching modes after mount uses the `setPlayer` and
`setFullScreen` actions.

## See also

- [VM API](/api-reference/vm-api)
- [Internals: components](/internals/components) and [containers](/internals/containers)
- [Internals: state](/internals/state) for the Redux layout
- [Embedding](/advanced/embedding)

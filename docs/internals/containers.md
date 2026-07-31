---
title: Containers
sidebar_position: 4
---

# The Container Pattern

Containers are the layer that connects presentation [Components](/internals/components) to the Redux store and to the virtual machine. A container selects the state a component needs, binds the action creators it should dispatch, and renders the component with those as props. This page describes the pattern and shows how a real container is written.

## Why containers exist

Presentation components take everything as props and know nothing about Redux. That keeps them reusable and testable, but something has to feed them the right props. That something is the container. It lives in `src/containers/`, one file per connected component, and it is where `react-redux`'s `connect` is used.

The payoff of the split: you can change how state is stored without touching the component, and you can render the same component with different data (editor, player, tests) just by wrapping it in a different container or passing props directly.

## A minimal container

`src/containers/turbo-mode.jsx` is a compact example. It reads turbo state from the store, exposes a toggle that calls into the VM, and hands both to its child:

```js
import {connect} from 'react-redux';

class TurboMode extends React.Component {
    // ...
    toggleTurboMode () {
        this.props.vm.setTurboMode(!this.props.turboMode);
    }
    render () {
        const {children, vm, ...props} = this.props;
        return this.props.children(this.toggleTurboMode, props);
    }
}

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    turboMode: state.scratchGui.vmStatus.turbo
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(TurboMode);
```

The two ingredients:

- **`mapStateToProps`** selects slices of state. Editor state is read from `state.scratchGui.<slice>`; here it reads the VM instance and the turbo flag. It runs on every store change, and the component re-renders when its selected props change.
- **`mapDispatchToProps`** (the second argument to `connect`) binds action creators to `dispatch`. When there is nothing to dispatch, it returns an empty object, as above.

Note that the VM is read from state like any other value. It is a stable object reference kept in the `vm` slice, so containers reach it with `state.scratchGui.vm` rather than importing a singleton.

## Selecting and dispatching in a larger container

The top-level container, `src/containers/gui.jsx`, shows the full shape. Its `mapStateToProps` derives many props from state, often flattening nested slices into simple booleans the component can use directly:

```js
const mapStateToProps = state => ({
    activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
    blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
    costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
    isFullScreen: state.scratchGui.mode.isFullScreen || state.scratchGui.mode.isEmbedded,
    vm: state.scratchGui.vm
    // ...
});
```

Its `mapDispatchToProps` binds action creators imported from the reducers:

```js
const mapDispatchToProps = dispatch => ({
    onSetStageSize: stageSize => dispatch(setStageSize(stageSize)),
    openSettingsModal: () => dispatch(openSettingsModal())
    // ...
});
```

The pattern is always the same: import the action creator from its reducer file, wrap it so the component gets a plain callback prop.

## Selectors live with reducers

Rather than reading raw state shape everywhere, some slices export selector functions so the derivation logic lives in one place. `gui.jsx`, for example, imports `getIsError` and `getIsShowingProject` from the `project-state` reducer and uses them inside `mapStateToProps`. Action creators are exported the same way, from the reducer that owns the slice. See [State Management](/internals/state) for how reducers, action creators, and selectors are organized.

## Containers as higher-order components

Some containers are not `connect` wrappers but higher-order components that add behavior and pass the rest through. The editor's top component is built by composing several of these (localization, theming, the VM bridge, project fetching and saving) around the connected `GUI`. That composition is described in [Architecture](/internals/architecture). `TurboMode` above is a related idea: a render-prop container that supplies a callback and state to whatever child function you give it.

## See also

- [Components](/internals/components)
- [State Management](/internals/state)
- [Architecture](/internals/architecture)

---
title: Components
sidebar_position: 3
---

# Components

scratch-gui splits its React code into two directories that play very different roles: `src/components/` for presentation and `src/containers/` for wiring. This page describes the component side and the split between the two. The container side is covered in [Containers](/internals/containers).

## The container/component split

The rule is simple:

- A **component** (`src/components/`) renders UI. It receives everything it needs through props and does not import the Redux store or the VM. Given the same props it renders the same thing, which makes it easy to reason about and to reuse.
- A **container** (`src/containers/`) knows about the store and the VM. It selects the state a component needs, binds the callbacks, and renders the matching component with those props.

Keeping presentation ignorant of where its data comes from is what lets the same visual component be driven by Redux in the editor, by different state in the player, or by props in a test.

Not every file is perfectly on one side of the line. Some components hold local UI state (layout measurements, hover, drag) with React hooks or `useState`, because that state is not worth putting in Redux. `src/components/gui/gui.jsx` is a large example: it manages stage-panel resizing and narrow-layout detection locally while still receiving its data props from the connected container. What components avoid is reaching into the global store directly.

## How a component is structured

Each component is a folder containing a `.jsx` file and a matching CSS module of the same name, for example `menu-bar/menu-bar.jsx` and `menu-bar/menu-bar.css`. The JSX imports its styles as a module:

```js
import styles from './menu-bar.css';
```

css-loader hashes and camelCases the class names, so `styles.someClass` resolves to a unique generated name. This scopes styles to the component and is why truly global CSS has to be imported differently (see [Theming](/internals/theming) and the CSS notes in [Contributing](/contributing/guidelines)).

Text shown to the user goes through react-intl's `FormattedMessage` and `defineMessages`, not hardcoded strings, so the interface can be translated.

## The main component tree

`src/components/gui/gui.jsx` (`GUIComponent`) is the root of the editor's presentation. It composes the major regions of the interface, most of which are themselves containers:

- `MenuBar` across the top.
- A tab strip with three panels: the blocks workspace (`Blocks`), the `CostumeTab`, and the `SoundTab`.
- `StageWrapper`, which holds the stage canvas, and `TargetPane`, the sprite and stage list.
- The block palette footer with the search and add-extension buttons, and the `Watermark`.
- Every modal and overlay: libraries (costume, sound, backdrop, extension), settings, the git modal, restore points, the debugger, alerts, cards, and more. Many are rendered only when their corresponding `...Visible` prop is true.

When `isPlayerOnly` is set, the same component renders just the `StageWrapper` instead of the full editor, which is how the player and embed views reuse the editor's code.

## Where to look

Some component directories you will meet often:

- `components/gui/` is the top-level layout.
- `components/menu-bar/` is the top bar and its menus.
- `components/stage/`, `components/stage-header/`, `components/target-pane/`, and `components/sprite-selector/` build the stage side.
- `components/loader/`, `components/box/`, `components/modal/`, and similar are small shared building blocks.

Many editor features (settings, custom extensions, the git modal, restore points, and others) are prefixed `tw-` or `mw-`, marking them as TurboWarp or MistWarp additions on top of the original Scratch components.

## See also

- [Containers](/internals/containers)
- [Architecture](/internals/architecture)
- [State Management](/internals/state)
- [Theming](/internals/theming)

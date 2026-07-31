---
title: Internals Overview
sidebar_position: 1
---

# Internals

This section explains how the MistWarp editor is built: the React and Redux architecture of scratch-gui, how the top-level component is composed, how the app talks to the virtual machine, how state is managed, how themes are applied, and how the addon system works.

It is the companion to [Contributing](/contributing/overview). Contributing tells you how to check out, build, and change the code. Internals tells you how the code is put together so those changes make sense.

This is developer-facing material. If you only want to use the editor, you do not need any of it.

## Scope

Almost everything here is about **scratch-gui**, because that is where the interface, the Redux store, the theme engine, and the addon framework live. The runtime and compiler live in scratch-vm and are covered separately in the [API Reference](/api-reference/overview). Where scratch-gui talks to the VM, that boundary is described in [Architecture](/internals/architecture).

MistWarp is a fork of TurboWarp, which is a fork of Scratch. Much of the structure here is inherited from Scratch and TurboWarp. The pages point out where MistWarp diverges.

## The pages

1. [Architecture](/internals/architecture) covers the big picture: React plus Redux, how `gui.jsx` is composed from higher-order components, and the bridge to the VM.
2. [Components](/internals/components) describes the presentation components and the container/component split.
3. [Containers](/internals/containers) explains the container pattern that connects components to Redux.
4. [State Management](/internals/state) lists the real reducers in the store and how selectors, action creators, and middleware fit together.
5. [Theming](/internals/theming) covers how themes turn into CSS custom properties on the document and how block colors are applied.
6. [The Addons System](/internals/addons-system) covers the addon settings store and the window system.

## See also

- [Contributing Overview](/contributing/overview)
- [Project Structure](/contributing/project-structure)
- [API Reference](/api-reference/overview)

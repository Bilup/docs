---
title: API Reference overview
sidebar_position: 1
---

MistWarp is built from a set of JavaScript packages: `scratch-vm` (the engine that runs
projects), `scratch-render` (the WebGL renderer), `scratch-blocks` (the block editor), and
`scratch-gui` (the React app that ties them together and also serves the community site).
This section documents the programmatic surfaces those packages expose.

It is aimed at advanced users, extension authors, and people embedding MistWarp in their own
pages. If you just want to make projects, you do not need any of this. If you want to script
the running project, build an extension, or drive the VM yourself, start here.

## Accessing the running instance

When the editor or player is open, scratch-gui puts two objects on `window` for debugging and
scripting:

- `window.vm` is the live [`VirtualMachine`](/api-reference/vm-api) instance. It is set once
  the VM manager mounts (see `src/lib/components/vm-manager-hoc.jsx`).
- `window.ReduxStore` is the app's Redux store (see `src/lib/components/app-state-hoc.jsx`),
  useful for inspecting GUI state.

Open the browser console on the editor and try:

```js
// The VM that runs the current project
window.vm

// Start the project, as if the green flag was clicked
window.vm.greenFlag();

// The renderer, if one is attached
window.vm.renderer

// The engine runtime (targets, threads, blocks, IO devices)
window.vm.runtime
```

These globals exist for interactive use. They are not a stable, versioned API and can change
between builds. Extensions should use the [extension API](/api-reference/extension-api)
instead, which passes `Scratch.vm` in explicitly.

## The layers

- [VM API](/api-reference/vm-api): the public `VirtualMachine` class. Load and save projects,
  control playback, manage sprites/costumes/sounds, and read state. This is what an embedder
  talks to.
- [GUI API](/api-reference/gui-api): the React entry points scratch-gui exports so you can
  render the editor or player in your own app.
- [Extension API](/api-reference/extension-api): the `Scratch` object (`BlockType`,
  `ArgumentType`, `Scratch.extensions.register`, and the sandbox permission helpers) that
  extension authors write against.
- [Block registration](/api-reference/block-registration): how opcodes and hats are wired
  into the runtime.
- [Threads](/api-reference/threads): the thread and sequencer model that actually executes
  scripts.
- [Runtime API](/api-reference/runtime): the engine (`vm.runtime`) that holds targets, IO
  devices, monitors, and starts threads.
- [Addon API](/api-reference/addon-api): the `addon` object userscripts receive.
- [Events](/api-reference/events): the events the VM emits.
- [Utilities](/api-reference/utilities): helper modules like `Cast`, `Color`, and `MathUtil`.

## Embedding

If you want to put a MistWarp project on your own page, you usually do not build against the
VM directly; you use the [packager](/packager/overview) or an
[embed iframe](/advanced/embedding). Build directly against the VM/GUI only when you need
control those tools do not give you.

## See also

- [Building Extensions](/building-extensions/introduction)
- [Internals: architecture](/internals/architecture)
- [JavaScript in projects](/advanced/javascript)

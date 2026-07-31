---
title: The block workspace
sidebar_position: 7
---

The workspace is the large scrolling canvas in the **Code** tab where you assemble scripts by snapping blocks together. It sits to the right of the [blocks palette](/editor/blocks-palette) and shows the scripts of the currently selected sprite or the stage.

## Working with blocks

- **Drag** a block from the palette into the workspace to add it. Drag blocks by their top-left to move a whole stack, or grab a block lower in a stack to pull it and everything below it away.
- **Snap** blocks together by dropping one near the connection point of another. A grey shadow shows where it will attach.
- **Delete** a block by dragging it back onto the palette, or by right-clicking it and choosing **Delete**.
- **Duplicate** copies a block and everything below it. **Add Comment** attaches a note. **Copy to Backpack** stores the stack in the [backpack](/editor/backpack).
- **Right-click the workspace background** for **Clean up Blocks** (auto-arranges every script into tidy columns), **Add Comment**, and options to collapse or expand comments.
- Blocks copy and paste with `Ctrl+C` / `Ctrl+V`, and the workspace has its own **Undo** and **Redo** (`Ctrl+Z` / `Ctrl+Shift+Z`).

## Comments

Comments are yellow sticky notes you can attach to a block or leave floating on the background. Drag one to move it, drag its corner to resize it, and click the triangle to collapse it to a single line. Comments are saved with the project, so they are a good place to document how a script works.

## Zooming and panning

Controls in the bottom-right corner **zoom in**, **zoom out**, and **reset zoom**. You can also zoom with `Ctrl` and the scroll wheel, and pan by dragging the empty background or scrolling. The workspace remembers its zoom and scroll position per project.

## Running and highlighting

Click any block or stack to run it once. While a script runs, its blocks **glow**; this is how the [debugger](/editor/debugger) and the "glow" indicators show you what is executing. A block that reports a value shows the value in a bubble when you click it.

## Large projects and deferred rendering

MistWarp does not render every block up front. When a project has many scripts (roughly 100 blocks or more), the workspace **loads scripts lazily**, rendering only the ones near your view and filling in the rest as you scroll. This keeps switching sprites and opening big projects fast. A consequence worth knowing: tools that count or search blocks read them from the project data (the VM), not from what is currently drawn on screen, so they stay accurate even for scripts you have not scrolled to.

To move quickly around a big project, use the [find bar](/editor/find-bar) to jump to a block, variable, or custom block, and [workspace bookmarks](/editor/bookmarks) to save and return to script locations.

## See also

- [The blocks palette](/editor/blocks-palette)
- [Find bar](/editor/find-bar) and [bookmarks](/editor/bookmarks)
- [Custom blocks](/editor/custom-blocks)
- [Keyboard shortcuts](/editor/shortcuts)

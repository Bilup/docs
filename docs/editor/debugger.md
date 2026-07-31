---
title: The debugger
sidebar_position: 19
---

The debugger is a tool window for inspecting a running project: logging messages, pausing and stepping the runtime, watching threads, and keeping an eye on performance and memory. It is aimed at anyone tracking down why a project misbehaves.

## Opening the debugger

Open the **Tools** menu and choose **Debugger**. It also opens automatically when a `breakpoint` block runs, pausing the project at that point.

The debugger adds two blocks to the [Control-style tools](/blocks/mistwarp-extras) it registers: `log`, `warn`, and `error` blocks that send a message to the log at that severity, and a `breakpoint` block that pauses the project.

## Pausing and stepping

When the project is paused (by a breakpoint, or the pause button), the debugger toolbar shows a **Paused** indicator with **Resume** and **Step** buttons. Step advances the project by exactly one frame so you can watch state change frame by frame.

You can also pause from the stage: the [settings](/editor/settings) **Show Pause Button** option adds a pause/play button next to the green flag (also `Alt+X`, `Option+X` on macOS), and **Show Frame Step Button** adds a single-frame step button while paused.

## The tabs

**Logs** shows every message, newest activity in view:

- Each entry has a timestamp, a severity icon (log, warn, or error), the message, and a link to the block and sprite that produced it. **Clicking the link jumps to that block**: it switches to the sprite, opens the Code tab, and scrolls the block into view.
- Filter the log with a search box, the **log / warn / error** severity toggles, and a per-sprite dropdown.
- **Export** downloads the log as a text file, and **Clear** empties it.
- Optional automatic logs (green flag clicks, broadcasts, clone creation, and hitting the clone limit) can be turned on in the debugger [settings](/editor/settings).

**Threads** shows the scripts currently running as a live tree, with each thread's call stack of blocks and the currently executing block highlighted. Compiled threads cannot be stepped and show no stack detail.

**Performance** charts the frame rate (against your target FPS) and the live clone count while the project runs.

**Memory** shows counts of clones, variables, variable characters, lists, and list items, turning to a warning colour when they climb high, plus charts of variable data size and list items and a list of variable values.

## Settings

The debugger's options live on the **Debugger** page of the [settings window](/editor/settings): highlight running blocks, clear logs on green flag, log green flag clicks, log clone creation, log the clone-limit warning, log broadcasts, and animate the graphs.

## See also

- [The variable manager](/editor/variable-manager)
- [The block workspace](/editor/workspace)
- [MistWarp extra blocks](/blocks/mistwarp-extras)
- [Settings](/editor/settings)

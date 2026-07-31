---
title: Threads
sidebar_position: 6
---

A project is a set of scripts, and each running script is a thread. The runtime steps every
thread a little on each frame; that stepping is what makes blocks run. This page describes the
`Thread` and `Sequencer` model in `scratch-vm/src/engine/`. MistWarp can also compile scripts to
JavaScript, which changes how a thread runs but not the surrounding model.

## What a thread is

`Thread` (`engine/thread.js`) is one running script. Its important fields:

- `topBlock`: the ID of the script's top (hat or first) block.
- `target`: the sprite or stage running the script.
- `blockContainer`: the `Blocks` container the thread executes from. Usually the target's own
  blocks, but a script clicked in the palette runs from `runtime.flyoutBlocks`. The compiler also
  reads it, so a null container skips compilation.
- `stack`: block IDs from the top block down to the currently executing one. Entering a C-block
  (a loop or `if`) pushes onto this stack; finishing pops.
- `stackFrames`: one `_StackFrame` per stack level, holding per-level execution state (`warpMode`,
  `isLoop`, `justReported`, `waitingReporter`, procedure `params`, and a scratch `executionContext`
  that a block method can use across yields). Frames are pooled and recycled through a free list.
- `status`: the thread's state (see below).
- `requestScriptGlowInFrame` / `blockGlowInFrame`: whether the script should glow this frame and
  which block ID to glow. The runtime reads these when it emits the glow events (below).
- `warpTimer`: a `Timer` created when the thread enters warp mode; see [Warp mode](#warp-mode).
- `isKilled`: set when the thread was stopped mid-execution so a resuming block does not overrun.
- `isCompiled`, `generator`, `procedures`: set when the thread was compiled to JavaScript.

Each thread has a stable ID from its target and top block, `target.id & topBlock`
(`Thread.getIdFromTargetAndBlock`).

### Thread status

`status` is one of five constants:

| Constant | Value | Meaning |
| --- | --- | --- |
| `Thread.STATUS_RUNNING` | 0 | Normal execution; step block to block. |
| `Thread.STATUS_PROMISE_WAIT` | 1 | Waiting on a promise from an async block. |
| `Thread.STATUS_YIELD` | 2 | Yielded; resumes next step. |
| `Thread.STATUS_YIELD_TICK` | 3 | Yielded for a single tick; cleared when resumed. |
| `Thread.STATUS_DONE` | 4 | Finished; no blocks left. |

### The stack

`Thread` exposes stack helpers used by the interpreter and by C-block implementations:
`pushStack(blockId)`, `popStack()`, `peekStack()`, `peekStackFrame()`, `goToNextBlock()`,
`reuseStackForNextBlock(blockId)`, `stopThisScript()`, and the procedure-parameter helpers
`pushParam`, `getParam`, `initParams`.

## The sequencer

`Sequencer` (`engine/sequencer.js`) runs the threads. Once per frame the runtime calls
`stepThreads()`, which:

1. Sets a work budget: `WORK_TIME = 0.75 * runtime.currentStepTime` (75% of the frame interval).
2. Loops over `runtime.threads`, calling `stepThread(thread)` on each running or yielded thread.
3. Keeps looping while there are active threads, the work budget is not spent, and either turbo
   mode is on or no block has requested a screen redraw.
4. Removes finished threads and returns them.

`stepThread(thread)` runs one thread. If the thread is compiled it hands off to the compiled
executor; otherwise it walks the interpreter from the current block, handling reporters, C-block
branches, promises, and yields. When a block requests a redraw (or the budget runs out), the
sequencer stops for this frame and picks up where it left off next frame.

### Warp mode

Warp mode ("run without screen refresh", and the basis of custom-block warp) makes a section run
to completion without yielding to redraw. A warping thread times itself against
`Sequencer.WARP_TIME` (500 ms) using the thread's own `warpTimer` instead of the shared
`WORK_TIME` budget, so a runaway warp loop cannot freeze the page forever.

## Starting threads

Threads are created by the runtime, not directly by most code. Clicking the green flag calls
`vm.greenFlag()`, which starts every green-flag hat. Firing a hat (a broadcast, a key press, an
extension `EVENT` block) goes through `runtime.startHats(opcode, optMatchFields, optTarget)`,
which finds every matching script, respects the hat's `restartExistingThreads` metadata, and
returns the new threads. Clicking a script in the editor calls `runtime.toggleScript` and starts a
one-off "stack click" thread that is kept out of the thread map. As threads start, stop, and glow,
the runtime emits the `*_GLOW_*`, `PROJECT_RUN_START`, and `PROJECT_RUN_STOP`
[events](/api-reference/events). To start threads yourself or watch the ones that exist, see the
[Runtime API](/api-reference/runtime).

## Compiled threads

MistWarp's compiler turns a script into a JavaScript generator function. When a thread compiles,
`isCompiled` becomes true and its `generator` is stepped instead of the interpreter walking
blocks. The thread model above (status, warp, starting and stopping) is unchanged; only the
per-block execution is faster. The compiler is on by default and can be turned off from
[project settings](/advanced/disable-compiler).

## See also

- [Runtime API](/api-reference/runtime) for starting threads, targets, and IO devices
- [Block registration](/api-reference/block-registration)
- [VM API](/api-reference/vm-api)
- [Internals: architecture](/internals/architecture)
- [Compiled extensions](/building-extensions/compiled/overview)
- [Warp timer](/advanced/warp-timer) and [remove limits](/advanced/remove-limits)

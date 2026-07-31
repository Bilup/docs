---
title: Control blocks
sidebar_position: 6
---

Control blocks decide when and how often other blocks run: loops, conditionals, waiting, stopping, and clones. Several of them are C blocks that wrap the blocks placed inside.

## Waiting

- **wait `1` seconds** pauses the script for a time.
- **wait until `<condition>`** pauses until a boolean becomes true.

## Loops

- **repeat `10`** runs the wrapped blocks a set number of times.
- **forever** runs the wrapped blocks endlessly (a cap block, nothing follows it).
- **repeat until `<condition>`** runs the wrapped blocks until the boolean becomes true.

## Conditionals

- **if `<condition>` then** runs the wrapped blocks only when the boolean is true.
- **if `<condition>` then ... else** runs the first branch when true, the second when false.

## Stopping and clones

- **stop `all` / `this script` / `other scripts in sprite`** halts scripts. `all` stops the whole project.
- **when I start as a clone** (hat) runs when a clone of this sprite is created.
- **create clone of `myself` / sprite** makes a running copy of a sprite.
- **delete this clone** removes the clone running this script (a cap block).

## MistWarp and TurboWarp extras

These control blocks are not in stock Scratch's palette:

- **while `<condition>`** runs the wrapped blocks as long as the boolean stays true (the opposite of `repeat until`).
- **for each `item` in `10`** runs the wrapped blocks once per count, setting a variable to 1, 2, 3, and so on.
- **all at once** runs the wrapped blocks without any screen-refresh yielding, in one frame. It is kept mainly for compatibility; a normal script under [warp](/advanced/warp-timer) behaves the same way.
- **switch `expression`**, **case `value`**, **default**, and **break** build a switch statement: the matching `case` branch runs, and plain cases stop at the next case (no fall-through unless you add `break` behaviour). See [MistWarp extras](/blocks/mistwarp-extras) for details.
- **counter**, **increment counter**, and **set counter to `0`** are a lightweight built-in counter carried over from Scratch 2 (reporter, stack, and reset). They avoid needing a variable for simple counting.

## See also

- [MistWarp extras](/blocks/mistwarp-extras)
- [Warp / turbo mode](/advanced/warp-timer)
- [Events blocks](/blocks/events)

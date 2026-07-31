---
title: MistWarp extras
sidebar_position: 11
---

MistWarp is built on TurboWarp, which is built on Scratch. Along the way both projects added blocks that stock Scratch does not have. This page collects those extra blocks in one place. Each one lives in its normal category and is also linked from that category's page. For extension blocks (Pen, Music, and so on) see [Extensions](/extensions/overview) instead; this page is only the built-in extras.

Some of these blocks are shown in the palette by default; others are compatibility or advanced blocks that come from imported projects or from turning on the right addon. They all run the same way in the [compiler](/advanced/disable-compiler) and interpreter.

## Motion

- **point towards x: `0` y: `0`** faces a specific coordinate instead of a menu target.
- **point towards x: `0` y: `0` from x: `0` y: `0`** faces from one coordinate toward another.

See [Motion blocks](/blocks/motion).

## Control

- **while `<condition>`** loops while a boolean stays true (the inverse of `repeat until`).
- **for each `item` in `10`** loops a set number of times, setting a variable to 1, 2, 3, and so on.
- **all at once** runs its wrapped blocks in a single frame with no screen-refresh yielding. Kept for compatibility with older projects; ordinary scripts under [warp](/advanced/warp-timer) behave the same.
- **switch `expression`** / **case `value`** / **default** / **break** build a switch statement. `switch` picks a branch by matching value; a plain `case` runs its branch and stops; `default` runs when nothing matches; `break` and case fall-through control let one case continue into the next.
- **counter** (reporter), **increment counter**, **set counter to `0`** are a simple built-in counter carried over from Scratch 2, so you can count without making a variable.

See [Control blocks](/blocks/control).

## Operators

- **letters `1` to `3` of `apple`** returns a substring between two positions.
- **`item` in `apple`** returns the position of a substring (case-insensitive), or 0 if not found.
- **replace `a` with `-` in `apple`** replaces every occurrence of a substring (case-insensitive).
- **`ab` repeated `3` times** repeats a string.
- **`upper` / `lower` case of `Apple`** changes the case of text.
- **trim `  apple  `** removes surrounding whitespace.
- **clamp `5` between `0` and `10`** limits a number to a range.
- **min** / **max** return the smaller or larger of their operands.
- **pi** reports 3.14159...
- **newline** reports a line-break character.

See [Operators blocks](/blocks/operators).

## Sensing

- **online?** reports whether the device has a network connection (`navigator.onLine`).
- **stage width** / **stage height** report the stage size in pixels.

See [Sensing blocks](/blocks/sensing).

## Variables and data

- **`list` as JSON** reports a list as a JSON array string.

See [Variables and lists](/blocks/variables).

## My Blocks

- **return `value`** ends a custom block and hands a value back to the caller, letting a custom block act as a reporter.
- **is compiled?** / **is mistwarp?** are special boolean argument-reporter names: `is compiled?` reports true when the compiler is running, `is mistwarp?` always reports true here.

See [My Blocks](/blocks/my-blocks).

## See also

- [Blocks overview](/blocks/overview)
- [Extensions overview](/extensions/overview)
- [MistWarp block extension](/extensions/mistwarp-blocks)

---
title: Blocks overview
sidebar_position: 1
---

Blocks are the puzzle pieces you snap together to build a project. Each block is one instruction; a stack of blocks is a script. MistWarp uses the same block language as Scratch, so anything you know from Scratch works here, and it adds a handful of extra blocks on top (see [MistWarp extras](/blocks/mistwarp-extras)).

## Block shapes

The shape of a block tells you how it connects and what it does.

- **Hat blocks** have a rounded top and a flat bottom. They start a script in response to an event, such as `when green flag clicked`. You cannot put anything above a hat.
- **Stack blocks** are rectangular with a notch on top and a bump on the bottom. They do one thing and pass control to the block below, such as `move 10 steps`. Most blocks are this shape.
- **Boolean blocks** are pointed hexagons that report `true` or `false`, such as `mouse down?`. They plug into the hexagonal slots of other blocks.
- **Reporter blocks** are rounded ovals that report a value (a number or text), such as `x position` or `answer`. They plug into the rounded slots of other blocks.
- **C blocks** (also called wrapper blocks) wrap around other blocks, such as `repeat 10` or `if ... then`. The blocks you drop inside run according to the C block's rule.
- **Cap blocks** have a notch on top but a flat bottom, so nothing can follow them. `stop all` and `delete this clone` are caps.

## The palette and categories

The block palette runs down the left side of the [editor workspace](/editor/workspace). It is organised into colour-coded categories, and clicking a category name (or its dot) scrolls the palette to that section. The built-in categories are:

- [Motion](/blocks/motion) (blue) moves and rotates sprites.
- [Looks](/blocks/looks) (purple) changes costumes, size, effects, and speech bubbles.
- [Sound](/blocks/sound) (magenta) plays sounds and sets volume.
- [Events](/blocks/events) (yellow) starts scripts and sends broadcasts.
- [Control](/blocks/control) (gold) handles loops, conditionals, waiting, and clones.
- [Sensing](/blocks/sensing) (light blue) reads the mouse, keyboard, timer, and other sprites.
- [Operators](/blocks/operators) (green) does maths, text, and logic.
- [Variables](/blocks/variables) (orange) stores values and lists (data).
- [My Blocks](/blocks/my-blocks) (pink/red) holds the custom blocks you define yourself.

Below those, each loaded [extension](/extensions/overview) (Pen, Music, and so on) adds its own category. See the [blocks palette](/editor/blocks-palette) page for how to search and drag blocks.

## MistWarp and TurboWarp extra blocks

MistWarp inherits TurboWarp's additions and adds its own, so a number of blocks appear that stock Scratch does not have, spread across several categories: extra motion, control, operator, sensing, and data blocks, plus a `return` block for custom blocks. These are documented per category and collected on one page in [MistWarp extras](/blocks/mistwarp-extras).

## See also

- [The blocks palette](/editor/blocks-palette)
- [The workspace](/editor/workspace)
- [Extensions overview](/extensions/overview)
- [MistWarp extras](/blocks/mistwarp-extras)

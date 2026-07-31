---
title: My Blocks (custom blocks)
sidebar_position: 10
---

My Blocks lets you define your own blocks, also called custom blocks or procedures. A custom block bundles a script under a single name so you can reuse it, which keeps projects shorter and easier to read. Use the "Make a Block" button at the top of the category to create one. See [custom blocks](/editor/custom-blocks) in the editor guide for the full walkthrough.

## The pieces

- **define `my block`** (hat) marks where a custom block's script begins. This is what actually runs when the block is called.
- **`my block`** (the block you named) is a stack block placed in the palette; calling it runs its `define` script.
- **argument reporters** appear inside the `define` script for each input you added. They report the value passed in for that call. Number/text inputs are rounded reporters; boolean inputs are hexagonal.

When you make a block you add labels and inputs (number or text, or boolean), and you can tick "Run without screen refresh" to make the whole block run in one frame, like [warp mode](/advanced/warp-timer).

## MistWarp and TurboWarp extras

- **return `value`** (`procedures_return`) stops the current custom block and, when the block was defined to report a value, hands that value back to the caller. This turns a custom block into a reporter that computes and returns a result. Used outside a custom block, it simply stops the script.

Boolean argument reporters also recognise two special names even when no such argument exists: an `is compiled?` boolean reports true when the [compiler](/advanced/disable-compiler) is running the project, and an `is mistwarp?` boolean always reports true in MistWarp. They let a project detect its runtime.

See [MistWarp extras](/blocks/mistwarp-extras).

## See also

- [Custom blocks](/editor/custom-blocks)
- [Control blocks](/blocks/control)
- [MistWarp extras](/blocks/mistwarp-extras)

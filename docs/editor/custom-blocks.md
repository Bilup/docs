---
title: Custom blocks (My Blocks)
sidebar_position: 10
---

Custom blocks let you name a piece of script and reuse it as a single block. They live in the **My Blocks** category of the [blocks palette](/editor/blocks-palette). A custom block is like a function: define it once, then call it from anywhere in that sprite.

## Making a block

1. Open **My Blocks** and click **Make a Block**.
2. In the editor that opens, type the block's text. Click the buttons to add inputs and labels as you go:
   - **Add an input (number or text)**: a slot that accepts any value, passed into the definition as a reporter.
   - **Add an input (boolean)**: a hexagonal slot that accepts a true/false condition.
   - **Add a label**: plain text between inputs, so the block reads like a sentence (for example `move` `[steps]` `at speed` `[speed]`).
3. Optionally tick **Run without screen refresh** (see below).
4. Click **OK**.

You get two things: a **define** hat block in the workspace, and a new block in the palette. Put the script you want to reuse under the define hat. Whatever inputs you added appear on the define hat as reporters you can drop into that script.

## Run without screen refresh

By default a custom block redraws the stage between steps like any other script. **Run without screen refresh** makes the whole block finish in a single frame, without pausing to redraw. This is the standard way to make a fast helper (drawing, list processing, maths) run instantly instead of one loop iteration per frame. Be careful with long or infinite loops inside such a block: they can freeze the project. MistWarp's [warp timer](/advanced/warp-timer) setting guards against many of these freezes.

## Editing and deleting

Right-click the **define** hat to edit the block's inputs, or right-click the block in the palette to delete it (you cannot delete a custom block while it is still used in a script). Custom blocks belong to the sprite that defines them; duplicating or exporting the sprite carries them along.

## Reporter and boolean custom blocks

Vanilla Scratch custom blocks are commands only (they run, but do not report a value). MistWarp adds **Custom Reporters** so a custom block can return a value:

- Right-click a custom block's define hat and choose **Change To Reporter** (or **Change To Statement** to turn it back). A reporter-shaped custom block can be dropped into any input, just like `x position`.
- Inside the definition, use the **return** block to hand back a value and stop the block. The return block comes from the Custom Reporters feature that MistWarp enables automatically.

These blocks are a MistWarp extension of Scratch. Projects that use them will not run unchanged on scratch.mit.edu. If you need vanilla compatibility, the **Vanilla Compatible Blocks Only** [setting](/editor/settings) hides them.

## See also

- [My Blocks reference](/blocks/my-blocks)
- [The block workspace](/editor/workspace)
- [Warp timer](/advanced/warp-timer)
- [Custom C blocks](/building-extensions/custom-c-blocks) for extension authors

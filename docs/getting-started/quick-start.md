---
title: Quick start
sidebar_position: 3
---

# Quick start

This page builds a small working project from an empty editor. It takes a few minutes and assumes no prior MistWarp experience. If you have never used Scratch either, the block system is the same one Scratch uses; see [Migrating from Scratch](/getting-started/migrating-from-scratch) for the concepts.

## Open the editor

Go to [warp.mistium.com](https://warp.mistium.com/). A new project opens with the default sprite, **Misty**, already on the stage. You do not need an account for anything on this page.

## Add code

The editor opens on the **Code** tab. The [blocks palette](/editor/blocks-palette) is on the left, grouped by category; the [workspace](/editor/workspace) where scripts go is in the middle.

1. From the **Events** category, drag a `when green flag clicked` block into the workspace. This is a hat block: it starts a script when the project runs.
2. From **Looks**, drag a `say [Hello!] for (2) seconds` block and snap it under the hat.
3. From **Motion**, drag a `move (10) steps` block underneath.
4. From **Control**, drag a `forever` block and wrap it around the `move` block so the sprite keeps moving.

Blocks snap together when their notches line up. To pull a block out, drag it away; to delete one, drag it back onto the palette.

## Run it

Above the [stage](/editor/stage) on the right is the green flag and the stop sign. Click the **green flag** to run your script; Misty says hello and starts moving. Click the **stop sign** to stop. Pressing the space bar also toggles running.

If the sprite walks off the edge, add an `if on edge, bounce` block from **Motion** inside the `forever` loop.

## Change how it looks

- The **Costumes** tab lets you draw or edit the sprite's appearance. See [Costumes](/editor/costumes).
- The **Sounds** tab manages audio. See [Sounds](/editor/sounds).
- Add more sprites with the sprite button at the bottom right of the [sprite pane](/editor/sprites), and change the backdrop from the [stage selector](/editor/stage) next to it.

## Save it

- **File then Save to your computer** downloads a `.sb3` file. This works with no account, and the file also opens in Scratch and TurboWarp.
- **File then Load from your computer** reopens a `.sb3` later.
- With a Rotur account, **File then Save to MistWarp** publishes the project to your account and the community. See [Project management](/editor/project-management).

MistWarp also keeps [restore points](/editor/restore-points) and autosaves in the background, so a crash or accidental reload does not lose your work.

## Where to go next

- [Editor tour](/getting-started/editor-tour) names every region of the interface.
- [Blocks overview](/blocks/overview) is the reference for each block category.
- [Extensions overview](/extensions/overview) adds blocks for pen, music, translation, hardware, and more.
- [Advanced settings](/advanced/custom-fps) unlock higher frame rates, a custom stage size, and other limits.

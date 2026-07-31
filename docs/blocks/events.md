---
title: Events blocks
sidebar_position: 5
---

Events blocks start scripts. Most of them are hat blocks that sit at the top of a stack and run it when something happens. Broadcasts let one script trigger scripts anywhere else in the project, including on other sprites.

## Hat blocks (script starters)

- **when green flag clicked** runs when the project starts. Starting again restarts these scripts.
- **when `space` key pressed** runs when a key is pressed. The menu includes specific keys and `any`.
- **when this sprite clicked** runs when the sprite is clicked.
- **when stage clicked** runs when the stage backdrop is clicked (shown when the stage is selected).
- **when backdrop switches to `backdrop`** runs when the stage changes to the named backdrop.
- **when `loudness` > `10`** runs when a sensed value (loudness or timer) rises above a threshold. This is an edge-triggered hat: it fires on the crossing, not continuously.
- **when I receive `message1`** runs when a matching broadcast is sent.

MistWarp also exposes **when touching `mouse-pointer`** as an edge-triggered hat that runs when the sprite starts touching a target.

## Broadcasting

- **broadcast `message1`** sends a message to every `when I receive` script and continues immediately, without waiting for them.
- **broadcast `message1` and wait** sends a message and pauses this script until all receiving scripts finish.

Broadcasts are chosen from a menu of message names; use the menu's "New message" option to add one.

## See also

- [Control blocks](/blocks/control) for waiting and loops
- [Sensing blocks](/blocks/sensing) for the values used by `when ... >`
- [The workspace](/editor/workspace)

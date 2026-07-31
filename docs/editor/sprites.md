---
title: Sprites
sidebar_position: 4
---

Sprites are the objects in your project: characters, buttons, backgrounds of movement, anything with its own scripts, costumes, and sounds. The sprite pane sits below the [stage](/editor/stage) and lists every sprite, shows the selected sprite's properties, and lets you add new ones.

A new MistWarp project starts with one sprite named **Misty**.

## The sprite list

Each sprite appears as a tile showing its thumbnail and name. Click a tile to select that sprite; the [Code](/editor/workspace), [Costumes](/editor/costumes), and [Sounds](/editor/sounds) tabs then edit that sprite. The selected sprite is highlighted.

Right-clicking a sprite tile opens a menu with:

- **duplicate**: make a full copy, including scripts, costumes, and sounds.
- **export**: save the sprite to your computer as a `.sprite3` file, which you can import into another project.
- **rename**
- **delete**

You can drag tiles to reorder them.

## Sprite properties

When a sprite is selected, its properties appear above the list:

- **Sprite** name: rename the sprite.
- **x** and **y**: its position on the [stage](/editor/stage).
- **Show** / hide: whether the sprite is visible (the eye buttons).
- **Size**: scale as a percentage, where 100 is the costume's natural size.
- **Direction**: the way the sprite points, set with the direction dial.

Editing these here is the same as the sprite doing it with [motion](/blocks/motion) and [looks](/blocks/looks) blocks; it is just the starting value.

### Rotation style

The direction dial also sets the **rotation style**, which controls how the sprite turns:

- **All around**: the costume rotates freely to face its direction.
- **Left-right**: the costume only flips horizontally, so it never appears upside down.
- **Don't rotate**: the costume never turns, whatever the direction.

## Adding sprites

The round add-sprite button (bottom-right of the pane) offers four ways to add a sprite:

- **Choose a Sprite**: pick from the built-in sprite library.
- **Paint**: create a blank sprite and open the [paint editor](/editor/costumes).
- **Surprise**: add a random sprite from the library.
- **Upload Sprite**: load an image or sprite file from your computer. Accepted types include `.svg`, `.png`, `.bmp`, `.jpg`, `.jpeg`, `.jfif`, `.webp`, `.gif`, and Scratch sprite files (`.sprite2`, `.sprite3`). You can select several files at once.

## The stage and backdrops

To the right of the sprite list is the **stage** tile. Selecting it lets you edit the stage's scripts, its **backdrops** (the Costumes tab becomes Backdrops), and its sounds. The stage cannot move, so it has no position, size, or direction, but it can have many backdrops and switch between them.

## See also

- [Costumes and the paint editor](/editor/costumes)
- [Sounds](/editor/sounds)
- [Motion blocks](/blocks/motion) and [Looks blocks](/blocks/looks)
- [The stage](/editor/stage)

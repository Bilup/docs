---
title: Motion blocks
sidebar_position: 2
---

Motion blocks move and rotate sprites on the [stage](/editor/stage). They have no effect on the stage itself, so the palette shows a reduced set when the stage is selected. Positions use Scratch coordinates: x runs left (negative) to right (positive), y runs down (negative) to up (positive), and 0,0 is the centre.

## Moving

- **move `10` steps** moves the sprite forward in the direction it is facing.
- **go to x: `0` y: `0`** jumps the sprite to an exact position.
- **go to `random position` / `mouse-pointer` / sprite** jumps to a target, a random spot, or the mouse.
- **glide `1` secs to x: `0` y: `0`** moves smoothly to a position over the given time.
- **glide `1` secs to `random position` / `mouse-pointer` / sprite** glides smoothly to a target.
- **change x by `10`** / **set x to `0`** adjusts or sets the horizontal position.
- **change y by `10`** / **set y to `0`** adjusts or sets the vertical position.

## Turning and direction

- **turn right `15` degrees** / **turn left `15` degrees** rotates the sprite.
- **point in direction `90`** faces a compass direction (90 is right, 0 is up, -90 is left, 180 is down).
- **point towards `mouse-pointer` / sprite** faces a target.
- **if on edge, bounce** reverses direction when the sprite hits the edge of the stage.
- **set rotation style `left-right` / `don't rotate` / `all around`** controls how the sprite visually rotates.

## Reporters

- **x position** reports the current x coordinate.
- **y position** reports the current y coordinate.
- **direction** reports the current direction in degrees.

## MistWarp and TurboWarp extras

These motion blocks are not in stock Scratch:

- **point towards x: `0` y: `0`** faces a specific coordinate instead of picking a target from a menu.
- **point towards x: `0` y: `0` from x: `0` y: `0`** faces from one coordinate toward another.

See [MistWarp extras](/blocks/mistwarp-extras) for the full list of added blocks.

## See also

- [The stage](/editor/stage)
- [Sprites](/editor/sprites)
- [Sensing blocks](/blocks/sensing) for reading positions of other sprites

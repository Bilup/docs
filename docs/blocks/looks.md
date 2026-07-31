---
title: Looks blocks
sidebar_position: 3
---

Looks blocks change what a sprite (or the [stage](/editor/stage)) shows: its costume or backdrop, size, graphic effects, layer, and speech or thought bubbles. When the stage is selected, only the backdrop, effect, and layer-independent blocks appear.

## Speech and thought bubbles

- **say `Hello!`** shows a speech bubble that stays until changed or cleared.
- **say `Hello!` for `2` seconds** shows a speech bubble for a set time, then removes it.
- **think `Hmm...`** shows a thought bubble that stays.
- **think `Hmm...` for `2` seconds** shows a thought bubble for a set time.

Saying or thinking an empty value clears the bubble.

## Showing and costumes

- **show** / **hide** makes the sprite visible or invisible.
- **switch costume to `costume`** changes the costume by name or number.
- **next costume** advances to the next costume, wrapping around at the end.
- **costume `number` / `name`** reports the current costume's number or name.

## Backdrops (stage)

- **switch backdrop to `backdrop`** changes the stage backdrop. The menu also accepts `next backdrop`, `previous backdrop`, and `random backdrop`.
- **next backdrop** advances to the next backdrop.
- **switch backdrop to `backdrop` and wait** switches, then waits for any `when backdrop switches to` scripts to finish.
- **backdrop `number` / `name`** reports the current backdrop's number or name.

## Size and graphic effects

- **change size by `10`** / **set size to `100` %** adjusts or sets the sprite's size.
- **size** reports the current size as a percentage.
- **change `color` effect by `25`** / **set `color` effect to `0`** adjusts a graphic effect. Effects include color, fisheye, whirl, pixelate, mosaic, brightness, and ghost (transparency).
- **clear graphic effects** resets all effects to zero.

## Layers

- **go to `front` / `back` layer** moves the sprite to the very front or back.
- **go `forward` / `backward` `1` layers** moves the sprite a number of layers relative to where it is.

## See also

- [Costumes](/editor/costumes)
- [The stage](/editor/stage)
- [Events blocks](/blocks/events) for `when backdrop switches to`

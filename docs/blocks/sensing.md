---
title: Sensing blocks
sidebar_position: 7
---

Sensing blocks read the world around a script: collisions, the mouse and keyboard, the timer, the date, and the properties of other sprites.

## Touching and distance

- **touching `mouse-pointer` / edge / sprite ?** reports whether the sprite is touching a target.
- **touching color `[#color]` ?** reports whether the sprite touches a colour on screen.
- **color `[#color]` is touching `[#color]` ?** reports whether one colour on the sprite touches another colour.
- **distance to `mouse-pointer` / sprite** reports the distance in pixels.

## Asking and answering

- **ask `What's your name?` and wait** shows an input box and pauses until the user answers.
- **answer** reports the most recent answer.

## Mouse and keyboard

- **mouse down?** reports whether the mouse button is held.
- **mouse x** / **mouse y** report the pointer's position.
- **key `space` pressed?** reports whether a key is held.
- **set drag mode `draggable` / `not draggable`** controls whether the player can drag this sprite.

## Values and properties

- **loudness** reports the microphone input level (0 to 100).
- **timer** reports seconds since the timer last reset; **reset timer** sets it to zero.
- **`backdrop #` of `Stage` / property of sprite** reports a property (x, y, direction, costume, size, volume, variables, and so on) of another sprite or the stage.
- **current `year` / `month` / `date` / `day of week` / `hour` / `minute` / `second`** reports a piece of the current date and time.
- **days since 2000** reports the number of days (with fraction) since the year 2000.
- **username** reports the signed-in player's username, when available.

## MistWarp and TurboWarp extras

- **online?** This `sensing_online` boolean reports whether the device currently has a network connection (`navigator.onLine`).
- **stage width** (`sensing_stagewidth`) reports the stage width in pixels (480 by default, but the [stage size](/editor/stage) can be changed).
- **stage height** (`sensing_stageheight`) reports the stage height in pixels (360 by default).

There is also a **loudness > `10`?** style boolean used by the `when ... >` hat.

See [MistWarp extras](/blocks/mistwarp-extras).

## See also

- [Events blocks](/blocks/events) for `when key pressed` and `when this sprite clicked`
- [Operators blocks](/blocks/operators) for comparing sensed values
- [MistWarp extras](/blocks/mistwarp-extras)

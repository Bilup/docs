---
title: micro:bit
sidebar_position: 12
---

# micro:bit

The **micro:bit** extension connects a project to a BBC micro:bit, a small programmable board with buttons, motion sensing, an LED display, and input pins. It is built in and compatible with Scratch.

Load it from **Add Extension** and choose **micro:bit**.

## Requirements

The micro:bit talks to MistWarp over Bluetooth, so you need:

- A computer with Bluetooth and a browser that supports it.
- **Scratch Link** (or the Scratch app) running to bridge Bluetooth to the browser.
- The Scratch micro:bit HEX firmware flashed onto the board.

When you add the extension, a connection window appears so you can pair the board. If pairing fails, check that Scratch Link is running and the firmware is installed.

## Blocks

### when `[button]` button pressed

A hat block that runs when button **A**, **B**, or **any** button is pressed.

### `[button]` button pressed?

A boolean that reports whether the given button is currently held.

### when `[gesture]`

A hat block that runs on a motion gesture such as **moved**, **shaken**, or **jumped**.

### display `[matrix]`

Lights up a pattern on the 5 by 5 LED display. Click the block to edit which LEDs are on.

### display text `[text]`

Scrolls a short message across the LED display.

### clear display

Turns every LED off.

### when tilted `[direction]` / tilted `[direction]`? / tilt angle `[direction]`

React to tilting the board **front**, **back**, **left**, **right**, or **any** direction, or read the tilt angle as a number.

### when pin `[pin]` connected

A hat block that runs when a circuit is completed through one of the micro:bit pins, so you can wire up your own buttons.

## See also

- [Extensions overview](/extensions/overview)
- [Sensing blocks](/blocks/sensing) for the built-in input blocks

---
title: Makey Makey
sidebar_position: 11
---

# Makey Makey

The **Makey Makey** extension adds blocks for reacting to a Makey Makey board, a small circuit board (by JoyLabz) that turns everyday conductive objects, like bananas or a drawing in pencil, into keys. It is built in and compatible with Scratch.

Load it from **Add Extension** and choose **Makey Makey**.

## How it works

A Makey Makey plugs into your computer over USB and pretends to be a keyboard. When you complete a circuit by touching a connected object, it sends a key press. These blocks are just a friendlier way to respond to those key presses, so no special driver or Bluetooth is needed, only the board plugged in.

## Blocks

### when `[key]` key pressed

```scratch
when (space v) key pressed
```

A hat block that runs when the given key is pressed. The dropdown includes **space**, the four **arrow** keys, and letter keys, matching the pads on the Makey Makey.

### when `[sequence]` pressed in order

```scratch
when (left up right v) pressed in order
```

A hat block that runs only when a sequence of keys is pressed in the right order, so you can build combos and secret codes. The menu offers preset sequences (including the classic up-up-down-down arrow patterns).

## Tips

- You do not strictly need a Makey Makey to test these; because they respond to ordinary key presses, the same-named keyboard keys trigger them too.
- The *pressed in order* block is handy for cheat codes and rhythm inputs.

## See also

- [Sensing blocks](/blocks/sensing)
- [Extensions Overview](/extensions/overview)

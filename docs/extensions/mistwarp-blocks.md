---
title: MistWarp Blocks
sidebar_position: 2
---

# MistWarp Blocks

The **MistWarp Blocks** extension (internal id `tw`) adds a small set of extra input blocks that vanilla Scratch does not have. It is built in, loads instantly, and is marked as incompatible with Scratch, so projects that use it will not run on scratch.mit.edu.

Load it from **Add Extension** and choose **MistWarp Blocks**.

## Blocks

### last key pressed

```scratch
(last key pressed)
```

A reporter that returns the most recent key the user pressed, as its key name (for example `space`, `a`, `up arrow`). Useful for menus, text entry, or letting the player rebind controls without checking every key individually.

### `[button]` mouse button down?

```scratch
<(0) mouse button down?>
```

A boolean that reports whether a specific mouse button is currently held. The dropdown offers:

- **(0) primary** (usually the left button)
- **(1) middle** (the scroll-wheel button)
- **(2) secondary** (usually the right button)

The dropdown accepts a reporter, so you can compute the button number at runtime. This lets you detect right-clicks and middle-clicks, which the standard `mouse down?` block cannot distinguish.

## Tips

- These blocks read the same keyboard and mouse state that the standard sensing blocks use, so they work everywhere in the editor and in the packager.
- Because the extension is Scratch-incompatible, avoid it if you plan to publish the project to scratch.mit.edu. For MistWarp-only projects it is safe to rely on.

## See also

- [Sensing blocks](/blocks/sensing)
- [Extensions Overview](/extensions/overview)

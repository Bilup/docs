---
title: Remove Fencing
sidebar_position: 14
---

# Remove Fencing

"Fencing" is Scratch's rule that keeps sprites partly on the stage, caps how large or small they can get, and stops "touching" checks from working past the stage edge. Removing fencing lets sprites move fully offscreen, grow or shrink without limit, and detect touching offscreen. Enable it in the [editor settings](/editor/settings) or with the [`offscreen` URL parameter](/advanced/url-parameters).

This can slightly improve performance in some projects, since the runtime no longer clamps sprite positions every frame.

:::caution
Some projects depend on fencing to keep sprites visible or in bounds, and can break when it is removed.
:::

## See also

- [Remove Miscellaneous Limits](/advanced/remove-limits)
- [Editor settings](/editor/settings)

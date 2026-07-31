---
title: High Quality Pen
sidebar_position: 9
---

# High Quality Pen

By default the pen layer is drawn at 480x360 and stretched to fit the stage, so pen art can look blocky when the stage is larger. High Quality Pen renders the pen layer at the stage's real resolution instead, and disables some coordinate rounding so pen lines land where you expect. Enable it in the [editor settings](/editor/settings) or with the [`hqpen` URL parameter](/advanced/url-parameters).

:::caution
High quality pen can significantly reduce performance, especially in fullscreen, because there are many more pixels to draw every frame. Not every project looks better with it on, so compare both before shipping.
:::

It pairs naturally with a [custom stage size](/advanced/custom-stage-size), since that is when the low default pen resolution is most visible.

## See also

- [Custom Stage Size](/advanced/custom-stage-size)
- [Pen extension](/extensions/pen)
- [Editor settings](/editor/settings)

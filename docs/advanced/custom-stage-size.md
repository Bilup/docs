---
title: Custom Stage Size
sidebar_position: 8
---

# Custom Stage Size

MistWarp can change the stage from Scratch's default 480x360 (4:3) to any other size, from the [editor settings](/editor/settings) or the [`size` URL parameter](/advanced/url-parameters) (`size=640x360`).

:::caution
Most projects are not built for a different stage size and will not lay out correctly when you change it.
:::

For example, `640x360` gives a widescreen 16:9 stage. Higher resolutions like `1280x720` or `1920x1080` work, but it is usually better to author at a lower resolution with the same aspect ratio and let fullscreen mode upscale it. Very large stages may not even fit on some displays, and they cost more to render.

A project can read the current stage size at runtime, so scripts that position or scale things can adapt. If you want the stage to follow the window or fullscreen size automatically in a packaged build, see [Dynamic stage resize](/packager/dynamic-stage-resize).

## See also

- [High Quality Pen](/advanced/high-quality-pen)
- [Dynamic stage resize](/packager/dynamic-stage-resize)
- [Editor settings](/editor/settings)

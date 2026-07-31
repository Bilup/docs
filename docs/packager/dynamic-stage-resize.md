---
title: Dynamic Stage Resize
sidebar_position: 4
slug: /packager/dynamic-stage-resize
---

# Dynamic stage resize

:::info
This is a [MistWarp Packager](/packager/overview) option.
:::

Dynamic stage resize makes the stage match whatever size and aspect ratio it is being shown at, instead of a fixed [stage size](/advanced/custom-stage-size).

The stage is not scaled, its actual dimensions change. If the user goes fullscreen on a 1920x1080 monitor, the stage becomes 1920x1080. If they shrink the window to 1x1, the stage becomes 1x1, so add a minimum-size check in your project to avoid degenerate cases.

## Making a project compatible

Almost no projects handle this out of the box. To support it:

1. First make the project work with a [custom stage size](/advanced/custom-stage-size) at all.
2. Then move your stage-size detection into a loop that runs every frame, and re-position everything based on the current size each frame. This is not elegant, but it is fast enough and is the most reliable approach.

## See also

- [Custom stage size](/advanced/custom-stage-size)
- [Packager overview](/packager/overview)

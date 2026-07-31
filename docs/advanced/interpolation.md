---
title: Interpolation
sidebar_position: 10
---

# Interpolation

Interpolation makes motion look smoother by drawing sprites at in-between positions between script frames. It is essentially a higher visual frame rate that does not change how fast scripts run, so unlike [raising the FPS](/advanced/custom-fps) it will not speed your game up or break timing. Enable it in the [editor settings](/editor/settings) or with the [`interpolate` URL parameter](/advanced/url-parameters).

## When not to use it

Interpolation does not help, and can hurt performance, on:

- 3D projects
- Raytracers
- Pen projects (pen cannot be interpolated)
- Projects that are already laggy

## Trade-offs

- It can add up to about 1/30th of a second of input latency, because a frame has to be held back to interpolate toward.
- Complex projects such as scrolling platformers may show minor graphical glitches.

For most non-pen games that move sprites around, interpolation is a cheap way to make motion feel much smoother while keeping the frame rate at 30.

## See also

- [Custom FPS](/advanced/custom-fps)
- [Editor settings](/editor/settings)

---
title: Custom FPS
sidebar_position: 7
---

# Custom FPS

Frame rate (frames per second) controls how many times per second your scripts run. Scratch runs at 30 FPS. MistWarp lets you change this, most commonly to 60 FPS, from the [editor settings](/editor/settings) or the [`fps` URL parameter](/advanced/url-parameters).

A value of `0` is special: the project runs at the same rate as the display's refresh rate instead of a fixed interval. At `0`, scripts may stop running when the project's tab is hidden.

## Most projects need changes to work at higher FPS

Raising the frame rate makes scripts run more often, so anything that moves by a fixed amount each frame moves faster. Consider `forever { move 1 step }`: at 30 FPS the sprite moves 30 steps per second, but at 60 FPS it moves 60 steps per second, twice as fast.

If you only want smoother motion without changing game speed, use [interpolation](/advanced/interpolation) instead of raising the frame rate. Interpolation keeps scripts at their normal rate and smooths the visuals in between.

To make a project genuinely frame-rate independent, use **delta time**: measure how much real time passed since the last frame and scale movement by it. This is a common game-development technique and usually requires reworking your movement scripts.

- [Delta timing (Wikipedia)](https://en.wikipedia.org/wiki/Delta_timing)

## See also

- [Interpolation](/advanced/interpolation)
- [URL Parameters](/advanced/url-parameters)
- [Editor settings](/editor/settings)

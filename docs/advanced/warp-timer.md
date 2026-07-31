---
title: Warp Timer
sidebar_position: 12
---

# Warp Timer

The Warp Timer makes scripts check whether they are stuck in a long or infinite loop and drop to a low frame rate instead of freezing the whole project until the loop finishes. This prevents most "the project hung" crashes, but it has a real performance cost, so it is only on by default in the editor, not in the player. Toggle it in the [editor settings](/editor/settings) or with the [`stuck` URL parameter](/advanced/url-parameters) (also accepted as `warp_timer`).

As a demonstration, consider a project with an infinite loop inside a "run without screen refresh" block. With the Warp Timer on, the project keeps rendering at a low frame rate (a couple of frames per second). With it off, the script never yields and the project appears frozen.

Warp Timer was previously called "Stuck Checking".

## See also

- [Custom FPS](/advanced/custom-fps)
- [URL Parameters](/advanced/url-parameters)
- [Editor settings](/editor/settings)

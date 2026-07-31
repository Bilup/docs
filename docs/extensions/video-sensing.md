---
title: Video Sensing
sidebar_position: 7
---

# Video Sensing

The **Video Sensing** extension shows your webcam on the stage and measures motion in it, so sprites can react to you waving your hand or moving in front of the camera. It is built in and compatible with Scratch.

Load it from **Add Extension** and choose **Video Sensing**.

## Requires a camera

The first time the video turns on, your browser asks for permission to use the webcam. Video Sensing detects the amount and direction of motion in the camera image; it does not recognise faces or objects. For face detection, see [Face Sensing](/extensions/face-sensing).

## Blocks

### when video motion > `[reference]`

```scratch
when video motion > (10)
```

A hat block that runs its script whenever the measured motion rises above the given threshold.

### video `[attribute]` on `[subject]`

```scratch
(video (motion v) on (sprite v))
```

Reporter for the current video reading. **attribute** is **motion** (how much movement) or **direction** (which way it is moving). **subject** is **sprite** (only the area over this sprite) or **stage** (the whole stage).

### turn video `[state]`

```scratch
turn video (on v)
```

Turns the camera feed **on**, **off**, or **on flipped** (mirrored left-to-right, which usually feels more natural).

### set video transparency to `[transparency]`

```scratch
set video transparency to (50)
```

Sets how see-through the camera image is on the stage, from 0 (opaque) to 100 (invisible). The motion sensing still works even when the video is fully transparent.

## Tips

- Motion is measured between video frames, so a still scene reads near zero and fast movement reads high.
- Use *on sprite* to make each sprite respond only to motion in its own area, for example buttons you "push" by waving over them.

## See also

- [Face Sensing](/extensions/face-sensing)
- [Extensions Overview](/extensions/overview)

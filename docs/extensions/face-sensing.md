---
title: Face Sensing
sidebar_position: 8
---

# Face Sensing

The **Face Sensing** extension detects a face in your webcam and reports where its features are, so a sprite can follow your nose, sit on your head, or react when you tilt. It is a remote extension, not bundled with the editor.

Load it from **Add Extension** and choose **Face Sensing**.

## Loaded remotely, needs a camera

Face Sensing is not bundled with the editor. The first time you load it, MistWarp downloads it from a remote URL, so you need an internet connection to load it (once loaded and saved, it reloads with the project). Like Video Sensing, it needs webcam permission to run.

## Blocks

The extension provides blocks in a few groups:

- **Face detection**: a hat that runs *when a face is detected*, and a boolean *a face is detected?* so you can check for a face anywhere in your scripts.
- **Face size**: a *face size* reporter for how large the detected face is, plus a command to set the sprite's size to match the face.
- **Face tilt**: a *face tilt* reporter, a hat that runs *when the face tilts* left or right, and a command to point the sprite in the direction of the tilt.
- **Feature positions**: reporters for the position of face parts, including between the eyes, each eye, the nose, the mouth, each ear, and the top of the head, plus a *go to* command to move a sprite to any of those parts.

The exact block wording comes from the extension itself; open it in the editor to see the full list.

## Tips

- Only one face is tracked at a time, so this works best with a single person facing the camera in reasonable light.
- Pair *go to* a face part with a sprite costume to make hats, glasses, or masks that follow your face.
- If detection fails to start, it is usually a camera-permission or lighting problem, not a project bug.

## See also

- [Video Sensing](/extensions/video-sensing)
- [Extensions Overview](/extensions/overview)

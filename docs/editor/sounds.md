---
title: Sounds and the sound editor
sidebar_position: 6
---

Every sprite and the stage can hold **sounds**: audio clips you play with [Sound blocks](/blocks/sound). The **Sounds** tab lists them and opens the built-in sound editor, where you can record, trim, and apply effects without leaving MistWarp.

## The sound list

Sounds appear down the left of the Sounds tab, each with a name and its length in seconds. Click one to select and edit it. Right-click for **duplicate**, **export** (saves the clip to your computer), and **delete**.

## Adding a sound

The round add button at the bottom offers:

- **Choose a Sound**: pick from the built-in library.
- **Upload Sound**: load an audio file. Accepted types are `.wav`, `.mp3`, `.ogg`, `.flac`, `.aac`, and `.m4a`. You can select several at once.
- **Surprise**: add a random sound from the library.
- **Record**: capture audio from your microphone (see below).

## Recording

**Record** opens the recorder. Grant microphone access, press record, then stop when you are done. You get a waveform with trim handles so you can cut the recording down to just the part you want before saving it as a new sound. Recording needs a working microphone and browser audio support.

## The sound editor

Selecting a sound shows its **waveform**. The controls are:

- **Play** / **Stop** (also toggled with the spacebar).
- Drag across the waveform to make a **selection**. The time readout shows the position and length of the current selection, or of the whole sound if nothing is selected. Press `Escape` or `Ctrl+A` to clear or select all.
- **Trim**: with a selection made, **Delete** (or the `Delete` / `Backspace` key) removes it. `Shift+Delete` keeps only the selection and deletes everything else.
- **Copy**, **Paste**, and **Copy to New** (turns the selection into a brand-new sound). Standard `Ctrl+C` / `Ctrl+V` also work.
- **Undo** and **Redo** (`Ctrl+Z` / `Ctrl+Shift+Z`), up to 99 steps.

Effects apply to the selection, or to the whole sound if nothing is selected:

- **Faster** and **Slower** change the playback rate and pitch.
- **Louder** and **Softer** change the volume (Louder is disabled when the clip is already near clipping).
- **Mute** silences the selection.
- **Fade in** and **Fade out** ramp the volume at the edges.
- **Reverse** plays the audio backwards.
- **Robot** adds a metallic, pitched texture.
- **Echo** adds a repeating echo.

## Notes

- The editor works in **mono**. Editing a stereo sound warns you first, because saving the edit converts it to mono permanently.
- Below the waveform is the clip's sample rate, channel count, and file size. Very large sounds show a warning that they may be too big to upload.
- Sound edits are destructive to the stored asset but fully undoable while the editor is open.

## See also

- [Sound blocks](/blocks/sound)
- [Costumes and the paint editor](/editor/costumes)
- [The Music extension](/extensions/music) for instruments and drums

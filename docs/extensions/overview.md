---
title: Extensions Overview
sidebar_position: 1
---

# Extensions Overview

Extensions add extra blocks to the palette that are not part of the core block categories. An extension can add a whole new instrument set, drive a physical robot over Bluetooth, read a webcam, or inject raw JavaScript into your compiled project. Once loaded, its blocks appear as a new category at the bottom of the blocks palette.

## Adding an extension

Click the **Add Extension** button in the bottom-left corner of the editor (the icon below the blocks palette). This opens the extension library. Click any extension to load it. Its blocks are added to your project immediately and are saved with the project, so anyone who opens the project later gets the same blocks.

Some extensions do more than add blocks:

- **Hardware extensions** (micro:bit, LEGO, Vernier sensors) open a connection dialog so you can pair a device over Bluetooth before the blocks do anything.
- **Camera extensions** (Video Sensing, Face Sensing) ask your browser for webcam permission the first time they run.

## Built-in vs remote extensions

MistWarp ships with two kinds of extension in the library:

- **Built-in** extensions are bundled with the editor and load instantly, offline. These include MistWarp Blocks, Patching, Music, Pen, Video Sensing, Text to Speech, Translate, Makey Makey, and the hardware extensions.
- **Remote** extensions are downloaded from a URL the first time you load them, so they need an internet connection to load. Face Sensing is one of these. The library also links out to the full MistWarp extension gallery at [extensions.mistium.com](https://extensions.mistium.com/), which hosts hundreds of community extensions.

A few built-in extensions also need the internet to actually work (not just to load): Text to Speech and Translate call an online service every time you use them, and hardware extensions may fetch firmware or connection assets.

## Loading a custom extension

If an extension is not in the library, you can load it yourself from a URL, a local file, or pasted JavaScript source. Open the extension library and choose **Custom Extension**. See [Custom Extensions](/extensions/custom-extension) for the details, including the difference between sandboxed and unsandboxed extensions and the security prompt you will see.

## Compatibility with Scratch

Some extensions are marked as incompatible with Scratch (MistWarp Blocks, Patching, and most custom extensions). Projects that use them will not run on scratch.mit.edu. The library warns you before loading one of these. Extensions that came from Scratch itself (Music, Pen, Video Sensing, Text to Speech, Translate, Makey Makey, and the LEGO / micro:bit / Vernier hardware extensions) stay compatible with Scratch.

## Writing your own

If you want to build an extension rather than just use one, start with [Building Extensions: Introduction](/building-extensions/introduction).

## See also

- [Custom Extensions](/extensions/custom-extension)
- [MistWarp Blocks](/extensions/mistwarp-blocks)
- [Patching](/extensions/patching)
- [Building Extensions: Introduction](/building-extensions/introduction)

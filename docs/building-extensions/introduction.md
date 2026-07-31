---
title: Introduction to custom extensions
sidebar_position: 1
---

# Introduction to custom extensions

Custom extensions add new blocks to MistWarp using JavaScript. This tutorial builds up from the simplest possible extension to full featured ones, one concept at a time. Read the pages in order and do the exercises before moving on; each page assumes you understood the last.

If you just want to use existing blocks, you do not need any of this. Open the editor, click the "Add Extension" button (a plus next to two blocks at the bottom-left of the block palette), and pick one of the built-in extensions. This tutorial is for people who want to write their own.

## What "extension" can mean

The word gets used for a few different things:

| | Can access MistWarp internals | Can be loaded by URL |
|:-:|:-:|:-:|
| Built-in extensions (Pen, Music, etc.) | Yes | No |
| Sandboxed custom extensions | No | Yes |
| Unsandboxed custom extensions | Yes | Yes |

These pages cover only **custom** extensions (the sandboxed and unsandboxed kinds). Built-in extensions share the same block-description format but are bundled into the editor build itself, so developing them is a different process that involves the [scratch-vm source](/contributing/project-structure). The [difference between sandboxed and unsandboxed](/building-extensions/sandbox) is covered later.

## Compatibility

Custom extensions are a MistWarp and TurboWarp feature. Projects that use them cannot be uploaded to the Scratch website. They work in the MistWarp editor and can be bundled into a standalone app or web page with the [MistWarp Packager](/packager/overview), which always runs extensions unsandboxed.

## Prerequisites

Writing extensions requires knowing JavaScript. If you do not already know the difference between `"1"` (a string) and `1` (a number), learn JavaScript first; extension development will be very hard otherwise. This tutorial does not teach the language.

You also need your browser's developer tools. They are usually under right-click, then "Inspect", or Ctrl+Shift+I (Option+Command+I on macOS) in the desktop app. Writing JavaScript without the console open is painful, and most problems you hit will only be visible there.

## Setting up a development environment

There are a few ways to load an extension you are working on.

### Load from a file or pasted code (simplest)

In the editor, "Add Extension", scroll to the bottom, and choose "Custom Extension". The dialog lets you paste JavaScript directly or select a local file. This works on any machine with just a text editor, but you have to re-paste or re-select the file every time you change it.

### Local HTTP server (recommended)

A local web server lets MistWarp fetch your extension by URL, so you only have to reload the page after a change. If you have Python installed, you already have a server:

```bash
cd path/to/your/extensions
python3 -m http.server 8080
```

That serves the current folder at `http://localhost:8080/`. Put a file called `hello-world.js` in that folder and confirm you can open [http://localhost:8080/hello-world.js](http://localhost:8080/hello-world.js) in your browser before continuing.

For now use a port **other than 8000**. Port 8000 is special: it is one of the URLs MistWarp trusts to run [unsandboxed](/building-extensions/unsandboxed), which comes with extra responsibilities we are not ready for yet. Start sandboxed.

Later we introduce [a purpose-built development server](/building-extensions/better-development-server), but starting with the most primitive setup keeps the moving parts visible.

## Next steps

Let's [write your first extension](/building-extensions/hello-world).

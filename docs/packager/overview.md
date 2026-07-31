---
title: Overview
sidebar_position: 1
---

# MistWarp Packager

The MistWarp Packager turns a Scratch or MistWarp project into a standalone program: a single HTML file, a zip, or a native executable for Windows, macOS, or Linux. The output does not need the editor or an internet connection to run, and it bundles MistWarp's fast compiled runtime.

Use it at [packager.warp.mistium.com](https://packager.warp.mistium.com/).

It fills the same role as HTMLifier or the forkphorus packager, with more output formats and more control over the loading screen, controls, and runtime settings.

## What you can do with it

- **Share a project as one file.** Send someone an HTML file they can open in any browser, with no MistWarp branding around it.
- **Ship a desktop app.** Package to an Electron, NW.js, or WKWebView executable that runs like a native program.
- **Embed a project you fully control.** [Embed the packaged file](/packager/embedding) instead of relying on a hosted embed.
- **Run offline or on locked-down networks.** See the [offline packager](/packager/offline).

## Getting a project into the packager

You have a few options:

- Enter a Scratch project ID or a direct project URL.
- Upload an `.sb3` file from your computer.
- Send the current project straight from the editor. See [Editor integration](/packager/editor-integration).

Remember that [unshared Scratch projects](/advanced/unshared-projects) cannot be loaded by ID; download the `.sb3` and upload it instead.

## Common settings

The packager exposes most of the same runtime options as the editor, including [custom FPS](/advanced/custom-fps), [interpolation](/advanced/interpolation), [high quality pen](/advanced/high-quality-pen), and [custom stage size](/advanced/custom-stage-size). It also adds packager-specific features:

- [Dynamic stage resize](/packager/dynamic-stage-resize) to make the stage follow the window or fullscreen size.
- [Special cloud behaviors](/packager/special-cloud-behaviors) for cloud variables with special names.

## See also

- [Embedding packaged projects](/packager/embedding)
- [Editor integration](/packager/editor-integration)
- [Offline packager](/packager/offline)
- [Can I sell packaged projects?](/packager/commercial-use)

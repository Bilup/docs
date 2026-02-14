---
slug: /development/getting-started
sidebar_position: 2
hide_table_of_contents: true
---

# Development Introduction

These are the instructions for setting up a development environment for MistWarp itself. This is useful if you want to submit pull requests to us or make your own mod.

If you just want to develop custom extensions, see [the custom extension documentation](../extensions/introduction.md) instead.

## Dependencies {#dependencies}

All of our packages need [Git](https://git-scm.com/download) and [Node.js **v20**](https://nodejs.org/en/download) (likely anything v18 or later works, but we can't promise that). We assume you are familiar with the command line.

Some packages may want some additional things installed, so check the README in each package you want to develop.

MistWarp is a large app that can require multiple gigabytes of disk space and memory to build.

## A note on how Scratch is organized {#organization}

Scratch is broken up into a bunch of different packages, each implementing one part of the app.

 - **scratch-gui** implements much of the interface (eg. the sprite list), connects everything together, and is where addons live
 - **scratch-vm** runs projects. It's where the compiler lives.
 - **scratch-render** is what displays things like the stage, sprites, text bubbles, and pen. It also implements blocks like "touching". Note that things that are rendered on top of sprites such as variable monitors are actually part of scratch-gui.
 - **scratch-svg-renderer** helps fix various SVG rendering problems (we rename this to **@turbowarp/scratch-svg-renderer**)
 - **scratch-render-fonts** contains all the fonts that SVG costumes can use
 - **scratch-paint** is the costume editor
 - **scratch-parser** extracts and validates sb2 and sb3 files
 - **scratch-storage** is an abstraction around fetch() used for downloading (and theoretically uploading) files (we rename this to **@turbowarp/scratch-storage**)
 - **scratch-l10n** contains some translations (we rename this to **@turbowarp/scratch-l10n**)

In addition, the desktop app and packager are also support repositories.

## Building the GUI {#gui}

If you want to mod Scratch, you'll need to be able to build the GUI. This is a common pattern you'll use for developing on Scratch packages:

```bash
# clone it
git clone https://github.com/MistWarp/scratch-gui
cd scratch-gui

# install dependencies (preferred over `npm install` as it is faster and won't modify package-lock.json)
npm ci

# start development playground
npm start
```

This starts the live development server for most packages, if there is one. For example, for scratch-gui, the playground can be accessed at [http://localhost:8601/](http://localhost:8601/). See the README or the output of `npm start` for information for other packages.

## Build {#build}

While `npm start` is useful for development, at some point you'll need to get raw files out. You can do this with:

```bash
npm run build
```

The output will be in the `build` folder.

When deploying MistWarp to a live website, you should enable production mode. This will result in faster execution and a greatly reduced file size:

```bash
# mac, linux
NODE_ENV=production npm run build

# windows command prompt (untested)
set NODE_ENV=production
npm run build

# windows powershell
$env:NODE_ENV="production"
npm run build
```

By default MistWarp generates links like `https://warp.mistium.com/editor.html#123`. However, by setting the variables `ROOT=/` and `ROUTING_STYLE=wildcard` (in the same way that you set `NODE_ENV=production`), you can get routes like `https://warp.mistium.com/123/editor` instead. Note that this requires a server that will setup the proper aliases. The webpack development server in scratch-gui is setup for this. For production you'd want something more like https://github.com/MistWarp/warp.mistium.com.

## Linking other packages {#linking}

To develop packages other than scratch-gui, you need to tell npm to use local copies of the package instead of the ones it downloaded from the internet. This is called *linking*. The pattern is:

```bash
# clone the package you want to develop in the same folder as scratch-gui
# (folder doesn't really matter but it makes things easier to keep track of)
cd scratch-gui/..
git clone https://github.com/MistWarp/scratch-vm

# install dependencies in the child package
cd scratch-vm
npm ci

# tell npm that this is your local copy of the package
npm link

# for some packages (eg. storage, svg-renderer), you may need to build for your changes to apply
npm run build

# tell scratch-gui to use your local copy of the package
cd ../scratch-gui
npm link scratch-vm
```

Trust me, always link multiple at once, linking one at a time will just break things a lot of the time and if you do npm ci or similar make sure to relink to the gui

```bash
# do this
npm link scratch-vm scratch-blocks

# not this
npm link scratch-vm
npm link scratch-blocks
```

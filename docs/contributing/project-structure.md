---
title: Project Structure
sidebar_position: 2
---

# Project Structure

MistWarp is a multi-repository workspace. Each package is its own Git checkout, and they are placed as siblings in one parent directory so they can link to each other. The parent directory itself is not a repository.

```
mistwarp/
├── scratch-gui/       # editor + community site (one webpack build)
├── scratch-vm/        # runtime and compiler; blocks are defined here
├── scratch-blocks/    # the block editor (Blockly fork)
├── scratch-render/    # WebGL stage renderer
├── scratch-paint/     # costume and backdrop editor
├── scratch-audio/     # Web Audio playback
├── packager/          # standalone project packager
├── unpackager/        # inverse of the packager
├── mistwarp-api/      # community platform backend
├── turbowarp-desktop/ # desktop wrapper for the editor
└── docs/              # this documentation site (Docusaurus)
```

## The packages

Scratch is split into packages that each implement one part of the app. MistWarp forks several of them.

- **scratch-gui** implements most of the interface (menu bar, sprite list, tabs), wires everything together, and is where addons live. It is a set of React components plus a Redux store. Uniquely to MistWarp, the same build also ships the community site.
- **scratch-vm** runs projects. It holds the block definitions (`src/blocks/scratch3_*.js`), the extensions (`src/extensions/`), and the compiler that turns blocks into JavaScript (`src/compiler/`).
- **scratch-render** draws the stage: sprites, pen, text bubbles, and collision blocks like "touching". Note that overlays such as variable monitors are drawn by scratch-gui, not scratch-render.
- **scratch-blocks** is the block palette and workspace, a fork of Google Blockly. Edits under its `core/` directory require a Closure recompile (see [Building and Running](/contributing/building-running)).
- **scratch-paint** is the costume and backdrop editor.
- **scratch-audio** handles sound playback.

Two more support packages are pulled in as npm dependencies rather than local checkouts, but you will see them referenced: **scratch-parser** (validates sb2/sb3 files) and **@turbowarp/scratch-storage** (a fetch abstraction for downloading assets).

## Inside scratch-gui

scratch-gui is where most editor work happens. The important source directories:

```
scratch-gui/src/
├── components/    # presentation React components (foo/foo.jsx + foo.css)
├── containers/    # Redux-connected wrappers around components
├── reducers/      # Redux reducers, one file per state slice
├── lib/           # the shared service layer, HOCs, themes, persistence
├── addons/        # the addon system (settings store, window system, addons)
├── playground/    # webpack entry points (editor, player, community, embed, ...)
└── community/     # the community single-page app
```

- `components/` holds pure UI. Each component is a folder with a `.jsx` and a matching CSS module.
- `containers/` connects components to the Redux store. See [The Container Pattern](/internals/containers).
- `reducers/` is the Redux state. See [State Management](/internals/state).
- `lib/` is the largest directory: higher-order components under `lib/components/`, the theme engine under `lib/themes/`, project persistence under `lib/persistence/`, plus the MistWarp service layers `lib/community/` and `lib/rotur/` used by both the editor and the community site.
- `addons/` is the addon framework, ported from Scratch Addons. See [The Addons System](/internals/addons-system).

The build produces several entry points, defined under `src/playground/`: `editor`, `player`, `community`, `fullscreen`, `embed`, `addons`, and `credits`. Routing is handled so that `/editor` serves the editor, `/embed.html` serves the embed player, and client routes such as `/project/*` and `/explore` serve the community app.

## How the packages link together

During development the engine packages are not fetched from npm. Instead they are symlinked from the local checkouts so that changes to, for example, scratch-vm show up in the editor without republishing. scratch-gui declares these links in its `pnpm.overrides` and exposes a helper script:

```bash
pnpm run link
# runs: pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

This means your directory layout matters: the engine packages must be siblings of scratch-gui, exactly as shown above.

## The MistWarp-only services

Two pieces are not Scratch or TurboWarp code at all:

- **mistwarp-api** is the community backend (accounts, projects, comments, notifications, settings sync). It is written in OSL and stores data as flat JSON, using Cloudflare R2 for project blobs. The frontend talks to it at `https://mwapi.mistium.com/api`.
- Identity and social features run through **Rotur**. Signing in exchanges a Rotur token for a MistWarp session; social features (posts, likes, follows) go to `https://api.rotur.dev`.

You do not need either running to work on the editor itself. They matter when you are working on the community site.

## See also

- [Building and Running](/contributing/building-running)
- [Internals Overview](/internals/overview)

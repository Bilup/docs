---
title: Building and Running
sidebar_position: 3
---

# Building and Running

This page walks through setting up a local MistWarp editor build. The examples use scratch-gui because that is where most development happens, but the same clone-and-link pattern applies to the other engine packages.

## Prerequisites

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) v20 (v18 or later is likely fine, but v20 is what we develop against)
- [pnpm](https://pnpm.io/), the package manager scratch-gui uses

Building the editor can use several gigabytes of disk space and memory, so give it room.

## Clone the packages side by side

The engine packages link to each other by relative path, so they must be siblings in one parent directory.

```bash
mkdir mistwarp
cd mistwarp
git clone https://github.com/MistWarp/scratch-gui
git clone https://github.com/MistWarp/scratch-vm
git clone https://github.com/MistWarp/scratch-blocks
git clone https://github.com/MistWarp/scratch-render
git clone https://github.com/MistWarp/scratch-paint
```

You only need the packages you intend to change. If you are just modifying the editor UI, scratch-gui alone is enough; its dependencies fall back to the versions pinned in `package.json`.

## Install and link

From `scratch-gui`:

```bash
cd scratch-gui
pnpm install
pnpm run link
```

`pnpm run link` symlinks the sibling checkouts into scratch-gui:

```
pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

After linking, changes you make in those packages are picked up by the scratch-gui build. If installing after linking ever resets the links, just run `pnpm run link` again. There is also a `pnpm run reinstall` script that wipes `node_modules` and the lockfile, reinstalls, and re-links in one step.

## Run the development server

```bash
pnpm start
```

This starts webpack-dev-server. Open [http://localhost:8601/](http://localhost:8601/). The dev server also mirrors the production routing, so `/editor` is the editor, `/embed.html` is the embed player, and the community client routes are served too.

## Production build

```bash
NODE_ENV=production pnpm run build
```

`pnpm run build` cleans the `build/` and `dist/` directories and runs webpack. Setting `NODE_ENV=production` produces a minified, deployable build under `build/`.

## Linting and formatting

```bash
pnpm run lint   # eslint check
pnpm run fmt    # eslint --fix
```

Linting must pass before a pull request is merged. See [Contributing](/contributing/guidelines) for the style rules that are not caught automatically (no code comments, no emdashes).

## Other packages

### scratch-vm

scratch-vm uses npm and its own scripts:

```bash
cd scratch-vm
npm install
npm run lint
npm run tap          # all tests
npm run tap:unit     # unit tests only
npx tap test/unit/<file>.js   # a single file
```

### scratch-blocks

Edits under scratch-blocks `core/` are compiled with Google Closure, so a plain rebuild is not enough. With `node_modules/.bin` on your `PATH`, run:

```bash
node universal-python.js build.py
```

Any new symbols you add must be exported in the `goog.global` block, or Closure will strip them from the build.

### mistwarp-api

The community backend is an OSL service. With the OSL interpreter installed:

```bash
cd mistwarp-api
osl run main.osl   # listens on port 5610
```

It stores data as flat JSON under `data/` and falls back to a local `data/blobs/` directory for project files with no additional configuration, so you can run it without any cloud setup.

## See also

- [Project Structure](/contributing/project-structure)
- [Testing](/contributing/testing)
- [Deploying](/contributing/deploying)

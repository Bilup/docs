---
title: Deploying
sidebar_position: 6
---

# Deploying

MistWarp's editor is a static site. A production build is a folder of HTML, JavaScript, and assets that can be served by any static host. This page covers how to build that folder and publish it, which is what you need if you run your own instance of the editor.

You do not need this to contribute changes. It matters only when you want to host a build yourself.

## Build output

A production build of scratch-gui is produced by:

```bash
NODE_ENV=production pnpm run build
```

This cleans the previous output and runs webpack, writing the deployable site to the `build/` directory. Everything under `build/` is static and self-contained.

## The deploy script

scratch-gui ships a `deploy` script that builds and publishes to a `gh-pages` branch in one step:

```bash
pnpm run deploy
```

Under the hood it runs:

```bash
NODE_ENV=production pnpm run build && \
  touch build/.nojekyll && \
  cp -r functions build/functions && \
  gh-pages -t -d build -m "Build for <commit hash>"
```

In order, that:

- makes a production build,
- adds a `.nojekyll` marker so the host does not run Jekyll over the output,
- copies the `functions/` directory into the build (these are Cloudflare Pages Functions used for routing and dynamic behavior),
- pushes the whole `build/` directory to the `gh-pages` branch with the `gh-pages` tool.

Committing to your default branch does not deploy anything. Publishing is a deliberate `pnpm run deploy`.

## Hosting the build

Because the output is static, you can serve it from any static host. The MistWarp setup publishes the `gh-pages` branch and points a host at it.

### Cloudflare Pages

The `functions/` directory in the build is written for [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/), so Cloudflare Pages is the intended host. A typical setup:

1. Create a Pages project connected to your fork of `scratch-gui`.
2. In the project settings, set the production branch to `gh-pages` and enable automatic deployments for it.
3. Run `pnpm run deploy` locally whenever you want to publish. Cloudflare detects the new commit on `gh-pages` and deploys it.

Because you build locally and push the finished `build/` directory, Cloudflare does not need to run its own build step.

### Other static hosts

Any host that can serve a directory works: GitHub Pages, a plain web server, an object store with static hosting, and so on. Two things to preserve:

- Keep the `.nojekyll` marker (or the host's equivalent) so filenames beginning with an underscore are not stripped.
- Reproduce the routing. The single build serves several apps from one set of files (`/editor`, `/embed.html`, the community client routes, and the legacy player routes). On Cloudflare Pages the `functions/` directory handles this; on another host you must implement equivalent rewrites, or the client routes will 404 on reload.

## The community backend

The editor build is only the frontend. If you also run the community platform, the backend (mistwarp-api) is a separate OSL service, not part of this static build. It is deployed and run on its own; see [Project Structure](/contributing/project-structure) for what it is. You do not need it to host just the editor.

## See also

- [Building and Running](/contributing/building-running)
- [Project Structure](/contributing/project-structure)
- [Contributing](/contributing/guidelines)

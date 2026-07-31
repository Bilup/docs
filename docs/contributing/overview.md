---
title: Contributing Overview
sidebar_position: 1
---

# Contributing to MistWarp

MistWarp is a Scratch modification built on top of TurboWarp, which is itself built on Scratch. That lineage matters for contributors: most of the code you will read is regular Scratch/TurboWarp code, and the MistWarp-specific pieces sit on top of it. If you have contributed to Scratch or TurboWarp before, you already know most of what you need.

This section is for people who want to work on MistWarp itself: fixing bugs in the editor, adding blocks to the VM, writing addons, or running their own build. If you only want to build a custom extension for your projects, read [Building Extensions](/building-extensions/introduction) instead, which does not require checking out the source.

## What lives where

MistWarp is not a single repository. It is a small collection of forked Scratch packages plus a few MistWarp-only services, checked out side by side. The [Project Structure](/contributing/project-structure) page describes the full layout, but the short version is:

- **scratch-gui** is the editor and the community site, built together in one webpack build. This is where you will spend most of your time.
- **scratch-vm** runs projects and contains the compiler. Blocks are defined here.
- **scratch-render**, **scratch-blocks**, **scratch-paint**, and **scratch-audio** are the other forked engine packages.
- **packager** turns projects into standalone HTML/executables.
- **mistwarp-api** is the community platform backend.
- **docs** is this site.

## Before you start

- MistWarp is a large app. Building the editor can use several gigabytes of disk space and memory.
- You need [Git](https://git-scm.com/) and a recent [Node.js](https://nodejs.org/) (v20 is what we develop against; v18 or later is likely fine).
- scratch-gui uses [pnpm](https://pnpm.io/) as its package manager, not npm. See [Building and Running](/contributing/building-running).

## How to read the rest of this section

1. [Project Structure](/contributing/project-structure) explains the multi-repo layout and how the packages link together.
2. [Building and Running](/contributing/building-running) is the practical setup: clone, install, link, run.
3. [Testing](/contributing/testing) covers the test suites in scratch-gui and scratch-vm.
4. [Contributing](/contributing/guidelines) covers the workflow: branches, style rules, and pull requests.
5. [Deploying](/contributing/deploying) explains how a build is published, in case you run your own instance.

If you want to understand how the editor is put together before you change it, the [Internals](/internals/overview) section is the companion to this one.

## See also

- [Internals Overview](/internals/overview)
- [Building Extensions](/building-extensions/introduction)

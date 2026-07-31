---
title: Project management
sidebar_position: 11
---

This page covers the lifecycle of a project: starting a new one, saving it (to your computer or to your MistWarp account), loading it back, sharing it, and remixing. Most of these actions live in the [File menu](/editor/menu-bar).

## New project

**File, New** clears the workspace and starts a fresh project with one sprite (Misty). If the current project has unsaved changes you are warned first, because a new project replaces what is open.

## Saving

There are two independent places a project can be saved: to your computer as a file, or to your MistWarp account online. They do not conflict; a project can be both.

### Save to your computer

- **File, Save to (filename)** or **Save as** writes an `.sb3` file to disk. On browsers that support the File System Access API, saving can write back to the same file you opened; otherwise you get a normal download.
- **File, Load from your computer** (`Ctrl+O`) opens an `.sb3` from disk.

An `.sb3` is a single self-contained file: a ZIP archive holding `project.json` (all sprites, scripts, variables, and settings) plus every costume and sound. It is the portable, offline copy of your project, and it works in Scratch, TurboWarp, and MistWarp.

### Save to MistWarp

When you are signed in with a [Rotur account](/getting-started/introduction), the File menu shows **Save to MistWarp** (and **Save now** / `Ctrl+S` saves to your account once the project lives there). This uploads the project to your account so you can reach it from any device through the community site.

- Uploading is **not** publishing. A saved project stays private to you until you share it.
- MistWarp uploads assets efficiently, sending only costumes and sounds it does not already have, so re-saving a project is fast.

To make a copy that saves independently, use **File, Save as a copy** (`Ctrl+Shift+S`).

## Sharing

Sharing is done on the community site, not from the editor's save action. Once a project is saved to your MistWarp account, open its project page (**File, See project page**, or the account area on the [menu bar](/editor/menu-bar)) and use the **Share** button there. Sharing makes the project visible to others and gives it a public page and player. You control visibility from the site.

## Remixing

A **remix** starts a new project based on an existing one, crediting the original. **File, Remix** (or **Remix to MistWarp** when signed in) creates your own copy that you can change and save separately, without touching the original. Remixing is how you build on someone else's shared project.

## Autosave and restore points

Two safety nets run while you work:

- [Restore points](/editor/restore-points) periodically snapshot the whole project into your browser so you can roll back after a mistake or crash.
- Optional [autosave](/editor/restore-points) re-saves the project to its current location on a timer.

Neither replaces saving deliberately, but both reduce the cost of forgetting.

## See also

- [The menu bar](/editor/menu-bar)
- [Restore points and autosave](/editor/restore-points)
- [Git version control](/editor/git)
- [Packaging a project](/editor/packaging)

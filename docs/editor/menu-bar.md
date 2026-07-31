---
title: The menu bar
sidebar_position: 2
---

The menu bar runs across the top of the editor. It holds the dropdown menus (File, Edit, Tools, Bookmarks), the Settings button, the project title, and, on the right, your save status and account. This page lists every menu and item.

The far-left **MistWarp** logo is a link to the home page. On narrow windows the menus collapse behind a **More** (☰) button; the items are identical.

Keyboard shortcuts shown below use `Ctrl` on Windows/Linux and `⌘` on macOS. The full list lives in [keyboard shortcuts](/editor/shortcuts).

## File

- **New** creates a fresh project. If your current project has unsaved changes you are warned first.
- **New window** (desktop app only) opens a second editor window.
- **Save now** (`Ctrl+S`) saves to wherever the project currently lives. When you are signed in and the project belongs to you, this uploads to MistWarp. See [project management](/editor/project-management).
- **Save as a copy** (`Ctrl+Shift+S`) saves a new, independent copy.
- **Remix** starts a new project based on the current one.
- **Save to MistWarp** / **Remix to MistWarp** (shown when you are signed in with a [Rotur account](/editor/project-management)) uploads the project to your account. Uploading never publishes it on its own; sharing happens separately on the site.
- **See project page** opens this project's page on the community site (shown once the project exists on MistWarp).
- **Load from your computer** (`Ctrl+O`) opens an `.sb3` file from disk.
- **Save to (filename)** and **Save as...** save an `.sb3` to your computer. On browsers that support the File System Access API you can save back to the same file; otherwise you get a normal download.
- **Package project** (`Ctrl+P`) opens the current project in the [packager](/packager/overview).
- **Commit to Git…**, **Push to (remote)**, **Pull from (remote)** appear when the project has a [git repository](/editor/git).
- **Restore points** (`Alt+R`) opens the [restore point](/editor/restore-points) manager; **Create restore point** makes one immediately.
- **Project metadata** shows the open project's author, dates, and contents.
- **Pause autosave** / **Resume autosave** appears when autosave is on, with a live countdown to the next automatic save.

## Edit

- **Restore Sprite / Sound / Costume** brings back the last thing you deleted (disabled when there is nothing to restore).
- **Undo** (`Ctrl+Z`) and **Redo** (`Ctrl+Shift+Z`) act on the block [workspace](/editor/workspace).
- **Addons** opens [addon settings](/editor/addons).
- **Desktop settings** (desktop app only) opens app-level options.
- **Change Username** sets the username reported to projects and cloud variables.
- **Enable / Disable Cloud Variables** toggles [cloud variables](/advanced/cloud-variables) for this session (disabled when they are unavailable).
- **Show Tutorial** replays the getting-started walkthrough.
- **Help** opens the in-editor Help window, a searchable reference to the editor, blocks, and extensions.
- **originChats** links out to the originChats community chat.

## Mode

A **Mode** menu appears only during the editor's occasional April Fools state. It offers **Normal mode** and **Caturday mode** (cat-themed blocks). It has no effect on how projects run and is off the rest of the year.

## Tools

- **Git** opens the [version-control](/editor/git) window.
- **Terminal** opens a shell window.
- **Live Collaboration** opens [live collaboration](/editor/collaboration).
- **Debugger** and **Variable Manager** appear when those tools are available, opening the [debugger](/editor/debugger) and [variable manager](/editor/variable-manager).
- **Add Extension** (`Ctrl+.`) opens the [extension library](/extensions/overview) to add or import an extension.
- **Manage Extensions** (`Ctrl+Alt+E`) lists the extensions already loaded in the project.

## Bookmarks

The Bookmarks menu manages [workspace bookmarks](/editor/bookmarks): saved camera positions in the block workspace so you can jump back to a script instantly. From here you can add, switch to, rename, delete, export, import, and clear bookmarks, and organise them into categories. Bookmarks are stored with the project.

Shortcuts: `Ctrl+Alt+T` adds a bookmark at the current position; `Ctrl+Alt+1` through `Ctrl+Alt+0` switch to the first ten bookmarks.

## Settings

The **Settings** button opens the [settings window](/editor/settings): theme, language, compiler and runtime options, [custom FPS](/advanced/custom-fps), [custom stage size](/advanced/custom-stage-size), and more.

## The right side

The account area on the right of the menu bar shows:

- **Save status**, which reflects whether the project has unsaved changes.
- A **live collaboration** presence indicator when a session is active.
- Navigation to the rest of the MistWarp site.
- Your **Rotur account**, or a sign-in prompt. Signing in enables Save to MistWarp, sharing, and cloud sync of your settings.

A **project title** field sits in the middle when you own the project. On project pages you may also see a view counter, a **Share** button, a **Remix** button, and a **See community** button, depending on the project and whether you are signed in. A **Feedback** link is always available.

## See also

- [Keyboard shortcuts](/editor/shortcuts)
- [Project management](/editor/project-management)
- [Settings](/editor/settings) and [addons](/editor/addons)

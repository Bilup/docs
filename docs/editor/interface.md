---
title: The editor interface
sidebar_position: 1
---

The MistWarp editor is where you build projects. It runs entirely in your browser (and in the desktop app), and it ships from the same build as the community site. This page is a map of the editor window: what each region is and where to read more.

## Layout at a glance

The editor is divided into a few fixed regions:

- **Menu bar** across the top: the MistWarp logo (a link back to the home page), the File / Edit / Tools / Bookmarks menus, Settings, the project title, and, on the right, your save status and account. See [the menu bar](/editor/menu-bar).
- **Stage** on one side: the running project, the green flag and stop button, the stage-size controls, and the fullscreen button. See [the stage](/editor/stage).
- **Sprite pane** below the stage: the list of sprites, the selected sprite's properties (position, size, direction, visibility), and the stage/backdrop selector. See [sprites](/editor/sprites).
- **Editing area** filling the rest of the window, controlled by three tabs at the top-left:
  - **Code**: the [blocks palette](/editor/blocks-palette) and the [block workspace](/editor/workspace).
  - **Costumes** (or **Backdrops** when the stage is selected): the [paint editor](/editor/costumes).
  - **Sounds**: the [sound editor](/editor/sounds).

The three tabs switch what the editing area shows for the currently selected sprite or the stage. The stage, sprite pane, and menu bar stay put while you switch tabs.

## Editor mode versus player mode

The same page can render two ways. In **editor mode** you see everything above. In **player mode** only the stage and its controls are shown, which is what visitors see on a shared project page or an embed. The community project page loads projects into the embedded player rather than the full editor.

## What makes the MistWarp editor different

Beyond the standard Scratch layout, the MistWarp editor adds:

- A [compiler](/blocks/overview) that turns your blocks into JavaScript for speed, plus [custom FPS](/advanced/custom-fps), [custom stage size](/advanced/custom-stage-size), and other [advanced settings](/editor/settings).
- [Addons](/editor/addons) and [custom themes](/editor/themes) that reshape and restyle the editor.
- Developer tools: a [debugger](/editor/debugger), a [variable manager](/editor/variable-manager), [restore points](/editor/restore-points) and autosave, built-in [git version control](/editor/git), and [live collaboration](/editor/collaboration).
- A [find bar](/editor/find-bar) and [workspace bookmarks](/editor/bookmarks) for navigating large projects.

## See also

- [Editor tour](/getting-started/editor-tour) for a guided first look
- [Keyboard shortcuts](/editor/shortcuts)
- [Project management](/editor/project-management): new, save, load, and share
- [Settings](/editor/settings) and [addons](/editor/addons)

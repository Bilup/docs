---
title: The variable manager
sidebar_position: 20
---

The variable manager is a window that shows every [variable and list](/editor/variables) at once and lets you read and change their values live while the project runs. It is far quicker than scattering monitors across the stage when you want to watch or tweak a lot of data.

## Opening it

Open the **Tools** menu and choose **Variable Manager**, click its button in the stage controls, or press `Ctrl+Shift+V` (`Cmd+Shift+V` on macOS). While it is open, `Ctrl+F` focuses its search box and `Escape` clears the search or closes the window.

## What it shows

Variables and lists are split into two sections:

- **Variables for this sprite**: the local variables of the sprite you are editing.
- **Variables for all sprites**: the global variables (those on the stage).

Each row shows the variable's name, its current value, and a badge for **List** or **Cloud** variables. Lists show as a multi-line box, one item per line. Very large values are hidden behind a button so they do not slow the editor down.

## What you can do

- **Search** by name or value, and **filter** by **All / Vars / Lists / Cloud**, each with a live count.
- **Edit a value**: type a new value and commit it. For a list, each line becomes an item.
- **Rename** a variable by editing its name (blank or duplicate names are rejected). Renaming a cloud variable keeps its cloud prefix.
- **Refresh** reloads the list, and values update **live** while the project runs so you can watch them change.

The variable manager reads and edits existing variables; creating and deleting variables is still done with the **Make a Variable** and **Make a List** buttons in the [blocks palette](/editor/blocks-palette).

## Settings

Its options are on the **Variable Manager** page of the [settings window](/editor/settings): the default view, whether live updates are on, the update interval, and the size limits for hiding very large values.

## See also

- [Variables and lists](/editor/variables)
- [The debugger](/editor/debugger)
- [Cloud variables](/advanced/cloud-variables)

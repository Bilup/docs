---
title: Variables and lists
sidebar_position: 9
---

The Variables category (internally called "data") holds two kinds of storage: variables, which each hold one value, and lists, which hold many values in order. You create variables and lists with the "Make a Variable" and "Make a List" buttons at the top of the category; MistWarp also has a dedicated [variable manager](/editor/variable-manager) for editing them in bulk.

A variable or list can be **for all sprites** (global) or **for this sprite only** (local to one sprite and its clones).

## Variables

- **`variable`** (reporter) reports the variable's current value. Checking its box on the palette shows a monitor on the [stage](/editor/stage).
- **set `variable` to `0`** stores a value.
- **change `variable` by `1`** adds a number to a numeric variable.
- **show variable `variable`** / **hide variable `variable`** shows or hides the stage monitor.

## Lists

- **`list`** (reporter) reports the list's contents.
- **add `thing` to `list`** appends an item to the end.
- **delete `1` of `list`** removes an item by position (the menu also offers `last` and `all`).
- **delete all of `list`** empties the list.
- **insert `thing` at `1` of `list`** adds an item at a position, shifting the rest down.
- **replace item `1` of `list` with `thing`** overwrites an item.
- **item `1` of `list`** returns the item at a position.
- **item # of `thing` in `list`** returns the position of an item, or 0 if not found.
- **length of `list`** returns how many items the list holds.
- **`list` contains `thing` ?** reports whether the list holds an item.
- **show list `list`** / **hide list `list`** shows or hides the list monitor on the stage.

## MistWarp and TurboWarp extras

- **`list` as JSON** (`data_listjson`) reports the whole list as a JSON array string, useful for saving or sending list data as text.

## See also

- [The variable manager](/editor/variable-manager)
- [Cloud variables](/advanced/cloud-variables)
- [Operators blocks](/blocks/operators) for working with values
- [MistWarp extras](/blocks/mistwarp-extras)

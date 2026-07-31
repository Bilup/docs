---
title: Variables and lists
sidebar_position: 9
---

# Variables and lists

Variables store a single value (a number or a piece of text). Lists store many
values in order. Both live in the **Variables** category of the block palette,
and both are created with the buttons at the top of that category.

## Making a variable

1. Open the **Variables** category in the [block palette](/editor/blocks-palette).
2. Click **Make a Variable**.
3. Type a name and choose a scope (see below).
4. Click **OK**.

Your new variable appears in the palette with `set`, `change`, `show`, and
`hide` blocks, plus a reporter block you can drop into any input.

Lists work the same way: click **Make a List** instead. A list comes with blocks
to add, delete, insert, replace, and read items, and to check its length and
contents.

## Scope: all sprites vs this sprite

When you make a variable or list you pick one of two scopes:

- **For all sprites** (global): every sprite and the Stage shares the same
  variable. Changing it from one sprite changes it everywhere. Use this for
  things like a score or a game state that the whole project cares about.
- **For this sprite only** (local): the variable belongs to the sprite that is
  currently selected. Other sprites cannot see it, and each clone of the sprite
  gets its own private copy. Use this for per-sprite data like health or speed.

The Stage can only hold global variables, because it has no clones and nothing
"local" to belong to.

:::note
Two sprites can each have a local variable with the same name without clashing,
because they are genuinely separate variables. A local variable and a global
variable can also share a name; the local one takes priority inside its sprite.
:::

## Monitors on the stage

Every variable and list has a **monitor**, the small readout shown on the
[stage](/editor/stage). Toggle it by checking the box next to the variable in the
palette, or with the `show variable` / `hide variable` blocks.

- Drag a monitor anywhere on the stage to reposition it.
- Right-click a variable monitor to switch between the normal readout, a large
  readout, and a slider you can drag to change the value live.
- Right-click a list monitor to resize it or export/import its contents.

Monitors are saved with the project, so their position and style travel with it.

## Advanced notes

- Variable and list values are stored as JavaScript strings and numbers. The
  [compiler](/advanced/disable-compiler) reads and writes them directly, so
  large lists are fast, but very large lists still cost memory and save time.
- List comparisons are case-insensitive by default. The **Case Sensitive Lists**
  option in [Settings](/editor/settings) makes `"a"` and `"A"` distinct values,
  which can speed up list-heavy projects at the cost of vanilla compatibility.
- To view or bulk-edit every variable and list at once, use the
  [Variable Manager](/editor/variable-manager).

## See also

- [Variables blocks reference](/blocks/variables)
- [Variable Manager](/editor/variable-manager)
- [Cloud variables](/advanced/cloud-variables)

---
title: The find bar
sidebar_position: 13
---

The find bar is a search box built into the editor's tab row (next to the Code, Costumes, and Sounds tabs). It jumps you straight to a block, variable, custom block, costume, or sound in the current sprite, which makes navigating large projects far quicker than scrolling.

## Opening it

Press `Ctrl+F` (`Cmd+F` on macOS) to focus the find bar, or click it. On narrow windows it collapses to a magnifier icon that expands when clicked. The find bar is available on the Code, Costumes, and Sounds tabs.

## What it finds

On the **Code** tab, typing filters a dropdown of matches in the current sprite or stage:

- Hat blocks: `when green flag clicked`, `when I receive`, broadcasts, clone starts, and other event hats.
- Custom block definitions.
- Ordinary blocks, matched by name or by the text in their inputs.
- Variables and lists (both global and per-sprite, labelled accordingly).

On the **Costumes** and **Sounds** tabs, it searches the names of that sprite's costumes or sounds and jumps the list to your pick.

## Navigating results

- **Arrow Up / Down** move through the dropdown; **Enter** goes to the next match.
- **F3** and **Shift+F3** step forward and back through matches.
- **Escape** clears the search, then closes the bar.
- Selecting a result **scrolls the workspace to that block** so it is in view.

When a match appears in several places (a variable used many times, or a custom block with several callers), a small **carousel** shows `current / total` with arrows; cycle through each occurrence with the left/right arrows and the workspace scrolls to each in turn.

You can toggle **case-sensitive** matching (the `Aa` button) and **regular expression** matching (the `.*` button). Shift-clicking or middle-clicking a block in the workspace opens the find bar focused on that block's variable, custom block, or broadcast, as a reverse lookup.

## See also

- [The block workspace](/editor/workspace)
- [Workspace bookmarks](/editor/bookmarks)
- [Keyboard shortcuts](/editor/shortcuts)

---
title: Workspace bookmarks
sidebar_position: 14
---

Workspace bookmarks save a spot in the block [workspace](/editor/workspace) so you can jump back to it instantly. A bookmark records where you were looking (which sprite, the zoom level, and the scroll position), which makes moving around a big project much faster than scrolling to find a script again.

## The Bookmarks menu

Bookmarks are managed from the **Bookmarks** menu in the [menu bar](/editor/menu-bar). It contains a search box, an **Add Current Position** item, the list of bookmarks, and Export / Import / Clear all at the bottom. Each bookmark row shows its name and saved date, with buttons to rename (the pencil) and delete (the trash).

## Adding and using bookmarks

- **Add**: choose **Add Current Position**, or press `Ctrl+Alt+T`. This saves the current sprite, zoom, and scroll position under a name.
- **Switch**: click a bookmark to return to exactly that view. The editor selects the saved sprite and restores its zoom and scroll offset.
- **Shortcuts**: `Ctrl+Alt+1` through `Ctrl+Alt+9` switch to the first nine bookmarks; `Ctrl+Alt+0` switches to the tenth.

## Categories

Bookmarks can be grouped into **categories** (the default is "General"). Category headers can be collapsed and expanded, which keeps the list manageable when a project has many bookmarks.

## Export, import, and storage

- **Export** downloads your bookmarks as a JSON file; **Import** merges a file back in without creating duplicates.
- Bookmarks are **stored inside the project**, so they travel with the `.sb3` and reappear when the project is reloaded. They are per-project.

## See also

- [The block workspace](/editor/workspace)
- [The find bar](/editor/find-bar)
- [The menu bar](/editor/menu-bar)
- [Keyboard shortcuts](/editor/shortcuts)

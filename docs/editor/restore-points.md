---
title: Restore points and autosave
sidebar_position: 21
---

MistWarp keeps safety nets so a crash, a mistake, or a forgotten save does not cost you your work. There are two separate features: **restore points**, which snapshot the whole project into your browser, and **autosave**, which re-saves the project file on a timer.

## Restore points

A restore point is a full snapshot of your project (all sprites, scripts, costumes, and sounds) saved into your browser's local storage. They are created automatically as you work, and you can make one by hand at any time.

### Automatic restore points

While you edit, MistWarp saves a restore point on a timer. The default is every **5 minutes**. You can change the interval, or turn automatic restore points off, from the manager (options are every 1, 5, 10, 15, or 30 minutes, or never). Turning them off is discouraged, since they are your main protection against losing work.

### Making one by hand

**File, Create restore point** makes a manual restore point immediately. Manual restore points are never pruned automatically, so they are the right choice before a risky change.

### The restore point manager

**File, Restore points** (`Alt+R`) opens the manager. Each restore point shows a thumbnail, the project title, when it was created, and its size. From here you can:

- **Load** a restore point by clicking it (you are warned if you have unsaved changes, since loading replaces the current project).
- **Download** it as an `.sb3` file.
- **Delete** one, or **Delete All**.

The footer shows the estimated storage used. Costumes and sounds shared between restore points are stored only once to save space.

:::warning
Restore points live in your browser, on this computer. They are not uploaded anywhere, and the browser can clear them without warning (for example when clearing site data or freeing space). Treat restore points as a convenience, not a backup: save projects you care about to [your computer](/editor/project-management) or [your MistWarp account](/editor/project-management) as well.
:::

Automatic restore points are pruned over time to stay within a modest limit; manual ones are kept.

## Autosave

Autosave is a separate, opt-in feature that periodically re-saves the actual project to wherever it currently lives (its file or your account), rather than snapshotting into the browser. It is off by default.

When autosave is on, the **File** menu shows a **Pause autosave** / **Resume autosave** item with a live countdown to the next save. It saves to the same place a manual **Save** would.

## See also

- [Project management](/editor/project-management)
- [Git version control](/editor/git) for a full history of changes
- [The menu bar](/editor/menu-bar)

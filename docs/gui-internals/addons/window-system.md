---
title: Window System
---

# Window System

MistWarp includes a window system used by addons and some UI features. It provides draggable, resizable windows with a consistent look and API.

## Creating a Window

```js
// Available globally as WindowManager
const win = WindowManager.createWindow({
  title: 'Addon Settings',
  width: 900,
  height: 700,
  minWidth: 600,
  minHeight: 400,
  x: 100,
  y: 100,
  resizable: true,
  closable: true,
  maximizable: true,
  onClose: () => {
    // cleanup
  }
});

// Add content
const el = win.getContentElement();
el.textContent = 'Hello';

win.show();
```

## Options
- `id` (string) unique identifier (auto-generated if omitted)
- `title` (string)
- `width`, `height` (number)
- `minWidth`, `minHeight` (number)
- `maxWidth`, `maxHeight` (number | null)
- `x`, `y` (number) initial position
- `resizable`, `closable`, `minimizable`, `maximizable` (boolean)
- `className` (string)
- `onClose`, `onMinimize`, `onMaximize`, `onRestore`, `onResize`, `onMove` (function)

## Methods
- `show()` — display window
- `hide()` — hide window
- `bringToFront()` — raise z-index
- `minimize()` — minimize window
- `toggleMaximize()` — maximize/restore
- `getContentElement()` — returns the content DOM element to append your UI

## Notes
- Windows are appended to `document.body`
- Dragging uses the header area; resize handles are added around edges
- The system manages z-order and prevents windows from going fully off-screen


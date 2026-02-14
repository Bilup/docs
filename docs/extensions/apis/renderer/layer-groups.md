---
title: Renderer Layer Groups
---

# Renderer Layer Groups

The renderer organizes drawables into groups that define rendering order.

## Groups
- `background` — behind everything
- `video` — camera/video layer
- `pen` — pen layer
- `sprite` — sprite layer (front)

## Order
From back to front: `background` → `video` → `pen` → `sprite`.

## Usage
```js
const id = renderer.createDrawable('sprite');
renderer.setDrawableOrder(id, Infinity, 'sprite');
renderer.updateDrawableProperties(id, { visible: true });
// Later
renderer.destroyDrawable(id, 'sprite');
```

See also:
- `createDrawable()`
- `setDrawableOrder()`
- `updateDrawableProperties()`
- `destroyDrawable()`


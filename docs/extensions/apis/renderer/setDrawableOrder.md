---
title: renderer.setDrawableOrder()
---

# renderer.setDrawableOrder()

Changes the z-order (layer position) of a drawable within its layer group.

## Syntax

```javascript
renderer.setDrawableOrder(drawableID, order, group, optIsRelative, optMin)
```

## Parameters

### drawableID
**Type:** `number`

The ID of the drawable to reorder.

### order
**Type:** `number`

New position. Can be absolute or relative (see `optIsRelative`).

### group  
**Type:** `string`

Layer group name (`'background'`, `'video'`, `'pen'`, or `'sprite'`).

### optIsRelative
**Type:** `boolean` (optional)

If `true`, `order` is relative to current position. Default: `false`.

### optMin
**Type:** `number` (optional)

Minimum allowed position. Default: `0`.

## Returns

**Type:** `number | null`

New order position if changed, or `null` if unchanged.

## Examples

### Move To Front

```javascript
renderer.setDrawableOrder(drawableId, Infinity, 'sprite');
```

### Move To Back

```javascript
renderer.setDrawableOrder(drawableId, 0, 'sprite');
```

### Move Back N Layers

```javascript
renderer.setDrawableOrder(drawableId, -2, 'sprite', true);
```

### Move Forward N Layers

```javascript
renderer.setDrawableOrder(drawableId, 3, 'sprite', true);
```

## See Also

- [getDrawableOrder()](./getDrawableOrder.md)
- [createDrawable()](./createDrawable.md)

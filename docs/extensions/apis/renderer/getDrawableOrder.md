---
title: renderer.getDrawableOrder()
---

# renderer.getDrawableOrder()

Returns the position of a drawable in the draw list.

## Syntax

```javascript
renderer.getDrawableOrder(drawableID)
```

## Parameters

### drawableID
**Type:** `number`

The ID of the drawable.

## Returns

**Type:** `number`

The position in the draw list (absolute, not relative to layer group).

## Example

```javascript
const position = renderer.getDrawableOrder(drawableId);
console.log(`Drawable is at position ${position}`);
```

## See Also

- [setDrawableOrder()](./setDrawableOrder.md)

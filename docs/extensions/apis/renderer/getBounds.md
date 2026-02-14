---
title: renderer.getBounds()
---

# renderer.getBounds()

Gets the tight bounding box of a drawable in Scratch coordinates.

## Syntax

```javascript
renderer.getBounds(drawableID)
```

## Parameters

### drawableID
**Type:** `number`

The ID of the drawable.

## Returns

**Type:** `object`

An object with properties:
- `left`, `right`, `top`, `bottom` (Scratch coordinates)
- `width`, `height`

## Example

```javascript
const bounds = renderer.getBounds(drawableId);
console.log(`Left: ${bounds.left}, Top: ${bounds.top}`);
```

## See Also

- [getBoundsForBubble()](./getBoundsForBubble.md)

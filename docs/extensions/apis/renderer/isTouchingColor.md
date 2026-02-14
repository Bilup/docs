---
title: renderer.isTouchingColor()
---

# renderer.isTouchingColor()

Checks if a drawable is touching a specific color.

## Syntax

```javascript
renderer.isTouchingColor(drawableID, color3b, mask3b)
```

## Parameters

### drawableID
**Type:** `number`

The ID of the drawable to check.

### color3b
**Type:** `Array<number>`

The target color to check for: `[r, g, b]` (0-255).

### mask3b
**Type:** `Array<number>` (optional)

Color mask for tolerance.

## Returns

**Type:** `boolean`

True if the drawable is touching the color.

## Example

```javascript
const isTouchingRed = renderer.isTouchingColor(drawableId, [255, 0, 0]);
```

## See Also

- [isTouchingDrawables()](./isTouchingDrawables.md)

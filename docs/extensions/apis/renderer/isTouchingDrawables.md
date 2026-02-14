---
title: renderer.isTouchingDrawables()
---

# renderer.isTouchingDrawables()

Checks if a drawable is touching any of the candidate drawables.

## Syntax

```javascript
renderer.isTouchingDrawables(drawableID, candidateIDs)
```

## Parameters

### drawableID
**Type:** `number`

The ID of the source drawable.

### candidateIDs
**Type:** `Array<number>` (optional)

Array of drawable IDs to check against. If omitted, checks against all drawables.

## Returns

**Type:** `boolean`

True if touching any candidate.

## Example

```javascript
const isTouchingAny = renderer.isTouchingDrawables(myDrawableId);
```

## See Also

- [isTouchingColor()](./isTouchingColor.md)

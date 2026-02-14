---
title: renderer.getCurrentSkinSize()
---

# renderer.getCurrentSkinSize()

Gets the size of the skin currently assigned to a drawable.

## Syntax

```javascript
renderer.getCurrentSkinSize(drawableID)
```

## Parameters

### drawableID
**Type:** `number`

The ID of the drawable.

## Returns

**Type:** `Array<number>`

An array `[width, height]` representing the skin's size.

## Example

```javascript
const [width, height] = renderer.getCurrentSkinSize(drawableId);
```

## See Also

- [getSkinSize()](./getSkinSize.md)

---
title: renderer.getSkinRotationCenter()
---

# renderer.getSkinRotationCenter()

Gets the rotation center of a skin.

## Syntax

```javascript
renderer.getSkinRotationCenter(skinID)
```

## Parameters

### skinID
**Type:** `number`

The ID of the skin.

## Returns

**Type:** `Array<number>`

An array `[x, y]` representing the rotation center relative to the skin's top-left corner.

## Example

```javascript
const [cx, cy] = renderer.getSkinRotationCenter(skinId);
```

## See Also

- [getSkinSize()](./getSkinSize.md)

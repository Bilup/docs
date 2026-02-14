---
title: renderer.getSkinSize()
---

# renderer.getSkinSize()

Gets the dimensions of a skin.

## Syntax

```javascript
renderer.getSkinSize(skinID)
```

## Parameters

### skinID
**Type:** `number`

The ID of the skin.

## Returns

**Type:** `Array<number>`

An array `[width, height]` representing the skin's size.

## Example

```javascript
const [width, height] = renderer.getSkinSize(skinId);
console.log(`Skin is ${width}x${height}`);
```

## See Also

- [getCurrentSkinSize()](./getCurrentSkinSize.md)
- [getSkinRotationCenter()](./getSkinRotationCenter.md)

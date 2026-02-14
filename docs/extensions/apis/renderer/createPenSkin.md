---
title: renderer.createPenSkin()
---

# renderer.createPenSkin()

Creates a new PenSkin, which implements a Scratch pen layer.

## Syntax

```javascript
renderer.createPenSkin()
```

## Parameters

None.

## Returns

**Type:** `number`

The ID of the new pen skin.

## Example

```javascript
const penSkinId = renderer.createPenSkin();
// Pen skins are automatically managed by the renderer for pen operations
```

## See Also

- [createBitmapSkin()](./createBitmapSkin.md)
- [createSVGSkin()](./createSVGSkin.md)

---
title: renderer.markSkinAsPrivate()
---

# renderer.markSkinAsPrivate()

Marks a skin as containing private information (like camera feed). Private skins may be hidden from snapshots or `isTouchingColor` checks depending on configuration.

## Syntax

```javascript
renderer.markSkinAsPrivate(skinID)
```

## Parameters

### skinID
**Type:** `number`

The ID of the skin to mark as private.

## Returns

**Type:** `void`

## Example

```javascript
const cameraSkinId = renderer.createBitmapSkin(cameraFeed, 1);
renderer.markSkinAsPrivate(cameraSkinId);
```

## See Also



---
title: renderer.updateBitmapSkin()
---

# renderer.updateBitmapSkin()

Updates an existing bitmap skin with new image data. If the skin is not a bitmap skin, it will be converted to one.

## Syntax

```javascript
renderer.updateBitmapSkin(skinId, imgData, bitmapResolution, rotationCenter)
```

## Parameters

### skinId
**Type:** `number`

The ID of the skin to update.

### imgData
**Type:** `ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement`

The new image data to apply to the skin.

### bitmapResolution
**Type:** `number`

Resolution multiplier for the bitmap. Typically `1`.

### rotationCenter
**Type:** `Array<number>` (optional)

The `[x, y]` rotation center point. If not provided, the center of the image is used.

## Returns

**Type:** `void`

## Example

```javascript
class GIFPlayerExtension {
  async playGIF(args, util) {
    const renderer = util.runtime.renderer;
    
    // Create canvas for rendering frames
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    
    // Create initial skin
    const skinId = renderer.createBitmapSkin(canvas, 1);
    
    // Update with new frames
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(nextFrame, 0, 0);
    
    // Update the existing skin
    renderer.updateBitmapSkin(skinId, canvas, 1);
  }
}
```

## Use Cases

- **GIF Animation** - Update skin with each frame
- **Dynamic Textures** - Modify skin content in real-time
- **Video Playback** - Update with video frames
- **Live Effects** - Apply real-time processing to images

## See Also

- [createBitmapSkin()](./createBitmapSkin.md) - Create a bitmap skin
- [updateSVGSkin()](./updateSVGSkin.md) - Update an SVG skin
- [destroySkin()](./destroySkin.md) - Destroy a skin

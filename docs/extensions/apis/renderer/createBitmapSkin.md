---
title: renderer.createBitmapSkin()
---

# renderer.createBitmapSkin()

Creates a new bitmap skin from image data.

## Syntax

```javascript
renderer.createBitmapSkin(bitmapData, costumeResolution, rotationCenter)
```

## Parameters

### bitmapData
**Type:** `ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement`

The source image data for the skin.

### costumeResolution  
**Type:** `number` (optional, default: `1`)

Resolution multiplier for the bitmap. Higher values indicate higher resolution costumes.

### rotationCenter
**Type:** `Array<number>` (optional)

The `[x, y]` rotation center point. If not provided, the center of the image is used.

## Returns

**Type:** `number`

The ID of the newly created skin.

## Example

```javascript
class MyExtension {
  async loadBitmapSkin(args, util) {
    const renderer = util.runtime.renderer;
    
    // Load image from URL
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = args.URL;
    await img.decode();
    
    // Create bitmap skin
    const skinId = renderer.createBitmapSkin(img, 1);
    
    return skinId;
  }
}
```

## See Also

- [updateBitmapSkin()](./updateBitmapSkin.md) - Update an existing bitmap skin
- [createSVGSkin()](./createSVGSkin.md) - Create an SVG skin
- [destroySkin()](./destroySkin.md) - Destroy a skin

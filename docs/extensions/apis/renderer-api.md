---
title: Renderer API Reference
---

# Renderer API Reference

The renderer provides WebGL-based rendering for sprites, costumes, and custom graphics. Access it via `util.runtime.renderer`.

## Quick Start

```javascript
class MyExtension {
  myBlock(args, util) {
    const renderer = util.runtime.renderer;
    
    // Create a skin
    const skinId = renderer.createBitmapSkin(imageData, 1);
    
    // Create a drawable
    const drawableId = renderer.createDrawable('foreground');
    
    // Apply skin to drawable
    renderer.updateDrawableProperties(drawableId, { skinId });
  }
}
```

## Skin Management

Skins provide textures and visual appearance for drawables.

### Creating Skins

- **[createBitmapSkin()](./renderer/createBitmapSkin.md)** - Create skin from image data
- **[createSVGSkin()](./renderer/createSVGSkin.md)** - Create skin from SVG markup
- **[createPenSkin()](./renderer/createPenSkin.md)** - Create pen layer skin
- **[createTextSkin()](./renderer/createTextSkin.md)** - Create text bubble skin

### Updating Skins

- **[updateBitmapSkin()](./renderer/updateBitmapSkin.md)** - Update existing bitmap skin
- **[updateSVGSkin()](./renderer/updateSVGSkin.md)** - Update existing SVG skin
- **[updateTextSkin()](./renderer/updateTextSkin.md)** - Update text bubble skin

### Managing Skins

- **[destroySkin()](./renderer/destroySkin.md)** - Destroy a skin and free resources  
- **[getSkinSize()](./renderer/getSkinSize.md)** - Get skin dimensions
- **[getSkinRotationCenter()](./renderer/getSkinRotationCenter.md)** - Get rotation center
- **[markSkinAsPrivate()](./renderer/markSkinAsPrivate.md)** - Mark skin as private

## Drawable Management

Drawables are visual objects rendered on screen.

### Creating & Destroying

- **[createDrawable()](./renderer/createDrawable.md)** - Create new drawable in layer group
- **[destroyDrawable()](./renderer/destroyDrawable.md)** - Destroy drawable and free resources

### Positioning & Ordering

- **[updateDrawableProperties()](./renderer/updateDrawableProperties.md)** - Update position, scale, effects, etc.
- **[setDrawableOrder()](./renderer/setDrawableOrder.md)** - Change z-order/layer
- **[getDrawableOrder()](./renderer/getDrawableOrder.md)** - Get current z-order

### Visual Properties

- **[getCurrentSkinSize()](./renderer/getCurrentSkinSize.md)** - Get size of drawable's current skin
- **[getBounds()](./renderer/getBounds.md)** - Get tight bounding box
- **[getBoundsForBubble()](./renderer/getBoundsForBubble.md)** - Get bounds for text bubble

## Collision Detection

- **[isTouchingColor()](./renderer/isTouchingColor.md)** - Check if drawable touches a color
- **[isTouchingDrawables()](./renderer/isTouchingDrawables.md)** - Check if drawables overlap

## Rendering Control

- **[draw()](./renderer/draw.md)** - Manually trigger a render  
- **[requestSnapshot()](./renderer/requestSnapshot.md)** - Capture canvas as data URL
- **[setBackgroundColor()](./renderer/setBackgroundColor.md)** - Set stage background color

## Configuration

- **[resize()](./renderer/resize.md)** - Set physical canvas size
- **[setStageSize()](./renderer/setStageSize.md)** - Set logical stage bounds

## Internal Properties

> **⚠️ Warning:** Internal APIs may change without notice

- **[renderer._allSkins](../concepts/internal-properties.md#renderer_allskins)** - Array of all skin objects
- **[renderer._allDrawables](../concepts/internal-properties.md#renderer_alldrawables)** - Array of all drawable objects

## Key Concepts

- **[SVG Loading Patterns](../concepts/svg-loading.md)** - Handle async SVG loading
- **[Internal Properties](../concepts/internal-properties.md)** - Using internal renderer APIs
- **[Resource Management](../concepts/resource-management.md)** - Proper cleanup patterns

## See Also

- [Scratch API](./scratch-api.md) - Extensions API basics
- [VM API](./vm-api.md) - Runtime and execution control
- [Audio API](./audio-api.md) - Sound and music APIs
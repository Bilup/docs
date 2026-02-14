---
title: renderer.createDrawable()
---

# renderer.createDrawable()

Creates a new drawable and adds it to the scene in the specified layer group.

## Syntax

```javascript
renderer.createDrawable(group)
```

## Parameters

### group
**Type:** `string`

The layer group to add the drawable to. Common values:
- `'background'` - Behind all sprites
- `'video'` - Camera/video layer
- `'pen'` - Pen layer
- `'sprite'` - Sprite layer

## Returns

**Type:** `number`

The ID of the newly created drawable.

## Example

```javascript
class CustomGraphicsExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.drawables = new Map();
  }
  
  createCustomDrawable(args, util) {
    const renderer = util.runtime.renderer;
    
    // Create drawable in sprite layer
    const drawableId = renderer.createDrawable('sprite');
    
    // Set initial properties  
    renderer.updateDrawableProperties(drawableId, {
      position: [0, 0, 0],
      visible: true,
      scale: [100, 100]
    });
    
    // Store reference
    this.drawables.set(args.NAME, drawableId);
    
    return drawableId;
  }
}
```

## Layer Groups

Layer groups determine rendering order:
1. `background` - Rendered first (behind everything)
2. `video` - Video/camera layer
3. `pen` - Pen layer
4. `sprite` - Rendered last (sprites)

## See Also

- [destroyDrawable()](./destroyDrawable.md) - Destroy a drawable
- [updateDrawableProperties()](./updateDrawableProperties.md) - Modify drawable properties
- [setDrawableOrder()](./setDrawableOrder.md) - Change drawable z-order

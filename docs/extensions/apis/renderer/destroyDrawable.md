---
title: renderer.destroyDrawable()
---

# renderer.destroyDrawable()

Destroys a drawable and removes it from the scene. Frees associated resources.

## Syntax

```javascript
renderer.destroyDrawable(drawableID, group)
```

## Parameters

### drawableID
**Type:** `number`

The ID of the drawable to destroy.

### group
**Type:** `string`

The layer group the drawable belongs to (`'background'`, `'video'`, `'pen'`, or `'sprite'`).

## Returns

**Type:** `void`

## Example

```javascript
class DrawableManagerExtension {
  removeDrawable(args) {
    const renderer = this.runtime.renderer;
    const drawableId = this.drawables.get(args.NAME);
    
    if (drawableId) {
      renderer.destroyDrawable(drawableId, 'sprite');
      this.drawables.delete(args.NAME);
    }
  }
}
```

## See Also

- [createDrawable()](./createDrawable.md)
- [updateDrawableProperties()](./updateDrawableProperties.md)

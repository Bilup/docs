---
title: renderer.updateDrawableProperties()
---

# renderer.updateDrawableProperties()

Updates properties of an existing drawable such as position, visibility, scale, and effects.

## Syntax

```javascript
renderer.updateDrawableProperties(drawableID, properties)
```

## Parameters

### drawableID
**Type:** `number`

The ID of the drawable to update.

### properties
**Type:** `object`

Object containing properties to update. Supported properties:

| Property | Type | Description |
|----------|------|-------------|
| `position` | `[x, y, z]` | Position in Scratch coordinates |
| `direction` | `number` | Direction in degrees (0-360) |
| `scale` | `[xScale, yScale]` | Scale percentages (100 = normal) |
| `visible` | `boolean` | Visibility state |
| `effects` | `object` | Visual effects (see below) |
| `skinId` | `number` | Skin ID to apply |

### Effects Object

```javascript
{
  ghost: 0-100,        // Transparency (0 = opaque, 100 = invisible)
  brightness: -100-100, // Brightness adjustment  
  color: 0-200         // Color/hue shift
}
```

## Returns

**Type:** `void`

## Examples

### Basic Positioning

```javascript
renderer.updateDrawableProperties(drawableId, {
  position: [100, 50, 0],  // x=100, y=50
  visible: true
});
```

### Apply Effects

```javascript
renderer.updateDrawableProperties(drawableId, {
  effects: {
    ghost: 50,        // 50% transparent
    brightness: 25,   // Brighten by 25
    color: 100        // Shift hue
  }
});
```

### Complete Update

```javascript
renderer.updateDrawableProperties(drawableId,{
  position: [0, 0, 0],
  direction: 90,
  scale: [150, 150],  // 150% size
  visible: true,
  effects: {
    ghost: 0,
    brightness: 0,
    color: 0
  }
});
```

## Notes

- Only updates properties you specify - others remain unchanged
- Position uses Scratch coordinate system (center is 0,0)
- Direction: 0° = up, 90° = right, 180° = down, 270° = left

## See Also

- [createDrawable()](./createDrawable.md) - Create a drawable
- [destroyDrawable()](./destroyDrawable.md) - Destroy a drawable
- [setDrawableOrder()](./setDrawableOrder.md) - Change z-order

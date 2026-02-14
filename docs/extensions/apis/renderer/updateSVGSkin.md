---
title: renderer.updateSVGSkin()
---

# renderer.updateSVGSkin()

Updates an existing SVG skin with new SVG markup. If the skin is not an SVG skin, it will be converted to one.

## Syntax

```javascript
renderer.updateSVGSkin(skinId, svgData, rotationCenter)
```

## Parameters

### skinId
**Type:** `number`

The ID of the skin to update.

### svgData
**Type:** `string`

The new SVG markup to apply.

### rotationCenter
**Type:** `Array<number>` (optional)

The `[x, y]` rotation center point.

## Returns

**Type:** `void`

## Example

```javascript
class DynamicSVGExtension {
  updateShape(args, util) {
    const renderer = util.runtime.renderer;
    const skinId = this.shapes.get(args.NAME);
    
    const newColor = args.COLOR;
    const svgData = `
      <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="${newColor}" />
      </svg>
    `;
    
    renderer.updateSVGSkin(skinId, svgData);
  }
}
```

## See Also

- [createSVGSkin()](./createSVGSkin.md)
- [updateBitmapSkin()](./updateBitmapSkin.md)

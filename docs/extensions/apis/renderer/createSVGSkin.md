---
title: renderer.createSVGSkin()
---

# renderer.createSVGSkin()

Creates a new SVG skin from SVG markup.

## Syntax

```javascript
renderer.createSVGSkin(svgData, rotationCenter)
```

## Parameters

### svgData
**Type:** `string`

The SVG markup as a string.

### rotationCenter
**Type:** `Array<number>` (optional)  

The `[x, y]` rotation center point. If not provided, the center of the SVG is used.

## Returns

**Type:** `number`

The ID of the newly created skin.

## Example

```javascript
class SVGExtension {
  createCircleSkin(args, util) {
    const renderer = util.runtime.renderer;
    const color = args.COLOR || '#ff0000';
    const size = args.SIZE || 100;
    
    const svgData = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="${color}" />
      </svg>
    `;
    
    const skinId = renderer.createSVGSkin(svgData);
    return skinId;
  }
}
```

## Notes

- SVG skins load asynchronously - see [SVG Loading](../../concepts/svg-loading.md)
- SVG content should include proper xmlns attribute
- Rotation center coordinates are relative to SVG viewBox

## See Also

- [updateSVGSkin()](./updateSVGSkin.md) - Update an existing SVG skin
- [createBitmapSkin()](./createBitmapSkin.md) - Create a bitmap skin
- [destroySkin()](./destroySkin.md) - Destroy a skin
- [SVG Loading Patterns](../../concepts/svg-loading.md) - Handle async SVG loading

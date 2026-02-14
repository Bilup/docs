---
title: SVG Loading Patterns
---

# SVG Loading Patterns

SVG skins in the renderer load asynchronously. This means when you create an SVG skin, the image may not be immediately ready for size queries or rendering.

## The Problem

```javascript
const skinId = renderer.createSVGSkin(svgData);
const skin = renderer._allSkins[skinId];

// This might be [0, 0] if SVG hasn't loaded yet!
console.log(skin.size);
```

## Solution: Wait for SVG Load

Use this helper function to wait for SVG skins to finish loading:

```javascript
/**
 * Wait for SVG skin to finish loading
 * @param {SVGSkin} svgSkin - The SVG skin object from renderer._allSkins
 * @returns {Promise<void>} - Resolves when SVG is loaded
 */
function svgSkinFinishedLoading(svgSkin) {
  return new Promise((resolve) => {
    if (svgSkin._svgImageLoaded) {
      // Already loaded
      resolve();
    } else {
      // Wait for load or error event
      svgSkin._svgImage.addEventListener('load', () => {
        resolve();
      });
      svgSkin._svgImage.addEventListener('error', () => {
        resolve(); // Resolve even on error to prevent hanging
      });
    }
  });
}
```

## Usage Example

```javascript
class SVGExtension {
  async registerSVGSkin(args, util) {
    const renderer = util.runtime.renderer;
    const svgData = args.SVG_CODE;
    
    // Create the SVG skin
    const skinId = renderer.createSVGSkin(svgData);
    
    // Get the skin object and wait for loading
    const svgSkin = renderer._allSkins[skinId];
    await svgSkinFinishedLoading(svgSkin);
    
    // Now safe to query size
    const size = svgSkin.size;
    console.log(`SVG loaded: ${size[0]} x ${size[1]}`);
    
    return skinId;
  }
}
```

## SVG Skin Properties

After loading completes, SVG skins have these properties:

- `_svgImageLoaded` - Boolean indicating load status
- `_svgImage` - The underlying SVG image element  
- `size` - [width, height] array with SVG dimensions

## When to Use

You need to wait for SVG loading when:
- Querying skin dimensions immediately after creation
- Applying the skin to a drawable right away
- Performing operations that depend on SVG content

## Related APIs

- [createSVGSkin()](../apis/renderer/createSVGSkin.md)
- [updateSVGSkin()](../apis/renderer/updateSVGSkin.md)
- [Internal Properties](./internal-properties.md)

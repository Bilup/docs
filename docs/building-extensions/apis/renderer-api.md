---
title: Renderer API
sidebar_position: 5
---

# Renderer API

The renderer (scratch-render) draws the stage with WebGL. [Unsandboxed extensions](/building-extensions/unsandboxed) reach it at `Scratch.renderer` (equivalently `util.runtime.renderer`).

Most extensions never touch the renderer; sprites are drawn for you. You need it only to draw your own graphics on the stage. The model has two layers:

- A **skin** holds a texture (a bitmap, an SVG, a pen canvas, or text).
- A **drawable** is a positioned instance that references a skin. You give a drawable a skin, then set its position, scale, effects, and layer.

```js
myBlock(args, util) {
  const renderer = util.runtime.renderer;

  const skinId = renderer.createBitmapSkin(imageData, 1);
  const drawableId = renderer.createDrawable('pen'); // a layer group
  renderer.updateDrawableSkinId(drawableId, skinId);
  renderer.updateDrawableProperties(drawableId, {
    position: [0, 0],
    scale: [100, 100],
    visible: true
  });
}
```

These are internal APIs. They can change between MistWarp versions, so guard your code and clean up skins and drawables you create.

## Skins

| Method | Description |
|:--|:--|
| `createBitmapSkin(bitmapData, resolution, rotationCenter?)` | Skin from an `ImageData`, canvas, or image. `resolution` is usually `1` or `2`. Returns a skin id. |
| `createSVGSkin(svgData, rotationCenter?)` | Skin from an SVG string. Returns a skin id. |
| `createPenSkin()` | An empty skin you draw onto with the pen methods. Returns a skin id. |
| `createTextSkin(type, text, pointsLeft)` | A speech/thought bubble skin. |
| `updateBitmapSkin(skinId, imgData, resolution, rotationCenter?)` | Replace a bitmap skin's contents. |
| `updateSVGSkin(skinId, svgData, rotationCenter?)` | Replace an SVG skin's contents. |
| `destroySkin(skinId)` | Free a skin. Do this when you are done with it. |
| `getSkinSize(skinId)` | `[width, height]` of the skin. |
| `getSkinRotationCenter(skinId)` | `[x, y]` rotation center. |

## Drawables

| Method | Description |
|:--|:--|
| `createDrawable(group)` | Create a drawable in a layer group (for example `'pen'`). Returns a drawable id. |
| `destroyDrawable(drawableId, group)` | Remove a drawable. |
| `updateDrawableSkinId(drawableId, skinId)` | Point a drawable at a skin. |
| `updateDrawableProperties(drawableId, properties)` | Set `position` `[x,y]`, `direction`, `scale` `[sx,sy]`, `visible`, `ghost` and other effects, and `skinId`. |
| `getCurrentSkinSize(drawableId)` | `[width, height]` of the drawable's current skin. |
| `getBounds(drawableId)` | Tight bounding box in stage coordinates. |
| `getDrawableOrder(drawableId)` | The drawable's index within its group. |
| `setDrawableOrder(drawableId, order, group, isRelative?, min?)` | Reorder a drawable (change layering). |

## Pen drawing

Only for skins made with `createPenSkin()`.

| Method | Description |
|:--|:--|
| `penClear(penSkinId)` | Erase the pen layer. |
| `penPoint(penSkinId, penAttributes, x, y)` | Draw a dot. |
| `penLine(penSkinId, penAttributes, x0, y0, x1, y1)` | Draw a line. `penAttributes` is `{ color4f: [r,g,b,a], diameter }`. |

## Collision

| Method | Description |
|:--|:--|
| `isTouchingColor(drawableId, color3b, mask3b?)` | Whether a drawable overlaps a color. `color3b` is `[r,g,b]` (0 to 255). |
| `isTouchingDrawables(drawableId, candidateIds?)` | Whether a drawable overlaps any of the given drawables. |

## Stage and output

| Method | Description |
|:--|:--|
| `draw()` | Render a frame now. |
| `requestSnapshot(callback)` | Capture the canvas; the callback receives a data URL. |
| `setBackgroundColor(r, g, b, a?)` | Stage background color. Components are 0 to 1. |
| `resize(pixelsWide, pixelsTall)` | Set the canvas's physical pixel size. |
| `setStageSize(xLeft, xRight, yBottom, yTop)` | Set the logical stage bounds. |
| `renderer.canvas` | The `<canvas>` element. |

## Coordinates

Stage coordinates match Scratch: `(0, 0)` is the center, x increases right, y increases up. On a default stage x runs -240 to 240 and y runs -180 to 180, but the [stage size can be customized](/advanced/custom-stage-size), so read `runtime.stageWidth` / `runtime.stageHeight` rather than assuming.

## See also

- [VM API](/building-extensions/apis/vm-api)
- [Scratch object API](/building-extensions/apis/scratch-api)

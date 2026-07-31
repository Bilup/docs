---
title: 渲染器 API
sidebar_position: 5
---

# 渲染器 API

渲染器（scratch-render）用 WebGL 绘制舞台。[非沙箱扩展](/building-extensions/unsandboxed)在 `Scratch.renderer` 访问它（等价于 `util.runtime.renderer`）。

大多数扩展从不接触渲染器；角色会自动绘制。只有当您想在舞台上绘制自己的图形时才需要它。模型有两层：

- **皮肤**持有纹理（位图、SVG、画笔画布或文本）。
- **可绘制对象**是引用皮肤的有位置实例。您给可绘制对象一个皮肤，然后设置它的位置、缩放、效果和图层。

```js
myBlock(args, util) {
  const renderer = util.runtime.renderer;

  const skinId = renderer.createBitmapSkin(imageData, 1);
  const drawableId = renderer.createDrawable('pen'); // 一个图层组
  renderer.updateDrawableSkinId(drawableId, skinId);
  renderer.updateDrawableProperties(drawableId, {
    position: [0, 0],
    scale: [100, 100],
    visible: true
  });
}
```

这些是内部 API。它们可能随 Bilup 版本而更改，因此请保护您的代码并清理您创建的皮肤和可绘制对象。

## 皮肤

| 方法 | 描述 |
|:--|:--|
| `createBitmapSkin(bitmapData, resolution, rotationCenter?)` | 从 `ImageData`、画布或图像创建皮肤。`resolution` 通常是 `1` 或 `2`。返回皮肤 id。 |
| `createSVGSkin(svgData, rotationCenter?)` | 从 SVG 字符串创建皮肤。返回皮肤 id。 |
| `createPenSkin()` | 您用画笔方法在其上绘制的空皮肤。返回皮肤 id。 |
| `createTextSkin(type, text, pointsLeft)` | 对话/思考气泡皮肤。 |
| `updateBitmapSkin(skinId, imgData, resolution, rotationCenter?)` | 替换位图皮肤的内容。 |
| `updateSVGSkin(skinId, svgData, rotationCenter?)` | 替换 SVG 皮肤的内容。 |
| `destroySkin(skinId)` | 释放皮肤。用完时执行此操作。 |
| `getSkinSize(skinId)` | 皮肤的 `[宽度, 高度]`。 |
| `getSkinRotationCenter(skinId)` | `[x, y]` 旋转中心。 |

## 可绘制对象

| 方法 | 描述 |
|:--|:--|
| `createDrawable(group)` | 在图层组中创建可绘制对象（例如 `'pen'`）。返回可绘制对象 id。 |
| `destroyDrawable(drawableId, group)` | 移除可绘制对象。 |
| `updateDrawableSkinId(drawableId, skinId)` | 将可绘制对象指向皮肤。 |
| `updateDrawableProperties(drawableId, properties)` | 设置 `position` `[x,y]`、`direction`、`scale` `[sx,sy]`、`visible`、`ghost` 和其他效果，以及 `skinId`。 |
| `getCurrentSkinSize(drawableId)` | 可绘制对象当前皮肤的 `[宽度, 高度]`。 |
| `getBounds(drawableId)` | 舞台坐标中的紧密边界框。 |
| `getDrawableOrder(drawableId)` | 可绘制对象在其组内的索引。 |
| `setDrawableOrder(drawableId, order, group, isRelative?, min?)` | 重新排序可绘制对象（更改分层）。 |

## 画笔绘制

只适用于用 `createPenSkin()` 制作的皮肤。

| 方法 | 描述 |
|:--|:--|
| `penClear(penSkinId)` | 擦除画笔层。 |
| `penPoint(penSkinId, penAttributes, x, y)` | 绘制一个点。 |
| `penLine(penSkinId, penAttributes, x0, y0, x1, y1)` | 绘制一条线。`penAttributes` 是 `{ color4f: [r,g,b,a], diameter }`。 |

## 碰撞

| 方法 | 描述 |
|:--|:--|
| `isTouchingColor(drawableId, color3b, mask3b?)` | 可绘制对象是否与颜色重叠。`color3b` 是 `[r,g,b]`（0 到 255）。 |
| `isTouchingDrawables(drawableId, candidateIds?)` | 可绘制对象是否与任何给定可绘制对象重叠。 |

## 舞台与输出

| 方法 | 描述 |
|:--|:--|
| `draw()` | 立即渲染一帧。 |
| `requestSnapshot(callback)` | 捕获画布；回调接收一个数据 URL。 |
| `setBackgroundColor(r, g, b, a?)` | 舞台背景颜色。分量是 0 到 1。 |
| `resize(pixelsWide, pixelsTall)` | 设置画布的物理像素大小。 |
| `setStageSize(xLeft, xRight, yBottom, yTop)` | 设置逻辑舞台边界。 |
| `renderer.canvas` | `<canvas>` 元素。 |

## 坐标

舞台坐标与 Scratch 匹配：`(0, 0)` 是中心，x 向右增加，y 向上增加。在默认舞台上 x 从 -240 到 240，y 从 -180 到 180，但[舞台大小可以自定义](/advanced/custom-stage-size)，因此请读取 `runtime.stageWidth` / `runtime.stageHeight`，而不是假设。

## 另请参阅

- [VM API](/building-extensions/apis/vm-api)
- [Scratch 对象 API](/building-extensions/apis/scratch-api)

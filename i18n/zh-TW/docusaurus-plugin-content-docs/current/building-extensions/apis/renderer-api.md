---
title: 渲染器 API
sidebar_position: 5
---

# 渲染器 API

渲染器（scratch-render）用 WebGL 繪製舞臺。[非沙箱擴充功能](/building-extensions/unsandboxed)在 `Scratch.renderer` 存取它（等價於 `util.runtime.renderer`）。

大多數擴充功能從不接觸渲染器；角色會自動繪製。只有當您想在舞臺上繪製自己的圖形時才需要它。模型有兩層：

- **皮膚**持有紋理（點陣圖、SVG、畫筆畫布或文本）。
- **可繪製物件**是引用皮膚的有位置實例。您給可繪製物件一個皮膚，然後設定它的位置、縮放、效果和圖層。

```js
myBlock(args, util) {
  const renderer = util.runtime.renderer;

  const skinId = renderer.createBitmapSkin(imageData, 1);
  const drawableId = renderer.createDrawable('pen'); // 一個圖層組
  renderer.updateDrawableSkinId(drawableId, skinId);
  renderer.updateDrawableProperties(drawableId, {
    position: [0, 0],
    scale: [100, 100],
    visible: true
  });
}
```

這些是內部 API。它們可能隨 Bilup 版本而更改，因此請保護您的程式碼並清理您建立的皮膚和可繪製物件。

## 皮膚

| 方法 | 描述 |
|:--|:--|
| `createBitmapSkin(bitmapData, resolution, rotationCenter?)` | 從 `ImageData`、畫布或影像建立皮膚。`resolution` 通常是 `1` 或 `2`。返回皮膚 id。 |
| `createSVGSkin(svgData, rotationCenter?)` | 從 SVG 字串建立皮膚。返回皮膚 id。 |
| `createPenSkin()` | 您用畫筆方法在其上繪製的空皮膚。返回皮膚 id。 |
| `createTextSkin(type, text, pointsLeft)` | 對話/思考氣泡皮膚。 |
| `updateBitmapSkin(skinId, imgData, resolution, rotationCenter?)` | 替換點陣圖皮膚的內容。 |
| `updateSVGSkin(skinId, svgData, rotationCenter?)` | 替換 SVG 皮膚的內容。 |
| `destroySkin(skinId)` | 釋放皮膚。用完時執行此操作。 |
| `getSkinSize(skinId)` | 皮膚的 `[寬度, 高度]`。 |
| `getSkinRotationCenter(skinId)` | `[x, y]` 旋轉中心。 |

## 可繪製物件

| 方法 | 描述 |
|:--|:--|
| `createDrawable(group)` | 在圖層組中建立可繪製物件（例如 `'pen'`）。返回可繪製物件 id。 |
| `destroyDrawable(drawableId, group)` | 移除可繪製物件。 |
| `updateDrawableSkinId(drawableId, skinId)` | 將可繪製物件指向皮膚。 |
| `updateDrawableProperties(drawableId, properties)` | 設定 `position` `[x,y]`、`direction`、`scale` `[sx,sy]`、`visible`、`ghost` 和其他效果，以及 `skinId`。 |
| `getCurrentSkinSize(drawableId)` | 可繪製物件當前皮膚的 `[寬度, 高度]`。 |
| `getBounds(drawableId)` | 舞臺座標中的緊密邊界框。 |
| `getDrawableOrder(drawableId)` | 可繪製物件在其組內的索引。 |
| `setDrawableOrder(drawableId, order, group, isRelative?, min?)` | 重新排序可繪製物件（更改分層）。 |

## 畫筆繪製

只適用於用 `createPenSkin()` 製作的皮膚。

| 方法 | 描述 |
|:--|:--|
| `penClear(penSkinId)` | 擦除畫筆層。 |
| `penPoint(penSkinId, penAttributes, x, y)` | 繪製一個點。 |
| `penLine(penSkinId, penAttributes, x0, y0, x1, y1)` | 繪製一條線。`penAttributes` 是 `{ color4f: [r,g,b,a], diameter }`。 |

## 碰撞

| 方法 | 描述 |
|:--|:--|
| `isTouchingColor(drawableId, color3b, mask3b?)` | 可繪製物件是否與顏色重疊。`color3b` 是 `[r,g,b]`（0 到 255）。 |
| `isTouchingDrawables(drawableId, candidateIds?)` | 可繪製物件是否與任何給定可繪製物件重疊。 |

## 舞臺與輸出

| 方法 | 描述 |
|:--|:--|
| `draw()` | 立即渲染一幀。 |
| `requestSnapshot(callback)` | 捕獲畫布；回呼接收一個資料 URL。 |
| `setBackgroundColor(r, g, b, a?)` | 舞臺背景顏色。分量是 0 到 1。 |
| `resize(pixelsWide, pixelsTall)` | 設定畫布的物理畫素大小。 |
| `setStageSize(xLeft, xRight, yBottom, yTop)` | 設定邏輯舞臺邊界。 |
| `renderer.canvas` | `<canvas>` 元素。 |

## 座標

舞臺座標與 Scratch 匹配：`(0, 0)` 是中心，x 向右增加，y 向上增加。在預設舞臺上 x 從 -240 到 240，y 從 -180 到 180，但[舞臺大小可以自訂](/advanced/custom-stage-size)，因此請讀取 `runtime.stageWidth` / `runtime.stageHeight`，而不是假設。

## 另請參閱

- [VM API](/building-extensions/apis/vm-api)
- [Scratch 物件 API](/building-extensions/apis/scratch-api)

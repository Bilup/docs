---
title: renderer.updateSVGSkin()
---

# renderer.updateSVGSkin()

用新的 SVG 标记更新现有的 SVG 皮肤。如果皮肤不是 SVG 皮肤，它将被转换为 SVG 皮肤。

## 语法

```javascript
renderer.updateSVGSkin(skinId, svgData, rotationCenter)
```

## 参数

### skinId
**类型:** `number`

要更新的皮肤的 ID。

### svgData
**类型:** `string`

要应用的新 SVG 标记。

### rotationCenter
**类型:** `Array<number>` (可选)

`[x, y]` 旋转中心点。

## 返回值

**类型:** `void`

## 示例

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

## 另请参阅

- [createSVGSkin()](./createSVGSkin.md)
- [updateBitmapSkin()](./updateBitmapSkin.md)
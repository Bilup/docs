---
title: renderer.createSVGSkin()
---

# renderer.createSVGSkin()

从 SVG 标记创建新的 SVG 造型。

## 语法

```javascript
renderer.createSVGSkin(svgData, rotationCenter)
```

## 参数

### svgData
**类型:** `string`

SVG 标记作为字符串。

### rotationCenter
**类型:** `Array<number>` (可选)  

`[x, y]` 旋转中心点。如果未提供，使用 SVG 的中心。

## 返回值

**类型:** `number`

新创建造型的 ID。

## 示例

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

## 注意事项

- SVG 造型异步加载 - 请参阅 [SVG 加载](../../concepts/svg-loading.md)
- SVG 内容应包含正确的 xmlns 属性
- 旋转中心坐标相对于 SVG viewBox

## 另请参阅

- [updateSVGSkin()](./updateSVGSkin.md) - 更新现有的 SVG 造型
- [createBitmapSkin()](./createBitmapSkin.md) - 创建位图造型
- [destroySkin()](./destroySkin.md) - 销毁造型
- [SVG 加载模式](../../concepts/svg-loading.md) - 处理异步 SVG 加载
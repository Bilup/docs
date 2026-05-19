---
title: renderer.createBitmapSkin()
---

# renderer.createBitmapSkin()

从图像数据创建新的位图造型。

## 语法

```javascript
renderer.createBitmapSkin(bitmapData, costumeResolution, rotationCenter)
```

## 参数

### bitmapData
**类型:** `ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement`

造型的源图像数据。

### costumeResolution  
**类型:** `number` (可选, 默认: `1`)

位图的分辨率。更高的值表示更高分辨率的造型。

### rotationCenter
**类型:** `Array<number>` (可选)

`[x, y]` 旋转中心点。如果未提供，使用图像的中心。

## 返回值

**类型:** `number`

新创建造型的 ID。

## 示例

```javascript
class MyExtension {
  async loadBitmapSkin(args, util) {
    const renderer = util.runtime.renderer;
    
    // 从 URL 加载图像
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = args.URL;
    await img.decode();
    
    // 创建位图造型
    const skinId = renderer.createBitmapSkin(img, 1);
    
    return skinId;
  }
}
```

## 另请参阅

- [updateBitmapSkin()](./updateBitmapSkin.md) - 更新现有的位图造型
- [createSVGSkin()](./createSVGSkin.md) - 创建 SVG 造型
- [destroySkin()](./destroySkin.md) - 销毁造型
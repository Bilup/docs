---
title: renderer.updateBitmapSkin()
---

# renderer.updateBitmapSkin()

用新图像数据更新现有的位图造型。如果造型不是位图造型，它将被转换为位图造型。

## 语法

```javascript
renderer.updateBitmapSkin(skinId, imgData, bitmapResolution, rotationCenter)
```

## 参数

### skinId
**类型:** `number`

要更新的造型的 ID。

### imgData
**类型:** `ImageData | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement`

要应用到造型的新图像数据。

### bitmapResolution
**类型:** `number`

位图的分辨率乘数。通常为 `1`。

### rotationCenter
**类型:** `Array<number>` (可选)

`[x, y]` 旋转中心点。如果未提供，使用图像的中心。

## 返回值

**类型:** `void`

## 示例

```javascript
class GIFPlayerExtension {
  async playGIF(args, util) {
    const renderer = util.runtime.renderer;
    
    // 创建用于渲染帧的画布
    const canvas = document.createElement('canvas');
    canvas.width = 480;
    canvas.height = 360;
    
    // 创建初始造型
    const skinId = renderer.createBitmapSkin(canvas, 1);
    
    // 用新帧更新
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(nextFrame, 0, 0);
    
    // 更新现有造型
    renderer.updateBitmapSkin(skinId, canvas, 1);
  }
}
```

## 用例

- **GIF 动画** - 用每一帧更新造型
- **动态纹理** - 实时修改造型内容
- **视频播放** - 用视频帧更新
- **实时效果** - 对图像应用实时处理

## 另请参阅

- [createBitmapSkin()](./createBitmapSkin.md) - 创建位图造型
- [updateSVGSkin()](./updateSVGSkin.md) - 更新 SVG 造型
- [destroySkin()](./destroySkin.md) - 销毁造型
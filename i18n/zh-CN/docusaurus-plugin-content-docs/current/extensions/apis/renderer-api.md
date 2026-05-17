---
title: 渲染器 API 参考
---

# 渲染器 API 参考

渲染器提供基于 WebGL 的角色、造型和自定义图形渲染。通过 `util.runtime.renderer` 访问它。

## 快速开始

```javascript
class MyExtension {
  myBlock(args, util) {
    const renderer = util.runtime.renderer;
    
    // 创建造型
    const skinId = renderer.createBitmapSkin(imageData, 1);
    
    // 创建可绘制对象
    const drawableId = renderer.createDrawable('foreground');
    
    // 将造型应用于可绘制对象
    renderer.updateDrawableProperties(drawableId, { skinId });
  }
}
```

## 造型管理

造型为可绘制对象提供纹理和视觉外观。

### 创建造型

- **[createBitmapSkin()](./renderer/createBitmapSkin.md)** - 从图像数据创建造型
- **[createSVGSkin()](./renderer/createSVGSkin.md)** - 从 SVG 标记创建造型
- **[createPenSkin()](./renderer/createPenSkin.md)** - 创建画笔图层造型
- **[createTextSkin()](./renderer/createTextSkin.md)** - 创建文本气泡造型

### 更新造型

- **[updateBitmapSkin()](./renderer/updateBitmapSkin.md)** - 更新现有位图造型
- **[updateSVGSkin()](./renderer/updateSVGSkin.md)** - 更新现有 SVG 造型
- **[updateTextSkin()](./renderer/updateTextSkin.md)** - 更新文本气泡造型

### 管理造型

- **[destroySkin()](./renderer/destroySkin.md)** - 销毁造型并释放资源
- **[getSkinSize()](./renderer/getSkinSize.md)** - 获取造型尺寸
- **[getSkinRotationCenter()](./renderer/getSkinRotationCenter.md)** - 获取旋转中心
- **[markSkinAsPrivate()](./renderer/markSkinAsPrivate.md)** - 将造型标记为私有

## 可绘制对象管理

可绘制对象是在屏幕上渲染的视觉对象。

### 创建与销毁

- **[createDrawable()](./renderer/createDrawable.md)** - 在图层组中创建新的可绘制对象
- **[destroyDrawable()](./renderer/destroyDrawable.md)** - 销毁可绘制对象并释放资源

### 定位与排序

- **[updateDrawableProperties()](./renderer/updateDrawableProperties.md)** - 更新位置、缩放、效果等
- **[setDrawableOrder()](./renderer/setDrawableOrder.md)** - 更改 z 顺序/图层
- **[getDrawableOrder()](./renderer/getDrawableOrder.md)** - 获取当前 z 顺序

### 视觉属性

- **[getCurrentSkinSize()](./renderer/getCurrentSkinSize.md)** - 获取可绘制对象当前造型的尺寸
- **[getBounds()](./renderer/getBounds.md)** - 获取紧密边界框
- **[getBoundsForBubble()](./renderer/getBoundsForBubble.md)** - 获取文本气泡的边界

## 碰撞检测

- **[isTouchingColor()](./renderer/isTouchingColor.md)** - 检查可绘制对象是否接触颜色
- **[isTouchingDrawables()](./renderer/isTouchingDrawables.md)** - 检查可绘制对象是否重叠

## 渲染控制

- **[draw()](./renderer/draw.md)** - 手动触发渲染
- **[requestSnapshot()](./renderer/requestSnapshot.md)** - 将画布捕获为数据 URL
- **[setBackgroundColor()](./renderer/setBackgroundColor.md)** - 设置舞台背景颜色

## 配置

- **[resize()](./renderer/resize.md)** - 设置物理画布尺寸
- **[setStageSize()](./renderer/setStageSize.md)** - 设置逻辑舞台边界

## 内部属性

> **⚠️ 警告：** 内部 API 可能会在没有通知的情况下更改

- **[renderer._allSkins](../concepts/internal-properties.md#renderer_allskins)** - 所有造型对象的数组
- **[renderer._allDrawables](../concepts/internal-properties.md#renderer_alldrawables)** - 所有可绘制对象的数组

## 关键概念

- **[SVG 加载模式](../concepts/svg-loading.md)** - 处理异步 SVG 加载
- **[内部属性](../concepts/internal-properties.md)** - 使用内部渲染器 API
- **[资源管理](../concepts/resource-management.md)** - 正确的清理模式

## 另请参阅

- [Scratch API](./scratch-api.md) - 扩展 API 基础
- [VM API](./vm-api.md) - 运行时和执行控制
- [Audio API](./audio-api.md) - 声音和音乐 API
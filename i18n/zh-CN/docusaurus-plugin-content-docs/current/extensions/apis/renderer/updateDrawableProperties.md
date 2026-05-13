---
title: renderer.updateDrawableProperties()
---

# renderer.updateDrawableProperties()

更新现有可绘制对象的属性，如位置、可见性、缩放和效果。

## 语法

```javascript
renderer.updateDrawableProperties(drawableID, properties)
```

## 参数

### drawableID
**类型:** `number`

要更新的可绘制对象的 ID。

### properties
**类型:** `object`

包含要更新的属性的对象。支持的属性：

| 属性 | 类型 | 描述 |
|----------|------|-------------|
| `position` | `[x, y, z]` | Scratch 坐标中的位置 |
| `direction` | `number` | 方向（度）(0-360) |
| `scale` | `[xScale, yScale]` | 缩放百分比 (100 = 正常) |
| `visible` | `boolean` | 可见性状态 |
| `effects` | `object` | 视觉效果（见下文） |
| `skinId` | `number` | 要应用的皮肤 ID |

### 效果对象

```javascript
{
  ghost: 0-100,        // 透明度 (0 = 不透明, 100 = 完全透明)
  brightness: -100-100, // 亮度调整
  color: 0-200         // 颜色/色相偏移
}
```

## 返回值

**类型:** `void`

## 示例

### 基本定位

```javascript
renderer.updateDrawableProperties(drawableId, {
  position: [100, 50, 0],  // x=100, y=50
  visible: true
});
```

### 应用效果

```javascript
renderer.updateDrawableProperties(drawableId, {
  effects: {
    ghost: 50,        // 50% 透明
    brightness: 25,   // 增亮 25
    color: 100        // 偏移色相
  }
});
```

### 完整更新

```javascript
renderer.updateDrawableProperties(drawableId,{
  position: [0, 0, 0],
  direction: 90,
  scale: [150, 150],  // 150% 大小
  visible: true,
  effects: {
    ghost: 0,
    brightness: 0,
    color: 0
  }
});
```

## 注意事项

- 只更新您指定的属性 - 其他属性保持不变
- 位置使用 Scratch 坐标系（中心是 0,0）
- 方向: 0° = 向上, 90° = 向右, 180° = 向下, 270° = 向左

## 另请参阅

- [createDrawable()](./createDrawable.md) - 创建可绘制对象
- [destroyDrawable()](./destroyDrawable.md) - 销毁可绘制对象
- [setDrawableOrder()](./setDrawableOrder.md) - 更改 z 顺序
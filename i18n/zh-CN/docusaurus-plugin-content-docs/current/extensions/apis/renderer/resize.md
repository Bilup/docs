---
title: renderer.resize()
---

# renderer.resize()

调整物理画布尺寸。

## 语法

```javascript
renderer.resize(width, height)
```

## 参数

### width
**类型:** `number`

设备独立像素中的宽度。

### height
**类型:** `number`

设备独立像素中的高度。

## 返回值

**类型:** `void`

## 注意事项

这会更改 HTML canvas 元素的大小。它不会更改逻辑舞台大小(坐标系)。

## 另请参阅

- [setStageSize()](./setStageSize.md)
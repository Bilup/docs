---
title: renderer.isTouchingColor()
---

# renderer.isTouchingColor()

检查可绘制对象是否接触特定颜色。

## 语法

```javascript
renderer.isTouchingColor(drawableID, color3b, mask3b)
```

## 参数

### drawableID
**类型:** `number`

要检查的可绘制对象的 ID。

### color3b
**类型:** `Array<number>`

要检查的目标颜色: `[r, g, b]` (0-255)。

### mask3b
**类型:** `Array<number>` (可选)

容差颜色遮罩。

## 返回值

**类型:** `boolean`

如果可绘制对象接触该颜色则为 true。

## 示例

```javascript
const isTouchingRed = renderer.isTouchingColor(drawableId, [255, 0, 0]);
```

## 另请参阅

- [isTouchingDrawables()](./isTouchingDrawables.md)
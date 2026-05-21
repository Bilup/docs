---
title: renderer.getDrawableOrder()
---

# renderer.getDrawableOrder()

返回可绘制对象在绘制列表中的位置。

## 语法

```javascript
renderer.getDrawableOrder(drawableID)
```

## 参数

### drawableID
**类型:** `number`

可绘制对象的 ID。

## 返回值

**类型:** `number`

绘制列表中的位置(绝对位置，不相对于图层组)。

## 示例

```javascript
const position = renderer.getDrawableOrder(drawableId);
console.log(`Drawable is at position ${position}`);
```

## 另请参阅

- [setDrawableOrder()](./setDrawableOrder.md)
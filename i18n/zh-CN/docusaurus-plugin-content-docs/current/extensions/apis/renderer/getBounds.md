---
title: renderer.getBounds()
---

# renderer.getBounds()

获取可绘制对象在 Scratch 坐标中的紧密边界框。

## 语法

```javascript
renderer.getBounds(drawableID)
```

## 参数

### drawableID
**类型:** `number`

可绘制对象的 ID。

## 返回值

**类型:** `object`

包含以下属性的对象：
- `left`, `right`, `top`, `bottom` (Scratch 坐标)
- `width`, `height`

## 示例

```javascript
const bounds = renderer.getBounds(drawableId);
console.log(`Left: ${bounds.left}, Top: ${bounds.top}`);
```

## 另请参阅

- [getBoundsForBubble()](./getBoundsForBubble.md)
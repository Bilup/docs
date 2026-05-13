---
title: renderer.isTouchingDrawables()
---

# renderer.isTouchingDrawables()

检查可绘制对象是否接触任何候选可绘制对象。

## 语法

```javascript
renderer.isTouchingDrawables(drawableID, candidateIDs)
```

## 参数

### drawableID
**类型:** `number`

源可绘制对象的 ID。

### candidateIDs
**类型:** `Array<number>` (可选)

要检查的可绘制对象 ID 数组。如果省略，检查所有可绘制对象。

## 返回值

**类型:** `boolean`

如果接触任何候选对象则为 true。

## 示例

```javascript
const isTouchingAny = renderer.isTouchingDrawables(myDrawableId);
```

## 另请参阅

- [isTouchingColor()](./isTouchingColor.md)
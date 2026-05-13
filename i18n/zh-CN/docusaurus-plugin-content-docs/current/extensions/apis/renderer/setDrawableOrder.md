---
title: renderer.setDrawableOrder()
---

# renderer.setDrawableOrder()

更改可绘制对象在其图层组内的 z 顺序（图层位置）。

## 语法

```javascript
renderer.setDrawableOrder(drawableID, order, group, optIsRelative, optMin)
```

## 参数

### drawableID
**类型:** `number`

要重新排序的可绘制对象的 ID。

### order
**类型:** `number`

新位置。可以是绝对位置或相对位置（请参见 `optIsRelative`）。

### group  
**类型:** `string`

图层组名称（`'background'`、`'video'`、`'pen'` 或 `'sprite'`）。

### optIsRelative
**类型:** `boolean` (可选)

如果为 `true`，`order` 相对于当前位置。默认值: `false`。

### optMin
**类型:** `number` (可选)

允许的最小位置。默认值: `0`。

## 返回值

**类型:** `number | null`

如果已更改，返回新的顺序位置；如果未更改，返回 `null`。

## 示例

### 移到最前面

```javascript
renderer.setDrawableOrder(drawableId, Infinity, 'sprite');
```

### 移到最后面

```javascript
renderer.setDrawableOrder(drawableId, 0, 'sprite');
```

### 向后移动 N 层

```javascript
renderer.setDrawableOrder(drawableId, -2, 'sprite', true);
```

### 向前移动 N 层

```javascript
renderer.setDrawableOrder(drawableId, 3, 'sprite', true);
```

## 另请参阅

- [getDrawableOrder()](./getDrawableOrder.md)
- [createDrawable()](./createDrawable.md)
---
title: renderer.setBackgroundColor()
---

# renderer.setBackgroundColor()

设置舞台的背景颜色。

## 语法

```javascript
renderer.setBackgroundColor(red, green, blue, alpha)
```

## 参数

### red, green, blue
**类型:** `number`

颜色分量 (0-1)。注意：这些是归一化的 0-1，不是 0-255。

### alpha
**类型:** `number` (可选)

透明度 (0-1)。默认值为 1。

## 返回值

**类型:** `void`

## 示例

```javascript
// 将背景设置为亮红色
renderer.setBackgroundColor(1, 0, 0);
```

## 另请参阅

- [draw()](./draw.md)
---
title: renderer.setStageSize()
---

# renderer.setStageSize()

设置舞台的逻辑坐标系。

## 语法

```javascript
renderer.setStageSize(xLeft, xRight, yBottom, yTop)
```

## 参数

### xLeft, xRight
**类型:** `number`

X 轴边界。标准 Scratch 是 -240 到 240。

### yBottom, yTop
**类型:** `number`

Y 轴边界。标准 Scratch 是 -180 到 180。

## 返回值

**类型:** `void`

## 示例

```javascript
// 设置为标准 Scratch 大小
renderer.setStageSize(-240, 240, -180, 180);
```

## 另请参阅

- [resize()](./resize.md)
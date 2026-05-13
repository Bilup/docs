---
title: renderer.getSkinRotationCenter()
---

# renderer.getSkinRotationCenter()

获取皮肤的旋转中心。

## 语法

```javascript
renderer.getSkinRotationCenter(skinID)
```

## 参数

### skinID
**类型:** `number`

皮肤的 ID。

## 返回值

**类型:** `Array<number>`

表示相对于皮肤左上角的旋转中心的数组 `[x, y]`。

## 示例

```javascript
const [cx, cy] = renderer.getSkinRotationCenter(skinId);
```

## 另请参阅

- [getSkinSize()](./getSkinSize.md)
---
title: renderer.getSkinSize()
---

# renderer.getSkinSize()

获取皮肤的尺寸。

## 语法

```javascript
renderer.getSkinSize(skinID)
```

## 参数

### skinID
**类型:** `number`

皮肤的 ID。

## 返回值

**类型:** `Array<number>`

表示皮肤尺寸的数组 `[width, height]`。

## 示例

```javascript
const [width, height] = renderer.getSkinSize(skinId);
console.log(`Skin is ${width}x${height}`);
```

## 另请参阅

- [getCurrentSkinSize()](./getCurrentSkinSize.md)
- [getSkinRotationCenter()](./getSkinRotationCenter.md)
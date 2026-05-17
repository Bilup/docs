---
title: renderer.createPenSkin()
---

# renderer.createPenSkin()

创建新的 PenSkin，实现 Scratch 画笔图层。

## 语法

```javascript
renderer.createPenSkin()
```

## 参数

无。

## 返回值

**类型:** `number`

新画笔造型的 ID。

## 示例

```javascript
const penSkinId = renderer.createPenSkin();
// 画笔造型由渲染器自动管理用于画笔操作
```

## 另请参阅

- [createBitmapSkin()](./createBitmapSkin.md)
- [createSVGSkin()](./createSVGSkin.md)
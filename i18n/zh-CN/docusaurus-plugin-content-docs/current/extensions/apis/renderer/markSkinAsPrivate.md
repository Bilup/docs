---
title: renderer.markSkinAsPrivate()
---

# renderer.markSkinAsPrivate()

将造型标记为包含私人信息（如摄像头画面）。根据配置，私人造型可能会从快照或 `isTouchingColor` 检查中隐藏。

## 语法

```javascript
renderer.markSkinAsPrivate(skinID)
```

## 参数

### skinID
**类型:** `number`

要标记为私人的造型的 ID。

## 返回值

**类型:** `void`

## 示例

```javascript
const cameraSkinId = renderer.createBitmapSkin(cameraFeed, 1);
renderer.markSkinAsPrivate(cameraSkinId);
```

## 另请参阅
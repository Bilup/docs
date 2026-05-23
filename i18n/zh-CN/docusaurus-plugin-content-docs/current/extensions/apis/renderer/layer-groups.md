---
title: Renderer Layer Groups
---

# 渲染器层组

渲染器将可绘制对象组织到定义渲染顺序的组中。

## 组
- `background` — 在所有内容后面
- `video` — 相机/视频层
- `pen` — 画笔层
- `sprite` — 角色层(前面)

## 顺序
从后到前：`background` → `video` → `pen` → `sprite`。

## 使用方法
```javascript
const id = renderer.createDrawable('sprite');
renderer.setDrawableOrder(id, Infinity, 'sprite');
renderer.updateDrawableProperties(id, { visible: true });
// 之后
renderer.destroyDrawable(id, 'sprite');
```

另请参见：
- `createDrawable()`
- `setDrawableOrder()`
- `updateDrawableProperties()`
- `destroyDrawable()`
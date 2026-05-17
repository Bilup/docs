---
title: 渲染器内部属性
---

# 渲染器内部属性

> **⚠️ 警告：内部 API**
>
> 这些属性是渲染器实现的内部属性，可能会在未来版本中更改。使用时要小心，访问前始终检查是否存在。

## renderer._allSkins

渲染器管理的所有造型对象的数组。

### 访问模式

```javascript
const renderer = util.runtime.renderer;
const skin = renderer._allSkins[skinId];

if (!skin) {
  console.warn('Skin not found');
  return;
}
```

### 常见造型属性

**所有造型：**
- `size` - 包含造型尺寸的 `[width, height]` 数组
- `_id` - 造型的唯一 ID

**仅 SVG 造型：**
- `_svgImageLoaded` - 指示 SVG 是否已完成加载的布尔值
- `_svgImage` - 底层 SVG 图像元素

### 示例：查询造型尺寸

```javascript
getSkinWidth(skinId) {
  const renderer = this.runtime.renderer;
  const skin = renderer._allSkins[skinId];
  
  if (!skin || !skin.size) return 0;
  
  return Math.ceil(skin.size[0]);
}
```

## renderer._allDrawables

场景中所有可绘制对象的数组。

### 访问模式

```javascript
const renderer = util.runtime.renderer;
const drawable = renderer._allDrawables[drawableId];

if (!drawable) {
  console.warn('Drawable not found');
  return;
}
```

### 可绘制对象属性

- `skin` - 当前造型对象的引用
- `_visible` - 布尔可见性状态
- 其他内部属性（位置、缩放、效果等）

### 示例：直接造型操作

```javascript
setSkin(drawableId, skinId) {
  const renderer = this.runtime.renderer;
  
  // 直接操作可绘制对象的造型
  // 警告：绕过正常的 Scratch 造型系统
  renderer._allDrawables[drawableId].skin = renderer._allSkins[skinId];
}
```

## 最佳实践

### 1. 始终检查存在性

```javascript
if (!renderer._allSkins || !renderer._allSkins[skinId]) {
  console.warn('Skin not found or renderer internals changed');
  return;
}
```

### 2. 提供回退

```javascript
const size = skin.size || [100, 100]; // 不可用时使用默认值
```

### 3. 文档化用法

使用内部 API 时：
- 清楚注释您正在使用内部 API
- 解释为什么需要它们
- 注意潜在的破坏性更改

### 4. 优先使用公共 API

检查公共 API 是否可以实现相同的结果。内部 API 应该是最后的手段。

## 为什么使用内部 API？

有时内部 API 对于以下情况是必要的：
- **造型尺寸** - 没有公共 API 来查询造型尺寸
- **直接操作** - 绕过正常的造型系统以使用自定义造型
- **高级功能** - 访问未公开的属性

## 风险

- **破坏性更改** - 内部 API 可能会在没有通知的情况下更改
- **未定义行为** - 不正确使用内部 API 可能导致崩溃
- **兼容性** - 可能无法在不同版本的渲染器上工作

## 相关内容

- [SVG 加载](./svg-loading.md) - 使用内部 SVG 造型属性
- [资源管理](resource-management.md) - 正确的清理模式
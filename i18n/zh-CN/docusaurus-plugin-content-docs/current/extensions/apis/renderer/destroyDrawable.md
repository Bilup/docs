---
title: renderer.destroyDrawable()
---

# renderer.destroyDrawable()

销毁可绘制对象并将其从场景中移除。释放相关资源。

## 语法

```javascript
renderer.destroyDrawable(drawableID, group)
```

## 参数

### drawableID
**类型:** `number`

要销毁的可绘制对象的 ID。

### group
**类型:** `string`

可绘制对象所属的图层组（`'background'`、`'video'`、`'pen'` 或 `'sprite'`）。

## 返回值

**类型:** `void`

## 示例

```javascript
class DrawableManagerExtension {
  removeDrawable(args) {
    const renderer = this.runtime.renderer;
    const drawableId = this.drawables.get(args.NAME);
    
    if (drawableId) {
      renderer.destroyDrawable(drawableId, 'sprite');
      this.drawables.delete(args.NAME);
    }
  }
}
```

## 另请参阅

- [createDrawable()](./createDrawable.md)
- [updateDrawableProperties()](./updateDrawableProperties.md)
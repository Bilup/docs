---
title: renderer.createDrawable()
---

# renderer.createDrawable()

创建新的可绘制对象并将其添加到指定图层组中的场景。

## 语法

```javascript
renderer.createDrawable(group)
```

## 参数

### group
**类型:** `string`

要添加可绘制对象的图层组。常见值：
- `'background'` - 在所有角色后面
- `'video'` - 相机/视频图层
- `'pen'` - 画笔图层
- `'sprite'` - 角色图层

## 返回值

**类型:** `number`

新创建的可绘制对象的 ID。

## 示例

```javascript
class CustomGraphicsExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.drawables = new Map();
  }
  
  createCustomDrawable(args, util) {
    const renderer = util.runtime.renderer;
    
    // 在角色图层中创建可绘制对象
    const drawableId = renderer.createDrawable('sprite');
    
    // 设置初始属性
    renderer.updateDrawableProperties(drawableId, {
      position: [0, 0, 0],
      visible: true,
      scale: [100, 100]
    });
    
    // 存储引用
    this.drawables.set(args.NAME, drawableId);
    
    return drawableId;
  }
}
```

## 图层组

图层组决定渲染顺序：
1. `background` - 首先渲染（在所有内容后面）
2. `video` - 视频/相机图层
3. `pen` - 画笔图层
4. `sprite` - 最后渲染（角色）

## 另请参阅

- [destroyDrawable()](./destroyDrawable.md) - 销毁可绘制对象
- [updateDrawableProperties()](./updateDrawableProperties.md) - 修改可绘制对象属性
- [setDrawableOrder()](./setDrawableOrder.md) - 更改可绘制对象 z 顺序
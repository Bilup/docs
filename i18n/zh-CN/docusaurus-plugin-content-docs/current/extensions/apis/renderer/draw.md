---
title: renderer.draw()
---

# renderer.draw()

手动触发布局渲染。

## 语法

```javascript
renderer.draw()
```

## 参数

无。

## 返回值

**类型:** `void`

## 注意事项

渲染器通常自动处理绘制。除非您正在进行自定义屏幕外渲染或需要在更改后立即强制更新，否则很少需要手动调用此方法。

## 另请参阅

- [requestSnapshot()](./requestSnapshot.md)
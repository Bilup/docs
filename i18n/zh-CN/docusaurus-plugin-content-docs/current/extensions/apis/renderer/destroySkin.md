---
title: renderer.destroySkin()
---

# renderer.destroySkin()

销毁皮肤并释放其资源。调用此方法后不要使用皮肤或其 ID。

## 语法

```javascript
renderer.destroySkin(skinId)
```

## 参数

### skinId
**类型:** `number`

要销毁的皮肤的 ID。

## 返回值

**类型:** `void`

## 示例

```javascript
class SkinManagerExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.customSkins = new Map();
    
    // 在项目停止时清理
    runtime.on('PROJECT_STOP_ALL', () => {
      this.cleanup();
    });
  }
  
  cleanup() {
    const renderer = this.runtime.renderer;
    
    // 销毁所有自定义皮肤
    for (const skinId of this.customSkins.values()) {
      renderer.destroySkin(skinId);
    }
    
    this.customSkins.clear();
  }
}
```

## 重要注意事项

- **内存管理** - 不再需要皮肤时始终销毁它们
- **可绘制对象引用** - 销毁被可绘制对象使用的皮肤可能导致渲染问题
- **最佳实践** - 在销毁皮肤之前恢复可绘制对象的皮肤

## 另请参阅

- [createBitmapSkin()](./createBitmapSkin.md) - 创建位图皮肤
- [createSVGSkin()](./createSVGSkin.md) - 创建 SVG 皮肤
- [资源管理](../../concepts/resource-management.md) - 清理最佳实践
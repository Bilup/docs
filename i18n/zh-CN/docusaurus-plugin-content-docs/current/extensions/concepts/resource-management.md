---
title: 资源管理
---

# 资源管理

正确的资源管理可以防止内存泄漏并确保扩展的流畅性能。

## 问题

创建造型和可绘制对象而不清理会导致：
- 内存泄漏
- 性能下降
- 资源耗尽
- 渲染故障

## 解决方案：生命周期管理

### 监听项目事件

```javascript
class MyExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.customSkins = new Map();
    this.customDrawables = new Map();
    
    // 项目停止时清理
    runtime.on('PROJECT_STOP_ALL', () => {
      this.cleanup();
    });
    
    // 项目开始时清理(可选)
    runtime.on('PROJECT_START', () => {
      this.cleanup();
    });
  }
  
  cleanup() {
    const renderer = this.runtime.renderer;
    
    // 首先销毁所有可绘制对象
    for (const [name, drawableId] of this.customDrawables) {
      renderer.destroyDrawable(drawableId, 'sprite');
    }
    this.customDrawables.clear();
    
    // 然后销毁所有造型
    for (const [name, skinId] of this.customSkins) {
      renderer.destroySkin(skinId);
    }
    this.customSkins.clear();
  }
}
```

## 最佳实践

### 1. 跟踪资源

使用 Map 或数组跟踪创建的资源：

```javascript
constructor(runtime) {
  this.skins = new Map();      // name -> skinId
  this.drawables = new Map();  // name -> drawableId
}
```

### 2. 按顺序清理

始终按此顺序销毁：
1. 先销毁可绘制对象(它们引用造型)
2. 然后销毁造型(在没有可绘制对象使用它们之后)

```javascript
cleanup() {
  // 1. 销毁可绘制对象
  for (const drawableId of this.drawables.values()) {
    renderer.destroyDrawable(drawableId, 'foreground');
  }
  
  // 2. 销毁造型
  for (const skinId of this.skins.values()) {
    renderer.destroySkin(skinId);
  }
}
```

### 3. 销毁前恢复

如果可绘制对象使用自定义造型，请在销毁自定义造型之前将其恢复为原始造型：

```javascript
deleteSkin(skinName) {
  const skinId = this.skins.get(skinName);
  if (!skinId) return;
  
  // 恢复使用此造型的所有目标
  this._restoreTargetsFromSkin(skinId);
  
  // 现在可以安全销毁
  renderer.destroySkin(skinId);
  this.skins.delete(skinName);
}

_restoreTargetsFromSkin(skinId) {
  for (const target of this.runtime.targets) {
    const drawableId = target.drawableID;
    const currentSkin = renderer._allDrawables[drawableId].skin;
    
    if (currentSkin._id === skinId) {
      target.updateAllDrawableProperties();
    }
  }
}
```

### 4. 实现 dispose()

对于可以卸载的扩展：

```javascript
dispose() {
  // 清理所有资源
  this.cleanup();
  
  // 移除事件监听器
  this.runtime.off('PROJECT_STOP_ALL', this.cleanup.bind(this));
  
  // 清除引用
  this.skins = null;
  this.drawables = null;
}
```

## 常见模式

### 模式：对象池

重用可绘制对象而不是不断创建/销毁：

```javascript
class OptimizedExtension {
  constructor(runtime) {
    this.drawablePool = [];
  }
  
  getDrawable() {
    if (this.drawablePool.length > 0) {
      return this.drawablePool.pop();
    }
    return renderer.createDrawable('foreground');
  }
  
  releaseDrawable(drawableId) {
    // 重置为默认状态
    renderer.updateDrawableProperties(drawableId, {
      visible: false,
      position: [0, 0, 0],
      effects: { ghost: 0, brightness: 0, color: 0 }
    });
    
    // 返回池中
    this.drawablePool.push(drawableId);
  }
}
```

### 模式：造型缓存

缓存经常使用的造型：

```javascript
getCachedSkin(cacheKey, createFunc) {
  if (this.skinCache.has(cacheKey)) {
    return this.skinCache.get(cacheKey);
  }
  
  const skinId = createFunc();
  this.skinCache.set(cacheKey, skinId);
  return skinId;
}
```

## 内存泄漏检查清单

- [ ] 跟踪所有创建的造型和可绘制对象
- [ ] 监听 PROJECT_STOP_ALL
- [ ] 在造型之前销毁可绘制对象
- [ ] 清理后清除所有 Map/Array
- [ ] 在 dispose() 中移除事件监听器
- [ ] 销毁自定义造型之前恢复目标造型

## 相关内容

- [destroySkin()](../apis/renderer/destroySkin.md)
- [destroyDrawable()](../apis/renderer/destroyDrawable.md)
- [内部属性](./internal-properties.md)
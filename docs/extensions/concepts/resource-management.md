---
title: Resource Management
---

# Resource Management

Proper resource management prevents memory leaks and ensures smooth performance in your extensions.

## The Problem

Creating skins and drawables without cleanup leads to:
- Memory leaks
- Performance degradation  
- Resource exhaustion
- Rendering glitches

## Solution: Lifecycle Management

### Listen for Project Events

```javascript
class MyExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.customSkins = new Map();
    this.customDrawables = new Map();
    
    // Clean up when project stops
    runtime.on('PROJECT_STOP_ALL', () => {
      this.cleanup();
    });
    
    // Clean up when project starts (optional)
    runtime.on('PROJECT_START', () => {
      this.cleanup();
    });
  }
  
  cleanup() {
    const renderer = this.runtime.renderer;
    
    // Destroy all drawables first
    for (const [name, drawableId] of this.customDrawables) {
      renderer.destroyDrawable(drawableId, 'sprite');
    }
    this.customDrawables.clear();
    
    // Then destroy all skins
    for (const [name, skinId] of this.customSkins) {
      renderer.destroySkin(skinId);
    }
    this.customSkins.clear();
  }
}
```

## Best Practices

### 1. Track Your Resources

Use Maps or Arrays to track created resources:

```javascript
constructor(runtime) {
  this.skins = new Map();      // name -> skinId
  this.drawables = new Map();  // name -> drawableId
}
```

### 2. Clean Up in Order

Always destroy in this order:
1. Drawables first (they reference skins)
2. Skins second (after no drawables use them)

```javascript
cleanup() {
  // 1. Destroy drawables
  for (const drawableId of this.drawables.values()) {
    renderer.destroyDrawable(drawableId, 'foreground');
  }
  
  // 2. Destroy skins
  for (const skinId of this.skins.values()) {
    renderer.destroySkin(skinId);
  }
}
```

### 3. Restore Before Destroying

If a drawable uses a custom skin, restore it to original skin before destroying the custom skin:

```javascript
deleteSkin(skinName) {
  const skinId = this.skins.get(skinName);
  if (!skinId) return;
  
  // Restore any targets using this skin
  this._restoreTargetsFromSkin(skinId);
  
  // Now safe to destroy
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

### 4. Implement dispose()

For extensions that can be unloaded:

```javascript
dispose() {
  // Cleanup all resources
  this.cleanup();
  
  // Remove event listeners
  this.runtime.off('PROJECT_STOP_ALL', this.cleanup.bind(this));
  
  // Clear references  
  this.skins = null;
  this.drawables = null;
}
```

## Common Patterns

### Pattern: Object Pool

Reuse drawables instead of constantly creating/destroying:

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
    // Reset to default state
    renderer.updateDrawableProperties(drawableId, {
      visible: false,
      position: [0, 0, 0],
      effects: { ghost: 0, brightness: 0, color: 0 }
    });
    
    // Return to pool
    this.drawablePool.push(drawableId);
  }
}
```

### Pattern: Skin Cache

Cache frequently used skins:

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

## Memory Leak Checklist

- [ ] Track all created skins and drawables
- [ ] Listen for PROJECT_STOP_ALL  
- [ ] Destroy drawables before skins
- [ ] Clear all Maps/Arrays after cleanup
- [ ] Remove event listeners in dispose()
- [ ] Restore target skins before destroying custom skins

## Related

- [destroySkin()](../apis/renderer/destroySkin.md)
- [destroyDrawable()](../apis/renderer/destroyDrawable.md)  
- [Internal Properties](./internal-properties.md)

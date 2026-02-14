---
title: renderer.destroySkin()
---

# renderer.destroySkin()

Destroys a skin and frees its resources. Do not use the skin or its ID after calling this.

## Syntax

```javascript
renderer.destroySkin(skinId)
```

## Parameters

### skinId
**Type:** `number`

The ID of the skin to destroy.

## Returns

**Type:** `void`

## Example

```javascript
class SkinManagerExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.customSkins = new Map();
    
    // Clean up on project stop
    runtime.on('PROJECT_STOP_ALL', () => {
      this.cleanup();
    });
  }
  
  cleanup() {
    const renderer = this.runtime.renderer;
    
    // Destroy all custom skins
    for (const skinId of this.customSkins.values()) {
      renderer.destroySkin(skinId);
    }
    
    this.customSkins.clear();
  }
}
```

## Important Notes

- **Memory Management** - Always destroy skins when no longer needed
- **Drawable References** - Destroying a skin used by drawables can cause rendering issues
- **Best Practice** - Restore drawable skins before destroying them

## See Also

- [createBitmapSkin()](./createBitmapSkin.md) - Create a bitmap skin
- [createSVGSkin()](./createSVGSkin.md) - Create an SVG skin
- [Resource Management](../../concepts/resource-management.md) - Best practices for cleanup

---
title: Internal Renderer Properties
---

# Internal Renderer Properties

> **⚠️ Warning: Internal APIs**
>
> These properties are internal to the renderer implementation and may change in future versions. Use with caution and always check for existence before accessing.

## renderer._allSkins

Array of all skin objects managed by the renderer.

### Access Pattern

```javascript
const renderer = util.runtime.renderer;
const skin = renderer._allSkins[skinId];

if (!skin) {
  console.warn('Skin not found');
  return;
}
```

### Common Skin Properties

**All Skins:**
- `size` - `[width, height]` array with skin dimensions
- `_id` - The skin's unique ID

**SVG Skins Only:**
- `_svgImageLoaded` - Boolean indicating if SVG has finished loading
- `_svgImage` - The underlying SVG image element

### Example: Query Skin Dimensions

```javascript
getSkinWidth(skinId) {
  const renderer = this.runtime.renderer;
  const skin = renderer._allSkins[skinId];
  
  if (!skin || !skin.size) return 0;
  
  return Math.ceil(skin.size[0]);
}
```

## renderer._allDrawables

Array of all drawable objects in the scene.

### Access Pattern

```javascript
const renderer = util.runtime.renderer;
const drawable = renderer._allDrawables[drawableId];

if (!drawable) {
  console.warn('Drawable not found');
  return;
}
```

### Drawable Properties

- `skin` - Reference to the current skin object
- `_visible` - Boolean visibility state
- Other internal properties (position, scale, effects, etc.)

### Example: Direct Skin Manipulation

```javascript
setSkin(drawableId, skinId) {
  const renderer = this.runtime.renderer;
  
  // Direct manipulation of drawable's skin
  // Warning: Bypasses normal Scratch costume system
  renderer._allDrawables[drawableId].skin = renderer._allSkins[skinId];
}
```

## Best Practices

### 1. Always Check Existence

```javascript
if (!renderer._allSkins || !renderer._allSkins[skinId]) {
  console.warn('Skin not found or renderer internals changed');
  return;
}
```

### 2. Provide Fallbacks

```javascript
const size = skin.size || [100, 100]; // Default if unavailable
```

### 3. Document Usage

When using internal APIs:
- Comment clearly that you're using internal APIs
- Explain why they're necessary
- Note potential breaking changes

### 4. Prefer Public APIs

Check if public APIs can achieve the same result. Internal APIs should be a last resort.

## Why Use Internal APIs?

Sometimes internal APIs are necessary for:
- **Skin Dimensions** - No public API to query skin size
- **Direct Manipulation** - Bypassing normal costume system for custom skins
- **Advanced Features** - Accessing properties not exposed publicly

## Risks

- **Breaking Changes** - Internal APIs may change without notice
- **Undefined Behavior** - Using internals incorrectly can cause crashes
- **Compatibility** - May not work across different renderer versions

## Related

- [SVG Loading](./svg-loading.md) - Using internal SVG skin properties
- [Resource Management](resource-management.md) - Proper cleanup patterns

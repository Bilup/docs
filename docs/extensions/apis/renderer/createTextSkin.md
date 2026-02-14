---
title: renderer.createTextSkin()
---

# renderer.createTextSkin()

Creates a new SVG skin using the text bubble creator (like "Say" or "Think" bubbles).

## Syntax

```javascript
renderer.createTextSkin(type, text, pointsLeft)
```

## Parameters

### type
**Type:** `string`

The type of bubble: `'say'` or `'think'`.

### text
**Type:** `string`

The text content of the bubble.

### pointsLeft
**Type:** `boolean`

If `true`, the bubble tail points to the left. If `false`, it points to the right.

## Returns

**Type:** `number`

The ID of the new skin.

## Example

```javascript
const skinId = renderer.createTextSkin('say', 'Hello World!', true);
```

## See Also

- [updateTextSkin()](./updateTextSkin.md)
- [createSVGSkin()](./createSVGSkin.md)

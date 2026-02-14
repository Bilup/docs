---
title: renderer.updateTextSkin()
---

# renderer.updateTextSkin()

Updates an existing text bubble skin with new text or style.

## Syntax

```javascript
renderer.updateTextSkin(skinId, type, text, pointsLeft)
```

## Parameters

### skinId
**Type:** `number`

The ID of the skin to update.

### type
**Type:** `string`

The type of bubble: `'say'` or `'think'`.

### text
**Type:** `string`

The new text content.

### pointsLeft
**Type:** `boolean`

Direction of the bubble tail.

## Returns

**Type:** `void`

## Example

```javascript
renderer.updateTextSkin(skinId, 'think', 'Hmm...', false);
```

## See Also

- [createTextSkin()](createTextSkin.md)

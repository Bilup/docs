---
title: renderer.setBackgroundColor()
---

# renderer.setBackgroundColor()

Sets the background color of the stage.

## Syntax

```javascript
renderer.setBackgroundColor(red, green, blue, alpha)
```

## Parameters

### red, green, blue
**Type:** `number`

Color components (0-1). Note: These are normalized 0-1, not 0-255.

### alpha
**Type:** `number` (optional)

Alpha/opacity (0-1). Default is 1.

## Returns

**Type:** `void`

## Example

```javascript
// Set background to bright red
renderer.setBackgroundColor(1, 0, 0);
```

## See Also

- [draw()](./draw.md)

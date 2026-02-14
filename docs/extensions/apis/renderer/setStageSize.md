---
title: renderer.setStageSize()
---

# renderer.setStageSize()

Sets the logical coordinate system of the stage.

## Syntax

```javascript
renderer.setStageSize(xLeft, xRight, yBottom, yTop)
```

## Parameters

### xLeft, xRight
**Type:** `number`

X-axis boundaries. Standard Scratch is -240 to 240.

### yBottom, yTop
**Type:** `number`

Y-axis boundaries. Standard Scratch is -180 to 180.

## Returns

**Type:** `void`

## Example

```javascript
// Set to standard Scratch size
renderer.setStageSize(-240, 240, -180, 180);
```

## See Also

- [resize()](./resize.md)


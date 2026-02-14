---
title: renderer.requestSnapshot()
---

# renderer.requestSnapshot()

Requests a snapshot of the current stage content.

## Syntax

```javascript
renderer.requestSnapshot(callback)
```

## Parameters

### callback
**Type:** `function`

Function called with the snapshot data URL. Signature: `(dataUrl) => void`.

## Returns

**Type:** `void`

## Example

```javascript
renderer.requestSnapshot(dataUrl => {
  console.log("Snapshot taken:", dataUrl);
  // dataUrl is a base64 encoded image string
});
```

## See Also

- [draw()](./draw.md)

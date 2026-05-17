---
title: renderer.createTextSkin()
---

# renderer.createTextSkin()

使用文本气泡创建器创建新的 SVG 造型（如"说"或"思考"气泡）。

## 语法

```javascript
renderer.createTextSkin(type, text, pointsLeft)
```

## 参数

### type
**类型:** `string`

气泡类型：`'say'` 或 `'think'`。

### text
**类型:** `string`

气泡的文本内容。

### pointsLeft
**类型:** `boolean`

如果为 `true`，气泡尾巴指向左侧。如果为 `false`，指向右侧。

## 返回值

**类型:** `number`

新造型的 ID。

## 示例

```javascript
const skinId = renderer.createTextSkin('say', 'Hello World!', true);
```

## 另请参阅

- [updateTextSkin()](./updateTextSkin.md)
- [createSVGSkin()](./createSVGSkin.md)
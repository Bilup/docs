---
title: renderer.updateTextSkin()
---

# renderer.updateTextSkin()

用新文本或样式更新现有的文本气泡造型。

## 语法

```javascript
renderer.updateTextSkin(skinId, type, text, pointsLeft)
```

## 参数

### skinId
**类型:** `number`

要更新的造型的 ID。

### type
**类型:** `string`

气泡类型：`'say'` 或 `'think'`。

### text
**类型:** `string`

新的文本内容。

### pointsLeft
**类型:** `boolean`

气泡尾巴的方向。

## 返回值

**类型:** `void`

## 示例

```javascript
renderer.updateTextSkin(skinId, 'think', 'Hmm...', false);
```

## 另请参阅

- [createTextSkin()](createTextSkin.md)
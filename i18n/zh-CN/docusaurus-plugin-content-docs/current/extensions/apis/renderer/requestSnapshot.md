---
title: renderer.requestSnapshot()
---

# renderer.requestSnapshot()

请求当前舞台内容的快照。

## 语法

```javascript
renderer.requestSnapshot(callback)
```

## 参数

### callback
**类型:** `function`

使用快照数据 URL 调用的函数。签名: `(dataUrl) => void`。

## 返回值

**类型:** `void`

## 示例

```javascript
renderer.requestSnapshot(dataUrl => {
  console.log("Snapshot taken:", dataUrl);
  // dataUrl 是 base64 编码的图像字符串
});
```

## 另请参阅

- [draw()](./draw.md)
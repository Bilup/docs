---
title: 编辑器集成
sidebar_position: 7
---

# 编辑器集成

Bilup 编辑器可以将当前项目直接交给打包器，因此您可以在一步之内从编辑到打包构建，而无需保存和重新上传文件。在底层，这是编辑器和打包器之间的一次小型 `postMessage` 握手，本文档为工具开发者记录了它。

## 握手

1. 编辑器在 `https://packager.bilup.org/?import_from=<编辑器来源>` 打开打包器。
2. 打包器向编辑器回传 `{ p4: { type: 'ready-for-import' } }`。
3. 编辑器回复 `{ p4: { type: 'start-import' } }`，这样打包器可以显示加载状态。
4. 编辑器导出项目并发送 `{ p4: { type: 'finish-import', data, name } }`，传输 SB3 `ArrayBuffer`。
5. 如果导出失败，编辑器改为发送 `{ p4: { type: 'cancel-import' } }`。

每条消息都包裹在一个 `p4` 对象中。

## finish-import

```js
source.postMessage({
  p4: {
    type: 'finish-import',
    data: buffer,        // SB3 ArrayBuffer
    name: 'My Project.sb3'
  }
}, origin, [buffer]);    // buffer 被转移，而不是复制
```

## 备注

- 编辑器只处理来源为 `https://packager.bilup.org` 的消息。
- SB3 用 `vm.saveProjectSb3('arraybuffer')` 生成。
- 文件名是当前项目标题加 `.sb3` 后缀。

## 另请参阅

- [打包器概览](/packager/overview)

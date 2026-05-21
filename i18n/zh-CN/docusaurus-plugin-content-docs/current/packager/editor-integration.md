---
title: 编辑器集成
---

# 编辑器集成

Bilup 编辑器可以通过 `postMessage` 将当前项目发送到打包器。这使得从编辑到打包的一键流程成为可能。

## 流程概述

1. 编辑器打开打包器：`https://packager.bilup.org/?import_from=ORIGIN`
2. 打包器发出就绪信号：`{ p4: { type: 'ready-for-import' } }`
3. 编辑器回复：`{ p4: { type: 'start-import' } }`
4. 编辑器发送项目数据和名称：`{ p4: { type: 'finish-import', data, name } }`
5. 出现错误时，编辑器发送：`{ p4: { type: 'cancel-import' } }`

## 消息类型

### ready-for-import(打包器 → 编辑器)
表示打包器已准备好接收项目数据。

### start-import(编辑器 → 打包器)
告诉打包器显示加载状态并准备接收数据。

### finish-import(编辑器 → 打包器)
包含 SB3 `ArrayBuffer` 和文件名：

```js
source.postMessage({
  p4: {
    type: 'finish-import',
    data: buffer, // ArrayBuffer
    name: 'project.sb3'
  }
}, origin, [buffer]); // 传输
```

### cancel-import(编辑器 → 打包器)
如果编辑器导出项目失败，则发送此消息。

## 注意事项
- 编辑器仅响应来自 `https://packager.bilup.org/` 的消息
- 编辑器通过 `vm.saveProjectSb3('arraybuffer')` 导出 SB3
- 文件名源自当前项目标题

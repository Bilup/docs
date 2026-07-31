---
title: 保持兼容性
sidebar_position: 8
---

# 保持兼容性

一旦人们用您的扩展构建项目，以错误的方式更改它实际上会**损坏那些项目**：积木消失、参数移位、值破坏。下面的规则关于不做那样的事。

根本原因是项目保存的方式。保存的项目通过内部标识符（扩展 ID、积木操作码和参数名）引用您的积木，而不是它们的标签。重命名这些标识符中的任何一个，保存的项目就无法再找到积木。

## 绝不能更改的内容

### 扩展 ID

```js
getInfo() {
  return {
    id: 'fetch', // 绝不能更改
    // ...
  };
}
```

### 积木操作码和类型

不要重命名操作码或改变它的用途。不要更改积木的 `blockType`，有两个安全例外：`REPORTER` 到 `BOOLEAN`，以及 `HAT` 到 `EVENT`。其他任何更改（例如 `HAT` 到 `BOOLEAN`）都会破坏项目。要替换积木，添加一个新积木并隐藏旧的（见下文）。

### 移除积木

永远不要删除项目可能使用的积木。用 `hideFromPalette: true` 隐藏它。现有的副本继续工作；它只是不再出现在积木区中。

### 参数标识符和类型

参数的键（`text: 'block [INPUT]'` 中的 `INPUT`）及其 `type` 不得更改或移除。

### 向现有积木添加参数

不要向已经存在的积木添加参数。而是添加一个新积木，并用新积木重新实现旧的：

```js
blocks: [
  {
    blockType: Scratch.BlockType.REPORTER,
    opcode: 'oldBlock',
    text: 'old [INPUT1]',
    arguments: { INPUT1: { /* ... */ } },
    hideFromPalette: true
  },
  {
    blockType: Scratch.BlockType.REPORTER,
    opcode: 'newBlock',
    text: 'new [INPUT1] [INPUT2]',
    arguments: { INPUT1: { /* ... */ }, INPUT2: { /* ... */ } }
  }
]
```

```js
oldBlock(args) {
  return this.newBlock({ ...args, INPUT2: 'Default value' });
}
newBlock(args) {
  // ...
}
```

### `isTerminal`

如果 `COMMAND` 积木还没有 `isTerminal: true`，不要添加它。在下面连接了积木的现有项目会损坏。请添加一个新积木。

### 菜单上的 `acceptReporters`

永远不要在字段（`acceptReporters: false`）和输入（`acceptReporters: true`）之间切换菜单。它会损坏项目。创建新菜单和积木。

### 行为

琐碎的 bug 修复通常没问题。显著改变积木的作用可能破坏依赖旧行为的项目。唯一可靠的保障是彻底测试。

## 可以安全更改的内容

扩展元数据：`name`、`docsURI`、`color1`/`color2`/`color3`、`menuIconURI`、`blockIconURI`。

每个积木和参数：

- `text`，只要它仍然包含相同的参数（重新排序没问题）
- `disableMonitor`（打开它隐藏复选框但保留现有监视器）
- `hideFromPalette`
- `filter`（添加它从积木区隐藏积木但保留现有副本）
- `defaultValue`
- 图像输入上的 `dataURI` 和 `flipRTL`

对于菜单，您可以自由更改项目 `text`，但更改项目的 `value` 有风险。添加菜单项目总是安全的；移除它们是危险的。

## 当您确实必须破坏兼容性时

有时没有兼容的路径。在这种情况下，**制作一个带新 ID 的全新扩展**，并让旧的原样不动。如果 `fetch` 需要重新设计，发布 `fetch2` 并保持 `fetch` 工作。

## 下一步

接下来，C 形积木：[自定义循环和条件](/building-extensions/custom-c-blocks)。

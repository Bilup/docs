---
slug: /development/globals
hide_table_of_contents: true
---

# 全局变量

为方便起见，可以使用开发者控制台访问的全局变量。

这些不能在沙盒化自定义扩展中使用，也不应该在非沙盒化自定义扩展中使用。

## `vm`

指 [scratch-vm](https://github.com/Bilup/scratch-vm) 实例。

## `ScratchBlocks`

指 *真实的* [scratch-blocks](https://github.com/Bilup/scratch-blocks)（`Blockly` 上只有很少的东西）。仅在打开编辑器后可用。

## `paper`

指 [paper.js](https://github.com/LLK/paper.js) 实例。仅在打开造型编辑器后可用。

## `ReduxStore`

指 scratch-gui 使用的内部 redux store。

使用 `ReduxStore.getState()` 获取状态，并使用 `ReduxStore.dispatch({ type: "..." })` 派发事件
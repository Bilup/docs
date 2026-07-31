---
title: 积木注册
sidebar_position: 5
---

积木以两种方式进入积木区：内置分类在运行时启动时作为内部积木包注册，扩展通过将 `getInfo()` 描述符变成真正的 scratch-blocks 的同一流水线注册它们的积木。本页描述这在 `scratch-vm/src/engine/runtime.js` 中如何发生。

## 内置积木包

核心分类（运动、外观、声音、事件、控制、侦测、运算、变量和自制积木）是 `scratch-vm/src/blocks/scratch3_*.js` 中的普通类。构造时，运行时调用 `_registerBlockPackages()`，它实例化每个包并从中收集三样东西：

- `getPrimitives()`：操作码到实现函数的映射。这些存储在 `runtime._primitives` 中，按操作码键控（例如 `motion_movesteps`），解释器调用它们。
- `getHats()`：帽子积木的元数据（例如帽子是否重启现有线程），存储在 `runtime._hats` 中。
- `getMonitored()`：哪些报告积木可以显示为舞台监视器，合并到 `runtime.monitorBlockInfo` 中。

每个包也通过 `compilerRegisterExtension(name, object)` 注册给编译器，它作为 `ext_<name>` 附加到运行时，使编译代码可以触及它。

一个操作码是分类名和积木名用下划线连接，如 `looks_sayforsecs`。积木区的形状、标签和输入来自 `scratch-blocks` 包中的 scratch-blocks 定义；VM 侧只提供操作码和它的行为。

## 扩展积木

扩展不编辑那些文件。它们在 `getInfo()` 中描述自己的积木，并用 `Scratch.extensions.register` 注册（请参阅[扩展 API](/api-reference/extension-api)）。扩展管理器运行 `getInfo()` 并将结果交给运行时的 `_registerExtensionPrimitives(extensionInfo)`，它：

1. 从扩展的 `id`、`name`、颜色（`color1`/`color2`/`color3`，回退到默认值）和图标构建一个分类描述符，并将其推入 `runtime._blockInfo`。
2. 通过 `_convertForScratchBlocks` 转换每个积木描述符来填充分类，该函数将 `text`、`blockType` 和 `arguments` 变成编辑器需要的 scratch-blocks XML。
3. 注册任何自定义字段类型，为每个发出 `EXTENSION_FIELD_ADDED`。
4. 用完成的分类发出 `EXTENSION_ADDED`，让 GUI 将其添加到积木区。

重新加载扩展的积木会调用 `_refreshExtensionPrimitives`，它重建分类并发出 `BLOCKSINFO_UPDATE`。移除一个会调用 `_unregisterExtensionPrimitives` 并发出 `EXTENSION_REMOVED`。请参阅[事件](/api-reference/events)。

## 积木描述符

`getInfo()` 的 `blocks` 数组中的每个条目看起来像这样：

```js
{
    opcode: 'doThing',
    blockType: Scratch.BlockType.COMMAND,
    text: 'do thing with [INPUT]',
    arguments: {
        INPUT: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: 'hello'
        }
    }
}
```

运行时用扩展 ID 给操作码加命名空间，因此扩展 `myext` 上的 `doThing` 变成操作码 `myext_doThing`，并在积木运行时调用扩展实例的 `doThing` 方法。`text` 中的占位符（如 `[INPUT]`）与 `arguments` 中的键匹配。

## 编译积木

解释器路径直接使用积木方法。对于想让积木通过 Bilup 的 JavaScript 编译器运行的扩展，`vm.exports.compiler.register(extensionId, blocks)` 为每个操作码注册一个带 `type`（`any`、`number`、`numberOrNaN`、`string`、`boolean`、`command` 之一）和一个 `compile` 函数的描述符。请参阅[编译扩展](/building-extensions/compiled/overview)。

## 另请参阅

- [扩展 API](/api-reference/extension-api)
- [线程](/api-reference/threads) 了解注册积木如何执行
- [事件](/api-reference/events)
- [构建自定义 C 积木](/building-extensions/custom-c-blocks)

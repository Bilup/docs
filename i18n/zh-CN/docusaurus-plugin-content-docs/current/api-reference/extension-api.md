---
title: 扩展 API
sidebar_position: 4
---

扩展向积木区添加一个积木分类。本页是面向作者的运行时 API 参考：全局 `Scratch` 对象、`BlockType` 和 `ArgumentType` 枚举，以及注册入口点。逐步指南请从[构建扩展](/building-extensions/introduction)开始。

扩展是一个带 `getInfo()` 方法的类，它描述扩展的积木，每个积木对应一个方法。它用 `Scratch.extensions.register` 注册自己。

```js
class MyExtension {
    getInfo () {
        return {
            id: 'myextension',
            name: 'My Extension',
            color1: '#ff4c4c',
            blocks: [
                {
                    opcode: 'addTwo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'add [A] and [B]',
                    arguments: {
                        A: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},
                        B: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2}
                    }
                }
            ]
        };
    }
    addTwo (args) {
        return Scratch.Cast.toNumber(args.A) + Scratch.Cast.toNumber(args.B);
    }
}
Scratch.extensions.register(new MyExtension());
```

## `Scratch` 对象

对于非沙箱扩展，`Scratch` 是一个全局。它的始终存在成员来自 `scratch-vm/src/extension-support/tw-extension-api-common.js`：

- `Scratch.ArgumentType`、`Scratch.BlockType`、`Scratch.TargetType`、`Scratch.BlockShape`：下面的枚举。
- `Scratch.Cast`：积木用来规范化输入的[类型强制转换辅助工具](/api-reference/utilities)。请使用这些而不是原始的 `Number(...)`/`String(...)`。

非沙箱扩展获得更多，当脚本运行时每个扩展都会添加（`tw-unsandboxed-extension-runner.js`）：

- `Scratch.extensions.register(extensionObject)`：注册您的扩展。`Scratch.extensions.unsandboxed` 在此环境中为 `true`。
- `Scratch.vm`：实时的 [`VirtualMachine`](/api-reference/vm-api)。
- `Scratch.renderer`：附加的渲染器。
- `Scratch.translate`：用于本地化字符串的 format-message 辅助工具。
- 权限检查（每个返回 `Promise<boolean>`）：`Scratch.canFetch(url)`、`Scratch.canOpenWindow(url)`、`Scratch.canRedirect(url)`、`Scratch.canDownload(url, name)`、`Scratch.canEmbed(url)`、`Scratch.canRecordAudio()`、`Scratch.canRecordVideo()`、`Scratch.canReadClipboard()`、`Scratch.canNotify()`、`Scratch.canGeolocate()`。
- 受守卫的操作（每个先检查匹配的权限，然后行动）：`Scratch.fetch(url, options)`、`Scratch.download(url, file)`、`Scratch.openWindow(url, features)`、`Scratch.redirect(url)`。

总是通过这些辅助工具路由网络和窗口访问。它们询问 VM 的安全管理器，这是用户保持对扩展可以触及范围控制的方式。请参阅[沙箱与非沙箱](/building-extensions/unsandboxed)。

## BlockType

来自 `extension-support/block-type.js`：

| 值 | 含义 |
| --- | --- |
| `BlockType.COMMAND` (`'command'`) | 运行操作的堆叠积木。 |
| `BlockType.REPORTER` (`'reporter'`) | 返回数字或字符串。 |
| `BlockType.BOOLEAN` (`'Boolean'`) | 返回真/假的六边形报告积木。 |
| `BlockType.HAT` (`'hat'`) | 当条件变为真时启动堆栈。 |
| `BlockType.EVENT` (`'event'`) | 无谓词的帽子；在匹配事件触发时运行。 |
| `BlockType.CONDITIONAL` (`'conditional'`) | C 积木；可以运行一个分支，然后继续。 |
| `BlockType.LOOP` (`'loop'`) | C 积木；每次分支运行后重新求值。 |
| `BlockType.BUTTON` (`'button'`) | 积木区按钮，不是可运行的积木。 |
| `BlockType.LABEL` (`'label'`) | 积木区中的文本标签，不是积木。 |
| `BlockType.XML` (`'xml'`) | 任意 scratch-blocks XML。 |

## ArgumentType

来自 `extension-support/argument-type.js`。该类型控制参数显示哪个输入编辑器：

| 值 | 显示的输入 |
| --- | --- |
| `ArgumentType.NUMBER` (`'number'`) | 数字字段。 |
| `ArgumentType.STRING` (`'string'`) | 文本字段。 |
| `ArgumentType.BOOLEAN` (`'Boolean'`) | 六边形布尔凹槽（无默认值）。 |
| `ArgumentType.ANGLE` (`'angle'`) | 带角度选择器的数字字段。 |
| `ArgumentType.COLOR` (`'color'`) | 颜色选择器。 |
| `ArgumentType.MATRIX` (`'matrix'`) | 5x5 矩阵字段。 |
| `ArgumentType.NOTE` (`'note'`) | 钢琴音符选择器。 |
| `ArgumentType.IMAGE` (`'image'`) | 积木标签中的内联图像（不是真正的输入）。 |
| `ArgumentType.COSTUME` (`'costume'`) | 当前目标造型的下拉框。 |
| `ArgumentType.SOUND` (`'sound'`) | 当前目标声音的下拉框。 |

在 `getInfo` 中，每个参数条目接受 `type`、可选的 `defaultValue` 和可选的 `menu`（扩展的 `menus` 中定义的菜单名称）。

## TargetType

来自 `extension-support/target-type.js`：`TargetType.SPRITE` (`'sprite'`) 和 `TargetType.STAGE` (`'stage'`)。由筛选字段使用，例如积木的 `filter` 数组。

## 积木方法

每个积木的 `opcode` 映射到扩展实例上的一个方法。它接收 `(args, util)`：

- `args`：一个按参数名键控的对象，持有当前输入值（用 `Scratch.Cast` 强制转换）。
- `util`：积木工具，包括 `util.target`（运行目标）、`util.thread`，以及用于 C 积木的 `util.startBranch(n, isLoop)`。请参阅[线程](/api-reference/threads)和[自定义 C 积木](/building-extensions/custom-c-blocks)。

报告积木返回它的值。命令积木不返回任何内容。返回一个 `Promise` 使积木异步。请参阅[异步性](/building-extensions/async)。

## 另请参阅

- [构建扩展：你好世界](/building-extensions/hello-world)
- [积木注册](/api-reference/block-registration) 了解 `getInfo` 如何变成真正的积木
- [实用工具](/api-reference/utilities) 了解 `Cast` 和朋友们
- [扩展的 Scratch API](/building-extensions/apis/scratch-api)

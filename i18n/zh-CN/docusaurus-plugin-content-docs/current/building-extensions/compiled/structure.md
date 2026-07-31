---
title: 扩展结构
sidebar_position: 2
---

# 扩展结构

编译扩展是一个普通扩展加上一次 `Scratch.vm.exports.compiler.register` 调用。本页介绍该调用的形状。[下一页](/building-extensions/compiled/first-extension)构建一个完整示例。

## 骨架

```js
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  const { vm, BlockType, ArgumentType } = Scratch;
  const { compiler } = vm.exports;
  const T = compiler.types; // ANY, NUMBER, NUMBER_OR_NAN, STRING, BOOLEAN, COMMAND

  // 1. 告诉编译器如何为每个积木生成 JavaScript。
  compiler.register('mathutils', {
    square: {
      type: T.NUMBER,
      compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
    }
  });

  // 2. 正常注册扩展，每个积木带一个回退 func。
  class MathUtils {
    getInfo() {
      return {
        id: 'mathutils',
        name: 'Math Utils',
        blocks: [
          {
            opcode: 'square',
            blockType: BlockType.REPORTER,
            text: 'square of [NUMBER]',
            arguments: { NUMBER: { type: ArgumentType.NUMBER, defaultValue: 5 } }
          }
        ]
      };
    }
    // 解释器回退：积木未编译时运行。
    square(args) {
      return Scratch.Cast.toNumber(args.NUMBER) ** 2;
    }
  }
  Scratch.extensions.register(new MathUtils());
})(Scratch);
```

这里发生两次独立的注册。`compiler.register` 教编译器；`Scratch.extensions.register` 将积木添加到积木区并提供解释器回退。积木的 `opcode`（`square`）和扩展 `id`（`mathutils`）将它们联系在一起：在内部，编译器条目以 `mathutils_square` 为键，这正是积木的完整操作码。

## compiler.register(extensionId, blocks)

- `extensionId`：您扩展的 `id`，与您在 `getInfo` 中传递的相同字符串。
- `blocks`：将每个积木的 `opcode` 映射到描述符的对象。

每个描述符具有：

| 字段 | 描述 |
|:--|:--|
| `type` | `compiler.types` 之一。是积木产生的值的类型（堆叠积木为 `COMMAND`）。 |
| `compile` | 一个为积木返回**JavaScript 源字符串**的函数。 |

`compiler.types`：

| 类型 | 用于 |
|:--|:--|
| `NUMBER` | 总是产生数字的报告积木。 |
| `NUMBER_OR_NAN` | 产生可能为 `NaN` 的数字的报告积木。 |
| `STRING` | 产生字符串的报告积木。 |
| `BOOLEAN` | 布尔报告积木。 |
| `ANY` | 类型事先不知道的报告积木。 |
| `COMMAND` | 运行操作且不返回任何内容的堆叠积木。 |

选择特定类型帮助编译器在下游跳过冗余转换，因此请选择您的积木真正保证的最窄类型。

## 编译上下文

`compile` 接收一个对象：

```js
compile: ({ input, field, mutation, runtime, target, stage }) => `...`
```

| 属性 | 它给您什么 |
|:--|:--|
| `input(name)` | 输入 `name` 的 JavaScript 源，转换为"any"。 |
| `input.number(name)` | 转换为数字的输入源。 |
| `input.string(name)` | 转换为字符串的输入源。 |
| `input.boolean(name)` | 转换为布尔值的输入源。 |
| `input.numberOrNaN(name)` | 转换为可能为 `NaN` 的数字的输入源。 |
| `input.raw(name)` | 无转换的输入源。对于字面量，这是裸值。 |
| `field(name)` | 字段 `name` 的值，已 JSON 编码（作为字符串字面量放入源是安全的）。 |
| `mutation` | 积木的 mutation 对象（用于可变参数积木）。 |
| `runtime`、`target`、`stage` | 指代生成代码中运行时、当前目标和舞台的变量名（作为字符串）。用它们接触引擎状态。 |

关键的思维模型：`compile` 在编译时运行并返回**文本**。`input.*` 辅助工具返回文本（一个 JavaScript 表达式），您通过字符串插值组装更大的表达式。您返回的内容被拼接到编译脚本中并在运行时执行。

## 真实的内置示例

Bilup 自己的运算积木正是以这种方式注册的。几个，直接来自引擎：

```js
// 数字结果
power:   ({ input: i }) => `Math.pow(${i.number('A')}, ${i.number('B')})`,
clamp:   ({ input: i }) => `Math.min(Math.max(${i.number('A')}, ${i.number('B')}), ${i.number('C')})`,

// 布尔结果
notequals: ({ input: i }) => `(${i.string('A')} !== ${i.string('B')})`,
starts:    ({ input: i }) => `(${i.string('A')}).startsWith(${i.string('B')})`,

// 字符串结果
replaceall: ({ input: i }) => `(${i.string('A')}).replaceAll(${i.string('C')}, ${i.string('B')})`,

// 接触运行时状态
stagewidth: ({ runtime }) => `${runtime}.stageWidth`,

// 无输入
pi: () => 'Math.PI',
```

`compile` 必须返回一个字符串。在优先级可能咬到您时用括号包裹表达式：输入可能展开为类似 `a + b` 的东西，而 `$(i.number('A')) ** 2` 在输入周围没有括号会解析错误。

## 回退函数

积木仍然需要类中的普通方法（上面的 `square(args)`）。它在积木未编译时运行：当报告积木供给监视器时、编译器被禁用时，或任何没有 Bilup 编译器的环境中。保持回退行为与编译版本相同，使结果永远不会不同。

## 下一步

端到端[构建第一个编译扩展](/building-extensions/compiled/first-extension)。

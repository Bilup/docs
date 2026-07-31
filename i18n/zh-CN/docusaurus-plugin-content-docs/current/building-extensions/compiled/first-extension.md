---
title: 您的第一个编译扩展
sidebar_position: 4
---

# 您的第一个编译扩展

让我们用受支持的 [`compiler.register` API](/building-extensions/compiled/structure) 构建一个带两个编译报告积木 `square` 和 `power` 的小"Math Utils"扩展。

## 样板

编译扩展必须以非沙箱方式运行，因此从检查开始并取出您需要的部分：

```js
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Math Utils must run unsandboxed');
  }

  const { vm, BlockType, ArgumentType } = Scratch;
  const { compiler } = vm.exports;
  const T = compiler.types;
```

## 注册编译实现

每个条目是 `type` 加一个返回 JavaScript 源的 `compile` 函数。两个报告积木都产生数字，因此它们的类型是 `T.NUMBER`：

```js
  compiler.register('mathutils', {
    square: {
      type: T.NUMBER,
      compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
    },
    power: {
      type: T.NUMBER,
      compile: ({ input }) => `Math.pow(${input.number('BASE')}, ${input.number('EXPONENT')})`
    }
  });
```

`input.number('NUMBER')` 展开为一个求值 `NUMBER` 输入并将其强制转换为数字的 JavaScript 表达式。`square` 周围的括号很重要：`NUMBER` 可能展开为类似 `a + b` 的东西，而 `a + b ** 2` 会在 `+` 之前应用 `**`。

## 注册带回退的积木

现在是普通的扩展。`opcode` 必须与您注册的键匹配，每个积木获得一个为未编译运行产生相同结果的普通方法：

```js
  class MathUtils {
    getInfo() {
      return {
        id: 'mathutils',
        name: 'Math Utils',
        color1: '#4C97FF',
        blocks: [
          {
            opcode: 'square',
            blockType: BlockType.REPORTER,
            text: 'square of [NUMBER]',
            arguments: {
              NUMBER: { type: ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: 'power',
            blockType: BlockType.REPORTER,
            text: '[BASE] to the power of [EXPONENT]',
            arguments: {
              BASE: { type: ArgumentType.NUMBER, defaultValue: 2 },
              EXPONENT: { type: ArgumentType.NUMBER, defaultValue: 3 }
            }
          }
        ]
      };
    }

    square(args) {
      return Scratch.Cast.toNumber(args.NUMBER) ** 2;
    }
    power(args) {
      return Math.pow(Scratch.Cast.toNumber(args.BASE), Scratch.Cast.toNumber(args.EXPONENT));
    }
  }

  Scratch.extensions.register(new MathUtils());
})(Scratch);
```

这就是完整的扩展。

## 测试它

1. 在编辑器中以非沙箱方式加载它（从 `http://localhost:8000/` 或使用"不进入沙箱运行"选项；请参阅[非沙箱扩展](/building-extensions/unsandboxed)）。
2. 使用 `square of (5)` 并确认它报告 `25`。
3. 给它不同类型的输入：字面量、变量和嵌套报告积木，如 `square of ((3 + 2))`。所有都应该工作，因为 `input.number` 编译输入产生的任何表达式。
4. 检查回退：将 `square of` 报告积木作为监视器放在舞台上（点击它的复选框）。监视器以未编译方式运行，因此这锻炼了 `square(args)` 方法。值应该匹配。

保持回退和编译版本同步。如果它们可能不一致，项目会因编译器是否开启而表现不同，这是一个难以追踪的混乱 bug。

## 下一步

[高级编译技巧](/building-extensions/compiled/advanced)：命令积木、可变参数输入、原始输入和接触运行时状态。

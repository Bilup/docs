---
title: 自定义 C 积木
sidebar_position: 9
---

# 自定义 C 积木

C 积木是包裹其他积木的那些：`如果`、`如果/否则`、`重复执行`、`重复执行无限次`。Bilup 让扩展定义自己的 C 积木。

::::warning
自定义 C 积木只在[非沙箱扩展](/building-extensions/unsandboxed)中工作。
::::

## 两种积木类型

- 用于重复积木的 `Scratch.BlockType.LOOP`。它恰好有一个分支，因此 `branchCount` 是隐含的。
- 用于 `如果`/`否则` 风格积木的 `Scratch.BlockType.CONDITIONAL`。将 `branchCount` 设置为它控制的分支数。

对没有底部连接的积木（如 `重复执行无限次`）使用 `isTerminal: true`。

## 驱动分支

有两种方式控制运行哪个分支以及是否循环。

**从积木函数返回一个值：**

- `CONDITIONAL`：返回要运行的分支的从 1 开始的索引，或 `0` / 假值表示不运行任何分支。
- `LOOP`：返回 `true` 运行分支并再次循环，或假值停止。

**或显式调用 `util.startBranch(branchIndex, isLoop)`：**

- `branchIndex`（数字）：要运行的从 1 开始的分支。第一个分支是 `1`。
- `isLoop`（布尔值）：如果为 `true`，分支完成后再次调用积木函数。

## 示例：如果 / 否则

```js
class ConditionalExtension {
  getInfo() {
    return {
      id: 'conditionalexample',
      name: 'Conditionals',
      blocks: [
        {
          opcode: 'myIfElse',
          text: ['if [CONDITION] then', 'else'],
          blockType: Scratch.BlockType.CONDITIONAL,
          branchCount: 2,
          arguments: {
            CONDITION: { type: Scratch.ArgumentType.BOOLEAN }
          }
        }
      ]
    };
  }

  myIfElse(args, util) {
    if (args.CONDITION) {
      util.startBranch(1); // "如果" 分支
    } else {
      util.startBranch(2); // "否则" 分支
    }
  }
}
Scratch.extensions.register(new ConditionalExtension());
```

用返回风格编写的相同积木：

```js
myIfElse(args) {
  return args.CONDITION ? 1 : 2; // 从 1 开始的分支索引
}
```

注意 `text` 是一个数组。对于多分支积木，每个字符串是一个分支上方的标签。

## 示例：循环

```js
class LoopExtension {
  getInfo() {
    return {
      id: 'loopexample',
      name: 'Loops',
      blocks: [
        {
          opcode: 'foreverLoop',
          text: 'run forever',
          blockType: Scratch.BlockType.LOOP,
          isTerminal: true // 下面没有连接
        },
        {
          opcode: 'repeatUntil',
          text: 'repeat until [CONDITION]',
          blockType: Scratch.BlockType.LOOP,
          arguments: {
            CONDITION: { type: Scratch.ArgumentType.BOOLEAN }
          }
        }
      ]
    };
  }

  foreverLoop(args, util) {
    util.startBranch(1, true); // 运行分支 1，然后循环
  }

  repeatUntil(args, util) {
    if (!args.CONDITION) {
      util.startBranch(1, true); // 条件为假：运行并再次循环
    }
    // 条件为真：什么都不做，循环结束
  }
}
Scratch.extensions.register(new LoopExtension());
```

计数 `重复执行` 使用返回风格和 `util.stackFrame` 来保持每次循环的状态：

```js
repeatTimes(args, util) {
  const times = Math.round(Scratch.Cast.toNumber(args.TIMES));
  if (typeof util.stackFrame.loopCounter === 'undefined') {
    util.stackFrame.loopCounter = times;
  }
  util.stackFrame.loopCounter--;
  return util.stackFrame.loopCounter >= 0; // true = 再次运行分支
}
```

`util.stackFrame` 是绑定到这个特定积木调用的暂存空间。它是存储循环计数器的正确位置，因为它在积木完成时被清除，并且不会与其他积木副本冲突。

## 要记住的事情

1. **分支从 1 开始。** 第一个分支是 `1`，不是 `0`。
2. **循环参数重新求值。** 在 `LOOP` 中，每次积木运行时都会再次读取输入，因此 `重复执行直到 [x = 5]` 会看到 `x` 的当前值。
3. **`startBranch` 让出。** 执行传递给分支；分支完成后（如果循环）再次调用您的函数。
4. **`isTerminal` 不是"停止"。** 它只是防止在下面连接积木。如果终止积木位于循环末尾，循环仍然继续，除非有东西停止线程。

## 下一步

接下来，一些[高级积木自定义](/building-extensions/advanced-block-customization)技巧。

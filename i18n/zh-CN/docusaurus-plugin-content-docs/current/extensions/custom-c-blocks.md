---
title: 自定义 C 积木
---

# 自定义 C 积木

Bilup 允许非沙盒化扩展创建类似于 Scratch 内置的 `if`、`repeat` 和 `forever` 积木的自定义 C 积木(循环和条件)。

> **⚠️ 要求：** 自定义 C 积木仅在**非沙盒化**扩展中工作。

## 定义 C 积木

要定义 C 积木，指定适当的 `blockType` 和(对于条件积木)`branchCount`。使用 `isTerminal` 表示底部不应有连接的积木(如 `forever`)。

### 积木定义

```javascript
{
  opcode: "myLoop",
  text: "repeat",
  blockType: Scratch.BlockType.LOOP
}
```

### 支持的积木类型

- `Scratch.BlockType.LOOP` — 用于重复积木。循环假定恰好有一个子分支；`branchCount` 是隐含的，不需要指定。
- `Scratch.BlockType.CONDITIONAL` — 用于 if/else 样式的积木。必须指定 `branchCount` 以指示积木控制多少个分支。

## 实现逻辑

有两种支持的方式来实现控制流：

- 从积木函数返回值。
  - 对于 `CONDITIONAL`：返回要运行的分支的基于 1 的索引，或返回 `0`/假值以不运行任何分支。
  - 对于 `LOOP`：返回 `true` 以重复，否则结束循环。
- 或者使用 `util.startBranch(branchIndex, isLoop)` 显式启动分支。

### util.startBranch(branchIndex, isLoop)

- `branchIndex` (number): 要运行的分支的基于 1 的索引。
- `isLoop` (boolean): 如果为 `true`，分支完成后将再次调用循环积木。

## 示例：If / Else

此示例使用显式分支控制重新创建标准的 `if-else` 积木。

```javascript
class ConditionalExtension {
  getInfo() {
    return {
      id: "conditionalexample",
      name: "Conditionals",
      blocks: [
        {
          opcode: "myIfElse",
          text: ["if [CONDITION] then", "else"],
          blockType: Scratch.BlockType.CONDITIONAL,
          branchCount: 2, // 两个分支：一个用于 'if'，一个用于 'else'
          arguments: {
            CONDITION: { type: Scratch.ArgumentType.BOOLEAN }
          }
        }
      ]
    };
  }

  myIfElse(args, util) {
    if (args.CONDITION) {
      // 运行第一个分支 (if)
      util.startBranch(1);
    } else {
      // 运行第二个分支 (else)
      util.startBranch(2);
    }
  }
}
Scratch.extensions.register(new ConditionalExtension());
```

或者，可以编写相同的积木以返回分支索引而不调用 `util.startBranch`：

```javascript
class ConditionalExtensionReturnStyle {
  getInfo() {
    return {
      id: "conditionalexample2",
      name: "Conditionals (return style)",
      blocks: [
        {
          opcode: "myIfElse",
          text: ["if [CONDITION] then", "else"],
          blockType: Scratch.BlockType.CONDITIONAL,
          branchCount: 2,
          arguments: {
            CONDITION: { type: Scratch.ArgumentType.BOOLEAN }
          }
        }
      ]
    };
  }

  myIfElse(args) {
    return args.CONDITION ? 1 : 2; // 基于 1 的分支索引
  }
}
Scratch.extensions.register(new ConditionalExtensionReturnStyle());
```

## 示例：循环

此示例创建一个 `repeat until` 循环和一个 `forever` 循环。

```javascript
class LoopExtension {
  getInfo() {
    return {
      id: "loopexample",
      name: "Loops",
      blocks: [
        {
          opcode: "foreverLoop",
          text: "run forever",
          blockType: Scratch.BlockType.LOOP,
          branchCount: 1,
          isTerminal: true // 底部没有积木连接
        },
        {
          opcode: "repeatUntil",
          text: "repeat until [CONDITION]",
          blockType: Scratch.BlockType.LOOP,
          branchCount: 1,
          arguments: {
            CONDITION: { type: Scratch.ArgumentType.BOOLEAN }
          }
        }
      ]
    };
  }

  foreverLoop(args, util) {
    // 启动分支 1 并循环 (true)
    util.startBranch(1, true);
  }

  repeatUntil(args, util) {
    // 检查条件
    if (!args.CONDITION) {
      // 如果为 false，运行分支 1 并再次循环
      util.startBranch(1, true);
    }
    // 如果为 true，不执行任何操作(循环结束)
  }
}
Scratch.extensions.register(new LoopExtension());
```

`repeat` 循环也可以通过在还有更多迭代时返回 `true` 来实现：

```javascript
class RepeatReturnStyle {
  getInfo() {
    return {
      id: "repeatreturn",
      name: "Repeat (return style)",
      blocks: [
        {
          opcode: "repeatTimes",
          text: "repeat [TIMES]",
          blockType: Scratch.BlockType.LOOP,
          arguments: {
            TIMES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
          }
        }
      ]
    };
  }

  repeatTimes(args, util) {
    const times = Math.round(Scratch.Cast.toNumber(args.TIMES));
    if (typeof util.stackFrame.loopCounter === "undefined") {
      util.stackFrame.loopCounter = times;
    }
    util.stackFrame.loopCounter--;
    return util.stackFrame.loopCounter >= 0; // true = 再次运行分支
  }
}
Scratch.extensions.register(new RepeatReturnStyle());
```

## 重要注意事项

1. **分支索引是基于 1 的**：第一个分支是 `1`。
2. **参数重新评估**：在循环中，参数每次积木运行时都会重新评估。
3. **产生**：`util.startBranch` 将执行权交给分支。分支完成后(如果是循环)，积木函数将再次被调用。
4. **终端积木**：对于结束堆栈的积木(如 `forever` 或 `stop all`)，设置 `isTerminal: true`。
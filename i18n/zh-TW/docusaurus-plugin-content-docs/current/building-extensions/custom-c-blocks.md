---
title: 自訂 C 積木
sidebar_position: 9
---

# 自訂 C 積木

C 積木是包裹其他積木的那些：`如果`、`如果/否則`、`重複執行`、`重複執行無限次`。Bilup 讓擴充功能定義自己的 C 積木。

::::warning
自訂 C 積木只在[非沙箱擴充功能](/building-extensions/unsandboxed)中工作。
::::

## 兩種積木型別

- 用於重複積木的 `Scratch.BlockType.LOOP`。它恰好有一個分支，因此 `branchCount` 是隱含的。
- 用於 `如果`/`否則` 風格積木的 `Scratch.BlockType.CONDITIONAL`。將 `branchCount` 設定為它控制的分支數。

對沒有底部連線的積木（如 `重複執行無限次`）使用 `isTerminal: true`。

## 驅動分支

有兩種方式控制執行哪個分支以及是否迴圈。

**從積木函式返回一個值：**

- `CONDITIONAL`：返回要執行的分支的從 1 開始的索引，或 `0` / 假值表示不執行任何分支。
- `LOOP`：返回 `true` 執行分支並再次迴圈，或假值停止。

**或顯式呼叫 `util.startBranch(branchIndex, isLoop)`：**

- `branchIndex`（數字）：要執行的從 1 開始的分支。第一個分支是 `1`。
- `isLoop`（布林值）：如果為 `true`，分支完成後再次呼叫積木函式。

## 示例：如果 / 否則

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
      util.startBranch(2); // "否則" 分支
    }
  }
}
Scratch.extensions.register(new ConditionalExtension());
```

用返回風格編寫的相同積木：

```js
myIfElse(args) {
  return args.CONDITION ? 1 : 2; // 從 1 開始的分支索引
}
```

注意 `text` 是一個數組。對於多分支積木，每個字串是一個分支上方的標籤。

## 示例：迴圈

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
          isTerminal: true // 下面沒有連線
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
    util.startBranch(1, true); // 執行分支 1，然後迴圈
  }

  repeatUntil(args, util) {
    if (!args.CONDITION) {
      util.startBranch(1, true); // 條件為假：執行並再次迴圈
    }
    // 條件為真：什麼都不做，迴圈結束
  }
}
Scratch.extensions.register(new LoopExtension());
```

計數 `重複執行` 使用返回風格和 `util.stackFrame` 來保持每次迴圈的狀態：

```js
repeatTimes(args, util) {
  const times = Math.round(Scratch.Cast.toNumber(args.TIMES));
  if (typeof util.stackFrame.loopCounter === 'undefined') {
    util.stackFrame.loopCounter = times;
  }
  util.stackFrame.loopCounter--;
  return util.stackFrame.loopCounter >= 0; // true = 再次執行分支
}
```

`util.stackFrame` 是繫結到這個特定積木呼叫的暫存空間。它是儲存迴圈計數器的正確位置，因為它在積木完成時被清除，並且不會與其他積木副本衝突。

## 要記住的事情

1. **分支從 1 開始。** 第一個分支是 `1`，不是 `0`。
2. **迴圈引數重新求值。** 在 `LOOP` 中，每次積木執行時都會再次讀取輸入，因此 `重複執行直到 [x = 5]` 會看到 `x` 的當前值。
3. **`startBranch` 讓出。** 執行傳遞給分支；分支完成後（如果迴圈）再次呼叫您的函式。
4. **`isTerminal` 不是"停止"。** 它只是防止在下面連線積木。如果終止積木位於迴圈末尾，迴圈仍然繼續，除非有東西停止執行緒。

## 下一步

接下來，一些[進階積木自訂](/building-extensions/advanced-block-customization)技巧。

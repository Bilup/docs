---
title: 擴充功能結構
sidebar_position: 2
---

# 擴充功能結構

編譯擴充功能是一個普通擴充功能加上一次 `Scratch.vm.exports.compiler.register` 呼叫。本頁介紹該呼叫的形狀。[下一頁](/building-extensions/compiled/first-extension)建置一個完整示例。

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

  // 1. 告訴編譯器如何為每個積木生成 JavaScript。
  compiler.register('mathutils', {
    square: {
      type: T.NUMBER,
      compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
    }
  });

  // 2. 正常註冊擴充功能，每個積木帶一個回退 func。
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
    // 直譯器回退：積木未編譯時執行。
    square(args) {
      return Scratch.Cast.toNumber(args.NUMBER) ** 2;
    }
  }
  Scratch.extensions.register(new MathUtils());
})(Scratch);
```

這裡發生兩次獨立的註冊。`compiler.register` 教編譯器；`Scratch.extensions.register` 將積木新增到積木區並提供直譯器回退。積木的 `opcode`（`square`）和擴充功能 `id`（`mathutils`）將它們聯絡在一起：在內部，編譯器條目以 `mathutils_square` 為鍵，這正是積木的完整操作碼。

## compiler.register(extensionId, blocks)

- `extensionId`：您擴充功能的 `id`，與您在 `getInfo` 中傳遞的相同字串。
- `blocks`：將每個積木的 `opcode` 對映到描述符的物件。

每個描述符具有：

| 欄位 | 描述 |
|:--|:--|
| `type` | `compiler.types` 之一。是積木產生的值的型別（堆疊積木為 `COMMAND`）。 |
| `compile` | 一個為積木返回**JavaScript 源字串**的函式。 |

`compiler.types`：

| 型別 | 用於 |
|:--|:--|
| `NUMBER` | 總是產生數字的報告積木。 |
| `NUMBER_OR_NAN` | 產生可能為 `NaN` 的數字的報告積木。 |
| `STRING` | 產生字串的報告積木。 |
| `BOOLEAN` | 布林報告積木。 |
| `ANY` | 型別事先不知道的報告積木。 |
| `COMMAND` | 執行操作且不返回任何內容的堆疊積木。 |

選擇特定型別幫助編譯器在下游跳過冗餘轉換，因此請選擇您的積木真正保證的最窄型別。

## 編譯上下文

`compile` 接收一個物件：

```js
compile: ({ input, field, mutation, runtime, target, stage }) => `...`
```

| 屬性 | 它給您什麼 |
|:--|:--|
| `input(name)` | 輸入 `name` 的 JavaScript 源，轉換為"any"。 |
| `input.number(name)` | 轉換為數字的輸入源。 |
| `input.string(name)` | 轉換為字串的輸入源。 |
| `input.boolean(name)` | 轉換為布林值的輸入源。 |
| `input.numberOrNaN(name)` | 轉換為可能為 `NaN` 的數字的輸入源。 |
| `input.raw(name)` | 無轉換的輸入源。對於字面量，這是裸值。 |
| `field(name)` | 欄位 `name` 的值，已 JSON 編碼（作為字串字面量放入源是安全的）。 |
| `mutation` | 積木的 mutation 物件（用於可變引數積木）。 |
| `runtime`、`target`、`stage` | 指代生成程式碼中執行時、當前目標和舞臺的變數名（作為字串）。用它們接觸引擎狀態。 |

關鍵的思維模型：`compile` 在編譯時執行並返回**文本**。`input.*` 輔助工具返回文本（一個 JavaScript 表示式），您透過字串插值組裝更大的表示式。您返回的內容被拼接到編譯指令碼中並在執行時執行。

## 真實的內建示例

Bilup 自己的運算積木正是以這種方式註冊的。幾個，直接來自引擎：

```js
// 數字結果
power:   ({ input: i }) => `Math.pow(${i.number('A')}, ${i.number('B')})`,
clamp:   ({ input: i }) => `Math.min(Math.max(${i.number('A')}, ${i.number('B')}), ${i.number('C')})`,

// 布林結果
notequals: ({ input: i }) => `(${i.string('A')} !== ${i.string('B')})`,
starts:    ({ input: i }) => `(${i.string('A')}).startsWith(${i.string('B')})`,

// 字串結果
replaceall: ({ input: i }) => `(${i.string('A')}).replaceAll(${i.string('C')}, ${i.string('B')})`,

// 接觸執行時狀態
stagewidth: ({ runtime }) => `${runtime}.stageWidth`,

// 無輸入
pi: () => 'Math.PI',
```

`compile` 必須返回一個字串。在優先順序可能咬到您時用括號包裹表示式：輸入可能展開為類似 `a + b` 的東西，而 `$(i.number('A')) ** 2` 在輸入周圍沒有括號會解析錯誤。

## 回退函式

積木仍然需要類中的普通方法（上面的 `square(args)`）。它在積木未編譯時執行：當報告積木供給監視器時、編譯器被停用時，或任何沒有 Bilup 編譯器的環境中。保持回退行為與編譯版本相同，使結果永遠不會不同。

## 下一步

端到端[建置第一個編譯擴充功能](/building-extensions/compiled/first-extension)。

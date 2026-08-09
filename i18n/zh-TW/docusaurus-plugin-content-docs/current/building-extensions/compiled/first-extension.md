---
title: 您的第一個編譯擴充功能
sidebar_position: 4
---

# 您的第一個編譯擴充功能

讓我們用受支援的 [`compiler.register` API](/building-extensions/compiled/structure) 建置一個帶兩個編譯報告積木 `square` 和 `power` 的小"Math Utils"擴充功能。

## 樣板

編譯擴充功能必須以非沙箱方式執行，因此從檢查開始並取出您需要的部分：

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

## 註冊編譯實現

每個條目是 `type` 加一個返回 JavaScript 源的 `compile` 函式。兩個報告積木都產生數字，因此它們的型別是 `T.NUMBER`：

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

`input.number('NUMBER')` 展開為一個求值 `NUMBER` 輸入並將其強制轉換為數字的 JavaScript 表示式。`square` 周圍的括號很重要：`NUMBER` 可能展開為類似 `a + b` 的東西，而 `a + b ** 2` 會在 `+` 之前應用 `**`。

## 註冊帶回退的積木

現在是普通的擴充功能。`opcode` 必須與您註冊的鍵匹配，每個積木獲得一個為未編譯執行產生相同結果的普通方法：

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

這就是完整的擴充功能。

## 測試它

1. 在編輯器中以非沙箱方式載入它（從 `http://localhost:8000/` 或使用"不進入沙箱執行"選項；請參閱[非沙箱擴充功能](/building-extensions/unsandboxed)）。
2. 使用 `square of (5)` 並確認它報告 `25`。
3. 給它不同型別的輸入：字面量、變數和巢狀報告積木，如 `square of ((3 + 2))`。所有都應該工作，因為 `input.number` 編譯輸入產生的任何表示式。
4. 檢查回退：將 `square of` 報告積木作為監視器放在舞臺上（點選它的核取方塊）。監視器以未編譯方式執行，因此這鍛鍊了 `square(args)` 方法。值應該匹配。

保持回退和編譯版本同步。如果它們可能不一致，專案會因編譯器是否開啟而表現不同，這是一個難以追蹤的混亂 bug。

## 下一步

[進階編譯技巧](/building-extensions/compiled/advanced)：命令積木、可變引數輸入、原始輸入和接觸執行時狀態。

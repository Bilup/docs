---
title: 事件和帽子
sidebar_position: 7
---

# 事件和帽子

事件積木和帽子積木都控制指令碼*何時*執行。它們看起來相似，但行為不同。本頁大部分內容需要[非沙箱擴充功能](/building-extensions/unsandboxed)；唯一的例外（邊緣啟用帽子）在末尾說明。

## 事件積木

事件積木響應外部事物執行指令碼："當旗子被點選"、"當角色被點選"。積木本身從不執行；它只是標記事件發生時啟動哪些指令碼堆疊。

::::warning
事件積木只在非沙箱擴充功能中受支援。
::::

這裡有一個"當按下空格鍵"事件積木（[下載](/example-extensions/unsandboxed/when-space-key-pressed.js)）：

```js
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) throw new Error('Must run unsandboxed');

  class WhenSpaceKeyPressed {
    getInfo() {
      return {
        id: 'eventexampleunsandboxed',
        name: 'Event Block Example',
        blocks: [
          {
            blockType: Scratch.BlockType.EVENT,
            opcode: 'whenSpacePressed',
            text: 'when space key pressed',
            isEdgeActivated: false // EVENT 積木的必需樣板
          }
        ]
      };
    }
    // 注意：whenSpacePressed 沒有函式。事件積木從不執行程式碼。
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      Scratch.vm.runtime.startHats('eventexampleunsandboxed_whenSpacePressed');
    }
  });

  Scratch.extensions.register(new WhenSpaceKeyPressed());
})(Scratch);
```

有兩件事很突出：

- `isEdgeActivated: false` 是事件積木的**必需樣板**。
- `whenSpacePressed` 操作碼沒有方法。您不為事件積木編寫程式碼。

您用 `startHats` 啟動事件積木下的指令碼。有兩種形式：

- 當您在積木**外部**（事件處理器、計時器、回呼）時，使用 `Scratch.vm.runtime.startHats(...)`
- 當您在**執行中的積木內部**時，使用 `util.startHats(...)`

::::warning
在執行中的積木內部使用 `Scratch.vm.runtime.startHats` 而不是 `util.startHats` 可能破壞指令碼執行。讓形式與您所在的位置匹配。
::::

`startHats` 的第一個引數是**完整**操作碼，`擴充功能id_操作碼`。上面是 `eventexampleunsandboxed_whenSpacePressed`。它啟動專案中每個頂部積木是該操作碼的指令碼。

您在這裡使用了 `keydown` 監聽器，但任何給您回呼的東西都有效：點選、`setInterval`、`fetch` 完成等。

## 按選單篩選

與其為每個鍵建一個單獨的積木，不如使用欄位選單，並將篩選器作為 `startHats` 的第二個引數傳遞（[下載](/example-extensions/unsandboxed/when-key-pressed.js)）：

```js
getInfo() {
  return {
    id: 'eventexample2unsandboxed',
    name: 'Event Block Example 2',
    blocks: [
      {
        blockType: Scratch.BlockType.EVENT,
        opcode: 'whenPressed',
        text: 'when [KEY] key pressed',
        isEdgeActivated: false,
        arguments: {
          KEY: { type: Scratch.ArgumentType.STRING, menu: 'key' }
        }
      }
    ],
    menus: {
      key: {
        acceptReporters: false, // 事件積木只支援欄位選單
        items: [
          { text: 'space', value: ' ' },
          'a', 'b', 'c'
        ]
      }
    }
  };
}
```

```js
document.addEventListener('keydown', (e) => {
  Scratch.vm.runtime.startHats('eventexample2unsandboxed_whenPressed', {
    KEY: e.key
  });
});
```

事件積木選單**必須是欄位選單**（`acceptReporters: false`）；您不能向它們放入報告積木。`startHats` 的第二個引數是一個物件，其鍵是引數名，值針對選單**值**（而不是顯示文本）匹配。只有欄位全部匹配的指令碼才被啟動。

## 按角色篩選

`startHats` 的第三個（最後一個）引數是一個目標。如果給定，只有該目標中的事件積木啟動。獲得目標的常見方式（[下載](/example-extensions/unsandboxed/when-key-pressed-stage.js)）：

- 舞臺用 `Scratch.vm.runtime.getTargetForStage()`
- 命名角色用 `Scratch.vm.runtime.getSpriteTargetByName('Sprite1')`
- 完整列表用 `Scratch.vm.runtime.targets`

要按角色篩選但不按欄位，請將 `null` 或 `{}` 作為第二個引數傳遞。

## 重啟現有執行緒

預設情況下，重新觸發事件不會重啟已經執行的指令碼（因此其中的 `等待` 會繼續計數）。要改為重啟，請在積木上設定 `shouldRestartExistingThreads: true`（[下載](/example-extensions/unsandboxed/when-key-pressed-restart.js)）。這與 Scratch 的"當收到"在每次廣播時重啟的方式匹配。

## 讀取啟動的執行緒

`startHats` 返回它啟動的 `Thread` 物件陣列。您可以用它來計數或監視它們（[下載](/example-extensions/unsandboxed/broadcast-5.js)）：

```js
broadcast({EVENT}, util) {
  const threads = util.startHats('broadcast5example_whenReceived', { EVENT_OPTION: EVENT });
  return `Started ${threads.length} new threads!`;
}
```

## 基於謂詞的帽子積木

謂詞帽子是一個更強大的事件積木。它是帶 `isEdgeActivated: false` 的 `Scratch.BlockType.HAT`。與事件積木不同，它**確實**有一個函式：在 `startHats` 執行它之後，積木的輸入被求值，函式返回 `true` 讓指令碼執行或 `false` 跳過它（解析為布林值的 Promise 也有效）（[下載](/example-extensions/unsandboxed/when.js)）：

```js
class When {
  getInfo() {
    return {
      id: 'whenunsandboxed',
      name: 'When',
      blocks: [
        {
          blockType: Scratch.BlockType.HAT,
          opcode: 'when',
          text: 'when [CONDITION]',
          isEdgeActivated: false,
          arguments: {
            CONDITION: { type: Scratch.ArgumentType.BOOLEAN }
          }
        }
      ]
    };
  }
  when(args) {
    return Scratch.Cast.toBoolean(args.CONDITION);
  }
}

Scratch.vm.runtime.on('BEFORE_EXECUTE', () => {
  Scratch.vm.runtime.startHats('whenunsandboxed_when');
});
```

Bilup 不會為您啟動謂詞帽子，因此您自己呼叫 `startHats`。這裡它在執行時的 `BEFORE_EXECUTE` 事件上執行，該事件在指令碼執行前每幀觸發一次，因此帽子每幀被求值。與事件積木一樣，您可以從任何獲得回呼的地方觸發它。

## 邊緣啟用帽子積木

謂詞帽子在條件*為真*時執行。邊緣啟用帽子在條件*變為*真時執行一次，就像 Scratch 的"當計時器 > 5"一樣。它是帶 `isEdgeActivated: true` 的 `Scratch.BlockType.HAT`（[下載](/example-extensions/timer-reimplementation.js)）：

```js
let startTime = Date.now();

class TimerReimplementationExample {
  getInfo() {
    return {
      id: 'timerreimplementationexample',
      name: 'Timer Example',
      blocks: [
        {
          opcode: 'whenTimerGreaterThan',
          blockType: Scratch.BlockType.HAT,
          text: 'when timer > [TIME]',
          isEdgeActivated: true,
          arguments: {
            TIME: { type: Scratch.ArgumentType.NUMBER, defaultValue: '3' }
          }
        },
        { opcode: 'timer', blockType: Scratch.BlockType.REPORTER, text: 'timer' },
        { opcode: 'resetTimer', blockType: Scratch.BlockType.COMMAND, text: 'reset timer' }
      ]
    };
  }
  whenTimerGreaterThan({TIME}) {
    return this.timer() > Scratch.Cast.toNumber(TIME);
  }
  timer() {
    return (Date.now() - startTime) / 1000;
  }
  resetTimer() {
    startTime = Date.now();
  }
}
Scratch.extensions.register(new TimerReimplementationExample());
```

::::info
邊緣啟用帽子在**任何**擴充功能中都能工作，即使是沙箱的，因為 Bilup 會在每幀開始時自動為它們呼叫 `startHats`。不要對它們使用 `shouldRestartExistingThreads: true`。
::::

積木在條件成立時返回 `true`，但指令碼只在從假到真的轉變時啟動。一旦為真，它不會再次觸發，直到條件變假然後又變真。與謂詞帽子一樣，邊緣帽子可以接受輸入並返回 Promise。

## 練習

1. 製作每 1、5 和 10 秒觸發的事件積木，然後將它們合併成一個帶選單的積木。
2. 製作一個帶文本輸入、觸發普通 Scratch 廣播的命令。內建的"當收到"操作碼是 `event_whenbroadcastreceived`，它的引數是 `BROADCAST_OPTION`。
3. 將其變成返回新執行緒啟動所在角色名稱的逗號分隔列表的報告積木。（提示：每個 `Thread` 都有一個 `.target`，每個目標都有 `.getName()`。）

## 下一步

我們涵蓋了很多 API。接下來：[如何在不斷壞現有專案的情況下更改擴充功能？](/building-extensions/compatibility)

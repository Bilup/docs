---
title: 事件和帽子
sidebar_position: 7
---

# 事件和帽子

事件积木和帽子积木都控制脚本*何时*运行。它们看起来相似，但行为不同。本页大部分内容需要[非沙箱扩展](/building-extensions/unsandboxed)；唯一的例外（边缘激活帽子）在末尾说明。

## 事件积木

事件积木响应外部事物运行脚本："当旗子被点击"、"当角色被点击"。积木本身从不执行；它只是标记事件发生时启动哪些脚本堆栈。

::::warning
事件积木只在非沙箱扩展中受支持。
::::

这里有一个"当按下空格键"事件积木（[下载](/example-extensions/unsandboxed/when-space-key-pressed.js)）：

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
            isEdgeActivated: false // EVENT 积木的必需样板
          }
        ]
      };
    }
    // 注意：whenSpacePressed 没有函数。事件积木从不运行代码。
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      Scratch.vm.runtime.startHats('eventexampleunsandboxed_whenSpacePressed');
    }
  });

  Scratch.extensions.register(new WhenSpaceKeyPressed());
})(Scratch);
```

有两件事很突出：

- `isEdgeActivated: false` 是事件积木的**必需样板**。
- `whenSpacePressed` 操作码没有方法。您不为事件积木编写代码。

您用 `startHats` 启动事件积木下的脚本。有两种形式：

- 当您在积木**外部**（事件处理器、计时器、回调）时，使用 `Scratch.vm.runtime.startHats(...)`
- 当您在**运行中的积木内部**时，使用 `util.startHats(...)`

::::warning
在运行中的积木内部使用 `Scratch.vm.runtime.startHats` 而不是 `util.startHats` 可能破坏脚本执行。让形式与您所在的位置匹配。
::::

`startHats` 的第一个参数是**完整**操作码，`扩展id_操作码`。上面是 `eventexampleunsandboxed_whenSpacePressed`。它启动项目中每个顶部积木是该操作码的脚本。

您在这里使用了 `keydown` 监听器，但任何给您回调的东西都有效：点击、`setInterval`、`fetch` 完成等。

## 按菜单筛选

与其为每个键建一个单独的积木，不如使用字段菜单，并将筛选器作为 `startHats` 的第二个参数传递（[下载](/example-extensions/unsandboxed/when-key-pressed.js)）：

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
        acceptReporters: false, // 事件积木只支持字段菜单
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

事件积木菜单**必须是字段菜单**（`acceptReporters: false`）；您不能向它们放入报告积木。`startHats` 的第二个参数是一个对象，其键是参数名，值针对菜单**值**（而不是显示文本）匹配。只有字段全部匹配的脚本才被启动。

## 按角色筛选

`startHats` 的第三个（最后一个）参数是一个目标。如果给定，只有该目标中的事件积木启动。获得目标的常见方式（[下载](/example-extensions/unsandboxed/when-key-pressed-stage.js)）：

- 舞台用 `Scratch.vm.runtime.getTargetForStage()`
- 命名角色用 `Scratch.vm.runtime.getSpriteTargetByName('Sprite1')`
- 完整列表用 `Scratch.vm.runtime.targets`

要按角色筛选但不按字段，请将 `null` 或 `{}` 作为第二个参数传递。

## 重启现有线程

默认情况下，重新触发事件不会重启已经运行的脚本（因此其中的 `等待` 会继续计数）。要改为重启，请在积木上设置 `shouldRestartExistingThreads: true`（[下载](/example-extensions/unsandboxed/when-key-pressed-restart.js)）。这与 Scratch 的"当收到"在每次广播时重启的方式匹配。

## 读取启动的线程

`startHats` 返回它启动的 `Thread` 对象数组。您可以用它来计数或监视它们（[下载](/example-extensions/unsandboxed/broadcast-5.js)）：

```js
broadcast({EVENT}, util) {
  const threads = util.startHats('broadcast5example_whenReceived', { EVENT_OPTION: EVENT });
  return `Started ${threads.length} new threads!`;
}
```

## 基于谓词的帽子积木

谓词帽子是一个更强大的事件积木。它是带 `isEdgeActivated: false` 的 `Scratch.BlockType.HAT`。与事件积木不同，它**确实**有一个函数：在 `startHats` 运行它之后，积木的输入被求值，函数返回 `true` 让脚本运行或 `false` 跳过它（解析为布尔值的 Promise 也有效）（[下载](/example-extensions/unsandboxed/when.js)）：

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

Bilup 不会为您启动谓词帽子，因此您自己调用 `startHats`。这里它在运行时的 `BEFORE_EXECUTE` 事件上运行，该事件在脚本运行前每帧触发一次，因此帽子每帧被求值。与事件积木一样，您可以从任何获得回调的地方触发它。

## 边缘激活帽子积木

谓词帽子在条件*为真*时运行。边缘激活帽子在条件*变为*真时运行一次，就像 Scratch 的"当计时器 > 5"一样。它是带 `isEdgeActivated: true` 的 `Scratch.BlockType.HAT`（[下载](/example-extensions/timer-reimplementation.js)）：

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
边缘激活帽子在**任何**扩展中都能工作，即使是沙箱的，因为 Bilup 会在每帧开始时自动为它们调用 `startHats`。不要对它们使用 `shouldRestartExistingThreads: true`。
::::

积木在条件成立时返回 `true`，但脚本只在从假到真的转变时启动。一旦为真，它不会再次触发，直到条件变假然后又变真。与谓词帽子一样，边缘帽子可以接受输入并返回 Promise。

## 练习

1. 制作每 1、5 和 10 秒触发的事件积木，然后将它们合并成一个带菜单的积木。
2. 制作一个带文本输入、触发普通 Scratch 广播的命令。内置的"当收到"操作码是 `event_whenbroadcastreceived`，它的参数是 `BROADCAST_OPTION`。
3. 将其变成返回新线程启动所在角色名称的逗号分隔列表的报告积木。（提示：每个 `Thread` 都有一个 `.target`，每个目标都有 `.getName()`。）

## 下一步

我们涵盖了很多 API。接下来：[如何在不断坏现有项目的情况下更改扩展？](/building-extensions/compatibility)

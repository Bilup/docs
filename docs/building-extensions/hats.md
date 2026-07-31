---
title: Events and hats
sidebar_position: 7
---

# Events and hats

Event blocks and hat blocks both control *when* a script runs. They look similar but behave differently. Most of this page requires [unsandboxed extensions](/building-extensions/unsandboxed); the one exception (edge-activated hats) is noted at the end.

## Event blocks

An event block runs a script in response to something external: "when flag clicked", "when this sprite clicked". The block itself never executes; it just marks which stacks to start when the event happens.

:::warning
Event blocks are only supported in unsandboxed extensions.
:::

Here is a "when space key pressed" event block ([download](/example-extensions/unsandboxed/when-space-key-pressed.js)):

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
            isEdgeActivated: false // required boilerplate for EVENT blocks
          }
        ]
      };
    }
    // Note: whenSpacePressed has NO function. Event blocks never run code.
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
      Scratch.vm.runtime.startHats('eventexampleunsandboxed_whenSpacePressed');
    }
  });

  Scratch.extensions.register(new WhenSpaceKeyPressed());
})(Scratch);
```

Two things stand out:

- `isEdgeActivated: false` is **required boilerplate** on event blocks.
- The `whenSpacePressed` opcode has no method. You do not write code for an event block.

You start the scripts under an event block with `startHats`. There are two forms:

- `Scratch.vm.runtime.startHats(...)` when you are **outside** a block (an event handler, a timer, a callback)
- `util.startHats(...)` when you are **inside** a running block

:::warning
Using `Scratch.vm.runtime.startHats` from inside a running block instead of `util.startHats` can break script execution. Match the form to where you are.
:::

The first argument to `startHats` is the **full** opcode, `extensionid_opcode`. Above that is `eventexampleunsandboxed_whenSpacePressed`. It starts every script in the project whose top block is that opcode.

You used a `keydown` listener here, but anything that gives you a callback works: clicks, `setInterval`, `fetch` completions, and so on.

## Filtering by menu

Rather than a separate block per key, use a field menu and pass a filter as the second argument to `startHats` ([download](/example-extensions/unsandboxed/when-key-pressed.js)):

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
        acceptReporters: false, // event blocks only support field menus
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

Event block menus **must be field menus** (`acceptReporters: false`); you cannot drop a reporter into them. The second argument to `startHats` is an object whose keys are argument names and whose values are matched against the menu **values** (not the display text). Only scripts whose fields all match are started.

## Filtering by sprite

The third (last) argument to `startHats` is a target. If given, only event blocks in that target start. Common ways to get a target ([download](/example-extensions/unsandboxed/when-key-pressed-stage.js)):

- `Scratch.vm.runtime.getTargetForStage()` for the stage
- `Scratch.vm.runtime.getSpriteTargetByName('Sprite1')` for a named sprite
- `Scratch.vm.runtime.targets` for the full list

To filter by sprite but not by field, pass `null` or `{}` as the second argument.

## Restarting existing threads

By default, re-firing an event does not restart a script that is already running (so a `wait` inside it keeps counting). To restart instead, set `shouldRestartExistingThreads: true` on the block ([download](/example-extensions/unsandboxed/when-key-pressed-restart.js)). This matches how Scratch's "when I receive" restarts on each broadcast.

## Reading the started threads

`startHats` returns an array of the `Thread` objects it started. You can use it to count or monitor them ([download](/example-extensions/unsandboxed/broadcast-5.js)):

```js
broadcast({EVENT}, util) {
  const threads = util.startHats('broadcast5example_whenReceived', { EVENT_OPTION: EVENT });
  return `Started ${threads.length} new threads!`;
}
```

## Predicate-based hat blocks

A predicate hat is a more powerful event block. It is `Scratch.BlockType.HAT` with `isEdgeActivated: false`. Unlike an event block, it **does** have a function: after `startHats` runs it, the block's inputs are evaluated and the function returns `true` to let the script run or `false` to skip it (a Promise resolving to a boolean also works) ([download](/example-extensions/unsandboxed/when.js)):

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

MistWarp does not start predicate hats for you, so you call `startHats` yourself. Here it runs on the runtime's `BEFORE_EXECUTE` event, which fires once per frame before scripts run, so the hat is evaluated every frame. As with event blocks, you can trigger it from anywhere you get a callback.

## Edge-activated hat blocks

A predicate hat runs while a condition *is* true. An edge-activated hat runs once when a condition *becomes* true, like Scratch's "when timer > 5". It is `Scratch.BlockType.HAT` with `isEdgeActivated: true` ([download](/example-extensions/timer-reimplementation.js)):

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

:::info
Edge-activated hats work in **any** extension, even sandboxed ones, because MistWarp calls `startHats` for them automatically at the start of each frame. Do not use `shouldRestartExistingThreads: true` with them.
:::

The block returns `true` while the condition holds, but the script only starts on the transition from false to true. Once true, it will not fire again until the condition becomes false and then true again. Like predicate hats, edge hats can take inputs and return a Promise.

## Exercises

1. Make event blocks that fire every 1, 5, and 10 seconds, then combine them into one block with a menu.
2. Make a command with a text input that fires a normal Scratch broadcast. The built-in "when I receive" opcode is `event_whenbroadcastreceived` and its argument is `BROADCAST_OPTION`.
3. Turn that into a reporter returning a comma-separated list of the sprite names a new thread started in. (Hint: each `Thread` has a `.target`, and each target has `.getName()`.)

## Next steps

We have covered a lot of APIs. Next: [how do you change an extension without breaking existing projects?](/building-extensions/compatibility)

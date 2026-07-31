---
title: Custom C blocks
sidebar_position: 9
---

# Custom C blocks

C blocks are the ones that wrap other blocks: `if`, `if/else`, `repeat`, `forever`. MistWarp lets extensions define their own.

:::warning
Custom C blocks only work in [unsandboxed extensions](/building-extensions/unsandboxed).
:::

## The two block types

- `Scratch.BlockType.LOOP` for repeating blocks. It has exactly one branch, so `branchCount` is implied.
- `Scratch.BlockType.CONDITIONAL` for `if`/`else` style blocks. Set `branchCount` to the number of branches it controls.

Use `isTerminal: true` for a block with no bottom connection, like `forever`.

## Driving the branches

There are two ways to control which branch runs and whether it loops.

**Return a value from the block function:**

- `CONDITIONAL`: return the 1-based index of the branch to run, or `0` / a falsy value to run none.
- `LOOP`: return `true` to run the branch and loop again, or a falsy value to stop.

**Or call `util.startBranch(branchIndex, isLoop)` explicitly:**

- `branchIndex` (number): the 1-based branch to run. The first branch is `1`.
- `isLoop` (boolean): if `true`, the block function is called again after the branch finishes.

## Example: if / else

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
      util.startBranch(1); // the "if" branch
    } else {
      util.startBranch(2); // the "else" branch
    }
  }
}
Scratch.extensions.register(new ConditionalExtension());
```

The same block written in the return style:

```js
myIfElse(args) {
  return args.CONDITION ? 1 : 2; // 1-based branch index
}
```

Notice `text` is an array. For a multi-branch block, each string is the label above one branch.

## Example: loops

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
          isTerminal: true // no connection underneath
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
    util.startBranch(1, true); // run branch 1, then loop
  }

  repeatUntil(args, util) {
    if (!args.CONDITION) {
      util.startBranch(1, true); // condition false: run and loop again
    }
    // condition true: do nothing, loop ends
  }
}
Scratch.extensions.register(new LoopExtension());
```

A counted `repeat` uses the return style and `util.stackFrame` to keep per-loop state:

```js
repeatTimes(args, util) {
  const times = Math.round(Scratch.Cast.toNumber(args.TIMES));
  if (typeof util.stackFrame.loopCounter === 'undefined') {
    util.stackFrame.loopCounter = times;
  }
  util.stackFrame.loopCounter--;
  return util.stackFrame.loopCounter >= 0; // true = run branch again
}
```

`util.stackFrame` is scratch space tied to this specific block invocation. It is the right place to store a loop counter, because it is cleared when the block finishes and does not clash with other copies of the block.

## Things to remember

1. **Branches are 1-based.** The first branch is `1`, not `0`.
2. **Loop arguments re-evaluate.** In a `LOOP`, inputs are read again each time the block runs, so `repeat until [x = 5]` sees the current value of `x`.
3. **`startBranch` yields.** Execution passes to the branch; your function is called again after the branch completes (if looping).
4. **`isTerminal` is not "stop".** It only prevents connecting a block underneath. If a terminal block sits at the end of a loop, the loop still continues unless something stops the thread.

## Next steps

Next, some [advanced block customization](/building-extensions/advanced-block-customization) techniques.

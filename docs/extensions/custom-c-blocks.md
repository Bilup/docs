---
title: Custom C Blocks
---

# Custom C Blocks

MistWarp allows unsandboxed extensions to create custom C blocks (loops and conditionals) similar to Scratch's built-in `if`, `repeat`, and `forever` blocks.

> **⚠️ Requirement:** Custom C blocks only work in **unsandboxed** extensions.

## Defining C Blocks

To define a C block, specify the appropriate `blockType` and (for conditionals) a `branchCount`. Use `isTerminal` for blocks that should not have a connection at the bottom (like `forever`).

### Block Definition

```javascript
{
  opcode: "myLoop",
  text: "repeat",
  blockType: Scratch.BlockType.LOOP
}
```

### Supported Block Types

- `Scratch.BlockType.LOOP` — For repeating blocks. The loop is assumed to have exactly one child branch; `branchCount` is implied and not required.
- `Scratch.BlockType.CONDITIONAL` — For if/else style blocks. Must specify `branchCount` to indicate how many branches the block controls.

## Implementing the Logic

There are two supported ways to implement control flow:

- Return values from your block function.
  - For `CONDITIONAL`: return the 1-based index of the branch to run, or return `0`/falsy to run no branch.
  - For `LOOP`: return `true` to repeat, otherwise end the loop.
- Or explicitly start branches using `util.startBranch(branchIndex, isLoop)`.

### util.startBranch(branchIndex, isLoop)

- `branchIndex` (number): 1-based index of the branch to run.
- `isLoop` (boolean): If `true`, the loop block will be called again after the branch finishes.

## Example: If / Else

This example recreates a standard `if-else` block using explicit branch control.

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
          branchCount: 2, // Two branches: one for 'if', one for 'else'
          arguments: {
            CONDITION: { type: Scratch.ArgumentType.BOOLEAN }
          }
        }
      ]
    };
  }

  myIfElse(args, util) {
    if (args.CONDITION) {
      // Run the first branch (if)
      util.startBranch(1);
    } else {
      // Run the second branch (else)
      util.startBranch(2);
    }
  }
}
Scratch.extensions.register(new ConditionalExtension());
```

Alternatively, the same block can be written to return the branch index without calling `util.startBranch`:

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
    return args.CONDITION ? 1 : 2; // 1-based branch index
  }
}
Scratch.extensions.register(new ConditionalExtensionReturnStyle());
```

## Example: Loops

This example creates a `repeat until` loop and a `forever` loop.

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
          isTerminal: true // No block connection at the bottom
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
    // Start branch 1 and loop (true)
    util.startBranch(1, true);
  }

  repeatUntil(args, util) {
    // Check condition
    if (!args.CONDITION) {
      // If false, run branch 1 and loop again
      util.startBranch(1, true);
    }
    // If true, do nothing (loop ends)
  }
}
Scratch.extensions.register(new LoopExtension());
```

The `repeat` loop can also be implemented by returning `true` while more iterations remain:

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
    return util.stackFrame.loopCounter >= 0; // true = run branch again
  }
}
Scratch.extensions.register(new RepeatReturnStyle());
```

## Important Notes

1. **Branch indices are 1-based:** The first branch is `1`.
2. **Argument re-evaluation:** In loops, arguments are re-evaluated each time the block runs.
3. **Yielding:** `util.startBranch` yields execution to the branch. The block function will be called again after the branch completes (if looping).
4. **Terminal blocks:** Set `isTerminal: true` for blocks that end a stack (such as `forever` or `stop all`).

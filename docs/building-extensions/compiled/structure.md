---
title: Extension structure
sidebar_position: 2
---

# Extension structure

A compiled extension is a normal extension plus a call to `Scratch.vm.exports.compiler.register`. This page covers the shape of that call. The [next page](/building-extensions/compiled/first-extension) builds a full example.

## The skeleton

```js
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  const { vm, BlockType, ArgumentType } = Scratch;
  const { compiler } = vm.exports;
  const T = compiler.types; // ANY, NUMBER, NUMBER_OR_NAN, STRING, BOOLEAN, COMMAND

  // 1. Tell the compiler how to generate JavaScript for each block.
  compiler.register('mathutils', {
    square: {
      type: T.NUMBER,
      compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
    }
  });

  // 2. Register the extension normally, with a fallback func per block.
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
    // Interpreter fallback: runs when the block is not compiled.
    square(args) {
      return Scratch.Cast.toNumber(args.NUMBER) ** 2;
    }
  }
  Scratch.extensions.register(new MathUtils());
})(Scratch);
```

Two independent registrations happen here. `compiler.register` teaches the compiler; `Scratch.extensions.register` adds the block to the palette and provides the interpreter fallback. The block's `opcode` (`square`) and the extension `id` (`mathutils`) tie them together: internally the compiler entry is keyed as `mathutils_square`, which is exactly the block's full opcode.

## compiler.register(extensionId, blocks)

- `extensionId`: your extension's `id`, the same string you pass in `getInfo`.
- `blocks`: an object mapping each block's `opcode` to a descriptor.

Each descriptor has:

| Field | Description |
|:--|:--|
| `type` | One of `compiler.types`. It is the type of value the block produces (or `COMMAND` for a stack block). |
| `compile` | A function that returns a **string of JavaScript source** for the block. |

`compiler.types`:

| Type | Use for |
|:--|:--|
| `NUMBER` | A reporter that always produces a number. |
| `NUMBER_OR_NAN` | A reporter that produces a number that may be `NaN`. |
| `STRING` | A reporter that produces a string. |
| `BOOLEAN` | A boolean reporter. |
| `ANY` | A reporter whose type is not known ahead of time. |
| `COMMAND` | A stack block that runs an action and returns nothing. |

Picking a specific type helps the compiler skip redundant conversions downstream, so prefer the narrowest type your block truly guarantees.

## The compile context

`compile` receives one object:

```js
compile: ({ input, field, mutation, runtime, target, stage }) => `...`
```

| Property | What it gives you |
|:--|:--|
| `input(name)` | JavaScript source for input `name`, coerced to "any". |
| `input.number(name)` | Input source coerced to a number. |
| `input.string(name)` | Input source coerced to a string. |
| `input.boolean(name)` | Input source coerced to a boolean. |
| `input.numberOrNaN(name)` | Input source coerced to a number that may be `NaN`. |
| `input.raw(name)` | Input source with no coercion. For a literal, this is the bare value. |
| `field(name)` | The value of field `name`, already JSON-encoded (safe to drop into source as a string literal). |
| `mutation` | The block's mutation object (used for variadic blocks). |
| `runtime`, `target`, `stage` | The variable names, as strings, that refer to the runtime, the current target, and the stage in the generated code. Use them to reach engine state. |

The key mental model: `compile` runs at compile time and returns **text**. The `input.*` helpers return text (a JavaScript expression), and you assemble a larger expression by string interpolation. What you return is spliced into the compiled script and executed at run time.

## Real built-in examples

MistWarp's own operators are registered exactly this way. A few, verbatim from the engine:

```js
// number result
power:   ({ input: i }) => `Math.pow(${i.number('A')}, ${i.number('B')})`,
clamp:   ({ input: i }) => `Math.min(Math.max(${i.number('A')}, ${i.number('B')}), ${i.number('C')})`,

// boolean result
notequals: ({ input: i }) => `(${i.string('A')} !== ${i.string('B')})`,
starts:    ({ input: i }) => `(${i.string('A')}).startsWith(${i.string('B')})`,

// string result
replaceall: ({ input: i }) => `(${i.string('A')}).replaceAll(${i.string('C')}, ${i.string('B')})`,

// reaching runtime state
stagewidth: ({ runtime }) => `${runtime}.stageWidth`,

// no inputs
pi: () => 'Math.PI',
```

`compile` must return a string. Wrap expressions in parentheses when precedence could bite you: an input might expand to something like `a + b`, and `${i.number('A')} ** 2` without parentheses around the input would parse wrong.

## Fallback functions

The block still needs its normal method in the class (`square(args)` above). It runs when the block is not compiled: when a reporter feeds a monitor, when the compiler is disabled, or in any environment without MistWarp's compiler. Keep the fallback behavior identical to the compiled version so results never differ.

## Next steps

[Build a first compiled extension](/building-extensions/compiled/first-extension) end to end.

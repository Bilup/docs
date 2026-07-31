---
title: Your first compiled extension
sidebar_position: 4
---

# Your first compiled extension

Let's build a small "Math Utils" extension with two compiled reporters, `square` and `power`, using the supported [`compiler.register` API](/building-extensions/compiled/structure).

## Boilerplate

Compiled extensions must run unsandboxed, so start with the check and pull out the pieces you need:

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

## Register the compiled implementations

Each entry is `type` plus a `compile` function that returns JavaScript source. Both reporters produce numbers, so their type is `T.NUMBER`:

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

`input.number('NUMBER')` expands to a JavaScript expression that evaluates the `NUMBER` input and coerces it to a number. The parentheses around `square` matter: `NUMBER` might expand to something like `a + b`, and `a + b ** 2` would apply `**` before `+`.

## Register the blocks with fallbacks

Now the ordinary extension. The `opcode`s must match the keys you registered, and each block gets a plain method that produces the same result for uncompiled runs:

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

That is the complete extension.

## Testing it

1. Load it unsandboxed in the editor (from `http://localhost:8000/` or with the "run without sandbox" option; see [Unsandboxed extensions](/building-extensions/unsandboxed)).
2. Use `square of (5)` and confirm it reports `25`.
3. Feed it inputs of different kinds: a literal, a variable, and a nested reporter like `square of ((3 + 2))`. All should work, because `input.number` compiles whatever expression the input produces.
4. Check the fallback: put a `square of` reporter on the stage as a monitor (click its checkbox). Monitors run uncompiled, so this exercises the `square(args)` method. The value should match.

Keep the fallback and the compiled version in lockstep. If they can disagree, projects will behave differently depending on whether the compiler is on, which is a confusing bug to chase.

## Next steps

[Advanced compiled techniques](/building-extensions/compiled/advanced): command blocks, variadic inputs, raw inputs, and reaching runtime state.

---
title: The legacy patching approach
sidebar_position: 3
---

# The legacy patching approach

Before MistWarp added the [`compiler.register` API](/building-extensions/compiled/structure), compiled extensions worked by **patching the compiler's internal code generators**. This page explains that older approach so you can recognize and maintain existing extensions. For new work, use `compiler.register`; it is shorter, supported, and does not break on compiler rewrites.

:::warning
Everything here goes through APIs that MistWarp explicitly labels unsupported. The accessor is literally named `i_will_not_ask_for_help_when_these_break`. The compiler's internals have already been rewritten once (which is why the compatibility shim exists), and they can change again. Do not build new extensions on this.
:::

## The compatibility shim

Old TurboWarp compiled extensions patched two generator classes: `ScriptTreeGenerator` (which turns blocks into an intermediate tree) and `JSGenerator` (which turns that tree into JavaScript). MistWarp's current compiler is structured differently, so it provides a compatibility shim that emulates the old classes:

```js
const compilerAPI = vm.exports.i_will_not_ask_for_help_when_these_break();
const { JSGenerator, ScriptTreeGenerator } = compilerAPI;
```

Calling this switches MistWarp into a legacy-compatible mode. The returned objects behave enough like the old generators for existing extensions to keep working.

The pattern those extensions use is a "patch" helper that wraps a method while preserving the original:

```js
const PATCHES_ID = 'myextension_patches';
const patch = (obj, functions) => {
  if (obj[PATCHES_ID]) return;
  obj[PATCHES_ID] = {};
  for (const name in functions) {
    const original = obj[name];
    obj[PATCHES_ID][name] = original;
    obj[name] = function (...args) {
      const callOriginal = (...a) => (original ? original.call(this, ...a) : undefined);
      return functions[name].call(this, callOriginal, ...args);
    };
  }
};
```

They then patch `descendStackedBlock` and `descendInput` on both generators to recognize their block opcodes, producing an intermediate node in the tree phase and emitting source in the JavaScript phase. The JavaScript phase used helpers like `TypedInput` and type constants (`TYPE_NUMBER`, and so on) pulled from the generator's exports, and wrote to `this.source`.

You do not need to learn the details to keep such an extension alive; you need to know that (a) it depends on this shim, and (b) the modern equivalent is far smaller.

## The same block, both ways

A "square" reporter in the legacy style needs a patch in each phase to match its opcode and emit `(${n} * ${n})`. The modern equivalent is the whole thing:

```js
vm.exports.compiler.register('mathutils', {
  square: {
    type: vm.exports.compiler.types.NUMBER,
    compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
  }
});
```

If you are maintaining a legacy extension and can afford to, porting it to `compiler.register` removes the dependency on the unsupported shim entirely.

## The newer internals accessor

MistWarp also exposes `vm.exports.these_broke_before_and_will_break_again()`, which returns the *current* compiler internals (the real `IRGenerator`, `ScriptTreeGenerator`, the `IntermediateInput`/`IntermediateStackBlock` classes, and the `StackOpcode` / `InputOpcode` / `InputType` enums). It carries the same "unsupported, will break" warning. It exists for extensions that genuinely need to reach into the new compiler; almost nothing does, because `compiler.register` covers the normal cases.

## Next steps

Skip the legacy path and [build a first compiled extension the supported way](/building-extensions/compiled/first-extension).

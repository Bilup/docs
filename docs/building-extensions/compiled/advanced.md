---
title: Advanced compiled techniques
sidebar_position: 5
---

# Advanced compiled techniques

This page covers the parts of the [`compiler.register` API](/building-extensions/compiled/structure) beyond a plain reporter: command blocks, fields, variadic inputs, raw inputs, and reaching runtime state. Everything here is verified against how MistWarp's own built-in operators are compiled.

Keep the mental model front of mind: `compile` runs **once, at compile time**, and returns a **string of JavaScript**. It cannot do runtime work itself; it decides what runtime work the generated code will do. Anything that must react to the running project has to be inside the string you return.

## Command blocks

Give the descriptor `type: COMMAND`. The string you return is used as a statement (the compiler appends `;`), so return an expression with a side effect:

```js
compiler.register('myext', {
  logmessage: {
    type: T.COMMAND,
    compile: ({ input }) => `console.log(${input.string('MESSAGE')})`
  }
});
```

To run several statements, wrap them in an immediately-invoked function:

```js
compile: ({ input, target }) =>
  `(() => { const n = ${input.number('N')}; ${target}.setXY(n, n); })()`
```

## Reaching runtime, target, and stage

The context gives you the variable names that refer to engine objects in the generated scope. Interpolate them into your source:

```js
compiler.register('myext', {
  stagewidth: {
    type: T.NUMBER,
    compile: ({ runtime }) => `${runtime}.stageWidth`
  },
  myx: {
    type: T.NUMBER,
    compile: ({ target }) => `${target}.x`
  }
});
```

`runtime` is the runtime, `target` is the target running the block, and `stage` is the stage. For example, the built-in stage width block compiles to a template that returns `runtime.stageWidth`.

## Fields

`field(name)` returns the field's value already JSON-encoded, so it is safe to splice as a string literal:

```js
compile: ({ field }) => `someTable[${field('CHOICE')}]`
// if the CHOICE field is "red", this becomes: someTable["red"]
```

## Input coercions

Pick the coercion that matches what your JavaScript expects. Choosing the right one avoids redundant conversions in the output.

| Helper | Emits |
|:--|:--|
| `input('A')` | The input, coerced to "any". |
| `input.number('A')` | Coerced to a number. |
| `input.numberOrNaN('A')` | Coerced to a number that may be `NaN`. |
| `input.string('A')` | Coerced to a string. |
| `input.boolean('A')` | Coerced to a boolean. |
| `input.raw('A')` | No coercion. For an operator dropdown, this is the bare operator text. |

`input.raw` is how a block that takes an operator as a field builds an expression. The built-in comparison block does exactly this:

```js
compare: {
  type: T.BOOLEAN,
  compile: ({ input: i }) => `(${i.number('A')} ${i.raw('C')} ${i.number('B')})`
}
// with C = "<", this becomes: (a < b)
```

Only use `raw` with values you control or a fixed menu. Splicing an arbitrary user string as raw source is an injection risk.

## Variadic inputs

Blocks that accept a variable number of inputs (like `min`/`max` of several values) read the count from `mutation`. This is verbatim how MistWarp compiles its variadic `min` and `max`:

```js
const variadic = (name, input, mutation) => {
  const count = Math.max(2, parseInt(mutation.itemcount, 10) || 2);
  const parts = Array.from({ length: count }, (_, i) => input.number(`NUM${i + 1}`));
  return `Math.${name}(${parts.join(',')})`;
};

compiler.register('myext', {
  min: { type: T.NUMBER, compile: ({ input, mutation }) => variadic('min', input, mutation) },
  max: { type: T.NUMBER, compile: ({ input, mutation }) => variadic('max', input, mutation) }
});
```

## Choosing the result type

`type` is the value the block produces, and the compiler uses it to skip conversions in the blocks that consume your output. Be honest:

- Use `NUMBER` only when the result is always a real number. If it can be `NaN` (a parse that might fail), use `NUMBER_OR_NAN`, or the compiler may assume a valid number and skip a `NaN` guard a caller needed.
- Use `ANY` when you cannot promise a type, for example a `JSON.parse` result.

```js
jsonparse: { type: T.ANY, compile: ({ input: i }) => `JSON.parse(${i.string('A')})` }
```

## Precedence and parentheses

Inputs expand to whole expressions, not just literals, so parenthesize anything where operator precedence could change the meaning. Prefer wrapping the input and the whole result:

```js
// risky: input might be `a + b`
compile: ({ input: i }) => `${i.number('X')} ** 2`
// safe
compile: ({ input: i }) => `((${i.number('X')}) ** 2)`
```

## Keep the fallback in sync

Every compiled block still needs its interpreter method (see [Your first compiled extension](/building-extensions/compiled/first-extension)). It runs whenever the block is not compiled, so it must compute the same result. When you change the compiled logic, change the fallback too.

## What not to do

The compiler is deliberately narrow, and that is the point. It has no supported API for multi-pass compilation, hoisting shared helper functions into the output, hooking the compiler's lifecycle, or holding cross-block state at compile time. If you find yourself wanting those, the block is probably too big to be worth compiling; write it as a normal [unsandboxed block](/building-extensions/unsandboxed) instead.

## See also

- [Compiled extensions overview](/building-extensions/compiled/overview)
- [The legacy patching approach](/building-extensions/compiled/patching)

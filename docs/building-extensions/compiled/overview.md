---
title: Compiled extensions overview
sidebar_position: 1
---

# Compiled extensions

MistWarp does not interpret projects block by block. It **compiles** them: the blocks are turned into JavaScript, which the browser runs at native speed. A normal extension block is a function the compiled code calls into, which is fast enough for most things but still an interpreter-style call.

A compiled extension goes further. It tells the compiler how to turn your block into JavaScript *inline*, so there is no call into your function at all. For a math block, that is the difference between "call the extension, which returns `Math.pow(a, b)`" and simply emitting `Math.pow(a, b)` straight into the script.

## When it is worth it

Compiling a block only helps when the block is small and runs a lot: math, string work, and other tight-loop operations. It does nothing for blocks dominated by real work (a network request, drawing, waiting), and it adds complexity.

Reach for a compiled block when:

- The operation is cheap but called thousands of times per frame, and interpreter overhead shows up in profiling.
- You can express the block as a short JavaScript expression.

Stick with a [normal extension](/building-extensions/introduction) when the block does anything substantial, when you are prototyping, or when the extra complexity is not paying for itself.

## Requirements

- Compiled extensions must run [unsandboxed](/building-extensions/unsandboxed); they use `Scratch.vm.exports`, which only exists in the main page.
- They rely on MistWarp's compiler, so they run in MistWarp and the [packager](/packager/overview), but not in vanilla Scratch.
- You always provide a normal `func` fallback so the block still works when the compiler is off (for example when a monitor reads a reporter, or if a user disables the compiler).

## Two ways to do it

MistWarp exposes two compiler entry points on `Scratch.vm.exports`:

- **`vm.exports.compiler.register(...)`** is the supported, stable way. You register a small `compile` function per block that returns a JavaScript source string. This is what the rest of this section teaches.
- **`vm.exports.i_will_not_ask_for_help_when_these_break()`** returns a compatibility shim for the *old* TurboWarp-style approach of patching the compiler's internal generators. It exists so older compiled extensions keep working. The name is a literal warning: it is unsupported, undocumented by contract, and can break at any release. Use it only to keep a legacy extension running; write new ones with `compiler.register`. See [Patching the compiler](/building-extensions/compiled/patching).

## Getting started

Read [normal extension development](/building-extensions/introduction) first; a compiled block is still a normal block with a compiler entry bolted on. Then continue to [Extension structure](/building-extensions/compiled/structure).

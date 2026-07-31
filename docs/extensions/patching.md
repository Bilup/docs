---
title: Patching
sidebar_position: 3
---

# Patching

The **Patching** extension lets you write raw JavaScript inside blocks. When the project is compiled, that JavaScript is injected directly into the generated code and runs as part of the compiled thread. It is built in and marked as incompatible with Scratch.

Load it from **Add Extension** and choose **Patching**.

## Blocks

### js `[code]` (reporter)

```scratch
(js [1 * 3])
```

Evaluates the JavaScript expression and returns its value. The default text is `1 * 3`, which reports `3`.

### js `[code]` (boolean)

```scratch
<js [1 === 1]>
```

Evaluates the JavaScript expression and reports it as a boolean.

### js `[code]` (command)

```scratch
js [console.log("hello")]
```

Runs the JavaScript as a statement, for side effects. The default text logs `hello` to the console.

## Requires the compiler

Patching blocks only work when the compiler is turned on. The block bodies are spliced into compiled output; there is no interpreter fallback, so if the compiler is disabled the blocks throw `Patching blocks require the compiler`. Make sure the compiler is enabled (it is by default). See [Disable Compiler](/advanced/disable-compiler) for how compilation is controlled.

## Security and stability risk

:::warning
Patching runs whatever JavaScript you put in the block with the same access as the rest of the page. Treat it the same way you would treat any code you paste from the internet.
:::

- Only use code you understand. A patching block can read and change anything the project can, including making network requests.
- Never load a shared project that uses patching blocks unless you trust the author, for the same reason.
- Because the code is injected into compiled output, a syntax error or a runtime exception can break the whole compiled thread, not just that one block.
- The expression forms (`js` reporter and boolean) should be a single expression. The command form takes statements.

For a structured way to write JavaScript that participates in compiled projects, see [Compiled Extensions](/building-extensions/compiled/overview), which is the supported path for anything beyond quick one-liners.

## See also

- [JavaScript in projects](/advanced/javascript)
- [Disable Compiler](/advanced/disable-compiler)
- [Compiled Extensions](/building-extensions/compiled/overview)

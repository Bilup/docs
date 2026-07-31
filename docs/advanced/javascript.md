---
title: JavaScript and the Compiler
sidebar_position: 2
---

# JavaScript and the Compiler

JavaScript shows up in MistWarp in three ways: a **compiler** that turns your blocks into JavaScript automatically for speed, the **Patching extension** that gives you `js (...)` blocks to run your own JavaScript from inside a project, and the **extension system** for writing full blocks of your own in JavaScript. This page covers all three.

## The compiler

Every time a project runs, MistWarp compiles your scripts into JavaScript that the browser can run directly, instead of interpreting the blocks one at a time. This is the main reason projects run much faster in MistWarp than in vanilla Scratch. It happens automatically, there is nothing to turn on, and the results are identical to how the blocks would behave in Scratch (aside from being faster).

A script is compiled the first time it runs. If a project seems to pause briefly the first time a script fires, that is compilation happening once; it does not repeat.

You almost never need to think about the compiler. The two times you might:

- **Debugging a compiler bug.** If a script behaves differently in MistWarp than in Scratch, you can turn the compiler off to check whether the compiler is at fault. See [Disable Compiler](/advanced/disable-compiler).
- **Looking at the generated code** (see below).

## Running JavaScript from inside a project

The [**Patching extension**](/extensions/patching) adds blocks that run JavaScript you write directly in the project:

- a **reporter** `js (...)` that returns the value of a JavaScript expression,
- a **boolean** `js (...)` for conditions, and
- a **command** `js (...)` that runs a statement.

Because the JavaScript is spliced into the compiled output, these blocks only work while the compiler is on; with the compiler disabled they throw "Patching blocks require the compiler". This is the direct "paste some JavaScript" path, and like any code that runs on the page, only run JavaScript you understand.

## Writing your own blocks in JavaScript

If you need more than an inline expression (to call a web API, use a browser feature, or add reusable blocks of your own), write an **unsandboxed extension**. Unsandboxed extensions run in the same context as the editor and have full access to the VM, the renderer, and normal browser APIs like `fetch` and `localStorage`.

This is a real programming task, not a block. The full guide is in [Building Extensions](/building-extensions/introduction), and the specifics of the unsandboxed environment are in [Unsandboxed Extensions](/building-extensions/unsandboxed). You can load an extension from a URL with the [`extension` URL parameter](/advanced/url-parameters#extension):

```
https://warp.mistium.com/?extension=https://example.com/extension.js
```

:::warning
Unsandboxed extensions run with full access to the page. Only load extensions from sources you trust. A malicious extension can do anything your browser can do.
:::

## Viewing the generated JavaScript

The JavaScript MistWarp generates is **not meant to be read or edited by humans**. It is optimized for speed and compatibility, not readability. For example, reading a list item might compile to `(b1.value[(b0.value | 0) - 1] ?? "")`, where `b0` and `b1` are internal variable names. There is no formatting and no comments.

If you still want to see it, open your browser's JavaScript console and run this before starting the project:

```js
vm.enableDebug();
```

The compiled JavaScript for each script is then logged to the console as it compiles. To turn logging back off:

```js
vm.disableDebug();
```

If you are trying to **learn** how a Scratch project would look as JavaScript, the compiler output is the wrong tool. Use a project-to-JavaScript converter like [Leopard](https://leopardjs.com/) instead, which produces clean, readable code.

## Packaging with custom code

To ship a project as a standalone HTML file or app, use the [MistWarp Packager](/packager/overview). The packager bundles the compiled runtime with your project so it runs anywhere, no editor required.

## See also

- [Patching extension](/extensions/patching)
- [Disable Compiler](/advanced/disable-compiler)
- [Building Extensions](/building-extensions/introduction)
- [URL Parameters](/advanced/url-parameters)

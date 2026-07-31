---
title: What the sandbox is
sidebar_position: 5
---

# What the sandbox is

There are two kinds of custom extension: **sandboxed** and **unsandboxed**. Everything so far has been sandboxed. This page explains what that means and why you will usually want the other kind.

## The sandbox

In MistWarp, the sandbox is an `<iframe>`. A sandboxed extension runs in a cross-origin iframe that cannot reach the main page where the editor and VM live. It is isolated in its own world.

That isolation means a sandboxed extension:

- Cannot access MistWarp internals (the VM, the runtime, the renderer)
- Cannot read any part of the project that was not passed to it as an argument, including variables
- Cannot interact with sprites directly

It can still:

- Call most public web APIs, subject to [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- Use many browser APIs that do not require page access, such as the [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API)

Some other Scratch mods sandbox extensions in a `Worker` instead. MistWarp uses an iframe because it is cross-origin (more secure) and exposes more web APIs.

## The big limitation

Every time a sandboxed block runs, the script pauses for at least one frame, no matter how trivial the block is. "Run without screen refresh" and turbo mode do not change this; the wait is unavoidable, because each call has to cross the iframe boundary.

That single-frame-per-block cost makes sandboxed extensions nearly useless for anything that runs in a loop, which is why unsandboxed extensions exist.

## Unsandboxed extensions

An unsandboxed extension does not run in an iframe. It runs in the same page as MistWarp itself, loaded as a `<script>` tag. So it:

- **Can** access MistWarp internals
- **Can** read any part of the project, including variables
- **Can** interact with any sprite directly

And, crucially, running one of its blocks is instantaneous. There is no forced one-frame delay.

The trade-off is trust and responsibility: because unsandboxed code can do anything the page can do, MistWarp only runs it unsandboxed under specific conditions, and you take on some extra rules. That is the subject of the [next page](/building-extensions/unsandboxed).

## Exercises

1. Load a sandboxed extension (as you have been) with a `COMMAND` block that does nothing. In an empty project, put it inside `repeat (10)` four times over. Notice the loop takes more than a second even though the blocks do nothing.
2. Replace those blocks with `set my variable to 0`. The loop now finishes instantly. That is how unsandboxed extension blocks behave.
3. Inside a sandboxed extension, `console.log(window.origin)`. Compare it with `window.origin` typed into the console on the main page. They differ, because the sandbox is a separate origin.

## Next steps

Unsandboxed extensions are clearly better for most uses, so [let's write one](/building-extensions/unsandboxed).

---
title: Disable Compiler
sidebar_position: 15
---

# Disable Compiler

MistWarp's [compiler](/advanced/javascript) turns your blocks into JavaScript so they run much faster than in vanilla Scratch. This option turns it off, falling back to interpreting blocks one at a time like Scratch does. Toggle it in the [editor settings](/editor/settings) or with the [`nocompile` URL parameter](/advanced/url-parameters).

:::warning
Do not change this unless you know exactly why you need to. Disabling the compiler makes projects much slower.
:::

The two legitimate reasons to disable it:

- **Debugging a compiler bug.** If a script behaves differently in MistWarp than in Scratch, turning the compiler off tells you whether the compiler is the cause.
- **Editing.** With the compiler off, script changes take effect immediately as you edit, which some people prefer while building. The "Disable compiler in editor" addon does exactly this by default, only in the editor, leaving the player fast.

## See also

- [JavaScript and the Compiler](/advanced/javascript)
- [Addons](/editor/addons)
- [Editor settings](/editor/settings)

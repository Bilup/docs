---
title: Custom Extensions
sidebar_position: 4
---

# Custom Extensions

The **Custom Extension** library item loads an extension that is not in the built-in list. You can point it at a URL, upload a local file, or paste JavaScript source code directly.

Open **Add Extension** and choose **Custom Extension**.

## Ways to load

- **From a URL** - paste a link ending in `.js`. This is how community extensions from galleries like [extensions.mistium.com](https://extensions.mistium.com/) are loaded. The URL is saved with the project, so the extension reloads from the same URL whenever the project is opened.
- **From a file** - upload a `.js` file from your computer. The extension's code is embedded in the project.
- **From text** - paste the JavaScript source directly.

## Sandboxed vs unsandboxed

When you load a custom extension you choose whether to run it sandboxed or unsandboxed.

- **Sandboxed** extensions run in an isolated worker. They can add blocks and do computation, but they cannot touch the page, the VM internals, or the renderer directly. This is the safer default and is enough for most extensions.
- **Unsandboxed** extensions run with full access to the runtime, the renderer, and the page. They can do things sandboxed extensions cannot (custom reporters that read sprite state, direct rendering, and so on), but they can also do anything the page can do.

As a user, prefer sandboxed unless the extension specifically needs unsandboxed access. If you are writing an extension, [Sandboxed](/building-extensions/sandbox) and [Unsandboxed](/building-extensions/unsandboxed) explain the trade-offs in detail.

## The security prompt

:::warning
Loading a custom extension runs someone else's code. Only load extensions from sources you trust.
:::

Before an extension from a URL or file runs, MistWarp shows a prompt telling you where it came from and letting you cancel. Unsandboxed extensions carry more risk because they are not isolated. If you did not intend to load an extension, or you do not recognise the source, cancel. A malicious extension can read your project, make network requests, and interfere with the page.

## After loading

Custom extension blocks appear as their own category, just like built-in extensions. The extension is saved with the project, so you do not have to reload it every session, and other people who open the project get the same blocks (loaded from the same URL, or embedded if you loaded from a file or text).

## See also

- [Extensions Overview](/extensions/overview)
- [Building Extensions: Introduction](/building-extensions/introduction)
- [Sandboxed extensions](/building-extensions/sandbox)
- [Unsandboxed extensions](/building-extensions/unsandboxed)

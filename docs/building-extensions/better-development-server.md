---
title: A better development server
sidebar_position: 11
---

# A better development server

The Python HTTP server from the [introduction](/building-extensions/introduction) works, but it has two rough edges. This page is optional, but smoothing them removes most of the friction from extension development.

## The two problems

1. **Caching.** `python3 -m http.server` sets cache headers that make the browser hold on to your old file. After you edit the extension you often have to hard-reload (reload ignoring cache) to see the change.
2. **The sandbox.** Anything not served from a trusted origin loads [sandboxed](/building-extensions/sandbox), which forces a one-frame delay per block. That is fine while you are learning, but it hides how your blocks will really behave once shipped.

## Serve on port 8000 to develop unsandboxed

`http://localhost:8000/` is one of the origins MistWarp trusts, so an extension served from there loads [unsandboxed](/building-extensions/unsandboxed) automatically, with no per-load prompt. Point your static server at port 8000 and load the file directly:

```bash
cd path/to/your/extensions
python3 -m http.server 8000
```

Then load `http://localhost:8000/your-extension.js` (or auto-load it with `?extension=http://localhost:8000/your-extension.js`). It must be `localhost` on port `8000` exactly; `127.0.0.1` and `0.0.0.0` are not trusted.

Give the extension an ID that includes your name, like `yournamefetch`, so it does not clash with anyone else's extension ID.

## Get rid of the hard-reload

Use any static server that sends no-cache headers instead of the bare Python one. For example, with Node.js installed:

```bash
npx http-server -p 8000 -c-1
```

`-c-1` disables caching, so a plain reload always fetches the current file. Any equivalent static server works; the only thing that matters is that it runs on port 8000 and does not cache.

## Next steps

With a faster loop, let's cover [more of the APIs and options extensions can use](/building-extensions/assorted-apis).

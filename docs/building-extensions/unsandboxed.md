---
title: Unsandboxed extensions
sidebar_position: 6
---

# Unsandboxed extensions

Unsandboxed extensions run as plain `<script>` tags in the main page instead of in a sandbox. That gives them access to MistWarp's internals, and a matching set of responsibilities.

## When an extension runs unsandboxed

MistWarp decides how to load each extension:

- **Loaded from a file or pasted code**: the custom-extension dialog has a "Run extension without sandbox" checkbox. You choose.
- **Loaded from a URL**: it runs unsandboxed automatically only if the URL begins with one of these trusted prefixes exactly:
  - `https://extensions.mistium.com/`
  - `https://extensions.turbowarp.org/`
  - `http://localhost:8000/`

  Any other URL loads sandboxed, unless the user manually chooses to trust it. There is no way to force an arbitrary URL to load unsandboxed, on purpose, to protect users from malicious extensions.

Since you do not control the two gallery domains, during development you serve your extension from `http://localhost:8000/`. Point your [local server](/building-extensions/introduction) at port 8000. It must be `localhost` on port `8000` exactly; `127.0.0.1` and `0.0.0.0` will not be treated as trusted.

## The template

The syntax is almost identical to a sandboxed extension, wrapped in an [immediately-invoked function expression (IIFE)](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) with strict mode:

```js
(function(Scratch) {
  'use strict';
  class MyExtension {
    getInfo() {
      return { /* ... */ };
    }
  }
  Scratch.extensions.register(new MyExtension());
})(Scratch);
```

The IIFE keeps unsandboxed extensions from clobbering each other. Because they all share one page, two extensions that both declare a global `vm` or `helper` would collide. Wrapping everything in a function with `'use strict'` keeps your variables private and gives each extension its own copy of `Scratch`.

**Every** variable, function, and class your extension defines must live inside the IIFE. This template is also backward compatible: as long as it does not use any unsandboxed-only feature, the same code still works when loaded sandboxed.

Here is a complete unsandboxed hello world ([download](/example-extensions/unsandboxed/hello-world-unsandboxed.js)):

```js
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Hello World example must run unsandboxed');
  }

  class HelloWorld {
    getInfo() {
      return {
        id: 'helloworldunsandboxed',
        name: 'Unsandboxed Hello World',
        blocks: [
          { opcode: 'hello', blockType: Scratch.BlockType.REPORTER, text: 'Hello!' }
        ]
      };
    }
    hello() {
      return 'World!';
    }
  }
  Scratch.extensions.register(new HelloWorld());
})(Scratch);
```

Serve it at `http://localhost:8000/hello-world-unsandboxed.js` and load that exact URL. Put its block inside a `repeat (30)` that adds it to a list; it runs instantly, where the sandboxed version would take at least a second.

## New responsibilities

Unsandboxed code runs in the same page as the user's project, so a mistake can do real damage:

- **Blocks must not throw.** A thrown error can break the script that ran the block.
- **Reporter and boolean blocks must return a valid value** (string, number, or boolean). Returning `undefined` can break scripts in confusing ways.
- **Blocks must not get stuck in infinite loops.** A sandboxed extension that hangs usually just stalls itself; an unsandboxed one freezes the whole page, which can cause **data loss**.

If your extension truly requires unsandboxed mode, fail loudly and early:

```js
if (!Scratch.extensions.unsandboxed) {
  throw new Error('My Extension must run unsandboxed');
}
```

## Accessing MistWarp internals

The headline feature is `Scratch.vm`, the actual VM object:

```js
const vm = Scratch.vm;
```

There is a lot reachable from there. Remember every declaration goes inside the IIFE:

```js
// GOOD
(function(Scratch) {
  const vm = Scratch.vm;
  // ...
}(Scratch));

// BAD: leaks a global
const vm = Scratch.vm;
(function(Scratch) { /* ... */ }(Scratch));
```

Your developer console is the best way to explore: after an extension loads you can inspect `Scratch` and `vm` there. The [scratch-vm source](/contributing/project-structure) is the reference for what exists.

Here is an extension that toggles turbo mode through the VM ([download](/example-extensions/unsandboxed/turbo-mode.js)):

```js
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Turbo Mode example must run unsandboxed');
  }
  const vm = Scratch.vm;

  class TurboMode {
    getInfo() {
      return {
        id: 'turbomodeunsandboxed',
        name: 'Turbo Mode',
        blocks: [
          {
            opcode: 'set',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set turbo mode to [ENABLED]',
            arguments: {
              ENABLED: { type: Scratch.ArgumentType.STRING, menu: 'ENABLED_MENU' }
            }
          }
        ],
        menus: {
          ENABLED_MENU: { acceptReporters: true, items: ['on', 'off'] }
        }
      };
    }
    set(args) {
      vm.setTurboMode(args.ENABLED === 'on');
    }
  }
  Scratch.extensions.register(new TurboMode());
})(Scratch);
```

## The block utility object

A sandboxed block only receives its arguments; it does not even know which sprite ran it. Unsandboxed blocks get a **second** parameter, conventionally `util`, the BlockUtility. `util.target` is the actual sprite (target) running the block ([download](/example-extensions/unsandboxed/block-utility-examples.js)):

```js
getSpriteName(args, util) {
  return util.target.getName();
}
doesVariableExist(args, util) {
  const variable = util.target.lookupVariableByNameAndType(args.NAME.toString(), args.TYPE);
  return !!variable;
}
```

:::warning
Every sprite, script, and block shares **one** `util` object. Rather than allocating a fresh one per call, MistWarp updates the properties of the shared object. So `util` is only valid at the exact moment the block runs. Reading it later (inside a `setTimeout`, a Promise callback, an event handler) gives the wrong target. Save what you need into a local variable first:

```js
// UNRELIABLE: util.target may have changed
myBlock(args, util) {
  setTimeout(() => alert(util.target.getName()), 1000);
}

// RELIABLE: capture the target now
myBlock(args, util) {
  const target = util.target;
  setTimeout(() => alert(target.getName()), 1000);
}
```
:::

A common habit is to alias the frequently used objects at the top of the IIFE:

```js
const vm = Scratch.vm;
const runtime = vm.runtime;
const Cast = Scratch.Cast;
```

## Permissioned APIs

A sandboxed extension is walled off, so it can use `fetch` and similar freely. An unsandboxed extension runs with the page's full power, so it must ask permission before reaching out to the network, opening windows, or redirecting. This keeps the user in control of their privacy. These permission checks also block projects from smuggling in arbitrary JavaScript (for example a `javascript:` redirect URL).

Requests to some well-known static hosts may be approved automatically; others prompt the user. Do not assume either way. Your code must handle the user saying no, behaving as it would with no internet connection.

### Network: fetch, WebSockets, images, audio

Use `Scratch.fetch(url)` instead of `fetch(url)`. For other network-touching APIs, gate them behind `await Scratch.canFetch(url)`:

```js
// Instead of fetch(url):
const response = await Scratch.fetch(url);

// WebSocket:
if (await Scratch.canFetch(url)) {
  const ws = new WebSocket(url);
}

// Image / Audio:
if (await Scratch.canFetch(src)) {
  const image = new Image();
  image.src = src;
}
```

### Opening tabs or windows

Use `Scratch.openWindow(url)` instead of `window.open(url)`. It always opens in a new tab or window. If you must call `window.open` yourself, gate it on `await Scratch.canOpenWindow(url)`:

```js
const win = await Scratch.openWindow(url);
// with features:
const win = await Scratch.openWindow(url, 'width=400,height=400');
```

### Redirecting the page

Use `Scratch.redirect(url)` instead of `location.href = url`, or gate on `await Scratch.canRedirect(url)`.

Other permission checks exist for device access: `Scratch.canRecordAudio()`, `canRecordVideo()`, `canReadClipboard()`, `canNotify()`, `canGeolocate()`, `canEmbed()`, `canDownload()`. See the [Scratch API reference](/building-extensions/apis/scratch-api).

## Exercises

Try these without the hints first; it teaches you how the VM is laid out.

1. A block that clicks the green flag. (Hint: `vm.greenFlag`.)
2. A reporter that returns the sprite's x position. (Hint: `util.target.x`.)
3. A command that moves the sprite to the center of the stage. (Hint: `util.target.setXY(0, 0)`.)

## Next steps

Tired of hard-reloading? Let's set up [a better development server](/building-extensions/better-development-server).

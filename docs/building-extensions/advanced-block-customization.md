---
title: Advanced block customization
sidebar_position: 10
---

# Advanced block customization

This page covers a few techniques that go beyond the normal block-description format. They all require [unsandboxed extensions](/building-extensions/unsandboxed), and they all reach into MistWarp internals that are not stable APIs.

:::warning
Everything here manipulates internal objects and the editor's DOM. It can break when MistWarp or Blockly updates, it is invisible to screen readers, and it does not run in the [packager](/packager/overview) or the player. Use it only when the normal block format genuinely cannot do what you need, and test after every MistWarp update.
:::

## A runtime patching helper

Many advanced extensions wrap an existing MistWarp method to add behavior while still calling the original. This small helper is the common pattern for doing that safely, including only patching once:

```js
const PATCHES_ID = '__myextension_patches';

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

Each replacement function receives `callOriginal` as its first argument, so it decides whether and when to run the original:

```js
patch(vm.runtime.constructor.prototype, {
  visualReport(callOriginal, target, blockId, value) {
    callOriginal(target, blockId, value); // keep normal behavior
    // then do something extra with blockId / value
  }
});
```

Keep a matching `unpatch` if your extension can be disabled, and store the originals (as above) so you can restore them.

## Replacing a block's visuals

MistWarp renders blocks as SVG through Blockly. An unsandboxed extension can find its own blocks in the workspace DOM and replace their contents, for example to show an image instead of text. The "Image Blocks" extension does this.

The idea: give the block empty (or near-empty) text, then, whenever the workspace changes, find the block's `<g>` element by category and opcode and rewrite its contents.

```js
function injectVisuals() {
  const workspace = document.querySelector('g.blocklyWorkspace');
  if (!workspace) return;
  workspace.querySelectorAll('g[data-category="Image Blocks"]').forEach((g) => {
    const block = vm.runtime.getEditingTarget()?.blocks.getBlock(g.dataset.id);
    if (block && block.opcode === 'imageBlocks_cat' && !g.querySelector('svg#custom')) {
      g.innerHTML = `<svg id="custom" width="92" height="92" viewBox="0,0,92,92">
        <image href="https://example.com/cat.png" height="92" width="92" />
      </svg><!--rotationCenter:46:46-->`;
    }
  });
}

vm.runtime.on('PROJECT_CHANGED', injectVisuals);
vm.runtime.on('BLOCK_DRAG_UPDATE', injectVisuals);
vm.runtime.on('BLOCK_DRAG_END', injectVisuals);
```

Notes:

- The trailing `<!--rotationCenter:x:y-->` comment is how Scratch's SVG loader marks the center; keep it.
- Use an (almost) empty block label so only your visual shows. A zero-width character such as `‎` works as the `text` value.
- Re-injection runs often, so keep the DOM work light and bail out early if the element already has your custom content (the `!g.querySelector('svg#custom')` check).
- The same `foreignObject` technique can embed HTML, video, or an iframe, but the more you embed the more fragile and heavy the block becomes. Validate any external URL you insert.

## Reaching another extension

An unsandboxed extension can see which extensions are loaded and, if it knows the internals, call into them. This is inherently brittle (it depends on the other extension's private shape), so treat it as a last resort and fail gracefully.

```js
// Is an extension loaded?
const loaded = vm.extensionManager.isExtensionLoaded('someid');

// The registered instance of an extension, if you need its methods:
const instance = vm.runtime[`ext_someid`];
if (instance && typeof instance.someMethod === 'function') {
  instance.someMethod();
}
```

There is no supported public contract between extensions. If you control both sides, prefer a small explicit interface you define yourself (for example a well-known property on `window`) over poking at private fields, and always guard for the other side being absent.

## Next steps

Next, [a purpose-built development server](/building-extensions/better-development-server) that removes the hard-reload chore.

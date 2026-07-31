---
title: Block registration
sidebar_position: 5
---

Blocks reach the palette in two ways: the built-in categories are registered as internal block
packages when the runtime starts, and extensions register their blocks through the same pipeline
that turns a `getInfo()` descriptor into real scratch-blocks. This page describes how that
happens in `scratch-vm/src/engine/runtime.js`.

## Built-in block packages

The core categories (motion, looks, sound, events, control, sensing, operators, variables, and
custom blocks) are plain classes in `scratch-vm/src/blocks/scratch3_*.js`. On construction, the
runtime calls `_registerBlockPackages()`, which instantiates each package and collects three
things from it:

- `getPrimitives()`: a map of opcode to implementation function. These are stored in
  `runtime._primitives`, keyed by opcode (for example `motion_movesteps`), and are what the
  interpreter calls.
- `getHats()`: metadata for hat blocks (for example whether the hat restarts existing threads),
  stored in `runtime._hats`.
- `getMonitored()`: which reporters can be shown as stage monitors, merged into
  `runtime.monitorBlockInfo`.

Each package is also registered for the compiler via `compilerRegisterExtension(name, object)`,
which attaches it to the runtime as `ext_<name>` so compiled code can reach it.

An opcode is the category name and block name joined by an underscore, like
`looks_sayforsecs`. The palette's block shape, label, and inputs come from the
scratch-blocks definitions in the `scratch-blocks` package; the VM side only provides the opcode
and its behavior.

## Extension blocks

Extensions do not edit those files. They describe their blocks in `getInfo()` and register with
`Scratch.extensions.register` (see the [Extension API](/api-reference/extension-api)). The
extension manager runs `getInfo()` and hands the result to the runtime's
`_registerExtensionPrimitives(extensionInfo)`, which:

1. Builds a category descriptor from the extension's `id`, `name`, colors (`color1`/`color2`/
   `color3`, falling back to defaults), and icons, and pushes it onto `runtime._blockInfo`.
2. Fills the category by converting each block descriptor with `_convertForScratchBlocks`, which
   turns the `text`, `blockType`, and `arguments` into the scratch-blocks XML the editor needs.
3. Registers any custom field types, emitting `EXTENSION_FIELD_ADDED` for each.
4. Emits `EXTENSION_ADDED` with the finished category so the GUI can add it to the palette.

Reloading an extension's blocks calls `_refreshExtensionPrimitives`, which rebuilds the category
and emits `BLOCKSINFO_UPDATE`. Removing one calls `_unregisterExtensionPrimitives` and emits
`EXTENSION_REMOVED`. See [Events](/api-reference/events).

## A block descriptor

Each entry in the `blocks` array of `getInfo()` looks like this:

```js
{
    opcode: 'doThing',
    blockType: Scratch.BlockType.COMMAND,
    text: 'do thing with [INPUT]',
    arguments: {
        INPUT: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: 'hello'
        }
    }
}
```

The runtime namespaces the opcode with the extension ID, so `doThing` on extension `myext`
becomes the opcode `myext_doThing`, and calls the extension instance's `doThing` method when the
block runs. Placeholders in `text` (like `[INPUT]`) are matched to keys in `arguments`.

## Compiled blocks

The interpreter path uses the block methods directly. For extensions that want their blocks to
run through MistWarp's JavaScript compiler, `vm.exports.compiler.register(extensionId, blocks)`
registers a descriptor per opcode with a `type` (one of `any`, `number`, `numberOrNaN`, `string`,
`boolean`, `command`) and a `compile` function. See
[Compiled extensions](/building-extensions/compiled/overview).

## See also

- [Extension API](/api-reference/extension-api)
- [Threads](/api-reference/threads) for how registered blocks execute
- [Events](/api-reference/events)
- [Building custom C blocks](/building-extensions/custom-c-blocks)

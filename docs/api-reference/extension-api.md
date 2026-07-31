---
title: Extension API
sidebar_position: 4
---

An extension adds a category of blocks to the palette. This page is the reference for the
author-facing runtime API: the global `Scratch` object, the `BlockType` and `ArgumentType`
enums, and the registration entry point. For a step-by-step guide, start with
[Building Extensions](/building-extensions/introduction).

An extension is a class with a `getInfo()` method that describes its blocks, plus one method per
block. It registers itself with `Scratch.extensions.register`.

```js
class MyExtension {
    getInfo () {
        return {
            id: 'myextension',
            name: 'My Extension',
            color1: '#ff4c4c',
            blocks: [
                {
                    opcode: 'addTwo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'add [A] and [B]',
                    arguments: {
                        A: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},
                        B: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2}
                    }
                }
            ]
        };
    }
    addTwo (args) {
        return Scratch.Cast.toNumber(args.A) + Scratch.Cast.toNumber(args.B);
    }
}
Scratch.extensions.register(new MyExtension());
```

## The `Scratch` object

For unsandboxed extensions, `Scratch` is a global. Its always-present members come from
`scratch-vm/src/extension-support/tw-extension-api-common.js`:

- `Scratch.ArgumentType`, `Scratch.BlockType`, `Scratch.TargetType`, `Scratch.BlockShape`: the
  enums below.
- `Scratch.Cast`: the [type coercion helpers](/api-reference/utilities) blocks use to normalize
  their inputs. Use these instead of raw `Number(...)`/`String(...)`.

Unsandboxed extensions get more, added per extension when the script runs
(`tw-unsandboxed-extension-runner.js`):

- `Scratch.extensions.register(extensionObject)`: register your extension. `Scratch.extensions.unsandboxed`
  is `true` in this environment.
- `Scratch.vm`: the live [`VirtualMachine`](/api-reference/vm-api).
- `Scratch.renderer`: the attached renderer.
- `Scratch.translate`: format-message helper for localized strings.
- Permission checks (each returns a `Promise<boolean>`): `Scratch.canFetch(url)`,
  `Scratch.canOpenWindow(url)`, `Scratch.canRedirect(url)`, `Scratch.canDownload(url, name)`,
  `Scratch.canEmbed(url)`, `Scratch.canRecordAudio()`, `Scratch.canRecordVideo()`,
  `Scratch.canReadClipboard()`, `Scratch.canNotify()`, `Scratch.canGeolocate()`.
- Guarded actions (each checks the matching permission first, then acts):
  `Scratch.fetch(url, options)`, `Scratch.download(url, file)`, `Scratch.openWindow(url, features)`,
  `Scratch.redirect(url)`.

Always route network and window access through these helpers. They ask the VM's security manager,
which is how the user stays in control of what an extension may reach. See
[Sandboxed vs unsandboxed](/building-extensions/unsandboxed).

## BlockType

From `extension-support/block-type.js`:

| Value | Meaning |
| --- | --- |
| `BlockType.COMMAND` (`'command'`) | Stack block that runs an action. |
| `BlockType.REPORTER` (`'reporter'`) | Returns a number or string. |
| `BlockType.BOOLEAN` (`'Boolean'`) | Hexagonal reporter returning true/false. |
| `BlockType.HAT` (`'hat'`) | Starts a stack when its condition becomes true. |
| `BlockType.EVENT` (`'event'`) | Hat with no predicate; runs when the matching event is fired. |
| `BlockType.CONDITIONAL` (`'conditional'`) | C-block; may run a branch, then continues. |
| `BlockType.LOOP` (`'loop'`) | C-block; re-evaluates after each branch run. |
| `BlockType.BUTTON` (`'button'`) | A palette button, not a runnable block. |
| `BlockType.LABEL` (`'label'`) | A text label in the palette, not a block. |
| `BlockType.XML` (`'xml'`) | Arbitrary scratch-blocks XML. |

## ArgumentType

From `extension-support/argument-type.js`. The type controls which input editor the argument
shows:

| Value | Input shown |
| --- | --- |
| `ArgumentType.NUMBER` (`'number'`) | Number field. |
| `ArgumentType.STRING` (`'string'`) | Text field. |
| `ArgumentType.BOOLEAN` (`'Boolean'`) | Hexagonal boolean slot (no default value). |
| `ArgumentType.ANGLE` (`'angle'`) | Number field with an angle picker. |
| `ArgumentType.COLOR` (`'color'`) | Color picker. |
| `ArgumentType.MATRIX` (`'matrix'`) | 5x5 matrix field. |
| `ArgumentType.NOTE` (`'note'`) | Piano note picker. |
| `ArgumentType.IMAGE` (`'image'`) | Inline image in the block label (not a real input). |
| `ArgumentType.COSTUME` (`'costume'`) | Dropdown of the current target's costumes. |
| `ArgumentType.SOUND` (`'sound'`) | Dropdown of the current target's sounds. |

In `getInfo`, each argument entry takes `type`, an optional `defaultValue`, and an optional `menu`
(the name of a menu defined in the extension's `menus`).

## TargetType

From `extension-support/target-type.js`: `TargetType.SPRITE` (`'sprite'`) and `TargetType.STAGE`
(`'stage'`). Used by filter fields such as a block's `filter` array.

## Block methods

Each block's `opcode` maps to a method on the extension instance. It receives `(args, util)`:

- `args`: an object keyed by argument name, holding the current input values (coerce with
  `Scratch.Cast`).
- `util`: block utilities, including `util.target` (the running target), `util.thread`, and
  `util.startBranch(n, isLoop)` for C-blocks. See [Threads](/api-reference/threads) and
  [Custom C blocks](/building-extensions/custom-c-blocks).

A reporter returns its value. A command returns nothing. Returning a `Promise` makes the block
asynchronous. See [Asynchronicity](/building-extensions/async).

## See also

- [Building Extensions: hello world](/building-extensions/hello-world)
- [Block registration](/api-reference/block-registration) for how `getInfo` becomes real blocks
- [Utilities](/api-reference/utilities) for `Cast` and friends
- [Scratch API for extensions](/building-extensions/apis/scratch-api)

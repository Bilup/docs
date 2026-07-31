---
title: Maintaining compatibility
sidebar_position: 8
---

# Maintaining compatibility

Once people build projects with your extension, changing it the wrong way effectively **corrupts those projects**: blocks disappear, arguments shift, values break. The rules below are about not doing that.

The underlying reason is how projects are saved. A saved project references your blocks by their internal identifiers (the extension ID, block opcodes, and argument names), not by their labels. Rename any of those identifiers and the saved project can no longer find the block.

## What you must never change

### The extension ID

```js
getInfo() {
  return {
    id: 'fetch', // must never change
    // ...
  };
}
```

### Block opcodes and types

Do not rename an opcode or repurpose it. Do not change a block's `blockType`, with two safe exceptions: `REPORTER` to `BOOLEAN`, and `HAT` to `EVENT`. Anything else (for example `HAT` to `BOOLEAN`) breaks projects. To replace a block, add a new one and hide the old one (see below).

### Removing blocks

Never delete a block that projects might use. Hide it instead with `hideFromPalette: true`. Existing copies keep working; it just stops appearing in the palette.

### Argument identifiers and types

An argument's key (`INPUT` in `text: 'block [INPUT]'`) and its `type` must not change or be removed.

### Adding arguments to an existing block

Do not add an argument to a block that already exists. Instead add a new block and reimplement the old one in terms of it:

```js
blocks: [
  {
    blockType: Scratch.BlockType.REPORTER,
    opcode: 'oldBlock',
    text: 'old [INPUT1]',
    arguments: { INPUT1: { /* ... */ } },
    hideFromPalette: true
  },
  {
    blockType: Scratch.BlockType.REPORTER,
    opcode: 'newBlock',
    text: 'new [INPUT1] [INPUT2]',
    arguments: { INPUT1: { /* ... */ }, INPUT2: { /* ... */ } }
  }
]
```

```js
oldBlock(args) {
  return this.newBlock({ ...args, INPUT2: 'Default value' });
}
newBlock(args) {
  // ...
}
```

### `isTerminal`

If a `COMMAND` block does not already have `isTerminal: true`, do not add it. Existing projects that connected a block underneath would break. Add a new block instead.

### `acceptReporters` on menus

Never switch a menu between a field (`acceptReporters: false`) and an input (`acceptReporters: true`). It corrupts projects. Create a new menu and block.

### Behavior

Trivial bug fixes are usually fine. Significantly changing what a block does can break projects that relied on the old behavior. The only reliable safeguard is thorough testing.

## What you can safely change

Extension metadata: `name`, `docsURI`, `color1`/`color2`/`color3`, `menuIconURI`, `blockIconURI`.

Per block and argument:

- `text`, as long as it still contains the same arguments (reordering them is fine)
- `disableMonitor` (turning it on hides the checkbox but keeps existing monitors)
- `hideFromPalette`
- `filter` (adding one hides the block from the palette but keeps existing copies)
- `defaultValue`
- `dataURI` and `flipRTL` on image inputs

For menus you can freely change item `text`, but changing an item's `value` is risky. Adding menu items is always safe; removing them is dangerous.

## When you truly must break compatibility

Sometimes there is no compatible path. In that case, **make a brand new extension with a new ID** and leave the old one untouched. If `fetch` needs a redesign, ship `fetch2` and keep `fetch` working.

## Next steps

Next, the C-shaped blocks: [custom loops and conditionals](/building-extensions/custom-c-blocks).

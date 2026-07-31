---
title: Assorted APIs
sidebar_position: 12
---

# Assorted APIs

Now that you can write extensions, here are more options available in `getInfo()` and on the `Scratch` object. Unless noted, these work in **both** sandboxed and unsandboxed extensions, and can be combined freely.

## Block colors

`color1`, `color2`, and `color3` set the block color, the input color, and the menu color, respectively. `color1` should be the brightest and `color3` the darkest. Use hex codes ([download](/example-extensions/color.js)):

```js
getInfo() {
  return {
    id: 'colorexample',
    name: 'Color Example',
    color1: '#ff0000',
    color2: '#00ff00',
    color3: '#0000ff',
    blocks: [ /* ... */ ]
  };
}
```

Alternate block color modes (High Contrast, Dark, and addon presets) are generated automatically from these values.

## docsURI

`docsURI` adds a button at the top of the extension's block list that opens a documentation page:

```js
getInfo() {
  return {
    id: 'hellodocs',
    name: 'Hello Docs!',
    docsURI: 'https://example.com/my-extension-docs',
    blocks: [ /* ... */ ]
  };
}
```

## disableMonitor

MistWarp automatically offers a monitor checkbox next to any input-less `REPORTER` block (and, unlike Scratch, `BOOLEAN` blocks too). Set `disableMonitor: true` on a block to hide that checkbox ([download](/example-extensions/unmonitorable.js)). Note this does not remove monitors someone already created with an older version of the extension.

## Scratch.Cast

Scratch has its own type-conversion and comparison rules, with plenty of quirks. Rather than reinventing them, use `Scratch.Cast` ([download](/example-extensions/cast.js)):

```js
toNumber({INPUT})   { return Scratch.Cast.toNumber(INPUT); }
castToString({INPUT}) { return Scratch.Cast.toString(INPUT); }
toBoolean({INPUT})  { return Scratch.Cast.toBoolean(INPUT); }

compare({A, B}) {
  const c = Scratch.Cast.compare(A, B);
  // Use < 0, > 0, or === 0. Do NOT use === 1 or === -1.
  if (c === 0) return 'Equal';
  return c > 0 ? 'A is greater' : 'B is greater';
}
```

The full reference is on the [Utility APIs page](/building-extensions/apis/utility-apis).

## hideFromPalette

`hideFromPalette: true` hides a block from the palette without removing it, so copies already in a project keep working. This is the main tool for [backward-compatible changes](/building-extensions/compatibility). Load [hidden-1.js](/example-extensions/hidden-1.js) and save a project using its block, then load [hidden-2.js](/example-extensions/hidden-2.js) (same extension, block now hidden) and reopen the project: the existing block still runs, but it is gone from the palette.

## filter

If a block only makes sense in sprites or only in the stage, set `filter` to an array containing `Scratch.TargetType.SPRITE` or `Scratch.TargetType.STAGE` ([download](/example-extensions/filter.js)):

```js
{
  opcode: 'sprites',
  blockType: Scratch.BlockType.COMMAND,
  text: 'available in ONLY sprites',
  filter: [Scratch.TargetType.SPRITE]
}
```

`filter` only affects which palette a block shows in. It is still possible to end up with the block in the "wrong" target through drag-and-drop or the backpack, so your code must still check `util.target.isStage` when it matters. To hide a block entirely, use `hideFromPalette`, not `filter: []`.

## Icons

There are three ways to attach images:

- `menuIconURI` on the extension: the image shown in the palette. Falls back to `blockIconURI`, then to a colored circle.
- `blockIconURI` on the extension: the default icon on every block.
- `blockIconURI` on a block: overrides the extension's icon for that block.

Each must be a [data: URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs). SVG is preferred; PNG or JPG at least 64x64 also works. Keep them square. See [icons.js](/example-extensions/icons.js).

## Inline images

Put an image inside a block by adding an argument of type `Scratch.ArgumentType.IMAGE` with a `dataURI`. Set `flipRTL: true` to mirror it in right-to-left languages. See [inline-images.js](/example-extensions/inline-images.js).

## Separators

To space out groups of blocks in the palette, put the string `'---'` in the `blocks` array ([download](/example-extensions/separators.js)):

```js
blocks: [
  { opcode: 'block1', blockType: Scratch.BlockType.COMMAND, text: 'group 1' },
  '---',
  { opcode: 'block2', blockType: Scratch.BlockType.COMMAND, text: 'group 2' }
]
```

## Terminal blocks

`isTerminal: true` stops another block from connecting underneath a `COMMAND` block ([download](/example-extensions/terminal.js)). It looks like "stop all", but it does not stop the script; it only blocks the bottom connection. A terminal block at the end of a loop will not stop the loop on its own.

## Next steps

Next, [event and hat blocks](/building-extensions/hats) (if you skipped ahead), or the [API reference pages](/building-extensions/apis/scratch-api) for the full surface of the `Scratch` object, VM, renderer, and audio engine.

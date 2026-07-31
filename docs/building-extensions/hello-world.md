---
title: Hello, world!
sidebar_position: 2
---

# Hello, world!

Here is a complete extension that adds one block, a reporter that returns "World!". Save it as `hello-world.js` where your [development server](/building-extensions/introduction) can serve it ([download](/example-extensions/hello-world.js)).

```js
class HelloWorld {
  getInfo() {
    return {
      id: 'helloworld',
      name: 'It works!',
      blocks: [
        {
          opcode: 'hello',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Hello!'
        }
      ]
    };
  }

  hello() {
    return 'World!';
  }
}

Scratch.extensions.register(new HelloWorld());
```

Load it in the editor: "Add Extension", scroll to the bottom, "Custom Extension", then enter the URL of your local server (or paste the code / pick the file). For now **do not** check "Run extension without sandbox".

After a moment an extension named "It works!" appears in the palette. If it does not, open the developer console and look for errors. The usual causes are a JavaScript syntax error, a runtime error (both show in the console), or an ad blocker blocking requests to localhost.

Now let's walk through the file in the order it runs.

## Registering

```js
Scratch.extensions.register(new HelloWorld());
```

`Scratch` is the global object MistWarp hands to every extension. `Scratch.extensions.register` is how your extension tells MistWarp it exists. The class name (`HelloWorld`) does not matter and does not need to be unique.

Call `register()` **exactly once**. If you never call it, MistWarp waits forever for your extension to load. If you call it more than once, the behavior is undefined.

## getInfo()

```js
getInfo() {
  return {
    id: 'helloworld',
    name: 'It works!',
    blocks: [
      {
        opcode: 'hello',
        blockType: Scratch.BlockType.REPORTER,
        text: 'Hello!'
      }
    ]
  };
}
```

After you call `register()`, MistWarp calls `getInfo()` on your object to learn about the extension. It must return an object describing the extension:

| Field | Type | Description |
|:-:|:-:|:--|
| `id` | string | A unique ID for this extension. No two loaded extensions can share an ID. Use only `a-z` and `0-9`, no spaces or symbols. It becomes part of every block's internal opcode and **must never change** once projects use it. |
| `name` | string | The name shown in the palette. Defaults to the `id` if omitted. |
| `blocks` | array | The blocks this extension provides. |

Each block object commonly has:

| Field | Type | Description |
|:-:|:-:|:--|
| `opcode` | string | The name of the method that runs when the block runs. `opcode: 'hello'` runs `this.hello()`. Must be unique within the extension. |
| `blockType` | `Scratch.BlockType.*` | The block's shape and behavior. See below. |
| `text` | string | The label shown on the block. Argument placeholders go here (next page). |
| `arguments` | object | Optional. Covered in [Dealing with inputs](/building-extensions/inputs). |

The common block types:

| Value | Shape | Example |
|:-:|:--|:--|
| `Scratch.BlockType.COMMAND` | Stack block, no return value | move 10 steps |
| `Scratch.BlockType.REPORTER` | Round block returning a string or number | x position |
| `Scratch.BlockType.BOOLEAN` | Pointed block returning true/false | mouse down? |
| `Scratch.BlockType.HAT` | Starts a script on a condition | when loudness > 10 |
| `Scratch.BlockType.EVENT` | Starts a script on an event | when this sprite clicked |

`HAT` and `EVENT` are covered in [Events and hats](/building-extensions/hats). `CONDITIONAL` and `LOOP` (C-shaped blocks) are covered in [Custom C blocks](/building-extensions/custom-c-blocks).

## The block function

```js
hello() {
  return 'World!';
}
```

This is the method named by `opcode: 'hello'`. Reporter blocks return a string or number; boolean blocks return `true` or `false`. Do not return `null`, `undefined`, arrays, or objects; those are not valid block values and will cause problems.

## Iterating quickly

Change the file, then reload the editor page. Two things make this faster:

- The `?extension=` URL parameter auto-loads an extension. If your file is at `http://localhost:8080/hello-world.js`, open `https://warp.mistium.com/editor?extension=http://localhost:8080/hello-world.js` to load it without going through the library.
- If changes are not showing up after a reload, use your browser's "hard refresh" (reload ignoring cache).

## Exercises

1. Change the block to return your favorite number instead of a string, and rename the block text to match.
2. Change the block's opcode (remember to rename the method too).
3. Add a second block with `blockType: Scratch.BlockType.BOOLEAN` that returns `true` or `false` at random.

## Next steps

Next, [let blocks take inputs](/building-extensions/inputs).

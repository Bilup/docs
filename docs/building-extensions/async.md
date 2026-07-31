---
title: Waiting for things that aren't instant
sidebar_position: 4
---

# Waiting for things that aren't instant

Sometimes a block has to wait for an asynchronous operation before the script continues. Network requests are the classic example: no matter how fast your connection is, a request is never instant.

The way a block signals "I am not done yet" is to return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). MistWarp waits for the Promise to resolve before running the next block, and may run other scripts in the meantime ([download](/example-extensions/async.js)):

```js
class AsyncExtension {
  getInfo() {
    return {
      id: 'asyncexample',
      name: 'Async Blocks',
      blocks: [
        {
          opcode: 'wait',
          text: 'wait [TIME] seconds',
          blockType: Scratch.BlockType.COMMAND,
          arguments: {
            TIME: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
          }
        },
        {
          opcode: 'fetch',
          text: 'fetch [URL]',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'https://extensions.mistium.com/hello.txt'
            }
          }
        }
      ]
    };
  }

  wait(args) {
    return new Promise((resolve) => {
      setTimeout(resolve, args.TIME * 1000);
    });
  }

  fetch(args) {
    return fetch(args.URL)
      .then((response) => response.text())
      .catch((error) => {
        console.error(error);
        return 'Uh oh! Something went wrong.';
      });
  }
}
Scratch.extensions.register(new AsyncExtension());
```

Async blocks are declared in `getInfo()` exactly like any other block. The only thing that changes is what the function returns.

## Notes on the two blocks

The `wait` block is roughly Scratch's built-in `wait` block. `setTimeout` does not use Promises, so we construct one by hand and resolve it inside the timeout. Because `wait` is a command (no return value), it resolves with nothing.

The `fetch` block requests a URL, like the "Fetch" extension in the gallery. `fetch()` already returns a Promise, so we chain onto it rather than making a new one. The rule that reporters must return a string, number, or boolean still applies, so we call `.text()` to turn the `Response` object into a string.

## Always handle errors

Any Promise that can reject needs a `.catch()`. How you handle the failure depends on the block, but a reporter should still return a valid string or number; returning an error message (as above) is a reasonable default. An unhandled rejection can leave the script stuck.

:::info
In an [unsandboxed extension](/building-extensions/unsandboxed) you should use `Scratch.fetch(url)` instead of the plain `fetch(url)` shown here, so the user's fetch permission settings are respected. In a sandboxed extension, plain `fetch` is fine.
:::

## Exercises

1. Write a command block that waits 100ms the first time it runs, 200ms the second time, 300ms the third, and so on.

## Next steps

Even blocks that do not return a Promise are not truly instant, and cannot reach many APIs. To understand why, we need to talk about [the sandbox](/building-extensions/sandbox).

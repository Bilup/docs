---
title: 等待非即时的事物
sidebar_position: 4
---

# 等待非即时的事物

有时积木必须在脚本继续之前等待异步操作。网络请求是经典示例：无论您的连接多快，请求都不可能是即时的。

积木表示"我还没完成"的方式是返回一个 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)。Bilup 在运行下一个积木之前等待 Promise 解析，并且可能同时运行其他脚本（[下载](/example-extensions/async.js)）：

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
              defaultValue: 'https://extensions.bilup.org/hello.txt'
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

异步积木在 `getInfo()` 中声明的方式与其他积木完全一样。唯一改变的是函数返回什么。

## 关于两个积木的说明

`wait` 积木大致是 Scratch 内置的 `wait` 积木。`setTimeout` 不使用 Promise，因此我们手动构造一个并在超时内解析它。因为 `wait` 是命令（无返回值），它解析时不带任何值。

`fetch` 积木请求一个 URL，就像画廊中的"Fetch"扩展一样。`fetch()` 已经返回一个 Promise，因此我们在它上面链接，而不是制作新的。报告积木必须返回字符串、数字或布尔值的规则仍然适用，因此我们调用 `.text()` 将 `Response` 对象变成字符串。

## 总是处理错误

任何可能拒绝的 Promise 都需要 `.catch()`。您如何处理失败取决于积木，但报告积木仍应返回有效的字符串或数字；返回错误消息（如上）是合理的默认值。未处理的拒绝可能让脚本卡住。

::::info
在[非沙箱扩展](/building-extensions/unsandboxed)中，您应该使用 `Scratch.fetch(url)` 而不是这里显示的普通 `fetch(url)`，以便尊重用户的获取权限设置。在沙箱扩展中，普通 `fetch` 没问题。
::::

## 练习

1. 写一个命令积木，第一次运行等待 100 毫秒，第二次 200 毫秒，第三次 300 毫秒，依此类推。

## 下一步

即使不返回 Promise 的积木也不是真正即时的，并且无法接触许多 API。要理解为什么，我们需要谈谈[沙箱](/building-extensions/sandbox)。

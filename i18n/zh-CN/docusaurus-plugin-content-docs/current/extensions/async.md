---
hide_table_of_contents: true
---

# 处理非即时操作

import {ExtensionCode} from './utils.js';

有时你会希望你的扩展等待"异步"操作完成后再继续执行（而不是提前继续执行并可能导致问题）。一个常见的例子是发出请求：无论你的互联网速度有多快，任何网络请求都不会是即时的。

现代 JavaScript 有一个处理这些问题的很酷的工具：[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)。这是你的积木如何通知 Scratch 你的积木正在等待异步操作完成，以及最终的值。

<ExtensionCode title="async">{require('!raw-loader!@site/static/example-extensions/async.js')}</ExtensionCode>

请注意，异步积木在 getInfo() 中的定义与其他积木相同。唯一的区别是函数的返回值。

这个问题中的第一个积木大致相当于 Scratch 的内置等待积木。请注意，这次我们必须手动构造一个 Promise，因为 setTimeout 不使用 Promise。当 Scratch 遇到这个积木时，它不会继续执行脚本，直到这个 promise 解决。Scratch 可能在此期间继续执行其他脚本。Wait 是一个命令积木（没有返回值），所以它不应该用任何东西解决（会被忽略）。

第二个积木是一个尝试获取 URL 的积木，类似于 https://extensions.turbowarp.org/ 上的"Fetch"扩展。fetch() 已经返回一个 promise，所以这次我们只是在它上面链式调用，而不是创建一个新的 promise。

返回值的限制仍然适用：你仍然需要确保返回字符串、数字或布尔值，所以我们在 then() 中调用 text() 将 fetch() 的 Response 对象转换为字符串。

这也展示了错误处理。每当你的 promise 可能拒绝、失败或出错时，你应该添加 catch()。具体如何处理这取决于你的用例，但通常你会想将错误记录到控制台并返回一个指示错误的字符串。

## 练习

1. 创建一个每次调用时等待 100ms 的积木。例如，第一次运行时等待 100ms，然后是 200ms，然后是 300ms，然后是 400ms，等等。

## 下一步

你可能已经意识到，即使是不返回 Promise 的积木实际上也不是立即运行的，并且你的扩展无法访问许多 API。要确定原因，我们需要[讨论"沙盒"到底是什么，以及它对你的扩展意味着什么](./sandbox.md)。
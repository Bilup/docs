---
hide_table_of_contents: true
---

# 非沙盒化扩展

import {ExtensionCode, Spoiler} from './utils.js';

非沙盒化扩展作为普通的 `<script>` 标签在主窗口中运行，而不是在沙盒中。它们可以访问许多我们将在下面讨论的新功能和职责。

## URL 限制

为了保护用户免受恶意扩展的侵害，从 URL 加载的扩展只有在其 URL 恰好以以下之一开头时才会在非沙盒环境中运行：

- `https://extensions.turbowarp.org/`
- `http://localhost:8000/`

由于你无法控制 extensions.turbowarp.org，你将不得不使用后一个选项。为此，将本地 HTTP 服务器配置为在端口 8000 上运行，而不是你目前使用的端口。

当从文件或 JavaScript 源代码手动加载扩展时，有一个选项可以在没有沙盒的情况下加载扩展。由于安全考虑，使用 URL 时不存在强制扩展在非沙盒环境中运行的选项。

## 语法

非沙盒化扩展的语法非常熟悉，但有一些不同。从技术上讲，如果你只是将旧的沙盒化扩展复制粘贴为非沙盒化扩展，它似乎会正常工作。然而，这是危险的，很可能在以后导致 bug。

如果你的沙盒化扩展有类似这样的代码：

```js
// 旧的沙盒化扩展（worker 或 <iframe> 沙盒）：
class MyExtension {
  getInfo () {
    return { /* ... */ };
  }
}
Scratch.extensions.register(new MyExtension());
```

或者如果你的扩展使用旧的"插件"机制，例如这个：（如果你不认识这段代码，不用担心）

```js
class MyExtension {
  getInfo () {
    return { /* ... */ };
  }
}
(function() {
  var extensionInstance = new MyExtension(window.vm.extensionManager.runtime)
  var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
  window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})();
```

非沙盒化版本的代码如下：

```js
(function(Scratch) {
  'use strict';
  class MyExtension {
    getInfo () {
      return { /* ... */ };
    }
  }
  Scratch.extensions.register(new MyExtension());
})(Scratch);
```

使用此模板可防止非沙盒化扩展在尝试定义同名变量、类或函数时相互干扰。通过要求所有内容都在[立即调用函数表达式 (IIFE)](https://developer.mozilla.org/en-US/docs/Glossary/IIFE) 中定义并启用[严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)，我们防止变量意外泄漏到全局作用域。

扩展定义的*所有*函数和变量都必须在 IIFE 内定义。此外，每个扩展必须确保使用其自己的 `Scratch` API 副本，此模板会自动执行此操作。

关于此模板的一个有趣的事情是它与沙盒化扩展向后兼容。只要扩展不使用非沙盒化扩展提供的任何功能，它将继续作为沙盒化扩展工作。

## 更完整的示例

在这里你可以看到一个完整的非沙盒化扩展：

<ExtensionCode title="unsandboxed/hello-world-unsandboxed" sandbox={false}>{require("!raw-loader!@site/static/example-extensions/unsandboxed/hello-world-unsandboxed.js")}</ExtensionCode>

如果你使用本地 HTTP 服务器，请保存此文件，以便你可以通过服务器访问它，然后在 Bilup 中加载确切的 URL [http://localhost:8000/hello-world-unsandboxed.js](http://localhost:8000/hello-world-unsandboxed.js)。如果没有任何东西出现，请查看开发者控制台。如果你看到错误提示扩展必须在非沙盒环境中运行，很可能你使用的是旧版本的 Bilup，或者你没有从恰好以 `http://localhost:8000/` 开头的 URL 加载它。127.0.0.1 和 0.0.0.0 将不起作用！必须是 localhost，端口恰好是 8000。

如果你只是使用文件，请确保每次加载扩展时都选中"在沙盒外运行扩展"框。

创建一个新的空项目，使用重复（30）循环将"hello"积木添加到列表中。请注意，它现在立即运行，而沙盒化版本至少需要一秒钟。

观察到大部分代码仍然相同：你仍然创建一个类，然后调用 Scratch.extensions.register()，然后 Scratch 调用 getInfo()，它返回相同类型的对象。只是周围的模板不同。

## 能力越大，责任越大

在我们讨论新 API 之前，我们想指出非沙盒化扩展的一些额外要求：

- 积木不能抛出错误。虽然沙盒化扩展可以，但这样做的非沙盒化扩展可能会破坏脚本。
- 输入和布尔积木必须返回有效值。虽然沙盒化扩展可以忽略这一点，但不返回正确值（字符串、数字或布尔值）的非沙盒化扩展可能会以未知方式破坏脚本。
- 积木不能陷入无限循环。虽然沙盒化扩展通常无法在陷入循环时冻结整个窗口，但非沙盒化扩展会。这可能导致**数据丢失**。

## 访问 Scratch 内部

非沙盒化扩展可以做的大事是直接访问 Scratch 内部。

```js
  const vm = Scratch.vm;
```

这是对实际 Scratch VM 对象的完全访问。你可以用它做很多事情。

记住——每个变量声明都必须在 IIFE *内部*发生。

```js
// GOOD CODE
(function(Scratch) {
  const vm = Scratch.vm;
  // ...
}(Scratch));

// BAD CODE
const vm = Scratch.vm;
(function(Scratch) {
  // ...
}(Scratch));
```

花点时间找找你要找的东西。你的开发者工具将非常有用，因为你可以在扩展加载后从那里访问 `Scratch`，或者使用其他可用的[调试全局变量](../development/globals)（但请不要在扩展中使用这些）。你可能会发现 [scratch-vm 源代码](https://github.com/TurboWarp/scratch-vm/) 或 [@turbowarp/types](https://github.com/turboWarp/types) 是有用的资源。

这是一个使用 Scratch.vm 切换加速模式的扩展示例，类似于 [extensions.turbowarp.org](https://extensions.turbowarp.org/) 上的"运行时选项"扩展：

<ExtensionCode title="unsandboxed/turbo-mode">{require("!raw-loader!@site/static/example-extensions/unsandboxed/turbo-mode.js")}</ExtensionCode>

## 积木工具对象

当沙盒化自定义扩展运行时，它只接收脚本提供的参数。它甚至不知道哪个角色正在执行它。我们现在介绍传递给积木函数的第二个参数：BlockUtility。

BlockUtility 对象（通常称为 `util`）允许非沙盒化扩展中的积木使用 `util.target` 直接访问运行它们的角色。与 VM 类似，这是内部使用的实际对象。你可以完全访问它。

这是一个演示使用 `util.target` 获取当前角色名称或访问变量的扩展示例。

<ExtensionCode title="unsandboxed/block-utility-examples">{require("!raw-loader!@site/static/example-extensions/unsandboxed/block-utility-examples.js")}</ExtensionCode>

请注意，每个角色、脚本和积木共享同一个积木工具对象。为了提高性能，它不是每次你的积木运行时都创建一个对象，而是更新共享对象的属性。因此，访问 `util` 的唯一安全时间是积木运行时立即访问。尝试在 setTimeout、setInterval、Promise 回调或其他非同步回调中访问 `util` 将无法正常工作。如果你需要稍后访问 `util` 的属性，请提前将它们保存在变量中。

```js
  // 这不可靠，可能会警告错误的东西：
  myBlock(args, util) {
    setTimeout(() => {
      alert(util.target.getName());
    }, 1000);
  }

  // 这总是有效：
  myBlock(args, util) {
    const target = util.target;
    setTimeout(() => {
      alert(target.getName());
    }, 1000);
  }
```

## 下一步

现在你知道了基础知识，让我们看看一些[更高级的 API 和技术](./assorted-apis)。
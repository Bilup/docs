---
title: 非沙箱扩展
sidebar_position: 6
---

# 非沙箱扩展

非沙箱扩展作为主页面中的普通 `<script>` 标签运行，而不是在沙箱中。这让它们可以访问 Bilup 的内部，以及一组相应的责任。

## 扩展何时以非沙箱方式运行

Bilup 决定如何加载每个扩展：

- **从文件或粘贴的代码加载**：自定义扩展对话框有一个"不进入沙箱运行扩展"复选框。由您选择。
- **从 URL 加载**：只有当 URL 恰好以下面一个受信任前缀开头时，它才自动以非沙箱方式运行：
  - `https://extensions.bilup.org/`
  - `https://extensions.turbowarp.org/`
  - `http://localhost:8000/`

  任何其他 URL 都以沙箱方式加载，除非用户手动选择信任它。无法强制任意 URL 以非沙箱方式加载，这是故意的，为了保护用户免受恶意扩展的侵害。

由于您不控制那两个画廊域名，开发期间您从 `http://localhost:8000/` 提供扩展。将您的[本地服务器](/building-extensions/introduction)指向 8000 端口。它必须恰好是 8000 端口上的 `localhost`；`127.0.0.1` 和 `0.0.0.0` 不会被视为受信任。

## 模板

语法与沙箱扩展几乎相同，包裹在[立即调用函数表达式（IIFE）](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)中并使用严格模式：

```js
(function(Scratch) {
  'use strict';
  class MyExtension {
    getInfo() {
      return { /* ... */ };
    }
  }
  Scratch.extensions.register(new MyExtension());
})(Scratch);
```

IIFE 防止非沙箱扩展相互干扰。因为它们共享一个页面，两个都声明全局 `vm` 或 `helper` 的扩展会冲突。将一切包裹在带 `'use strict'` 的函数中可以让您的变量保持私有，并给每个扩展自己的 `Scratch` 副本。

您的扩展定义的**每个**变量、函数和类都必须位于 IIFE 内部。这个模板也是向后兼容的：只要不使用任何仅非沙箱的功能，同样的代码在沙箱加载时仍然有效。

这里有一个完整的非沙箱 hello world（[下载](/example-extensions/unsandboxed/hello-world-unsandboxed.js)）：

```js
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Hello World example must run unsandboxed');
  }

  class HelloWorld {
    getInfo() {
      return {
        id: 'helloworldunsandboxed',
        name: 'Unsandboxed Hello World',
        blocks: [
          { opcode: 'hello', blockType: Scratch.BlockType.REPORTER, text: 'Hello!' }
        ]
      };
    }
    hello() {
      return 'World!';
    }
  }
  Scratch.extensions.register(new HelloWorld());
})(Scratch);
```

在 `http://localhost:8000/hello-world-unsandboxed.js` 提供它并加载那个确切 URL。把它的积木放进一个将它加入列表的 `重复执行 (30)` 中；它会立即运行，而沙箱版本至少要花一秒。

## 新责任

非沙箱代码与用户的项目在同一页面上运行，因此一个错误可能造成真正的损害：

- **积木绝不能抛出异常。** 抛出的错误可能破坏运行该积木的脚本。
- **报告和布尔积木必须返回有效值**（字符串、数字或布尔值）。返回 `undefined` 可能以令人困惑的方式破坏脚本。
- **积木绝不能陷入无限循环。** 挂起的沙箱扩展通常只是停滞自身；非沙箱的会冻结整个页面，这可能导致**数据丢失**。

如果您的扩展确实需要非沙箱模式，请响亮且尽早地失败：

```js
if (!Scratch.extensions.unsandboxed) {
  throw new Error('My Extension must run unsandboxed');
}
```

## 访问 Bilup 内部

头条功能是 `Scratch.vm`，实际的 VM 对象：

```js
const vm = Scratch.vm;
```

从那里可以访问很多东西。记住每个声明都放在 IIFE 内部：

```js
// 好
(function(Scratch) {
  const vm = Scratch.vm;
  // ...
}(Scratch));

// 坏：泄漏一个全局
const vm = Scratch.vm;
(function(Scratch) { /* ... */ }(Scratch));
```

您的开发者控制台是最好的探索方式：扩展加载后，您可以在那里检查 `Scratch` 和 `vm`。[scratch-vm 源码](/contributing/project-structure)是存在什么的参考。

这里有一个通过 VM 切换涡轮模式的扩展（[下载](/example-extensions/unsandboxed/turbo-mode.js)）：

```js
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Turbo Mode example must run unsandboxed');
  }
  const vm = Scratch.vm;

  class TurboMode {
    getInfo() {
      return {
        id: 'turbomodeunsandboxed',
        name: 'Turbo Mode',
        blocks: [
          {
            opcode: 'set',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set turbo mode to [ENABLED]',
            arguments: {
              ENABLED: { type: Scratch.ArgumentType.STRING, menu: 'ENABLED_MENU' }
            }
          }
        ],
        menus: {
          ENABLED_MENU: { acceptReporters: true, items: ['on', 'off'] }
        }
      };
    }
    set(args) {
      vm.setTurboMode(args.ENABLED === 'on');
    }
  }
  Scratch.extensions.register(new TurboMode());
})(Scratch);
```

## 积木工具对象

沙箱积木只接收它的参数；它甚至不知道是哪个角色运行了它。非沙箱积木获得**第二个**参数，习惯上叫 `util`，即 BlockUtility。`util.target` 是运行积木的实际角色（目标）（[下载](/example-extensions/unsandboxed/block-utility-examples.js)）：

```js
getSpriteName(args, util) {
  return util.target.getName();
}
doesVariableExist(args, util) {
  const variable = util.target.lookupVariableByNameAndType(args.NAME.toString(), args.TYPE);
  return !!variable;
}
```

::::warning
每个角色、脚本和积木共享**一个** `util` 对象。Bilup 不是每次调用分配新的，而是更新共享对象的属性。因此 `util` 只在积木运行的准确时刻有效。稍后读取它（在 `setTimeout`、Promise 回调、事件处理器内部）会得到错误的目标。请先把您需要的保存到局部变量中：

```js
// 不可靠：util.target 可能已更改
myBlock(args, util) {
  setTimeout(() => alert(util.target.getName()), 1000);
}

// 可靠：立即捕获目标
myBlock(args, util) {
  const target = util.target;
  setTimeout(() => alert(target.getName()), 1000);
}
```
::::

一个常见习惯是在 IIFE 顶部为频繁使用的对象起别名：

```js
const vm = Scratch.vm;
const runtime = vm.runtime;
const Cast = Scratch.Cast;
```

## 需要权限的 API

沙箱扩展被隔离，因此它可以自由使用 `fetch` 和类似的。非沙箱扩展以页面的全部权力运行，因此它在接触网络、打开窗口或重定向前必须请求权限。这让用户掌握其隐私的控制权。这些权限检查还阻止项目偷偷带入任意 JavaScript（例如 `javascript:` 重定向 URL）。

对某些知名静态主机的请求可能会自动批准；其他的会提示用户。不要假设任何一种方式。您的代码必须处理用户说不的情况，就像在没有互联网连接时那样行为。

### 网络：fetch、WebSocket、图片、音频

使用 `Scratch.fetch(url)` 而不是 `fetch(url)`。对于其他接触网络的 API，将它们放在 `await Scratch.canFetch(url)` 后面：

```js
// 而不是 fetch(url)：
const response = await Scratch.fetch(url);

// WebSocket：
if (await Scratch.canFetch(url)) {
  const ws = new WebSocket(url);
}

// 图片 / 音频：
if (await Scratch.canFetch(src)) {
  const image = new Image();
  image.src = src;
}
```

### 打开标签页或窗口

使用 `Scratch.openWindow(url)` 而不是 `window.open(url)`。它总是在新标签页或窗口中打开。如果您必须自己调用 `window.open`，请将它放在 `await Scratch.canOpenWindow(url)` 后面：

```js
const win = await Scratch.openWindow(url);
// 带特性：
const win = await Scratch.openWindow(url, 'width=400,height=400');
```

### 重定向页面

使用 `Scratch.redirect(url)` 而不是 `location.href = url`，或放在 `await Scratch.canRedirect(url)` 后面。

设备访问存在其他权限检查：`Scratch.canRecordAudio()`、`canRecordVideo()`、`canReadClipboard()`、`canNotify()`、`canGeolocate()`、`canEmbed()`、`canDownload()`。请参阅 [Scratch API 参考](/building-extensions/apis/scratch-api)。

## 练习

先不看提示尝试这些；它教您 VM 是如何布局的。

1. 一个点击绿旗的积木。（提示：`vm.greenFlag`。）
2. 一个返回角色 x 坐标的报告积木。（提示：`util.target.x`。）
3. 一个将角色移到舞台中心的命令。（提示：`util.target.setXY(0, 0)`。）

## 下一步

厌倦了硬刷新？让我们设置[一个更好的开发服务器](/building-extensions/better-development-server)。

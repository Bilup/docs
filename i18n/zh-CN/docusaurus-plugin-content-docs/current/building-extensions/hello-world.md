---
title: 你好，世界！
sidebar_position: 2
---

# 你好，世界！

这里有一个完整的扩展，它添加一个积木，一个返回"World!"的报告积木。将其保存为 `hello-world.js`，放在您的[开发服务器](/building-extensions/introduction)可以提供服务的位置（[下载](/example-extensions/hello-world.js)）。

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

在编辑器中加载它："添加扩展"，滚动到底部，"自定义扩展"，然后输入您本地服务器的 URL（或粘贴代码 / 选择文件）。现在**不要**勾选"不进入沙箱运行扩展"。

片刻之后，一个名为"It works!"的扩展出现在积木区中。如果没有，请打开开发者控制台查找错误。常见原因是 JavaScript 语法错误、运行时错误（两者都显示在控制台中），或广告拦截器阻止了对 localhost 的请求。

现在让我们按运行顺序逐段浏览该文件。

## 注册

```js
Scratch.extensions.register(new HelloWorld());
```

`Scratch` 是 Bilup 交给每个扩展的全局对象。`Scratch.extensions.register` 是您的扩展告诉 Bilup 它存在的方式。类名（`HelloWorld`）无关紧要，也不需要唯一。

**恰好**调用一次 `register()`。如果您从不调用它，Bilup 会永远等待您的扩展加载。如果您调用多次，行为是未定义的。

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

调用 `register()` 后，Bilup 会在您的对象上调用 `getInfo()` 来了解扩展。它必须返回一个描述扩展的对象：

| 字段 | 类型 | 描述 |
|:-:|:-:|:--|
| `id` | string | 此扩展的唯一 ID。没有两个已加载的扩展可以共享一个 ID。只使用 `a-z` 和 `0-9`，不要用空格或符号。它成为每个积木内部操作码的一部分，并且一旦项目使用它，就**绝不能更改**。 |
| `name` | string | 积木区中显示的名称。省略时默认为 `id`。 |
| `blocks` | array | 此扩展提供的积木。 |

每个积木对象通常具有：

| 字段 | 类型 | 描述 |
|:-:|:-:|:--|
| `opcode` | string | 积木运行时运行的方法名。`opcode: 'hello'` 运行 `this.hello()`。在扩展内必须唯一。 |
| `blockType` | `Scratch.BlockType.*` | 积木的形状和行为。见下文。 |
| `text` | string | 积木上显示的标签。参数占位符放在这里（下一页）。 |
| `arguments` | object | 可选。[处理输入](/building-extensions/inputs)中介绍。 |

常见的积木类型：

| 值 | 形状 | 示例 |
|:-:|:--|:--|
| `Scratch.BlockType.COMMAND` | 堆叠积木，无返回值 | 移动 10 步 |
| `Scratch.BlockType.REPORTER` | 返回字符串或数字的圆形积木 | x 坐标 |
| `Scratch.BlockType.BOOLEAN` | 返回真/假的尖形积木 | 鼠标按下? |
| `Scratch.BlockType.HAT` | 在条件上启动脚本 | 当响度 > 10 |
| `Scratch.BlockType.EVENT` | 在事件上启动脚本 | 当角色被点击时 |

`HAT` 和 `EVENT` 在[事件和帽子](/building-extensions/hats)中介绍。`CONDITIONAL` 和 `LOOP`（C 形积木）在[自定义 C 积木](/building-extensions/custom-c-blocks)中介绍。

## 积木函数

```js
hello() {
  return 'World!';
}
```

这是由 `opcode: 'hello'` 命名的方法。报告积木返回字符串或数字；布尔积木返回 `true` 或 `false`。不要返回 `null`、`undefined`、数组或对象；这些不是有效的积木值，会导致问题。

## 快速迭代

更改文件，然后重新加载编辑器页面。有两件事可以让这更快：

- `?extension=` URL 参数会自动加载扩展。如果您的文件在 `http://localhost:8080/hello-world.js`，打开 `https://com.bilup.org/editor?extension=http://localhost:8080/hello-world.js` 来加载它，无需经过素材库。
- 如果重新加载后更改没有显示，请使用浏览器的"硬刷新"（忽略缓存重新加载）。

## 练习

1. 将积木改为返回您最喜欢的数字而不是字符串，并重命名积木文本以匹配。
2. 更改积木的操作码（记住也要重命名方法）。
3. 添加第二个 `blockType: Scratch.BlockType.BOOLEAN` 的积木，随机返回 `true` 或 `false`。

## 下一步

接下来，[让积木接受输入](/building-extensions/inputs)。

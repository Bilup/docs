---
hide_table_of_contents: true
---

# Hello, world!

import {ExtensionCode} from './utils.js';

让我们从创建一个非常简单的扩展开始。这个扩展只添加一个返回 "Hello, world!" 的积木：

<ExtensionCode title="hello-world">{require('!raw-loader!@site/static/example-extensions/hello-world.js')}</ExtensionCode>

上面是我们用于显示扩展代码的标准组件。请注意标题旁边的"试用此扩展"按钮——通过该链接，你无需在本地进行任何设置即可查看此扩展的功能。请注意，这些扩展主要用于演示 API 功能；它们不打算在项目中实际使用。[extensions.turbowarp.org](https://extensions.turbowarp.org/) 上几乎总会有另一个扩展做同样的事情，但更好。

如果你只是使用简单文件开发扩展，将此代码保存到名为 "hello-world.js" 的文件中。如果你使用本地 HTTP 服务器，将代码保存在服务器允许你访问的名为 "hello-world.js" 的文件中。

现在，转到 Bilup 编辑器，单击添加扩展按钮(积木旁边的 +)，滚动到 Scratch 部分的底部，然后选择"自定义扩展"选项。输入本地 HTTP 服务器的完整 URL，或使用其他选项卡选择文件或粘贴代码。目前，**不要**选中"在沙盒外运行扩展"框。

一秒钟后，一个名为 "It works!" 的扩展应该会出现在侧边栏中。如果没有出现，请打开开发者工具并在控制台中查找任何警告。一些最常见的错误是：

- JavaScript 中的语法错误。这应该出现在浏览器的开发者工具中。
- JavaScript 中的运行时错误。这应该出现在浏览器的开发者工具中。
- 你的广告拦截器或浏览器阻止了对 localhost 的请求。尝试关闭广告拦截器。一旦你的扩展发布在面向互联网的网站上，这应该不是问题。

现在，我们将按运行顺序剖析此文件中发生的事情。

## 构造和注册

```javascript
class MyExtension {
```

这是一个标准的 [JavaScript 类](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)。通常以类的形式定义你的扩展。类的名称无关紧要，但我们建议以某种方式基于扩展的名称来命名。在此阶段它不必是唯一的。

```javascript
Scratch.extensions.register(new HelloWorld());
```

这将你的类构造为一个对象，并引入允许扩展运行的特殊 API：`Scratch`。`Scratch` 上有很多内容，但最重要的函数之一是 `Scratch.extensions.register`。

确保始终恰好调用一次 register()。如果你不调用它，你的扩展将永远不会被添加，我们将一直等待它加载。如果你多次调用它，行为是未定义的，所以不要依赖它。

## getInfo()

```javascript
  getInfo() {
    return {
      id: 'helloworld',
      name: 'It works!',
      blocks: [
        {
          opcode: 'hello',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Hello, world!'
        }
      ]
    };
  }
```

当你调用 register() 时，Scratch 会在提供的对象上调用 getInfo() 函数。此对象必须返回一个包含扩展元数据的对象。一些字段是 `id`、`name` 和 `blocks`。以下是这些字段的简要摘要：

| | 类型 | 描述 |
|:-:|:-:|:-:|
| id | string | 仅由此扩展使用的唯一 ID。多个扩展不能共享相同的 ID。只能使用字母 a-z 和 0-9 — 不能有空格或特殊字符。 |
| name | string | 出现在工具箱中的扩展名称。如果未提供，默认为扩展 ID。 |
| blocks | array | 描述项目中积木的对象列表。 |

以下是每个积木应有的内容的简要摘要：

| | 类型 | 描述 |
|:-:|:-:|:-:|
| opcode | string | 运行此积木时应运行的函数名称。例如，如果这是 "hello"，则会运行类的 "hello" 方法。每个 opcode 在每个扩展中必须是唯一的，因此多个扩展可以各自有一个 opcode 为 "hello" 的积木。|
| blockType | Scratch.BlockType.* | 确定积木的形状。最常见的是 Scratch.BlockType.COMMAND、Scratch.BlockType.REPORTER 或 Scratch.BlockType.BOOLEAN。详情见下表。 |
| text | string | 将出现在编辑器中的积木文本。这里有一些用于处理参数的特殊语法，将在下一部分讨论。 |
| arguments | object | 可选。在下一节讨论。 |

以下是 blockType 的可接受值：

| | 描述 | 示例 |
|:-:|:-:|:-:|
|Scratch.BlockType.COMMAND|不返回值的积木|move 10 steps|
|Scratch.BlockType.REPORTER|返回字符串或数字的圆形积木|x position, costume name|
|Scratch.BlockType.BOOLEAN|带尖边的积木，返回布尔值(true 或 false)|mouse down|
|Scratch.BlockType.HAT|响应特定条件开始的积木。稍后讨论。|when loudness > 10|
|Scratch.BlockType.EVENT|仅响应事件开始的积木。稍后讨论。|when this sprite clicked|

虽然存在其他 BlockType，但它们效果不佳，目前不会讨论。

## 积木

```javascript
  hello() {
    return 'Hello, world!';
  }
```

这定义了将运行 opcode 为 "hello" 的积木的函数。在这种情况下，我们的积木非常简单，只返回一个字符串。REPORTER 积木应返回字符串、数字或布尔值，BOOLEAN 积木应只返回布尔值。请注意，`null`、`undefined`、列表和对象不是这些积木的预期返回值。

当你想更改扩展时，只需修改扩展并重新加载页面。这里有一个提示可以让你的生活更轻松：你可以使用 `?extension=` URL 参数自动加载扩展，而无需进入库。例如，如果你的扩展 URL 是 http://localhost:8080/hello-world.js ，你可以使用 https://editor.bilup.org/editor?extension=http://localhost:8080/hello-world.js 自动加载它。

如果你发现刷新时更改未被应用，请尝试浏览器的"强制刷新"或"无缓存刷新"快捷键。

## 练习

1. 将 "Hello!" 积木更改为返回你最喜欢的数字。记得相应地重命名积木。
1. 更改积木的 opcode。
1. 添加另一个积木。让这个积木使用 `type` 为 `Scratch.BlockType.BOOLEAN`，并随机返回布尔值(true 或 false)。

## 下一步

接下来，让我们[允许我们的积木接受参数](./inputs)。
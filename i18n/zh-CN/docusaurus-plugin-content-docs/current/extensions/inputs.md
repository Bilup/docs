---
hide_table_of_contents: true
---

# 处理输入

import {ExtensionCode} from './utils.js';

通常你会希望你的积木接受"输入"、"参数"或"参数"。让我们通过一个新示例来学习如何做到这一点：

<ExtensionCode title="strict-equality">{require("!raw-loader!@site/static/example-extensions/strict-equality.js")}</ExtensionCode>

将此代码保存到 "hello-world.js" 旁边的名为 "strict-equality.js" 的文件中，并以加载 hello world 扩展的相同方式加载它。大部分代码与 hello world 扩展非常相似。请注意，此扩展中的严格等于积木将区分 "a" 和 "A"，这与普通的 Scratch 等于积木不同。

(如果你想在项目中使用此积木，请参见 https://extensions.turbowarp.org/ 上的"工具"扩展)

现在让我们谈谈参数。

:::info
参数系统可能有些复杂。如果遇到问题，请提交 bug 报告。
:::

要向积木添加参数，你给它一个 `arguments` 属性。它应该设置为包含其他对象的对象。你在 `arguments` 中放入的每个属性对应一个参数。每个都有一个名称。名称可以是全部大写或任何你想要的格式。

以下是为参数设置的最常见属性的摘要：

| |类型|描述|
|:-:|:-:|:-:|
|type|Scratch.ArgumentType.*|确定输入的形状以及默认文本输入接受的值。最常见的是 Scratch.ArgumentType.STRING、Scratch.ArgumentType.NUMBER 或 Scratch.ArgumentType.BOOLEAN。可接受值见下表。请注意，这只是建议，实际类型可能有所不同。|
|defaultValue|string|可选。工具箱中的默认值。仅对带有文本框的输入使用；不对布尔输入使用。|
|menu|string|稍后讨论。|

以下是 type 的可接受值：

| | 描述 | 示例 |
|:-:|:-:|:-:|
|Scratch.ArgumentType.STRING|任何文本|apple, 123, true|
|Scratch.ArgumentType.NUMBER|任何数字|123|
|Scratch.ArgumentType.BOOLEAN|真或假。这个很特别，因为它试图阻止用户将非布尔值拖放到输入中。|true|
|Scratch.ArgumentType.COLOR|十六进制颜色代码|#ff4c4c|
|Scratch.ArgumentType.ANGLE|方向输入。90 表示向右。逆时针增加。与角色方向相同。|90, 180|
|Scratch.ArgumentType.MATRIX|用二进制表示的 5x5 矩阵| 11101010101... |
|Scratch.ArgumentType.NOTE|钢琴键盘上的音符。| ? |
|Scratch.ArgumentType.IMAGE|显示内联图像，实际上不是输入。稍后描述。| N/A |
|Scratch.ArgumentType.COSTUME|该角色内的造型名称。| costume1 |
|Scratch.ArgumentType.SOUND|该角色内的声音名称。| recording1 |

接下来，Scratch 需要知道每个参数在积木中的位置。它们是在开头、结尾还是中间?它无法猜测，所以你必须告诉它。要做到这一点，你可以使用积木上的 `text` 属性，通过使用 `[ARGUMENT_NAME]` 语法来表示每个输入的位置。`arguments` 对象中的每个参数应该在 `text` 中恰好出现一次。参数可以按任何顺序排列；没关系。

当 Scratch 运行你的积木函数时，它会将第一个值作为对象传入。此对象将包含积木具有的每个参数名称的值。按照惯例，我们称之为 `args` 或使用解构语法。例如，如果积木有一个名为 `X` 和 `Y` 的参数，可以通过以下任何方式访问它们：

```js
  // 使用 args.XYZ 格式...
  goto(args) {
    console.log(args.X, args.Y);
  }

  // 或者使用解构...
  goto({X, Y}) {
    console.log(X, Y);
  }
```

无论参数的 `type` 指定为什么类型，参数都可以是字符串、数字或布尔值。你的代码必须确保根据需要转换值。

## 静态菜单

有时你可能希望你的积木有一个下拉菜单。这些被称为菜单。我们将首先讨论静态菜单。这些菜单包含一组固定的项目，永远不会改变。

<ExtensionCode title="strings-1">{require("!raw-loader!@site/static/example-extensions/strings-1.js")}</ExtensionCode>

https://extensions.turbowarp.org/ 上的"文本"扩展中提供了类似的积木。

要将参数设为菜单，将其 `type` 设置为 `Scratch.ArgumentType.STRING`，并将其 `menu` 属性设置为菜单的名称。这对应于 getInfo() 返回的对象中的新属性：`menus`。

`menus` 是类似于 `arguments` 的对象的对象。`menus` 中的每个项目通常是一个具有以下属性的对象：

| |Type|Description|
|:-:|:-:|:-:|
|items|array|字符串数组。或者，数组中的项目可以是包含 `text` 和 `value` 属性的对象，两者都是字符串。|
|acceptReporters|boolean|允许人们将复杂积木拖放到菜单中。你几乎总是希望这是 `true`。|

字段是只能设置为固定字符串的参数。例如，参见"停止全部"积木中的输入。输入是可以设置为任何值的参数。例如，参见"移动 10 步"积木中的步数输入或"切换造型"积木中的造型输入。你几乎总是想要输入，而不是字段。

虽然可以将菜单对象本身设置为数组，但强烈不建议这样做，因为它会隐式地将 `acceptReporters` 设置为 `false`，这几乎不是你想要的。你使用的几乎每个菜单都应该显式地将 `acceptReporters` 设置为 true，使其成为"输入"而不是"字段"。此规则的唯一例外是使用[基于事件的帽子积木](./hats)时，这将在稍后讨论。请注意，将参数从字段切换到输入或反之亦然是向后不兼容的更改。

默认值通常是菜单项列表中的第一项。项目列表不能为空。

在某些情况下，你希望下拉菜单中显示给用户的文本与积木内部接收的值不同。为此，项目可以是对象列表而不是字符串(或者只是某些项目可以是对象)。

<ExtensionCode title="strings-2">{require("!raw-loader!@site/static/example-extensions/strings-2.js")}</ExtensionCode>

请注意，虽然下拉菜单在编辑器中显示 UPPERCASE，但积木实际上收到的是 "up"。

## 练习

1. 添加一个与内置 Scratch "连接"积木相同功能的积木。它应该接受两个参数并生成一个连接它们的新字符串。确保你的积木将参数转换为字符串，这样当有人运行"连接 ((1 + 2)) ((3 + 4))"时，他们得到的是"37"而不是"10"。
1. 创建一个接受数字参数和带有"奇数"和"偶数"选项的菜单参数的布尔积木。积木应返回给定数字是否为奇数或偶数，如菜单所示。

## 下一步

到目前为止，所有的积木都很简单，积木(几乎)立即完成，但是[如果积木需要等待网络请求等事情完成怎么办](./async)?
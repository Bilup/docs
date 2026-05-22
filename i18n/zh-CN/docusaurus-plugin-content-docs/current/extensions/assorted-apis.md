---
hide_table_of_contents: true
---

# 各种 API

import {ExtensionCode} from './utils.js';

既然你熟悉编写自定义扩展，我们将分享更多 API。这些 API 在**沙盒化和非沙盒化**扩展中都可用。它们都可以一起使用。

## color1, color2, color3

这三个属性分别决定每个扩展的积木颜色、积木输入颜色和积木菜单颜色。一般建议是 `color1` 应该最亮，`color2` 稍暗，`color3` 最暗。它们应该设置为十六进制颜色代码。

<ExtensionCode title="color">{require("!raw-loader!@site/static/example-extensions/color.js")}</ExtensionCode>

不同的积木颜色模式(如 **High Contrast**、**Dark** 和任何 "Addons" 预设)会根据这些值自动生成。

## docsURI

docsURI 在积木列表的开头添加一个按钮，用于打开页面让人们了解你的扩展如何工作。

<ExtensionCode title="hello-docs">{require("!raw-loader!@site/static/example-extensions/hello-docs.js")}</ExtensionCode>

## disableMonitor

Scratch 会自动显示一个复选框，用于显示没有输入的 REPORTER 积木的变量监视器。请注意，在 Bilup 中，这也适用于 BOOLEAN 积木。要禁用此功能，请在积木上设置 disableMonitor 为 true。

请注意，即使设置了 disableMonitor，人们仍然可以使用修改版(或旧版)扩展或其他工具手动创建监视器。

<ExtensionCode title="unmonitorable">{require("!raw-loader!@site/static/example-extensions/unmonitorable.js")}</ExtensionCode>

## Scratch.Cast

Scratch 处理类型转换或比较等操作的方式有很多奇特的方式。与其尝试自己编写它们，你可以使用 Scratch.Cast.* API。

<ExtensionCode title="cast">{require("!raw-loader!@site/static/example-extensions/cast.js")}</ExtensionCode>

## hideFromPalette

有时你可能希望从工具箱中隐藏一个积木，但不想删除它。这对于确保你的更改[向后兼容](./compatibility)很有用。具有 hideFromPalette 属性的积木将从工具箱中隐藏，但项目中已有的任何副本将继续正常工作。

例如，在这里加载第一个扩展，并使用其积木保存项目：

<ExtensionCode title="hidden-1">{require("!raw-loader!@site/static/example-extensions/hidden-1.js")}</ExtensionCode>

然后改用此扩展，并加载之前的项目：

<ExtensionCode title="hidden-2">{require("!raw-loader!@site/static/example-extensions/hidden-2.js")}</ExtensionCode>

可以看到已存在的积木副本继续工作，但它没有在工具箱中列出。

## filter

你的一些积木可能只在角色中工作或只在舞台中工作。对于这些积木，你可以使用 filter 属性设置为包含 `Scratch.TargetType.STAGE` 或 `Scratch.TargetType.SPRITE` 的数组，使其仅在该类型的目标中可见。

请注意，仍然可以通过例如拖放或背包获取违反 filter 属性的积木。因此，你的积木必须仍然使用 `util.target.isStage` 检查目标是舞台还是角色。

<ExtensionCode title="filter">{require("!raw-loader!@site/static/example-extensions/filter.js")}</ExtensionCode>

## Icons

有三种不同的方式可以向你的扩展添加图像：

- menuIconURI 用于整个扩展。这设置出现在积木面板中的图像。如果未设置，默认为 blockIconURI。如果也未设置，则默认为扩展颜色的圆形。
- blockIconURI 用于整个扩展。这将是所有未覆盖它的积木的默认值。
- blockIconURI 用于每个积木。这会覆盖整个扩展上设置的 blockIconURI。

这些属性中的每一个都应该是内联的 [data: URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)。首选 SVG，但至少 64x64 大小的 PNG 或 JPG 也能很好地工作。图标应该是方形的。

<ExtensionCode title="icons">{require("!raw-loader!@site/static/example-extensions/icons.js")}</ExtensionCode>

## 内联图像

你也可以使用类型为 IMAGE 的"参数"并在参数上设置 `dataURI`，在积木中的任何位置放置图像。与其他图像一样，这是一个 [data: URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)。首选 SVG，但至少 64x64 大小的 PNG 或 JPG 也能很好地工作。图标应该是方形的。

此外，如果你将 `flipRTL` 设置为 true，图像将在从右到左的语言中水平翻转。

<ExtensionCode title="inline-images">{require("!raw-loader!@site/static/example-extensions/inline-images.js")}</ExtensionCode>

## 分隔符

如果你的扩展有很多积木，你可能想在积木组之间放一些空格。要做到这一点，应在 blocks 列表中加入 `"---"`：

<ExtensionCode title="separators">{require("!raw-loader!@site/static/example-extensions/separators.js")}</ExtensionCode>

## 终端积木

要防止在 COMMAND 积木下方连接积木，请在积木上设置 `isTerminal: true`。

虽然积木的形状看起来类似于"停止此脚本"和"停止全部"，但其行为与两者都不匹配。例如，如果此积木放在循环末尾，循环将继续运行，除非其他代码停止当前线程。这只是防止在下方连接积木。

<ExtensionCode title="terminal">{require("!raw-loader!@site/static/example-extensions/terminal.js")}</ExtensionCode>

## 下一步

接下来，让我们看看[如何制作像"当我收到"或"当计时器大于"这样的积木。](./hats)
---
slug: /packager/special-cloud-behaviors
hide_table_of_contents: true
---

# 特殊云变量行为

:::info
此页面是关于 [Bilup 打包器](https://packager.bilup.org/) 的。
:::

默认禁用的「特殊云变量行为」选项会更改特定名称的云变量行为，以解锁项目的新兼容性。这基于 [HTMLifier 中的类似功能](https://github.com/SheepTester/htmlifier/wiki/Special-cloud-behaviours)。此功能可以在「云变量」部分启用。

要创建这些，只需像平常一样创建云变量，但给它们下面找到的特定名称。例如，要使用 `☁ url` 变量，创建一个名为 `url` 的变量并将其标记为云变量。

启用特殊云变量行为将覆盖这些变量的任何其他设置，因此像 `☁ username` 这样的变量永远不会存储在本地或与其他用户同步。

## ☁ url {#url}

`☁ url` 的值将设置为页面的当前 URL。更改 `☁ url` 的值没有任何作用。

## ☁ redirect {#redirect}

当 `☁ redirect` 的值被设置为 URL 时，当前标签页将导航到该 URL。

## ☁ open link {#open-link}

当 `☁ open link` 的值被设置为 URL 时，项目将尝试在新标签页中打开该 URL。请注意，由于大多数浏览器内置的弹出窗口阻止程序，这并不总是可靠的。

## ☁ username {#username}

当 `☁ username` 的值被更改时，「感知」类别中「用户名」积木的值将被更改。

## ☁ pasted {#pasted}

当用户使用 ctrl+v 等快捷方式将某些文本粘贴到页面时，文本将存储在 `☁ pasted` 中。

## ☁ set clipboard {#set-clipboard}

当 `☁ set clipboard` 的值被更改时，页面将尝试将文本存储在用户的剪贴板中。这可能并不总是有效。

## ☁ room id {#room-id}

当 `☁ room id` 的值被更改时，用于同步云变量的项目 ID 将被更改。例如，如果项目的原始 ID 是 1234，并且 `☁ room id` 被设置为 `xyz`，则新的项目 ID 将是 `1234-xyz`。要将项目 ID 重置为原始 ID，请将 `☁ room id` 的值设置为空字符串。

这可以作为向云变量项目添加服务器选择器的一种方式，而无需创建一堆额外的变量。只有具有相同 room ID 的人才能在他们之间同步变量。云变量可能需要几秒钟才能再次开始工作，因为它必须重新连接到云变量服务器。

room ID 不影响本地存储的云变量。

## ☁ eval {#eval}

:::warning
此选项需要启用「不安全的特殊云变量行为」。

不安全的云变量行为允许打包的项目在项目通常执行的「沙箱」之外执行任意代码。根据你打包的环境，这会授予项目对你的电脑的完全控制权，包括安装病毒的能力。

如果你不信任你要打包的项目或不使用此功能，请关闭此选项。
:::

当 `☁ eval` 的值被更改时，它的值将被作为 JavaScript 执行。

如果 JavaScript 执行成功，其输出将存储在 `☁ eval output` 中。

如果执行 JavaScript 时出错，错误将存储在 `☁ eval error` 中。

如果 JavaScript 返回一个 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)，如果 promise 解决，resolved 值将存储在 `☁ eval output` 中；如果拒绝，错误将存储在 `☁ eval error` 中。请注意，设置 `☁ eval` 始终是一个即时过程，因此输出变量可能不会立即更新。

## 更多信息和讨论 {#further-information}

请参阅 https://github.com/TurboWarp/packager/issues/48

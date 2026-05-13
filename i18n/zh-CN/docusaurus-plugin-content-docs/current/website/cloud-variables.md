---
slug: /cloud-variables
hide_table_of_contents: true
---

# 云变量

Bilup 有自己独立于 Scratch 的云变量服务器。

需要注意的事项：

 - 任何人都可以使用「编辑 > 更改用户名」菜单更改其用户名。显示用户名为「griffpatch」的用户很可能不是真正的 griffpatch。
 - 为了减少滥用，云变量服务器会拒绝任何不属于现有 Scratch 账户的用户名。
 - 由于潜在的滥用，Scratch 团队成员的名字不能使用。包括 ScratchCat。
 - 变量长度限制已增加到 100000 个字符。
 - 云变量仍然只能存储数字。
 - 云变量会在服务器重启或没有人在项目中一段时间后重置，因此诸如下排行榜之类的内容不会保存很长时间。
 - 打开编辑器时，云变量会被禁用。
 - 不要滥用云变量来创建无审核的聊天室。
 - 没有公共的云变量历史记录。
 - 当使用云变量或自定义扩展时，视频感知扩展的颜色检测会被禁用。这修复了与 Scratch 的「出于隐私原因，由于此项目包含视频感知积木，云变量已被禁用」警告相同的问题。

---

## 给机器人和高级用户 {#advanced}

我们允许并鼓励开发机器人和自定义客户端。但是，由于持续的滥用，我们要求你遵守一些规则。请记住，**这是一个由志愿者运营的免费服务。** 解析消息的 CPU 和向其他用户发送消息的带宽不是免费的。以下信息适用于用户和云变量库的作者。

### 协议 {#protocol}

协议与 [Scratch 的云变量](https://github.com/Bilup/cloud-server/blob/master/doc/protocol.md) 相同。我们提供 [一个用于 Node.js 的基础参考库](https://www.npmjs.com/package/@turbowarp/mist)。由于协议是完全开放的，如果你不想使用我们的库，则不需要使用它。

### 需要 User-Agent {#user-agent}

机器人必须在连接中提供有效的 [User-Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) 头信息。这包括联系信息（如 Scratch 个人资料链接、电子邮件地址、GitHub 问题页面等）以及所使用的云变量库的名称和版本（如果适用）。确切的语法无关紧要，只需要人类可读。以下是一些好的 User-Agent 示例：

 - `multiplayer leaderboard bot by https://scratch.mit.edu/users/TestMuffin`
 - `cloud-variable-library/1.0.1 contact@example.com`

唯一的例外是，如果你的机器人运行在浏览器中，而你无法控制 User-Agent。在这种情况下，你的浏览器会自动包含其他头信息，如 Origin 以及你网站的名称。伪装成浏览器是不行的，而且很容易被检测到。

请咨询你的云变量库的作者或查阅你的 WebSocket 库的文档，了解如何添加 User-Agent。

<details>
<summary>如果你正在开发云变量库</summary>

你应该暴露一个设置 User-Agent 的 API，并且应该强制使用此 API。例如，对于某个假设的云变量 API，你可能有这样的选项：

```js
const CloudConnection = require('...');

const connection = new CloudConnection({
    username: '...',
    projectId: '...',
    // highlight-start
    // 更新这个！
    contactInformation: 'contact@example.com'
    // highlight-end
});

connection.on('connected', () => { /* ... */ });
connection.on('set', (name, value) => { /* ... */ });
```

你的库将看到 `contactInformation` 选项，并将其与库的名称和版本连接起来，最终得到类似这样的 User-Agent：`CloudConnectionLib/0.3.3 contact@example.com`。

如果有人没有指定 `contactInformation`，你不应该让他们继续。缺少信息的 User-Agent 将被阻止，你会收到诸如「云变量无法连接」之类的无意义错误报告，而没有进一步细节。祝你好运来诊断这个问题！相反，给他们一个友好的错误消息，让他们能够自己解决，而不会打扰你。

要实际设置 User-Agent，请查阅你使用的 WebSocket 库的文档。他们可能不会专门提到 User-Agent，但他们应该提到如何设置头信息。例如，使用 Node.js [ws](https://www.npmjs.com/package/ws) 客户端，你会这样做：

```js
const ws = new WebSocket("wss://clouddata.bilup.org", {
  headers: {
    "user-agent": userAgentGoesHere
  }
});
```

</details>

### 项目 ID {#project-id}

项目 ID 不仅限于数字——它们可以是任何你想要的文本。如果你为不在 Scratch 网站上的项目使用自定义 ID，请使用诸如 `example.com/my-project` 之类的文本，以便我们验证你的项目是合法的。如果我们看到大量使用没有意义的项目 ID 的云变量活动，我们将禁用该项目 ID。

<details>
<summary>如果你正在开发云变量库</summary>

因此，你的项目 ID 选项应该是字符串，而不是整数或其他数字类型。

</details>

### 用户名 {#username}

云变量协议要求你提供用户名。服务器会尝试确保所有用户名在允许连接之前都是安全的。我们建议只将用户名设置为 `player` 后跟 2 到 7 个随机数字，因为连接会启动得更快（我们不会要求 Scratch API 验证它）。如果你的机器人需要特定的用户名，请将其存储在单独的变量中。

<details>
<summary>如果你正在开发云变量库</summary>

只要你强制用户使用有效的 User-Agent，用户名就是多余的，所以你可以省略用户名选项并自动生成一个随机的。

</details>

### 不要频繁打开和关闭连接 {#one-connection}

我们看到一种模式：机器人打开连接，关闭它，然后立即打开一个新的，如此循环。最终的结果是一个缓慢的机器人，使用了远远超出其所需的 网络和 CPU 资源，这是不允许的。我们认为这是因为一些设计不佳的库的 API 让人们编写这样的代码：

```py
while True:
    value = cloudlibrary.get_var(project_id, username, user_agent, variable_name)
    print(f"{variable_name} is {value}")
```

其中 `cloudlibrary.get_var` 的实现是打开连接然后立即关闭。相反，库应该提供 [事件驱动](https://en.wikipedia.org/wiki/Event-driven_programming) 的 API。不是不断地向服务器请求最新值，而是只打开一个 WebSocket，让服务器在发生更新时发送更新。WebSocket 非常高效：如果没有变量在变化，连接会保持空闲。如果有很多变量在变化，你会尽快收到更新。类似的代码可能是：

```py
def on_set(name, value):
    print(f"{name} is {value}")
connection = cloudlibrary.connect(project_id, username, user_agent, on_set)
```

只要实现是事件驱动的并且在内部使用一个连接（那么 `get_var` 只是返回最近接收的值），就可以提供类似 `get_var` 的 API。这只是需要一点工作而已。

### 更新会被缓冲 {#buffering}

为了提高性能，服务器会缓冲多个云变量更新，作为一组发送。不保证按接收顺序发送更新，有些更新可能会被完全跳过。由于这种缓冲，每秒发送超过 10 次更新变量是完全多余的。

### 响应 ping {#pings}

服务器会定期发送 [WebSocket ping 帧](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API/Writing_WebSocket_servers#pings_and_pongs_the_heartbeat_of_websockets)，你必须用 pong 回应，否则连接会断开。请查阅你的 WebSocket 库的文档，了解如何启用 ping/pong 支持（如果默认没有启用的话）。

### 重要的调试信息 {#debug}

为了让我们、你以及使用你的库的任何人更轻松，请将这些内容记录在某处（如错误消息中），而不是默默忽略它们：

 - WebSocket 关闭代码。所有 4XXX 代码都 [列在此表中](https://github.com/Bilup/cloud-server/blob/master/doc/protocol.md#server---client)。你更愿意看到 `连接关闭` 还是 `连接关闭，代码 4002`？在表中查找后者的代码，可以清楚地看出问题是用户名。
 - 从服务器收到的无效 JSON。如果服务器有要告诉你的内容超出了关闭代码表所说的内容，它可能会向你发送一个纯英文句子而不是 JSON 对象。当你的 JSON 解析器抛出错误时，你应该记录从服务器收到的实际原始文本，这样你就会得到诸如 `从服务器收到无效 JSON：你使用的云数据库没有理由发送你的登录令牌给你的 Scratch 账户带来了风险` 而不是 `JSON.parse：JSON 数据第 1 行第 1 列出现意外字符` 这样的错误消息。你更愿意看到哪一个？

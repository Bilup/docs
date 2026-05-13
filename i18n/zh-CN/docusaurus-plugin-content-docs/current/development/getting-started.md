---
slug: /development/getting-started
sidebar_position: 2
hide_table_of_contents: true
---

# 开发入门

这些是为 Bilup 本身设置开发环境的说明。如果你想向我们提交拉取请求或创建自己的修改版，这会很有用。

如果你只是想开发自定义扩展，请改为查看[自定义扩展文档](../extensions/introduction.md)。

## 依赖 {#dependencies}

我们所有的包都需要 [Git](https://git-scm.com/download) 和 [Node.js **v20**](https://nodejs.org/en/download)（可能 v18 或更高版本都可以工作，但我们不能保证）。我们假设你熟悉命令行。

有些包可能需要安装一些额外的东西，所以请查看你想要开发的每个包中的 README。

Bilup 是一个大型应用，构建可能需要多个 GB 的磁盘空间和内存。

## Scratch 组织方式说明 {#organization}

Scratch 被分成许多不同的包，每个包实现应用的一部分。

- **scratch-gui** 实现了大部分界面（例如角色列表），连接所有内容，是插件所在的地方
- **scratch-vm** 运行项目。编译器就在这里。
- **scratch-render** 负责显示舞台、角色、文本气泡和画笔等内容。它还实现了"touching"等积木。请注意，渲染在角色上方的内容（如变量监视器）实际上是 scratch-gui 的一部分。
- **scratch-svg-renderer** 帮助修复各种 SVG 渲染问题（我们将其重命名为 **@bilup/scratch-svg-renderer**）
- **scratch-render-fonts** 包含 SVG 造型可以使用的所有字体
- **scratch-paint** 是造型编辑器
- **scratch-parser** 提取和验证 sb2 和 sb3 文件
- **scratch-storage** 是围绕 fetch() 的抽象，用于下载（理论上也用于上传）文件（我们将其重命名为 **@turbowarp/scratch-storage**）
- **scratch-l10n** 包含一些翻译（我们将其重命名为 **@bilup/scratch-l10n**）

此外，桌面应用和打包器也是支持仓库。

## 构建 GUI {#gui}

如果你想修改 Scratch，你需要能够构建 GUI。这是你在 Scratch 包上开发时会使用的常见模式：

```bash
# 克隆它
git clone https://github.com/Bilup/scratch-gui
cd scratch-gui

# 安装依赖（比 `npm install` 更快且不会修改 package-lock.json）
npm ci

# 启动开发游乐场
npm start
```

这会启动大多数包的实时开发服务器（如果有的话）。例如，对于 scratch-gui，可以在 [http://localhost:8601/](http://localhost:8601/) 访问游乐场。有关其他包的信息，请查看 README 或 `npm start` 的输出。

## 构建 {#build}

虽然 `npm start` 对开发很有用，但在某些时候你需要获取原始文件。你可以通过以下方式做到：

```bash
npm run build
```

输出将在 `build` 文件夹中。

将 Bilup 部署到实时网站时，你应该启用生产模式。这将提高执行速度并大大减小文件大小：

```bash
# mac, linux
NODE_ENV=production npm run build

# windows command prompt (未测试)
set NODE_ENV=production
npm run build

# windows powershell
$env:NODE_ENV="production"
npm run build
```

默认情况下，Bilup 生成类似 `https://editor.bilup.org/editor.html#123` 的链接。但是，通过设置变量 `ROOT=/` 和 `ROUTING_STYLE=wildcard`（与设置 `NODE_ENV=production` 的方式相同），你可以获得类似 `https://editor.bilup.org/123/editor` 的路由。请注意，这需要服务器设置适当的别名。scratch-gui 中的 webpack 开发服务器已经为此设置好了。在生产环境中，你可能需要像 https://github.com/Bilup/editor.bilup.org 这样的东西。

## 链接其他包 {#linking}

要开发 scratch-gui 以外的包，你需要告诉 npm 使用包的本地副本而不是从互联网下载的副本。这称为*链接*。模式是：

```bash
# 在 scratch-gui 所在的同一文件夹中克隆你要开发的包
# （文件夹并不重要，但它使事情更容易跟踪）
cd scratch-gui/..
git clone https://github.com/Bilup/scratch-vm

# 在子包中安装依赖
cd scratch-vm
npm ci

# 告诉 npm 这是你的包的本地副本
npm link

# 对于某些包（例如 storage, svg-renderer），你可能需要构建才能应用更改
npm run build

# 告诉 scratch-gui 使用你的包的本地副本
cd ../scratch-gui
npm link scratch-vm
```

相信我，总是一次链接多个，一次链接一个只会在很多时候破坏东西，如果你做 npm ci 或类似的操作，请确保重新链接到 gui

```bash
# 这样做
npm link scratch-vm scratch-blocks

# 不要这样做
npm link scratch-vm
npm link scratch-blocks
```
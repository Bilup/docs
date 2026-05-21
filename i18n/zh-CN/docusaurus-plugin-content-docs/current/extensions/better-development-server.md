---
hide_table_of_contents: true
---

# 更好的开发服务器

import {Spoiler} from './utils.js';

Python 内置的 HTTP 服务器使用简单，但它很原始。我们可以做得更好。本节严格来说是可选的，但我们认为它会让你的生活更轻松。

## Bilup/extensions

extensions.bilup.org 的 GitHub 仓库是 [Bilup/extensions](https://github.com/Bilup/extensions)。这里提供的其中一个东西是我们使用的开发服务器，以及构建网站的代码。你也可以在本地运行它。

这需要在本地安装 Git 和 Node.js。运行以下命令下载服务器并安装其依赖项：

```bash
git clone https://github.com/Bilup/extensions.git
cd extensions
npm ci
```

现在打开你的代码编辑器到你刚刚下载的 "extensions" 仓库。

关闭旧的开发服务器并使用以下命令启动新服务器：

```bash
npm run dev
```

现在导航到 [http://localhost:8000](http://localhost:8000) -- 你应该看到类似于 [extensions.bilup.org](https://extensions.bilup.org/) 的列表。目前，我们不关心列表，我们只使用开发服务器部分。

保存扩展 JS 的位置在仓库内的 `extensions` 文件夹中。如果你打算稍后提交给我们，你应该为你的扩展创建一个用户文件夹。例如，如果你的用户名是 `TestMuffin`，你可以将你的 fetch 扩展保存在文件夹 `extensions/TestMuffin/fetch.js` 中，并使用 http://localhost:8000/TestMuffin/fetch.js 加载它。扩展还应该使用包含你用户名的 ID，例如 `testmuffinfetch`。

本地开发服务器设置了正确的标头，因此你不需要手动强制刷新以确保脚本更改生效，并且它会尽可能模仿真实的 extensions.bilup.org 网站。它还包括许多常见 Scratch API 的 TypeScript 提示和常见错误的 ESLint 规则。

未来，我们可能会考虑添加更多开发功能。

## 练习

1. 你能弄清楚如何向开发服务器添加新的 HTML 文件吗?(提示：<Spoiler>查看 "website" 文件夹</Spoiler>)
1. 你能弄清楚如何将你的扩展添加到主页列表吗?(提示：<Spoiler>查看 "extensions/extensions.json"</Spoiler>)
1. 你能弄清楚如何为你的扩展在主页上添加图像吗?(提示：<Spoiler>在 "images" 中创建一个与 "extensions" 中的文件具有相同文件夹和基本名称的图像</Spoiler>)

## 下一步

接下来，让我们使用改进的开发体验来[了解扩展可用的更多 API 和选项](./assorted-apis)。
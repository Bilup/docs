---
title: 项目结构
sidebar_position: 2
---

# 项目结构

Bilup 是一个多仓库工作区。每个包都是自己的 Git 检出，它们作为同一个父目录中的同级放置，以便相互链接。父目录本身不是一个仓库。

```
bilup/
├── scratch-gui/       # 编辑器 + 社区站点（同一个 webpack 构建）
├── scratch-vm/        # 运行时和编译器；积木在这里定义
├── scratch-blocks/    # 积木编辑器（Blockly 分叉）
├── scratch-render/    # WebGL 舞台渲染器
├── scratch-paint/     # 造型和背景编辑器
├── scratch-audio/     # Web Audio 播放
├── packager/          # 独立项目打包器
├── unpackager/        # 打包器的逆向
├── api/               # 社区平台后端
├── desktop/           # 编辑器的桌面包装
└── docs/              # 本文档站点（Docusaurus）
```

## 各包

Scratch 被拆分为分别实现应用一部分的包。Bilup 分叉了其中几个。

- **scratch-gui** 实现大部分界面（菜单栏、角色列表、标签页），将它们组合在一起，并且是插件所在的地方。它是一组 React 组件加上一个 Redux store。Bilup 独有的，同一个构建还提供社区站点。
- **scratch-vm** 运行项目。它持有积木定义（`src/blocks/scratch3_*.js`）、扩展（`src/extensions/`）以及将积木变成 JavaScript 的编译器（`src/compiler/`）。
- **scratch-render** 绘制舞台：角色、画笔、文本气泡和"碰到"等碰撞积木。注意变量监视器等覆盖层由 scratch-gui 绘制，而不是 scratch-render。
- **scratch-blocks** 是积木区和工作区，Google Blockly 的一个分叉。其 `core/` 目录下的编辑需要 Closure 重新编译（请参阅[构建与运行](/contributing/building-running)）。
- **scratch-paint** 是造型和背景编辑器。
- **scratch-audio** 处理声音播放。

另外两个支持包作为 npm 依赖而不是本地检出引入，但您会看到它们的引用：**scratch-parser**（验证 sb2/sb3 文件）和 **@turbowarp/scratch-storage**（用于下载资产的 fetch 抽象）。

## scratch-gui 内部

scratch-gui 是大多数编辑器工作发生的地方。重要的源目录：

```
scratch-gui/src/
├── components/    # 展示性 React 组件（foo/foo.jsx + foo.css）
├── containers/    # 围绕组件的 Redux 连接包装
├── reducers/      # Redux reducer，每个状态切片一个文件
├── lib/           # 共享服务层、HOC、主题、持久化
├── addons/        # 插件系统（设置存储、窗口系统、插件）
├── playground/    # webpack 入口点（编辑器、播放器、社区、嵌入、...）
└── community/     # 社区单页应用
```

- `components/` 持有纯 UI。每个组件是一个带 `.jsx` 和匹配 CSS 模块的文件夹。
- `containers/` 将组件连接到 Redux store。请参阅[容器模式](/internals/containers)。
- `reducers/` 是 Redux 状态。请参阅[状态管理](/internals/state)。
- `lib/` 是最大的目录：`lib/components/` 下的高阶组件、`lib/themes/` 下的主题引擎、`lib/persistence/` 下的项目持久化，加上编辑器与社区站点都使用的 Bilup 服务层 `lib/community/` 和 `lib/rotur/`。
- `addons/` 是插件框架，从 Scratch Addons 移植。请参阅[插件系统](/internals/addons-system)。

构建产生几个入口点，定义在 `src/playground/` 下：`editor`、`player`、`community`、`fullscreen`、`embed`、`addons` 和 `credits`。路由被处理为 `/editor` 提供编辑器，`/embed.html` 提供嵌入播放器，`/project/*` 和 `/explore` 等客户端路由提供社区应用。

## 各包如何链接

开发期间引擎包不是从 npm 获取的。它们从本地检出 symlink 链接，因此例如 scratch-vm 的更改会出现在编辑器中而无需重新发布。scratch-gui 在其 `pnpm.overrides` 中声明这些链接并暴露一个辅助脚本：

```bash
pnpm run link
# 运行：pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

这意味着您的目录布局很重要：引擎包必须是 scratch-gui 的同级，如上所示。

## Bilup 专用服务

两个部分根本不是 Scratch 或 TurboWarp 代码：

- **api** 是社区后端（账户、项目、评论、通知、设置同步）。它用 OSL 编写，将数据存储为扁平 JSON，对项目 blob 使用 Cloudflare R2。前端在 `https://api.bilup.org/api` 与它通信。
- 身份和社交功能通过 **Bilup Accounts** 运行。登录将 Bilup Accounts 令牌换成 Bilup 会话；社交功能（帖子、点赞、关注）转到 `https://api.accounts.bilup.org`。

您不需要两者都运行来参与编辑器本身的工作。它们在做社区站点时才有意义。

## 另请参阅

- [构建与运行](/contributing/building-running)
- [内部概览](/internals/overview)

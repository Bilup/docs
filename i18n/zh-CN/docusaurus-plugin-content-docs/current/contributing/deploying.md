---
title: 部署
sidebar_position: 6
---

# 部署

Bilup 的编辑器是一个静态站点。生产构建是一个 HTML、JavaScript 和资产文件夹，可以由任何静态主机提供。本页介绍如何构建和发布该文件夹，这是您运行自己的编辑器实例时需要的。

贡献更改不需要这个。只有当您想自己托管构建时它才重要。

## 构建输出

scratch-gui 的生产构建由以下命令产生：

```bash
NODE_ENV=production pnpm run build
```

这会清理之前的输出并运行 webpack，将可部署的站点写入 `build/` 目录。`build/` 下的所有内容都是静态且自包含的。

## 部署脚本

scratch-gui 附带一个 `deploy` 脚本，一步构建并发布到 `gh-pages` 分支：

```bash
pnpm run deploy
```

在底层它运行：

```bash
NODE_ENV=production pnpm run build && \
  touch build/.nojekyll && \
  cp -r functions build/functions && \
  gh-pages -t -d build -m "Build for <commit hash>"
```

按顺序，它：

- 做一次生产构建，
- 添加 `.nojekyll` 标记，让主机不在输出上运行 Jekyll，
- 将 `functions/` 目录复制到构建中（这些是用于路由和动态行为的 Cloudflare Pages Functions），
- 用 `gh-pages` 工具将整个 `build/` 目录推送到 `gh-pages` 分支。

提交到默认分支不会部署任何东西。发布是刻意的 `pnpm run deploy`。

## 托管构建

因为输出是静态的，您可以从任何静态主机提供它。Bilup 的设置发布 `gh-pages` 分支并将主机指向它。

### Cloudflare Pages

构建中的 `functions/` 目录是为 [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/) 编写的，因此 Cloudflare Pages 是预期的主机。典型设置：

1. 创建一个连接到您的 `scratch-gui` fork 的 Pages 项目。
2. 在项目设置中，将生产分支设置为 `gh-pages` 并为其启用自动部署。
3. 每当您想发布时在本地运行 `pnpm run deploy`。Cloudflare 检测 `gh-pages` 上的新提交并部署它。

因为您在本地构建并推送完成的 `build/` 目录，Cloudflare 不需要运行自己的构建步骤。

### 其他静态主机

任何可以提供目录的主机都可以：GitHub Pages、普通 Web 服务器、带静态托管的对象存储等。要保留两件事：

- 保留 `.nojekyll` 标记（或主机的等价物），使以下划线开头的文件名不被剥离。
- 复现路由。同一个构建从一组文件提供多个应用（`/editor`、`/embed.html`、社区客户端路由和遗留播放器路由）。在 Cloudflare Pages 上 `functions/` 目录处理此问题；在另一个主机上您必须实现等价的重写，否则客户端路由会在重新加载时 404。

## 社区后端

编辑器构建只是前端。如果您也运行社区平台，后端（mistwarp-api）是一个单独的 OSL 服务，不是这个静态构建的一部分。它单独部署和运行；它是什么请参阅[项目结构](/contributing/project-structure)。仅托管编辑器不需要它。

## 另请参阅

- [构建与运行](/contributing/building-running)
- [项目结构](/contributing/project-structure)
- [贡献](/contributing/guidelines)

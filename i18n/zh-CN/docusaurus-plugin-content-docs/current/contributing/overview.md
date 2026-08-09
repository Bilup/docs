---
title: 贡献概览
sidebar_position: 1
---

# 为 Bilup 做贡献

Bilup 是构建在 TurboWarp 之上的 Scratch 修改版，而 TurboWarp 本身构建在 Scratch 之上。这个谱系对贡献者很重要：您将阅读的大部分代码是普通的 Scratch/TurboWarp 代码，Bilup 特有的部分位于其上层。如果您以前为 Scratch 或 TurboWarp 做过贡献，您已经掌握了大部分所需知识。

本节面向想参与 Bilup 本身开发的人：修复编辑器中的 bug、向 VM 添加积木、编写插件，或运行自己的构建。如果您只想为自己的项目构建自定义扩展，请改读[构建扩展](/building-extensions/introduction)，那不需要检出源码。

## 各部分在哪里

Bilup 不是单一仓库。它是几个分叉的 Scratch 包加上少量 Bilup 专用服务的集合，并排检出。详细信息请参阅[项目结构](/contributing/project-structure)页面，简而言之：

- **scratch-gui** 是编辑器和社区站点，构建在同一个 webpack 构建中。这是您花大部分时间的地方。
- **scratch-vm** 运行项目并包含编译器。积木在这里定义。
- **scratch-render**、**scratch-blocks**、**scratch-paint** 和 **scratch-audio** 是其他分叉的引擎包。
- **packager** 将项目变成独立的 HTML/可执行文件。
- **bilup-api** 是社区平台后端。
- **docs** 就是这个站点。

## 开始之前

- Bilup 是一个大型应用。构建编辑器可能需要几个 GB 的磁盘空间和内存。
- 您需要 [Git](https://git-scm.com/) 和较新的 [Node.js](https://nodejs.org/)（我们以 v20 作为开发目标；v18 或更高版本可能也可以）。
- scratch-gui 使用 [pnpm](https://pnpm.io/) 作为包管理器，而不是 npm。请参阅[构建与运行](/contributing/building-running)。

## 如何阅读本节其余部分

1. [项目结构](/contributing/project-structure) 解释多仓库布局以及各包如何链接。
2. [构建与运行](/contributing/building-running) 是实际操作：克隆、安装、链接、运行。
3. [测试](/contributing/testing) 涵盖 scratch-gui 和 scratch-vm 中的测试套件。
4. [贡献](/contributing/guidelines) 涵盖工作流程：分支、样式规则和拉取请求。
5. [部署](/contributing/deploying) 解释构建如何发布，以防您运行自己的实例。

如果您想在修改之前理解编辑器是如何组成的，[内部](/internals/overview) 部分是它的配套。

## 另请参阅

- [内部概览](/internals/overview)
- [构建扩展](/building-extensions/introduction)

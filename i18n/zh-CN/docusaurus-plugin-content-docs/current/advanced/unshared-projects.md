---
title: 未共享项目
sidebar_position: 5
---

# 未共享项目

Scratch 上未共享的项目无法在 Bilup、打包器或任何其他第三方网站中打开。这是 Scratch 的限制，不是 Bilup 的，并且在不危及账户安全的情况下没有任何办法绕过。

::::warning
任何非 scratch.mit.edu 的网站，如果索要您的 Scratch 密码，都是诈骗，即使它声称能让您打开未共享的项目。您的账户会被盗。这条规则没有任何例外。
::::

## 为什么会这样

从 Scratch API 下载项目需要一个临时的"项目令牌"。对于未共享的项目，该令牌只能由项目所有者获得，并且几分钟后过期。即使您在同一浏览器中登录了 Scratch，Bilup 也无法读取该令牌，因此无法下载项目数据。

这是 Scratch 团队有意做出的更改，让未共享项目真正私密。在此之前，"未共享"项目实际上对任何知道 ID 的人都是公开的，考虑到其中许多项目包含个人信息，这是一个真正的隐私问题。保护它们是正确的决定。

## 应该怎么做

**测试自己的项目。** 在 Scratch 编辑器中使用文件，然后保存到电脑下载 `.sb3`，然后在 Bilup 中使用文件，然后从电脑加载打开它。许多人主要在 Bilup 中工作，并将完成的 `.sb3` 上传回 Scratch。这样做时请保留备份。

**协作。** 在 Scratch 上共享项目。共享未完成的工作完全可以。如果您想与他人实时编辑，Bilup 还内置了完全不依赖 Scratch 的[协作](/editor/collaboration)。

**嵌入。** 在 Scratch 上共享项目，或下载 `.sb3` 并使用[Bilup 打包器](/packager/overview)将其转换为可以[嵌入](/packager/embedding)的独立文件。

## 面向工具开发者

本部分面向构建自己的 Scratch 相关工具的人。要下载共享项目，您首先获取其元数据以获得项目令牌，然后使用该令牌获取数据：

1. `GET https://api.scratch.mit.edu/projects/<id>` 并读取 `project_token` 字段。
2. `GET https://projects.scratch.mit.edu/<id>?token=<token>` 获取项目 JSON 或 SB3。

浏览器不能直接调用 `api.scratch.mit.edu`，因为它不发送 [CORS](/advanced/cors) 头，因此浏览器端代码需要 CORS 代理；服务器端代码（Node.js）不受 CORS 约束，可以直接调用。有关处理这一切的现成下载器，请参阅 [sb-downloader](https://github.com/forkphorus/sb-downloader)。

## 另请参阅

- [协作](/editor/collaboration)
- [Bilup 打包器](/packager/overview)
- [CORS](/advanced/cors)

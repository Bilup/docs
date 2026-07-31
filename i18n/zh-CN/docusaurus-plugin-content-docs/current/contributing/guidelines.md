---
title: 贡献指南
sidebar_position: 5
---

# 贡献

本页涵盖将更改提交到 Bilup 的实际工作流程：代码在哪里、工作时各包如何链接、样式规则，以及如何打开拉取请求。如果您还没有设置本地构建，请先阅读[构建与运行](/contributing/building-running)。

## 代码在哪里

Bilup 分布在 [GitHub 上的 Bilup 组织](https://github.com/Bilup) 下的几个仓库中。您最可能接触到的：

- [scratch-gui](https://github.com/Bilup/scratch-gui) 是编辑器和社区站点。大多数 UI 工作在这里完成。
- [scratch-vm](https://github.com/Bilup/scratch-vm) 运行项目并持有积木定义和编译器。
- [scratch-blocks](https://github.com/Bilup/scratch-blocks)、[scratch-render](https://github.com/Bilup/scratch-render)、[scratch-paint](https://github.com/Bilup/scratch-paint) 和 [scratch-audio](https://github.com/Bilup/scratch-audio) 是其他引擎包。

每个包的用途请参阅[项目结构](/contributing/project-structure)。

Bilup 是 TurboWarp 的分叉，TurboWarp 是 [Scratch](https://scratch.mit.edu/) 的分叉。因为这个谱系，您阅读的大量代码（以及您修复的大量 bug）不是 Bilup 特有的。上游也存在的 bug 通常最好也向上游报告或修复。

## pnpm 链接工作流

开发期间引擎包不是从 npm 获取的。它们从本地并排检出 symlink 链接，因此例如 scratch-vm 中的更改无需重新发布就会被 scratch-gui 构建拾取。这只有在各包位于同一个父目录中作为同级时才有效。

从 `scratch-gui` 开始：

```bash
pnpm install
pnpm run link   # pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

如果之后 `pnpm install` 重置了链接，请再次运行 `pnpm run link`。`pnpm run reinstall` 会一次性清除 `node_modules` 和 lockfile、重新安装并重新链接。

一个值得记住的后果：因为链接是通过相对路径的，您的目录布局是构建的一部分。请保持检出命名并作为同级放置。

## 样式规则

一些规则由 linter 强制执行，一些是您必须手动遵循的项目约定。

提交前运行 linter：

```bash
pnpm run lint   # eslint 检查
pnpm run fmt    # eslint --fix
```

linter 无法捕获的两个约定是跨每个仓库的硬性项目规则：

- **无代码注释。** 不要向代码添加解释性注释。唯一允许的注释是 lint 要求的标记，如 `eslint-disable` 行。这适用于每个 Bilup 仓库。
- **无长破折号（em dash）。** 不要在任何地方使用长破折号：代码中、UI 字符串中、行文中都不用。使用逗号、括号或 "到" 表示范围。

几个容易踩坑的包特定规则：

- scratch-gui CSS 只用 postcss-simple-vars 处理。没有 `lighten()` 或 `darken()`；改用 `color-mix()`。
- css-loader 在 scratch-gui 中对类名做哈希和驼峰化。裸的 `:global {}` 块会静默丢弃其规则；改用 `import '!!style-loader!css-loader!./x.css'` 导入真正的全局 CSS。
- 社区站点 CSS 自定义属性使用 `--mw-*` 前缀。编辑器在 `documentElement` 上设置裸属性名，如 `--text`，因此社区侧的无前缀名称会冲突。请参阅[主题](/internals/theming)。
- scratch-blocks `core/` 下的编辑需要 Closure 重新编译，任何新符号必须在 `goog.global` 块中导出，否则 Closure 会剥离它。请参阅[构建与运行](/contributing/building-running)。

## 测试您的更改

打开拉取请求前运行相关测试套件。scratch-gui 和 scratch-vm 有独立的套件和独立命令，在[测试](/contributing/testing)中介绍。至少，lint 必须通过并且应用必须能构建。

## 打开拉取请求

1. Fork 您要更改的仓库，或在有访问权限时推送分支。不要直接提交到默认分支。
2. 在带描述性名称的主题分支上进行更改。
3. 运行 `pnpm run lint`（和测试）并确保构建成功。
4. 对相应的 Bilup 仓库打开拉取请求。描述更改做了什么以及为什么。如果它修复了 bug，描述如何复现它。
5. 如果您的更改跨越多个包（例如 GUI 依赖的 VM 更改），请在描述中注明，以便审查者检出匹配的分支。

## 许可

Bilup 继承了 TurboWarp 和 Scratch 的许可。TurboWarp 对 Scratch 的修改在 GNU 通用公共许可证 v3.0 下，原始 Scratch BSD 许可证在需要的地方保留。通过贡献，您同意您的更改在相同条款下发布。捆绑的插件来自 [Scratch Addons](https://scratchaddons.com/) 项目；请参阅[插件系统](/internals/addons-system)。

## 另请参阅

- [构建与运行](/contributing/building-running)
- [项目结构](/contributing/project-structure)
- [测试](/contributing/testing)
- [部署](/contributing/deploying)
- [内部概览](/internals/overview)

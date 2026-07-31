---
title: 构建与运行
sidebar_position: 3
---

# 构建与运行

本页介绍设置本地 Bilup 编辑器构建的步骤。示例使用 scratch-gui，因为那是大多数开发发生的地方，但相同的克隆和链接模式适用于其他引擎包。

## 先决条件

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) v20（v18 或更高版本可能也可以，但 v20 是我们开发的目标）
- [pnpm](https://pnpm.io/)，scratch-gui 使用的包管理器

构建编辑器可能需要几个 GB 的磁盘空间和内存，所以给它留出空间。

## 并排克隆各包

引擎包通过相对路径相互链接，因此它们必须位于同一个父目录中作为同级。

```bash
mkdir bilup
cd bilup
git clone https://github.com/Bilup/scratch-gui
git clone https://github.com/Bilup/scratch-vm
git clone https://github.com/Bilup/scratch-blocks
git clone https://github.com/Bilup/scratch-render
git clone https://github.com/Bilup/scratch-paint
```

您只需要打算更改的包。如果您只是修改编辑器 UI，只克隆 scratch-gui 就够了；它的依赖回退到 `package.json` 中固定的版本。

## 安装并链接

从 `scratch-gui` 开始：

```bash
cd scratch-gui
pnpm install
pnpm run link
```

`pnpm run link` 将同级检出 symlink 到 scratch-gui：

```
pnpm link ../scratch-vm ../scratch-blocks ../scratch-render ../scratch-paint
```

链接后，您在这些包中所做的更改会被 scratch-gui 构建拾取。如果链接后安装重置了链接，只需再次运行 `pnpm run link`。还有一个 `pnpm run reinstall` 脚本，会一次性清除 `node_modules` 和 lockfile、重新安装并重新链接。

## 运行开发服务器

```bash
pnpm start
```

这会启动 webpack-dev-server。打开 [http://localhost:8601/](http://localhost:8601/)。开发服务器也镜像生产路由，因此 `/editor` 是编辑器，`/embed.html` 是嵌入播放器，社区客户端路由也会被提供。

## 生产构建

```bash
NODE_ENV=production pnpm run build
```

`pnpm run build` 清理 `build/` 和 `dist/` 目录并运行 webpack。设置 `NODE_ENV=production` 会在 `build/` 下产生一个压缩的、可部署的构建。

## Lint 与格式化

```bash
pnpm run lint   # eslint 检查
pnpm run fmt    # eslint --fix
```

Lint 必须在拉取请求合并之前通过。样式规则请参阅[贡献](/contributing/guidelines)中那些不会被自动捕获的（无代码注释、无长破折号）。

## 其他包

### scratch-vm

scratch-vm 使用 npm 和自己的脚本：

```bash
cd scratch-vm
npm install
npm run lint
npm run tap          # 所有测试
npm run tap:unit     # 仅单元测试
npx tap test/unit/<file>.js   # 单个文件
```

### scratch-blocks

scratch-blocks `core/` 下的编辑用 Google Closure 编译，因此仅仅重建是不够的。将 `node_modules/.bin` 放在 `PATH` 上后，运行：

```bash
node universal-python.js build.py
```

您添加的任何新符号都必须在 `goog.global` 块中导出，否则 Closure 会从构建中剥离它们。

### mistwarp-api

社区后端是一个 OSL 服务。安装了 OSL 解释器后：

```bash
cd mistwarp-api
osl run main.osl   # 监听端口 5610
```

它将数据存储为 `data/` 下的扁平 JSON，并且在没有任何额外配置的情况下，为项目文件回退到本地 `data/blobs/` 目录，因此您可以在没有云设置的情况下运行它。

## 另请参阅

- [项目结构](/contributing/project-structure)
- [测试](/contributing/testing)
- [部署](/contributing/deploying)

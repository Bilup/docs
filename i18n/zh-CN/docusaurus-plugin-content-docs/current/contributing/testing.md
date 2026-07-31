---
title: 测试
sidebar_position: 4
---

# 测试

Bilup 继承了 Scratch 的测试设置：scratch-gui 中用 [Jest](https://jestjs.io/)，scratch-vm 中用 [tap](https://node-tap.io/)。本页列出各套件以及如何运行它们。

## scratch-gui

scratch-gui 在 `package.json` 中定义其测试脚本。完整运行串联 lint、单元测试、构建和集成测试：

```bash
pnpm test
```

开发期间很少需要这个。单独的部分更有用。

### Lint

```bash
pnpm run test:lint   # eslint . --ext .js,.jsx
```

### 单元测试

单元测试位于 `test/unit/` 下。它们用 Jest 和 Enzyme（React 16）运行。定义了两个套件：

```bash
pnpm run test:unit     # 插件测试套件（test/unit/addons）
pnpm run test:collab   # 协作引擎测试（test/unit/collaboration）
```

`pnpm run test:collab` 覆盖 `src/lib/collaboration/` 下的协作序列器引擎，是处理实时协作时要运行的套件。您可以直接运行单个 Jest 文件：

```bash
npx jest test/unit/collaboration/<file>.test.js
```

### 集成测试

`test/integration/` 下的集成测试驱动无头浏览器（带 chromedriver 的 Selenium）对真实构建运行。它们需要先构建：

```bash
pnpm run build
pnpm run test:integration
```

您可以运行单个集成文件，并观看浏览器而不是无头运行：

```bash
npx jest --runInBand test/integration/backpack.test.js
USE_HEADLESS=no npx jest --runInBand test/integration/backpack.test.js
```

如果 chromedriver 与您安装的 Chrome 不兼容，请用 `pnpm add -D chromedriver@<version>` 安装匹配的版本。

## scratch-vm

scratch-vm 使用 tap。从 scratch-vm 检出目录：

```bash
npm run tap            # 单元和集成测试
npm run tap:unit       # 仅单元测试
npm run tap:integration
npx tap test/unit/<file>.js   # 单个文件
```

VM 是积木和编译器所在的地方，因此这是更改运行时行为时要运行的套件。添加或更改积木时，在 `test/` 下添加或更新一个 fixture，使行为被固定。

## 测试什么

- 更改积木或编译器：添加一个 scratch-vm tap 测试。
- 更改协作：运行 `pnpm run test:collab`。
- 更改 React 组件或容器：在 `test/unit/` 下添加一个 Jest 单元测试。
- 任何涉及浏览器的用户可见内容：考虑一个集成测试。

## 另请参阅

- [构建与运行](/contributing/building-running)
- [贡献](/contributing/guidelines)

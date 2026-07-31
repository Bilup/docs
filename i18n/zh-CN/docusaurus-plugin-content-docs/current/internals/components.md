---
title: 组件
sidebar_position: 3
---

# 组件

scratch-gui 将其 React 代码拆分为两个扮演非常不同角色的目录：`src/components/` 用于展示，`src/containers/` 用于接线。本页描述组件侧以及两者之间的拆分。容器侧在[容器](/internals/containers)中介绍。

## 容器/组件拆分

规则很简单：

- **组件**（`src/components/`）渲染 UI。它通过 props 接收它需要的一切，不导入 Redux store 或 VM。给定相同的 props 它渲染相同的内容，这使它容易推理和复用。
- **容器**（`src/containers/`）知道 store 和 VM。它选择组件需要的状态、绑定回调，并用那些 props 渲染匹配的组件。

让展示不知道数据来自哪里，这就是同一个视觉组件可以在编辑器中被 Redux 驱动、在播放器中被不同状态驱动、或在测试中被 props 驱动的原因。

并非每个文件都完美地落在线的一侧。一些组件用 React hooks 或 `useState` 持有本地 UI 状态（布局测量、悬停、拖动），因为那种状态不值得放进 Redux。`src/components/gui/gui.jsx` 是一个大例子：它在本地管理舞台面板调整大小和窄布局检测，同时仍然从连接的容器接收其数据 props。组件避免的是直接触及全局 store。

## 组件如何组织

每个组件是一个包含 `.jsx` 文件和同名匹配 CSS 模块的文件夹，例如 `menu-bar/menu-bar.jsx` 和 `menu-bar/menu-bar.css`。JSX 将其样式作为模块导入：

```js
import styles from './menu-bar.css';
```

css-loader 对类名做哈希和驼峰化，因此 `styles.someClass` 解析为一个唯一的生成名。这使样式作用于组件，这也是真正的全局 CSS 必须以不同方式导入的原因（请参阅[主题](/internals/theming)和[贡献](/contributing/guidelines)中的 CSS 说明）。

显示给用户的文本通过 react-intl 的 `FormattedMessage` 和 `defineMessages`，而不是硬编码字符串，因此界面可以翻译。

## 主要组件树

`src/components/gui/gui.jsx`（`GUIComponent`）是编辑器展示的根。它组合界面的主要区域，其中大多数本身是容器：

- 顶部的 `MenuBar`。
- 带三个面板的标签条：积木工作区（`Blocks`）、`CostumeTab` 和 `SoundTab`。
- `StageWrapper`，持有舞台画布，以及 `TargetPane`，角色和舞台列表。
- 带搜索和添加扩展按钮的积木区页脚，以及 `Watermark`。
- 每个模态框和覆盖层：素材库（造型、声音、背景、扩展）、设置、git 模态框、还原点、调试器、警报、卡片等。许多只在对应的 `...Visible` prop 为真时渲染。

设置 `isPlayerOnly` 时，同一个组件只渲染 `StageWrapper` 而不是完整编辑器，这就是播放器和嵌入视图复用编辑器代码的方式。

## 去哪里看

一些您经常遇到的组件目录：

- `components/gui/` 是顶层布局。
- `components/menu-bar/` 是顶栏及其菜单。
- `components/stage/`、`components/stage-header/`、`components/target-pane/` 和 `components/sprite-selector/` 构建舞台侧。
- `components/loader/`、`components/box/`、`components/modal/` 等是小型共享积木。

许多编辑器功能（设置、自定义扩展、git 模态框、还原点等）以 `tw-` 或 `mw-` 为前缀，标记它们是在原始 Scratch 组件之上的 TurboWarp 或 Bilup 添加。

## 另请参阅

- [容器](/internals/containers)
- [架构](/internals/architecture)
- [状态管理](/internals/state)
- [主题](/internals/theming)

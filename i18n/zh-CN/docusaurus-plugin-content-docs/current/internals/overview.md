---
title: 内部概览
sidebar_position: 1
---

# 内部

本节解释 Bilup 编辑器是如何构建的：scratch-gui 的 React 和 Redux 架构、顶层组件如何组合、应用如何与虚拟机对话、状态如何管理、主题如何应用，以及插件系统如何工作。

它是[贡献](/contributing/overview)的配套。贡献告诉您如何检出、构建和更改代码。内部告诉您代码是如何组成的，让那些更改有意义。

这是面向开发者的内容。如果您只想使用编辑器，您不需要这些。

## 范围

这里几乎所有内容都是关于 **scratch-gui** 的，因为界面、Redux store、主题引擎和插件框架都在那里。运行时和编译器位于 scratch-vm 中，在 [API 参考](/api-reference/overview)中单独介绍。scratch-gui 与 VM 对话的边界在[架构](/internals/architecture)中描述。

Bilup 是 TurboWarp 的分叉，TurboWarp 是 Scratch 的分叉。这里的大量结构继承自 Scratch 和 TurboWarp。各页会指出 Bilup 在哪里有分歧。

## 各页

1. [架构](/internals/architecture) 涵盖大局：React 加 Redux、`gui.jsx` 如何从高阶组件组成，以及通往 VM 的桥梁。
2. [组件](/internals/components) 描述展示组件以及容器/组件拆分。
3. [容器](/internals/containers) 解释将组件连接到 Redux 的容器模式。
4. [状态管理](/internals/state) 列出 store 中的实际 reducer，以及选择器、action creator 和中间件如何组合。
5. [主题](/internals/theming) 涵盖主题如何变成文档上的 CSS 自定义属性以及积木颜色如何应用。
6. [插件系统](/internals/addons-system) 涵盖插件设置存储和窗口系统。

## 另请参阅

- [贡献概览](/contributing/overview)
- [项目结构](/contributing/project-structure)
- [API 参考](/api-reference/overview)

---
title: API 参考概览
sidebar_position: 1
---

Bilup 由一组 JavaScript 包构建：`scratch-vm`（运行项目的引擎）、`scratch-render`（WebGL 渲染器）、`scratch-blocks`（积木编辑器）和 `scratch-gui`（将它们整合在一起并同时提供社区站点的 React 应用）。本节记录这些包暴露的程序化表面。

它面向高级用户、扩展作者以及在自己的页面中嵌入 Bilup 的人。如果您只想制作项目，您不需要这些。如果您想编写脚本控制运行中的项目、构建扩展或自己驱动 VM，从这里开始。

## 访问运行中的实例

编辑器或播放器打开时，scratch-gui 将两个对象放在 `window` 上用于调试和脚本编写：

- `window.vm` 是实时的 [`VirtualMachine`](/api-reference/vm-api) 实例。VM 管理器挂载后设置一次（请参阅 `src/lib/components/vm-manager-hoc.jsx`）。
- `window.ReduxStore` 是应用的 Redux store（请参阅 `src/lib/components/app-state-hoc.jsx`），对检查 GUI 状态很有用。

在编辑器上打开浏览器控制台并尝试：

```js
// 运行当前项目的 VM
window.vm

// 启动项目，就像点击了绿旗
window.vm.greenFlag();

// 渲染器，如果已附加
window.vm.renderer

// 引擎运行时（目标、线程、积木、IO 设备）
window.vm.runtime
```

这些全局变量用于交互式使用。它们不是稳定的、带版本的 API，并且可能随构建而更改。扩展应该改用[扩展 API](/api-reference/extension-api)，它会显式传递 `Scratch.vm`。

## 各层

- [VM API](/api-reference/vm-api)：公开的 `VirtualMachine` 类。加载和保存项目、控制播放、管理角色/造型/声音，以及读取状态。这是嵌入者对话的对象。
- [GUI API](/api-reference/gui-api)：scratch-gui 导出的 React 入口点，让您可以在自己的应用中渲染编辑器或播放器。
- [扩展 API](/api-reference/extension-api)：扩展作者针对其编写的 `Scratch` 对象（`BlockType`、`ArgumentType`、`Scratch.extensions.register` 以及沙箱权限辅助工具）。
- [积木注册](/api-reference/block-registration)：操作码和帽子如何接入运行时。
- [线程](/api-reference/threads)：实际执行脚本的线程和序列器模型。
- [运行时 API](/api-reference/runtime)：持有目标、IO 设备、监视器并启动线程的引擎（`vm.runtime`）。
- [插件 API](/api-reference/addon-api)：userscript 接收的 `addon` 对象。
- [事件](/api-reference/events)：VM 发出的事件。
- [实用工具](/api-reference/utilities)：`Cast`、`Color` 和 `MathUtil` 等辅助模块。

## 嵌入

如果您想在自己的页面上放置 Bilup 项目，通常不需要直接针对 VM 构建；您使用[打包器](/packager/overview)或[嵌入 iframe](/advanced/embedding)。只有当您需要这些工具不给您的控制时，才直接针对 VM/GUI 构建。

## 另请参阅

- [构建扩展](/building-extensions/introduction)
- [内部：架构](/internals/architecture)
- [项目中的 JavaScript](/advanced/javascript)

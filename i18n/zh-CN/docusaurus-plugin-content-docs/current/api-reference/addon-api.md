---
title: 插件 API
sidebar_position: 7
---

插件是修改编辑器和播放器的 userscript 和 userstyle。每个插件是 `scratch-gui/src/addons/addons/` 下的一个文件夹，带有一个清单和一个或多个脚本。当插件的 userscript 运行时，它接收一个 API 对象。本页是该对象的参考，定义在 `scratch-gui/src/addons/api.js`。插件是什么以及如何使用请参阅[插件](/editor/addons)。

## userscript 入口点

插件 userscript 导出一个接收 API 对象的默认异步函数：

```js
export default async function ({addon, console, msg}) {
    const vm = addon.tab.traps.vm;
    // ... 修改编辑器 ...
}
```

传入的对象具有以下成员：

- `addon`：插件 API，分为 `addon.tab`、`addon.settings` 和 `addon.self`（见下文）。
- `console`：浏览器控制台。
- `global`：全局对象。
- `msg(key, vars)`：来自插件翻译的本地化消息。
- `safeMsg(key, vars)`：相同，但经过 HTML 转义。

## addon.tab

`addon.tab` 是触及页面的主要表面。它是一个事件目标。

- `tab.traps`：到编辑器内部的逃生舱口：
  - `traps.vm`：实时的 [`VirtualMachine`](/api-reference/vm-api)。
  - `traps.getBlockly()`：在 Blockly 实例就绪后解析它。
  - `traps.getWorkspace()`：当前的 Blockly 工作区。
  - `traps.getPaper()`：在造型编辑器打开时解析 paper.js 作用域。
- `tab.redux`：访问 GUI 的 Redux store，包括 `tab.redux.state` 和 `statechanged` 事件。
- `tab.waitForElement(selector, options)`：在匹配的 DOM 元素出现后解析它。选项包括 `markAsSeen`（这样同一元素不会返回两次）、`condition` 回调、`reduxCondition` 回调和 `reduxEvents` 以等待特定的 store 操作。
- `tab.appendToSharedSpace({space, element, order, scope})`：将元素插入已知的编辑器区域（例如 `stageHeader`），相对于其他插件保持在稳定位置。
- `tab.createBlockContextMenu(callback, {workspace, blocks, flyout, comments})`：向积木或工作区上下文菜单添加项目。
- `tab.scratchClass(...names, {others})`：将 Bilup 的哈希 CSS 类名（例如 `green-flag`）解析为它们真实的运行时类名，让您的样式和查询匹配。
- `tab.scratchMessage(id)`：查找编辑器自己本地化字符串之一。
- `tab.copyImage(dataURL)`：将 PNG 数据 URL 复制到剪贴板。
- `tab.createModal(title, {isOpen})`、`tab.confirm(...)`、`tab.prompt(...)`：编辑器风格的对话框。
- `tab.displayNoneWhileDisabled(el, options)`：在插件被禁用时隐藏元素。
- `tab.editorMode`：当前编辑器模式字符串。
- `tab.direction`：当前语言环境的 `'ltr'` 或 `'rtl'`。
- `tab.recolorable()`：一个 `<img>`，其 SVG 根据当前主题强调色重新着色。

## addon.settings

`addon.settings` 读取插件自己的设置，按其清单声明。它是一个事件目标。

- `settings.get(id)`：设置的当前值。
- 监听 `change` 事件以在用户更改设置时做出反应：

```js
addon.settings.addEventListener('change', () => {
    const speed = addon.settings.get('speed');
    // ... 应用新值 ...
});
```

## addon.self

`addon.self` 是插件自己的状态。它是一个事件目标。

- `self.id`：插件的 ID。
- `self.disabled`：插件当前是否被禁用。
- `self.getResource(path)`：将捆绑的资源路径解析为可用的 URL。
- 当用户打开编辑器时切换插件时，会触发 `disabled` 和 `reenabled` 事件，因此插件无需重新加载即可清理或重新应用其更改：

```js
addon.self.addEventListener('disabled', () => { /* 撤销更改 */ });
addon.self.addEventListener('reenabled', () => { /* 重做更改 */ });
```

## Userstyles

插件还可以携带 CSS。静态样式表自动应用，设置可以驱动 CSS 自定义属性：清单设置产生名为 `--<addonId>-<settingId>` 的变量，清单 `customCssVariables` 可以计算在设置更改时更新的颜色（混合、增亮、阈值等）。

## 另请参阅

- [插件](/editor/addons) 了解面向用户的功能
- [内部：插件系统](/internals/addons-system)
- [VM API](/api-reference/vm-api)

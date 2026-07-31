---
title: 主题
sidebar_position: 6
---

# 主题

Bilup 主题是一组颜色和选项，变成文档上的 CSS 自定义属性，外加一组为工作区重新着色的积木颜色。本页描述主题如何表示、如何应用，以及在主题系统附近工作时要注意的事项。

引擎位于 `src/lib/themes/`。

## 主题是什么

主题是 `src/lib/themes/index.js` 中 `Theme` 类的一个实例。它是一个小的、不可变的选择包：

- `accent`：强调色集合（来自 `src/lib/themes/accent/`）。
- `gui`：界面配色方案，`light`、`dark` 或 `midnight` 之一（来自 `src/lib/themes/gui/`）。
- `blocks`：积木调色板，`three`（默认）、`dark`、`high-contrast` 或 `custom` 之一。
- `menuBarAlign`、`wallpaper`、`fonts` 和一个用于更细选项的 `appearance` 对象。

`Theme` 是不可变的：`set(property, value)` 和 `setAppearance(changes)` 等方法返回一个新的 `Theme`，而不是修改现有的。它还按需计算派生的颜色映射，最重要的是：

- `getGuiColors()` 将强调色、GUI 和积木颜色合并到界面调色板中。
- `getBlockColors()` 产生积木调色板。
- `isDark()` 报告结果方案是否是深色的。

每个 GUI 方案的默认主题被预计算为 `Theme.defaults.light`、`Theme.defaults.dark` 等。

## 检测起始主题

启动时，`src/lib/themes/themePersistance.js` 决定使用哪个主题。它从 `localStorage`（`tw:theme`）读取存储的偏好，迁移遗留的 `"light"` / `"dark"` 值、按 UUID 恢复保存的自定义主题，或导入内联的自定义主题。如果没有存储任何内容，它回退到系统偏好：`prefers-color-scheme: dark` 和 `prefers-contrast: more` 会被尊重。这就是 `theme` reducer 开始的值。

## 应用主题：CSS 自定义属性

应用主题由 `src/lib/themes/guiHelpers.js` 中的 `applyGuiColors(theme)` 完成。它将 CSS 自定义属性写到文档根（`document.documentElement`）上，使整个应用一次重新样式化。粗略来说它：

- 将每个 GUI 颜色写成根上的 `--<name>` 属性（以及一个 `--<name>-default` 回退），例如 `--ui-primary`、`--looks-secondary`、`--text-primary`。
- 派生一些额外的，例如用于半透明覆盖层的 `--ui-primary-rgb`。
- 将积木颜色写成 `--editorTheme3-*` 属性（按分类：primary、secondary、tertiary、字段背景，加上工作区、工具箱、浮动框、滚动条和网格颜色）。
- 计算菜单栏背景，并从其亮度计算可读的 `--menu-bar-foreground`，然后用同样方式计算 `--accent-foreground`。
- 更新 `<meta name="theme-color">` 标签使浏览器 chrome 匹配。
- 应用壁纸并加载主题字体。

因为这些是设置在 `documentElement` 上的裸属性名（不限作用域、无前缀），任何组件都可以用 `var(--...)` 消费它们。这是刻意的，也是社区站点必须将自己的自定义属性加 `--mw-*` 前缀的原因：`--text` 这样的无前缀名称会与编辑器的冲突。请参阅[贡献](/contributing/guidelines)中的 CSS 说明。

`applyGuiColors` 在主题首次设置时从 `theme` reducer 调用，并在主题更改时再次调用。`TWThemeManagerHOC` 位于顶层 HOC 栈的早期（请参阅[架构](/internals/architecture)），正是为了让主题在图标渲染前应用，避免错误颜色的闪现。

## 重新着色积木

界面从 CSS 变量即时重新样式化，但积木工作区由 scratch-blocks（Blockly 分叉）绘制，需要的比 CSS 更多。`--editorTheme3-*` 属性供注入的积木样式表使用，更改积木颜色需要重新创建或重新着色工作区。编辑器在主题的积木身份（`theme.getBlocksThemeId()`）上重新键控 `Blocks` 组件，因此切换积木调色板会用新颜色重建工作区，而不是尝试就地修改。

舞台自己的积木颜色（在"碰到颜色"样式功能运行时使用）来自 `getStageBlockColors()`，对于不是用来影响舞台的积木主题，它回退到浅色调色板。

## 自定义主题

在内置方案之外，用户可以构建自定义主题。它们在 `src/lib/themes/custom-themes.js`（`customThemeManager` 和 `CustomTheme` 类）中管理并按 UUID 存储。自定义主题也可以嵌入到项目中，使打开项目时提供应用它的选项；该提示流程由 `mwProjectTheme` reducer 支撑（请参阅[状态管理](/internals/state)）并由 VM 监听器处理。

## 另请参阅

- [架构](/internals/architecture)
- [状态管理](/internals/state)
- [插件系统](/internals/addons-system)
- [贡献](/contributing/guidelines)

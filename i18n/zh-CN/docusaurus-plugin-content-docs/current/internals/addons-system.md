---
title: 插件系统
sidebar_position: 7
---

# 插件系统

插件是修改编辑器的小功能：编辑器调整、额外工具、外观更改。Bilup 的插件框架继承自 [Scratch Addons](https://scratchaddons.com/) 浏览器扩展，适配后在编辑器构建内部运行。本页描述您最可能使用的两个部分：设置存储和窗口系统。

插件代码位于 `src/addons/`。

## 插件从哪里来

插件及其翻译从 Scratch Addons 拉取，并为在 TurboWarp 和 Bilup 中使用打补丁。`src/addons/` 的大部分是生成的：`pull.js` 脚本获取上游源码、应用补丁并写入 `addons/`、`addons-l10n/`、`libraries/` 和 `generated/` 文件夹。您通常不手动编辑这些。正如 addons README 所说，功能请求去上游，但由 TurboWarp 或 Bilup 移植引起的 bug 在这里报告。

捆绑插件的列表定义在 `src/addons/addons.js` 中（仅由 `pull.js` 使用，不在运行时使用）。它包含 `editor-devtools`、`debugger`、`variable-manager`、`folders`、`block-switching` 等编辑器工具，以及为自定义积木主题提供动力的 `editor-theme3` 插件。

## 设置存储

每个插件都有设置（至少包括它是否启用）。所有这些由一个 `SettingsStore`（`src/addons/settings-store.js`）持有，通过 `src/addons/settings-store-singleton.js` 作为单例使用：

```js
import SettingsStore from './settings-store';

const settingStore = new SettingsStore();
const urlParameters = new URLSearchParams(location.search);
if (urlParameters.has('addons')) {
    settingStore.parseUrlParameter(urlParameters.get('addons'));
} else {
    settingStore.readLocalStorage();
}

export default settingStore;
```

启动时 store 从 `localStorage`（键 `tw:addons`）加载设置，除非 `addons` URL 参数覆盖它们。`SettingsStore` 扩展一个事件目标垫片，因此应用的其他部分订阅它并在设置更改时做出反应。

它的主要职责：

- **读取和持久化。** `readLocalStorage()` 和 `saveToLocalStorage()` 加载和存储设置，`migrateSettings()` 升级较旧的保存格式（store 当前是第 5 版）。
- **查询。** `getAddonEnabled(id)`、`getAddonSetting(id, settingId)`、`getAddonManifest(id)` 和 `getDefaultSettings(id)` 回答插件的当前配置是什么，回退到清单默认值。
- **更改。** `setAddonEnabled(id, enabled)` 和 `setAddonSetting(id, settingId, value)` 更新值、持久化并发出更改事件，让受影响的插件实时响应。`resetAddon()` 和 `resetAllAddons()` 恢复默认值。
- **导入和导出。** `export({theme})` 和 `import(data)` 在实例之间移动设置，`parseUrlParameter()` 应用在 URL 中传入的设置。
- **条件。** `evaluateCondition()` 支持只在其他设置持有某些值时应用的插件设置。

设置 UI（在 `src/addons/settings/`）是这个 store 的一个视图；更改控件调用 `setAddonSetting`，其余由 store 完成。

## 窗口系统

一些插件打开自己的浮动面板（例如调试器和变量管理器）。与其让每个插件重新发明，有一个共享窗口系统在 `src/addons/window-system/` 中，以 `window-manager.js` 为中心。

`window-manager.js` 导出一个 `WindowManager` 对象，一个用于创建和跟踪窗口的小型 API：

```js
const WindowManager = {
    createWindow (options = {}) { /* ... */ },
    getWindow (id) { /* ... */ },
    getAllWindows () { /* ... */ },
    closeWindow (id) { /* ... */ },
    closeAllWindows () { /* ... */ },
    bringToFront (id) { /* ... */ }
};
```

它也作为 `window.wm` 全局暴露。

`createWindow` 根据环境返回两个实现之一：

- **`AddonWindow`** 是在编辑器内部渲染的页内可拖动、可调整大小的窗口。这是正常情况。
- **`NativeAddonWindow`** 在真正的操作系统窗口可用时（例如在桌面应用中）使用，通过 `window.open` 打开一个真正的弹出窗口并使其相对于主窗口定位。`createWindow` 只在原生窗口可以使用且窗口的 id 未被强制保持页内时选择这条路径。

无论哪种方式，管理器都保持活动窗口的注册表，以便查找它们、聚焦它们（`bringToFront`），并单独或一次性关闭它们。通过此系统创建的窗口共享样式和行为（滚动条、标题按钮、焦点处理），因此插件获得一致的窗口而无需每个都构建自己的。

## 另请参阅

- [编辑器插件](/editor/addons)
- [状态管理](/internals/state)
- [主题](/internals/theming)
- [架构](/internals/architecture)

---
title: 架构
sidebar_position: 2
---

# 架构

Bilup 看起来像一个应用，但实际上是构建时组合在一起的一组独立包。本页是自顶向下的地图：各包是什么、项目如何从工作区中的积木流到舞台上的像素、它如何保存和加载，以及编辑器、插件、主题引擎和社区层如何围绕核心排列。本节的后续页面放大各个部件；从这里开始看它们如何连接。

## 各包

Bilup 是 TurboWarp 的分叉，TurboWarp 是 Scratch 的分叉，它继承了 Scratch 拆分为独立 npm 包的布局。每个包都是自己的仓库，独立开发并链接到编辑器构建中。

- **scratch-gui** 是编辑器和社区站点：一个由 webpack 打包的 React 加 Redux 应用。它拥有界面、Redux store、主题引擎、插件框架和社区 SPA。您看到的一切都是 scratch-gui；本内部节的几乎所有内容都是关于它的。
- **scratch-vm** 是引擎。它是纯 JavaScript，没有 React。它拥有运行时、目标（角色和舞台）、积木、线程、解释器和 JS 编译器。它是项目实际做什么的真相来源。
- **scratch-render** 在 WebGL 画布上绘制舞台。VM 拥有一个渲染器实例并告诉它每个角色、造型和画笔痕迹去哪里。
- **scratch-blocks** 是 Google Blockly 的一个分叉。它绘制积木工作区和积木区，并将积木编辑变成 VM 应用的更改。
- **scratch-paint** 是造型和背景编辑器（一个绘画程序）。它有自己的 Redux store，这就是编辑器的 store 有独立 `scratchPaint` 切片的原因。
- **scratch-audio** 播放和处理声音：VM 将音频缓冲区和效果参数交给它。

开发时这些通过 `pnpm run link` symlink 到 scratch-gui 中，因此例如 scratch-vm 的更改无需重新发布就会出现在编辑器中。工作区布局请参阅[项目结构](/contributing/project-structure)。

## 各部分如何对话

运行时编辑器恰好持有一个 VM 实例。scratch-gui 自己不运行项目；它驱动 VM 并将界面需要的 VM 状态部分镜像到 Redux 中。

```
用户
 |
 v
scratch-gui (React 组件 + Redux store)
 |            ^
 | 调用       | 事件 -> Redux actions
 v            |
scratch-vm  (Runtime, Targets, Blocks, Sequencer, Compiler/Interpreter)
 |   |   |
 |   |   +--> scratch-audio   (声音播放)
 |   +------> scratch-render   (WebGL 舞台)
 +----------> scratch-blocks   (工作区 + 积木区，编辑流回 VM)
```

交互是一个循环。用户在组件中做一些事；容器要么分发一个 Redux action，要么调用 VM 上的方法。VM 做工作并发出事件。`vmListenerHOC` 将这些事件翻译成 Redux actions，连接的组件重新渲染，界面赶上运行时。因为 VM 是真相来源，Redux 从不尝试持有整个项目；它持有 UI 读取的切片的镜像。

接下来的部分跟随一个项目穿过这个循环：从工作区进入运行时、输出到渲染器、回到磁盘。

## 从积木到执行

积木存在于两个保持同步的地方。在工作区中，**scratch-blocks** 拥有可视积木。在 VM 中，每个目标有一个 `blocks` 容器（`scratch-vm/src/engine/blocks.js`），将相同的脚本存储为按积木 ID 键控的普通数据。当您拖动或编辑积木时，scratch-blocks 触发一个事件，VM 对其积木容器应用相应的更改，两个表示保持对齐。Bilup 从 VM 的积木对象构建工作区，而不是往返 XML，因此这座桥是真正的耦合点（积木区和影子输入是惰性构建的）。

运行项目意味着运行线程。当帽子积木触发时（绿旗、按键、广播），运行时为那个脚本启动一个**线程**（`engine/thread.js`）。每帧**序列器**（`engine/sequencer.js`）在一个时间预算（`WORK_TIME`，帧的四分之三）的一小部分内步进每个活动线程，然后让出让帧渲染。这个"步进一点、渲染、步进一点"的节奏让脚本看起来并行运行。线程和序列器模型在[线程](/api-reference/threads)下完整记录。

每个线程以两种方式之一运行：

- **解释。** `engine/execute.js` 直接遍历积木树，查找每个操作码的函数并调用它。这是始终可用的路径，也是脚本第一次被步进的运行方式。
- **编译。** Bilup 的 JS 编译器（`scratch-vm/src/compiler/`）将脚本变成真正的 JavaScript 函数。`compile.js` 运行中间表示生成器（`irgen.js`）、优化器（`iroptimizer.js`）和 JS 生成器（`jsgen.js`）；生成的函数由 `jsexecute.js` 执行。编译脚本比解释脚本快得多。编译默认开启（`runtime.compilerOptions.enabled`），可以在设置中关闭，此时一切都回退到解释器。

两条路径产生相同的可见行为；编译器是同一语义上的速度层。运行时、它的选项以及它如何决定编译在 [VM API](/api-reference/vm-api) 中介绍。

## 渲染舞台

运行时不绘制任何东西。每个目标保持它的位置、造型、大小、效果和画笔状态，并将它们报告给 **scratch-render**，它在共享的 WebGL 画布上将每个角色绘制为纹理四边形。VM 拥有那个画布；scratch-gui 只定位它并在上面绘制覆盖层：变量和列表监视器、拖动层、绿旗点击捕获器，这些从不接触 WebGL。当目标移动或切换造型时，VM 告诉渲染器，下一帧反映它。造型和背景编辑是一个单独的关注点，由**scratch-paint** 在造型和声音标签页处理。

## 保存和加载

项目被序列化为 **sb3** 格式，一个包含 `project.json` 加资产文件（SVG 或 PNG 造型、WAV 或 MP3 声音）的 ZIP，每个资产按字节的 MD5 哈希命名。

- **序列化。** `scratch-vm/src/serialization/sb3.js` 遍历运行时、目标、积木、变量和监视器并写入 `project.json`；资产从每个目标的造型和声音中收集。编辑器将这些打包成一个 `.sb3`。较旧的 `sb2.js` 处理导入遗留的 Scratch 2 项目。
- **反序列化。** 加载反转这个过程：解析 `project.json`、重建目标和它们的积木容器，并按哈希加载每个引用的资产。`validate-project.js` 在进入时对 JSON 做健全性检查。
- **存储。** 资产是内容寻址的，因此许多角色共享的同一个造型只存储一次。编辑器的存储层将资产哈希解析为其字节，无论来自 sb3、后端还是内置素材库。

字节实际存放在哪里取决于项目如何打开：本地文件、内置项目获取器或社区后端。发布流水线（创建、上传 sb3 和缩略图，然后分享）在下面以及[项目管理](/editor/project-management)和[打包](/editor/packaging)中描述。

## 编辑器外壳

React 侧是容器与组件拆分。**组件**（`src/components/`）渲染标记并接受一切作为 props；它们不知道 Redux 存在。**容器**（`src/containers/`）将组件连接到 Redux store 和 VM。这个拆分是 scratch-gui 的支柱，在[组件](/internals/components)和[容器](/internals/containers)中介绍。

界面状态存在于一个 Redux store 中，在 `src/lib/components/app-state-hoc.jsx` 中从三个顶层 reducer 构建：`scratchGui`（大的编辑器树，在 `src/reducers/gui.js` 中组装）、`locales`（语言和 RTL）和 `scratchPaint`（画板编辑器的 store）。`AppStateHOC` 还为播放器、全屏和嵌入模式播种受限的初始状态，在每个 action 后通知插件系统，并在 `window.ReduxStore` 上暴露 store。切片的完整列表在[状态管理](/internals/state)中。

顶层组件在 `src/containers/gui.jsx` 中组合。连接的 `GUI` 被包裹在一堆高阶组件中，每个横切关注点一个，使用 redux 的 `compose` 纯粹作为函数组合辅助工具：

```js
const WrappedGui = compose(
    LocalizationHOC,
    ErrorBoundaryHOC('Top Level App'),
    TWThemeManagerHOC,
    TWFullScreenResizerHOC,
    FontLoaderHOC,
    ProjectFetcherHOC,
    SB3PostMessageHOC,
    TitledHOC,
    ProjectSaverHOC,
    vmListenerHOC,
    vmManagerHOC,
    SBFileUploaderHOC,
    cloudManagerHOC
)(ConnectedGUI);
```

每个 HOC 负责一件工作：本地化、崩溃边界、应用主题（放置较早以便图标在首次绘制前重新着色）、全屏调整大小、字体加载、获取和保存项目、从 `postMessage` 和本地文件加载、云变量，以及两个 VM 桥接 HOC。VM 桥是 `vmManagerHOC`（驱动 VM：附加音频、启动它、加载项目数据）和 `vmListenerHOC`（监听 VM 事件并分发 Redux actions）。VM 实例本身在 `vm` reducer（`src/reducers/vm.js`）中创建一次，并作为稳定引用保存在 store 中，任何容器都可以通过 `state.scratchGui.vm` 到达它。

渲染的 `GUIComponent`（`src/components/gui/gui.jsx`）布置菜单栏、代码/造型/声音标签页、积木工作区、舞台、目标面板和每个模态框。设置 `isPlayerOnly` 时它只渲染舞台，这就是播放器和嵌入复用编辑器代码的方式。面向用户的导览请参阅[编辑器界面](/editor/interface)和[工作区](/editor/workspace)页面。

## 插件、窗口和主题

两个编辑器子系统位于 React 树旁边而不是内部。

- **插件**（`src/addons/`）是从 Scratch Addons 移植的小型编辑器功能。一个 `SettingsStore` 持有每个插件的启用标志和设置，持久化到 `localStorage`；插件订阅并在设置更改时做出反应。一些插件通过一个共享窗口系统打开浮动面板，该系统渲染页内窗口，或在桌面应用中渲染真正的操作系统窗口。请参阅[插件系统](/internals/addons-system)。
- **主题**（`src/lib/themes/`）将 `Theme` 对象变成写在 `document.documentElement` 上的 CSS 自定义属性，加上提供给 scratch-blocks 的积木颜色。因为属性是无前缀的（`--ui-primary`、`--text-primary`），任何组件都用 `var(...)` 消费它们，社区站点必须将自己的属性加 `--mw-*` 前缀以避免冲突。请参阅[主题](/internals/theming)。

## 身份与社区层

Bilup 不是仅本地的。scratch-gui 还从同一个 webpack 构建提供社区站点（`src/community/`），编辑器有通往它的钩子。

身份基于 Rotur（`src/lib/rotur/identity.js` 是两个应用的唯一真相来源）。用户用 Rotur 令牌登录，它被换成一个 7 天的 Bilup 会话令牌；两个应用都订阅该状态，退出会清除它。前端在 `https://mwapi.mistium.com/api` 用 Bearer 令牌认证调用后端。Rotur 社交功能（帖子、点赞、关注、头像）直接转到 `https://api.rotur.dev`。

发布项目是先上传的：编辑器创建项目记录、上传 sb3 和缩略图（服务器解压它并存储内容寻址资产），用户在站点上分享它。设置和主题以最后写入者获胜的方式同步到账户。这些流程由 `rotur` 和 `collaboration` Redux 切片支撑（请参阅[状态管理](/internals/state)），并且超出本内部节的范围，本内部节聚焦于编辑器引擎；在此注明它们以便整个图景可见。

## 另请参阅

- [组件](/internals/components)
- [容器](/internals/containers)
- [状态管理](/internals/state)
- [主题](/internals/theming)
- [插件系统](/internals/addons-system)
- [线程](/api-reference/threads) 和 [VM API](/api-reference/vm-api)
- [项目结构](/contributing/project-structure)

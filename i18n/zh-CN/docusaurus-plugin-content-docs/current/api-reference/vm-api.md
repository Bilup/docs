---
title: VM API
sidebar_position: 2
---

`VirtualMachine` 是运行项目的引擎。它加载和保存项目、控制播放、管理角色/造型/声音，并持有实际执行积木的 [`Runtime`](/api-reference/threads)。编辑器或播放器打开时，实时实例位于 `window.vm`（请参阅[概览](/api-reference/overview)）。

该类位于 `scratch-vm/src/virtual-machine.js`，是 `scratch-vm` 包的默认导出：

```js
import VirtualMachine from 'scratch-vm';
const vm = new VirtualMachine();
vm.start();
```

`VirtualMachine` 扩展 Node 的 `EventEmitter`，因此您用 `vm.on(name, handler)` 监听。它发出什么请参阅[事件](/api-reference/events)。

## 生命周期

- `start()`：开始运行时的步进循环。在做任何其他事情之前调用一次。
- `quit()`：关闭运行时并释放句柄。用于测试收尾；之后不要再使用运行时。`stop()` 是已弃用的别名。
- `greenFlag()`：启动所有绿旗脚本，就像点击了旗帜一样。
- `stopAll()`：停止每个运行中的线程和活动（停止符号按钮）。
- `clear()`：处理当前项目的数据并重置为空运行时。

## 加载项目

- `loadProject(input)` 返回一个 `Promise`。`input` 可以是 JSON 字符串、普通项目对象，或包含 `.sb`、`.sb2` 或 `.sb3` 文件的 `ArrayBuffer`/类型化数组。VM 验证输入、反序列化它、加载它需要的任何扩展并安装目标。Scratch 1（`.sb`）文件会自动转换。
- `downloadProjectId(id)`：通过附加的存储模块按 ID 获取项目并加载它。需要附加存储（见下文）。
- `fromJSON(json)`：`loadProject` 的已弃用包装；请改用 `loadProject`。

```js
const buffer = await fetch('project.sb3').then(r => r.arrayBuffer());
await vm.loadProject(buffer);
vm.greenFlag();
```

## 保存和导出

- `saveProjectSb3(type, options)`：为压缩的 `.sb3` 返回一个 `Promise`。`type` 是任何 JSZip 输出类型（默认 `'blob'`）。`options.allowOptimization`（默认 `true`）控制积木/注释 ID 优化。
- `saveProjectSb3Stream(type, options)`：为相同数据返回一个 JSZip `StreamHelper`，用于流式传输大型项目。
- `saveProjectSb3DontZip(options)`：返回将文件名映射到原始字节的 `Record<string, Uint8Array>`，跳过 zip 创建。返回的缓冲区是 VM 自己的；不要修改它们（`project.json` 除外，它是新建的）。
- `toJSON(optTargetId, serializationOptions)`：将整个项目（或给定 `optTargetId` 时的单个角色）序列化为 JSON 字符串。
- `exportSprite(targetId, optZipType)`：为一个角色及其资产的 `.sprite3` zip 返回一个 `Promise`。
- `serializeAssets(targetId)`：为项目的资产（或一个目标的）返回 `[{fileName, fileContent}]`。
- `assets`（getter）：当前运行时中每个资产对象的数组。

## 目标、角色和编辑目标

"编辑目标"是编辑器中当前选中的角色或舞台。工作区的积木编辑路由到它。

- `editingTarget`：当前选中的 `Target`（一个 `RenderedTarget`），或 `null`。
- `setEditingTarget(targetId)`：切换正在编辑的目标。发出 `targetsUpdate` 和 `workspaceUpdate`。
- `addSprite(input)`：从 `.sprite2`/`.sprite3` 数据（字符串、对象或 ArrayBuffer）添加角色。返回一个 `Promise`。
- `renameSprite(targetId, newName)`：重命名角色（名称自动去重）。
- `deleteSprite(targetId)`：删除角色及其克隆体。返回一个恢复它的函数。
- `duplicateSprite(targetId)`：返回一个在副本添加后解析的 `Promise`。
- `reorderTarget(targetIndex, newIndex)`：在列表中移动目标。返回它是否更改。
- `postSpriteInfo(data)`：更新编辑/拖动目标的信息（`x`、`y`、`direction`、`size`、`visible`、`rotationStyle`）。
- `startDrag(targetId)` / `stopDrag(targetId)`：让目标进入或退出拖动状态，使积木停止或恢复影响它的位置。
- `setVariableValue(targetId, variableId, value)` / `getVariableValue(targetId, variableId)`：按 ID 写入或读取变量。`setVariableValue` 返回它是否成功；`getVariableValue` 返回值或 `null`。

## 造型、声音和背景

这些作用于编辑目标，除非传入了目标 ID。大多数返回一个 `Promise`。

- `addCostume(md5ext, costumeObject, optTargetId, optVersion)`、`addCostumeFromLibrary(md5ext, costumeObject)`、`duplicateCostume(costumeIndex)`、`renameCostume(costumeIndex, newName)`、`deleteCostume(costumeIndex)`（返回恢复函数或 `null`）。
- `updateBitmap(costumeIndex, bitmap, rotationCenterX, rotationCenterY, bitmapResolution)` 和 `updateSvg(costumeIndex, svg, rotationCenterX, rotationCenterY)`：替换造型的图像。
- `getCostume(costumeIndex)`：造型的 SVG 字符串，或 PNG/JPG 的数据 URI。
- `getExportedCostume(costumeObject)` / `getExportedCostumeBase64(costumeObject)`：用于将造型保存到磁盘的原始字节 / base64。
- `addSound(soundObject, optTargetId)`、`duplicateSound(soundIndex)`、`renameSound(soundIndex, newName)`、`deleteSound(soundIndex)`（返回恢复函数或 `null`）。
- `getSoundBuffer(soundIndex)` / `updateSoundBuffer(soundIndex, newBuffer, soundEncoding)`：读取或替换声音的解码音频。
- `addBackdrop(md5ext, backdropObject)`：向舞台添加背景。
- `reorderCostume(targetId, costumeIndex, newIndex)` / `reorderSound(targetId, soundIndex, newIndex)`：重新排序；每个返回它是否成功。

## 播放模式和运行时选项

- `setTurboMode(on)`：涡轮模式（循环不对重绘让出）。
- `setCompatibilityMode(on)`：30 TPS "2.0" 时序。
- `setFramerate(fps)`：目标帧率。Bilup 允许任意值。
- `setInterpolation(enabled)`：帧插值，平滑项目原生帧率之上的运动。
- `setStageSize(width, height)`：自定义舞台尺寸。
- `setRuntimeOptions(options)` / `setCompilerOptions(options)`：切换运行时行为（围栏、克隆/列表限制、杂项限制）和编译器行为（启用/禁用编译器、防卡死计时器）。每个合并到当前选项中并发出 `*_CHANGED` 事件。
- `setInEditor(inEditor)`、`convertToPackagedRuntime()`：编辑器和打包器用它告诉运行时它处于哪种环境。
- `enableDebug()` / `disableDebug()`：切换调试器的额外检测。

## 附加子系统

VM 不创建自己的渲染器、音频引擎或存储；宿主附加它们。

- `attachRenderer(renderer)` 和 `renderer` getter（返回附加的 `RenderWebGL` 或 `undefined`）。
- `attachAudioEngine(audioEngine)`。
- `attachStorage(storage)`：一个 `scratch-storage` 实例，`downloadProjectId` 和加载素材库资产需要它。
- `attachV2BitmapAdapter(adapter)`：将 Scratch 2 位图转换为 Scratch 3 位图。
- `setCloudProvider(provider)` / `setVideoProvider(provider)`：接入云变量和摄像头后端。
- `postIOData(device, data)`：将输入送入虚拟 I/O 设备（`keyboard`、`mouse`、`mouseWheel`、`userData` 等）。
- `setLocale(locale, messages)`：更改 VM 的语言；返回一个在积木刷新后解析的 `Promise`。

## 扩展和外设

- `extensionManager`：`ExtensionManager`。用它加载内置和自定义扩展。
- `securityManager`：决定非沙箱扩展可以做什么的安全管理器。
- `scanForPeripheral(extensionId)`、`connectPeripheral(extensionId, peripheralId)`、`disconnectPeripheral(extensionId)`、`getPeripheralIsConnected(extensionId)`：控制 micro:bit 和 EV3 等扩展的硬件外设。
- `exports`：为扩展作者暴露的内部类，包括 `Sprite`、`RenderedTarget`、`Variable`、`JSZip`，以及用于注册编译积木描述符的 `exports.compiler.register(...)`。名为 `these_broke_before_and_will_break_again` 和 `i_will_not_ask_for_help_when_these_break` 的函数触及不稳定的编译器内部；名字就是警告。

## 高级：加载实际如何运行

`loadProject` 验证输入，然后调用 `deserializeProject`，它清空运行时并按 `projectVersion` 选择 `sb2` 或 `sb3` 反序列化。结果（目标加上它们使用的扩展集）进入 `installTargets`，它等待异步扩展、通过 `extensionManager` 和 `securityManager` 加载所需扩展、将每个目标添加到运行时、按 `layerOrder` 排序执行顺序、选择一个编辑目标，并发出 `targetsUpdate` 和 `workspaceUpdate`。加载进度通过 `LOAD_PROGRESS` 事件报告，阶段为 `unzipping`、`parsing`、`checking`、`building` 和 `installing`。

## 另请参阅

- [事件](/api-reference/events) 了解完整的事件列表
- [线程](/api-reference/threads) 了解运行时和序列器
- [扩展 API](/api-reference/extension-api) 用于编写扩展
- [嵌入](/advanced/embedding) 和[打包器](/packager/overview) 用于分发项目

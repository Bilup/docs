---
title: VM API
sidebar_position: 2
---

`VirtualMachine` 是執行專案的引擎。它載入和儲存專案、控制播放、管理角色/造型/聲音，並持有實際執行積木的 [`Runtime`](/api-reference/threads)。編輯器或播放器開啟時，即時實例位於 `window.vm`（請參閱[概覽](/api-reference/overview)）。

該類位於 `scratch-vm/src/virtual-machine.js`，是 `scratch-vm` 包的預設匯出：

```js
import VirtualMachine from 'scratch-vm';
const vm = new VirtualMachine();
vm.start();
```

`VirtualMachine` 擴充功能 Node 的 `EventEmitter`，因此您用 `vm.on(name, handler)` 監聽。它發出什麼請參閱[事件](/api-reference/events)。

## 生命週期

- `start()`：開始執行時的步進迴圈。在做任何其他事情之前呼叫一次。
- `quit()`：關閉執行時並釋放控制代碼。用於測試收尾；之後不要再使用執行時。`stop()` 是已棄用的別名。
- `greenFlag()`：啟動所有綠旗指令碼，就像點選了旗幟一樣。
- `stopAll()`：停止每個執行中的執行緒和活動（停止符號按鈕）。
- `clear()`：處理當前專案的資料並重置為空執行時。

## 載入專案

- `loadProject(input)` 返回一個 `Promise`。`input` 可以是 JSON 字串、普通專案物件，或包含 `.sb`、`.sb2` 或 `.sb3` 檔案的 `ArrayBuffer`/型別化陣列。VM 驗證輸入、反序列化它、載入它需要的任何擴充功能並安裝目標。Scratch 1（`.sb`）檔案會自動轉換。
- `downloadProjectId(id)`：透過附加的儲存模組按 ID 獲取專案並載入它。需要附加儲存（見下文）。
- `fromJSON(json)`：`loadProject` 的已棄用包裝；請改用 `loadProject`。

```js
const buffer = await fetch('project.sb3').then(r => r.arrayBuffer());
await vm.loadProject(buffer);
vm.greenFlag();
```

## 儲存和匯出

- `saveProjectSb3(type, options)`：為壓縮的 `.sb3` 返回一個 `Promise`。`type` 是任何 JSZip 輸出型別（預設 `'blob'`）。`options.allowOptimization`（預設 `true`）控制積木/註解 ID 最佳化。
- `saveProjectSb3Stream(type, options)`：為相同資料返回一個 JSZip `StreamHelper`，用於流式傳輸大型專案。
- `saveProjectSb3DontZip(options)`：返回將檔名對映到原始位元組的 `Record<string, Uint8Array>`，跳過 zip 建立。返回的緩衝區是 VM 自己的；不要修改它們（`project.json` 除外，它是新建的）。
- `toJSON(optTargetId, serializationOptions)`：將整個專案（或給定 `optTargetId` 時的單個角色）序列化為 JSON 字串。
- `exportSprite(targetId, optZipType)`：為一個角色及其資產的 `.sprite3` zip 返回一個 `Promise`。
- `serializeAssets(targetId)`：為專案的資產（或一個目標的）返回 `[{fileName, fileContent}]`。
- `assets`（getter）：當前執行時中每個資產物件的陣列。

## 目標、角色和編輯目標

"編輯目標"是編輯器中當前選中的角色或舞臺。工作區的積木編輯路由到它。

- `editingTarget`：當前選中的 `Target`（一個 `RenderedTarget`），或 `null`。
- `setEditingTarget(targetId)`：切換正在編輯的目標。發出 `targetsUpdate` 和 `workspaceUpdate`。
- `addSprite(input)`：從 `.sprite2`/`.sprite3` 資料（字串、物件或 ArrayBuffer）新增角色。返回一個 `Promise`。
- `renameSprite(targetId, newName)`：重新命名角色（名稱自動去重）。
- `deleteSprite(targetId)`：刪除角色及其克隆體。返回一個恢復它的函式。
- `duplicateSprite(targetId)`：返回一個在副本新增後解析的 `Promise`。
- `reorderTarget(targetIndex, newIndex)`：在列表中移動目標。返回它是否更改。
- `postSpriteInfo(data)`：更新編輯/拖動目標的資訊（`x`、`y`、`direction`、`size`、`visible`、`rotationStyle`）。
- `startDrag(targetId)` / `stopDrag(targetId)`：讓目標進入或退出拖動狀態，使積木停止或恢復影響它的位置。
- `setVariableValue(targetId, variableId, value)` / `getVariableValue(targetId, variableId)`：按 ID 寫入或讀取變數。`setVariableValue` 返回它是否成功；`getVariableValue` 返回值或 `null`。

## 造型、聲音和背景

這些作用於編輯目標，除非傳入了目標 ID。大多數返回一個 `Promise`。

- `addCostume(md5ext, costumeObject, optTargetId, optVersion)`、`addCostumeFromLibrary(md5ext, costumeObject)`、`duplicateCostume(costumeIndex)`、`renameCostume(costumeIndex, newName)`、`deleteCostume(costumeIndex)`（返回恢復函式或 `null`）。
- `updateBitmap(costumeIndex, bitmap, rotationCenterX, rotationCenterY, bitmapResolution)` 和 `updateSvg(costumeIndex, svg, rotationCenterX, rotationCenterY)`：替換造型的影像。
- `getCostume(costumeIndex)`：造型的 SVG 字串，或 PNG/JPG 的資料 URI。
- `getExportedCostume(costumeObject)` / `getExportedCostumeBase64(costumeObject)`：用於將造型儲存到磁碟的原始位元組 / base64。
- `addSound(soundObject, optTargetId)`、`duplicateSound(soundIndex)`、`renameSound(soundIndex, newName)`、`deleteSound(soundIndex)`（返回恢復函式或 `null`）。
- `getSoundBuffer(soundIndex)` / `updateSoundBuffer(soundIndex, newBuffer, soundEncoding)`：讀取或替換聲音的解碼音訊。
- `addBackdrop(md5ext, backdropObject)`：向舞臺新增背景。
- `reorderCostume(targetId, costumeIndex, newIndex)` / `reorderSound(targetId, soundIndex, newIndex)`：重新排序；每個返回它是否成功。

## 播放模式和執行時選項

- `setTurboMode(on)`：渦輪模式（迴圈不對重繪讓出）。
- `setCompatibilityMode(on)`：30 TPS "2.0" 時序。
- `setFramerate(fps)`：目標幀率。Bilup 允許任意值。
- `setInterpolation(enabled)`：幀插值，平滑專案原生幀率之上的運動。
- `setStageSize(width, height)`：自訂舞臺尺寸。
- `setRuntimeOptions(options)` / `setCompilerOptions(options)`：切換執行時行為（圍欄、克隆/列表限制、雜項限制）和編譯器行為（啟用/停用編譯器、防卡死計時器）。每個合併到當前選項中併發出 `*_CHANGED` 事件。
- `setInEditor(inEditor)`、`convertToPackagedRuntime()`：編輯器和打包器用它告訴執行時它處於哪種環境。
- `enableDebug()` / `disableDebug()`：切換偵錯器的額外檢測。

## 附加子系統

VM 不建立自己的渲染器、音訊引擎或儲存；宿主附加它們。

- `attachRenderer(renderer)` 和 `renderer` getter（返回附加的 `RenderWebGL` 或 `undefined`）。
- `attachAudioEngine(audioEngine)`。
- `attachStorage(storage)`：一個 `scratch-storage` 實例，`downloadProjectId` 和載入素材庫資產需要它。
- `attachV2BitmapAdapter(adapter)`：將 Scratch 2 點陣圖轉換為 Scratch 3 點陣圖。
- `setCloudProvider(provider)` / `setVideoProvider(provider)`：接入雲端變數和攝影機後端。
- `postIOData(device, data)`：將輸入送入虛擬 I/O 裝置（`keyboard`、`mouse`、`mouseWheel`、`userData` 等）。
- `setLocale(locale, messages)`：更改 VM 的語言；返回一個在積木重新整理後解析的 `Promise`。

## 擴充功能和周邊

- `extensionManager`：`ExtensionManager`。用它載入內建和自訂擴充功能。
- `securityManager`：決定非沙箱擴充功能可以做什麼的安全管理器。
- `scanForPeripheral(extensionId)`、`connectPeripheral(extensionId, peripheralId)`、`disconnectPeripheral(extensionId)`、`getPeripheralIsConnected(extensionId)`：控制 micro:bit 和 EV3 等擴充功能的硬體周邊。
- `exports`：為擴充功能作者暴露的內部類，包括 `Sprite`、`RenderedTarget`、`Variable`、`JSZip`，以及用於註冊編譯積木描述符的 `exports.compiler.register(...)`。名為 `these_broke_before_and_will_break_again` 和 `i_will_not_ask_for_help_when_these_break` 的函式觸及不穩定的編譯器內部；名字就是警告。

## 進階：載入實際如何執行

`loadProject` 驗證輸入，然後呼叫 `deserializeProject`，它清空執行時並按 `projectVersion` 選擇 `sb2` 或 `sb3` 反序列化。結果（目標加上它們使用的擴充功能集）進入 `installTargets`，它等待非同步擴充功能、透過 `extensionManager` 和 `securityManager` 載入所需擴充功能、將每個目標新增到執行時、按 `layerOrder` 排序執行順序、選擇一個編輯目標，併發出 `targetsUpdate` 和 `workspaceUpdate`。載入進度透過 `LOAD_PROGRESS` 事件報告，階段為 `unzipping`、`parsing`、`checking`、`building` 和 `installing`。

## 另請參閱

- [事件](/api-reference/events) 瞭解完整的事件列表
- [執行緒](/api-reference/threads) 瞭解執行時和序列器
- [擴充功能 API](/api-reference/extension-api) 用於編寫擴充功能
- [嵌入](/advanced/embedding) 和[打包器](/packager/overview) 用於分發專案

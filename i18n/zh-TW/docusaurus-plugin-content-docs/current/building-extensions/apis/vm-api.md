---
title: VM API
sidebar_position: 3
---

# VM API

VM（虛擬機器）執行專案。[非沙箱擴充功能](/building-extensions/unsandboxed)以 `Scratch.vm` 存取它，積木函式以 `util.runtime` 存取它（執行時是 `vm.runtime`）。

```js
if (!Scratch.extensions.unsandboxed) {
  throw new Error('This extension needs the VM');
}
const vm = Scratch.vm;
const runtime = vm.runtime;
```

這些是內部物件，不是凍結的公共 API。保護缺失的值（角色被刪除、擴充功能解除安裝），並優先監聽事件而不是輪詢。這些方法中的大多數在 Bilup 和 TurboWarp 上都存在；Bilup 特有的行為在重要處註明。

## 專案控制

```js
vm.greenFlag();          // 按下綠旗
vm.stopAll();            // 停止所有指令碼
vm.setTurboMode(true);   // 渦輪模式開/關
vm.setFramerate(60);     // 目標每秒幀數
vm.setInterpolation(true);
vm.setCompilerOptions({ enabled: true, warpTimer: false });
vm.setRuntimeOptions({ maxClones: 300, miscLimits: true, fencing: true });
vm.setStageSize(width, height);
```

Bilup 預設編譯專案（`compilerOptions.enabled` 為 `true`）。幀率和舞臺大小不限於 Scratch 的 30 FPS / 480x360。

## 目標

"目標"是一個角色、克隆體或舞臺。

```js
runtime.targets;                          // 所有目標的陣列（舞臺 + 角色 + 克隆）
runtime.getTargetForStage();              // 舞臺目標
runtime.getTargetById(id);                // 按內部 id
runtime.getSpriteTargetByName('Sprite1'); // 按名稱的原始（非克隆）角色
vm.editingTarget;                         // 編輯器中當前開啟的角色
```

目標屬性和方法：

```js
const t = runtime.getSpriteTargetByName('Sprite1');
t.x; t.y; t.direction; t.size; t.visible;
t.getName();
t.isStage; t.isOriginal;
t.currentCostume;                         // 索引
t.sprite.costumes[t.currentCostume].name;

t.setXY(100, 50);
t.setDirection(90);
t.setSize(150);
```

### 克隆

```js
const original = runtime.getSpriteTargetByName('Sprite1');
const clone = original.makeClone();
if (clone) {
  runtime.addTarget(clone);
  clone.setXY(100, 50);
}

// 移除克隆（絕不是原始）
if (!clone.isOriginal) runtime.disposeTarget(clone);
```

## 變數和列表

變數和列表位於目標上。變數型別使用 `''`，列表使用 `'list'`。

```js
const stage = runtime.getTargetForStage();

const score = stage.lookupVariableByNameAndType('score', '');
if (score) score.value = 100;

const items = stage.lookupVariableByNameAndType('items', 'list');
if (items) items.value.push('new item');
```

全域變數和列表位於舞臺上；角色區域性的位於角色上。要列舉，請迭代 `target.variables` 並檢查每個條目的 `.type`。

## 啟動指令碼

```js
// 啟動每個"當綠旗被點選"帽子
runtime.startHats('event_whenflagclicked');

// 啟動匹配欄位的帽子
runtime.startHats('event_whenbroadcastreceived', { BROADCAST_OPTION: 'message1' });
```

`startHats` 返回啟動的 `Thread` 物件。在執行中的積木內部，請使用 `util.startHats`。請參閱[事件和帽子](/building-extensions/hats)。

## 執行緒

```js
runtime.threads;              // 執行中的執行緒
runtime.stopForTarget(target); // 停止目標指令碼

thread.target;   // 執行它的目標
thread.topBlock; // 頂部積木的 id
thread.status;   // 見下文
```

執行緒狀態值：

| 值 | 常量 | 含義 |
|:-:|:--|:--|
| 0 | `STATUS_RUNNING` | 執行中 |
| 1 | `STATUS_PROMISE_WAIT` | 等待 Promise |
| 2 | `STATUS_YIELD` | 本幀已讓出 |
| 3 | `STATUS_YIELD_TICK` | 讓出直到下一個 tick |
| 4 | `STATUS_DONE` | 已完成 |

在積木內部，`util`（積木工具）是您對當前執行緒的控制代碼，而不是深入 `runtime.threads`：

- `util.thread` 是執行積木的 `Thread`。
- `util.yield()` 為本幀讓出當前執行緒（從非同步積木返回 Promise 是等待的常規方式；`util.yield()` 是手動等價物）。
- `util.yieldTick()` 讓出直到下一個 tick。
- `util.startBranch(index, isLoop)` 執行 C 積木分支（請參閱[自訂 C 積木](/building-extensions/custom-c-blocks)）。

完整的執行緒模型、狀態和序列器請參閱[執行緒參考](/api-reference/threads)。

## 事件

用 `vm.on(...)` 或 `runtime.on(...)` 監聽：

| 事件 | 觸發時 |
|:--|:--|
| `PROJECT_RUN_START` | 指令碼開始執行 |
| `PROJECT_RUN_STOP` | 所有指令碼已停止 |
| `PROJECT_LOADED` | 專案完成載入 |
| `PROJECT_CHANGED` | 專案被修改 |
| `targetWasCreated` | 建立目標（通常是克隆）；引數 `(newTarget, sourceTarget)` |
| `TARGETS_UPDATE` | 目標列表更改 |
| `BEFORE_EXECUTE` | 每幀，在指令碼執行前（對謂詞帽子有用） |
| `MONITORS_UPDATE` | 監視器值更改 |

```js
runtime.on('targetWasCreated', (target) => console.log('created', target.getName()));
vm.on('PROJECT_RUN_START', () => console.log('running'));
```

上表列出了擴充功能最常觸及的事件。執行時事件的完整集合和生命週期請參閱[執行時參考](/api-reference/runtime)。

## 輸入裝置

```js
const mouse = runtime.ioDevices.mouse;
mouse.getClientX(); mouse.getClientY(); mouse.getIsDown();

const keyboard = runtime.ioDevices.keyboard;
keyboard.getKeyIsDown('space');

const clock = runtime.ioDevices.clock;
clock.projectTimer();       // 計時器重置以來的秒數
clock.resetProjectTimer();
```

## 舞臺大小

```js
runtime.stageWidth;   // 當前邏輯寬度
runtime.stageHeight;  // 當前邏輯高度
vm.setStageSize(640, 360);
```

## 擴充功能管理

```js
const em = vm.extensionManager;
em.isExtensionLoaded('pen');   // 布林值
em.getExtensionURLs();         // 已載入擴充功能的 URL
em.refreshBlocks('myextension'); // 更改積木資訊後重新渲染積木區
```

## 按專案儲存

`runtime.extensionStorage` 是儲存在專案檔案內部的物件。以您的擴充功能 ID 為鍵儲存小的可 JSON 序列化設定：

```js
runtime.extensionStorage.myextension = { volume: 0.5 };
```

## 編譯器內部

要直接生成 JavaScript（原生速度積木），Bilup 透過 `vm.exports.compiler` 暴露受支援的擴充功能編譯器 API。這是它自己的主題；請參閱[編譯擴充功能](/building-extensions/compiled/overview)。

## 另請參閱

- [Scratch 物件 API](/building-extensions/apis/scratch-api)
- [渲染器 API](/building-extensions/apis/renderer-api)
- [編譯擴充功能](/building-extensions/compiled/overview)
- [執行時參考](/api-reference/runtime)
- [執行緒參考](/api-reference/threads)

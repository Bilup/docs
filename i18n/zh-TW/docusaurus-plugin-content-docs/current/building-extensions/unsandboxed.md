---
title: 非沙箱擴充功能
sidebar_position: 6
---

# 非沙箱擴充功能

非沙箱擴充功能作為主頁面中的普通 `<script>` 標籤執行，而不是在沙箱中。這讓它們可以存取 Bilup 的內部，以及一組相應的責任。

## 擴充功能何時以非沙箱方式執行

Bilup 決定如何載入每個擴充功能：

- **從檔案或貼上的程式碼載入**：自訂擴充功能對話方塊有一個"不進入沙箱執行擴充功能"核取方塊。由您選擇。
- **從 URL 載入**：只有當 URL 恰好以下面一個受信任字首開頭時，它才自動以非沙箱方式執行：
  - `https://extensions.bilup.org/`
  - `https://extensions.turbowarp.org/`
  - `http://localhost:8000/`

  任何其他 URL 都以沙箱方式載入，除非使用者手動選擇信任它。無法強制任意 URL 以非沙箱方式載入，這是故意的，為了保護使用者免受惡意擴充功能的侵害。

由於您不控制那兩個畫廊域名，開發期間您從 `http://localhost:8000/` 提供擴充功能。將您的[本地伺服器](/building-extensions/introduction)指向 8000 埠。它必須恰好是 8000 埠上的 `localhost`；`127.0.0.1` 和 `0.0.0.0` 不會被視為受信任。

## 模板

語法與沙箱擴充功能幾乎相同，包裹在[立即呼叫函式表示式（IIFE）](https://developer.mozilla.org/zh-CN/docs/Glossary/IIFE)中並使用嚴格模式：

```js
(function(Scratch) {
  'use strict';
  class MyExtension {
    getInfo() {
      return { /* ... */ };
    }
  }
  Scratch.extensions.register(new MyExtension());
})(Scratch);
```

IIFE 防止非沙箱擴充功能相互干擾。因為它們共享一個頁面，兩個都宣告全域 `vm` 或 `helper` 的擴充功能會衝突。將一切包裹在帶 `'use strict'` 的函式中可以讓您的變數保持私有，並給每個擴充功能自己的 `Scratch` 副本。

您的擴充功能定義的**每個**變數、函式和類都必須位於 IIFE 內部。這個模板也是向後相容的：只要不使用任何僅非沙箱的功能，同樣的程式碼在沙箱載入時仍然有效。

這裡有一個完整的非沙箱 hello world（[下載](/example-extensions/unsandboxed/hello-world-unsandboxed.js)）：

```js
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Hello World example must run unsandboxed');
  }

  class HelloWorld {
    getInfo() {
      return {
        id: 'helloworldunsandboxed',
        name: 'Unsandboxed Hello World',
        blocks: [
          { opcode: 'hello', blockType: Scratch.BlockType.REPORTER, text: 'Hello!' }
        ]
      };
    }
    hello() {
      return 'World!';
    }
  }
  Scratch.extensions.register(new HelloWorld());
})(Scratch);
```

在 `http://localhost:8000/hello-world-unsandboxed.js` 提供它並載入那個確切 URL。把它的積木放進一個將它加入列表的 `重複執行 (30)` 中；它會立即執行，而沙箱版本至少要花一秒。

## 新責任

非沙箱程式碼與使用者的專案在同一頁面上執行，因此一個錯誤可能造成真正的損害：

- **積木絕不能丟擲異常。** 丟擲的錯誤可能破壞執行該積木的指令碼。
- **報告和布林積木必須返回有效值**（字串、數字或布林值）。返回 `undefined` 可能以令人困惑的方式破壞指令碼。
- **積木絕不能陷入無限迴圈。** 掛起的沙箱擴充功能通常只是停滯自身；非沙箱的會凍結整個頁面，這可能導致**資料丟失**。

如果您的擴充功能確實需要非沙箱模式，請響亮且儘早地失敗：

```js
if (!Scratch.extensions.unsandboxed) {
  throw new Error('My Extension must run unsandboxed');
}
```

## 存取 Bilup 內部

頭條功能是 `Scratch.vm`，實際的 VM 物件：

```js
const vm = Scratch.vm;
```

從那裡可以存取很多東西。記住每個宣告都放在 IIFE 內部：

```js
// 好
(function(Scratch) {
  const vm = Scratch.vm;
  // ...
}(Scratch));

// 壞：洩漏一個全域
const vm = Scratch.vm;
(function(Scratch) { /* ... */ }(Scratch));
```

您的開發者控制台是最好的探索方式：擴充功能載入後，您可以在那裡檢查 `Scratch` 和 `vm`。[scratch-vm 原始碼](/contributing/project-structure)是存在什麼的參考。

這裡有一個透過 VM 切換渦輪模式的擴充功能（[下載](/example-extensions/unsandboxed/turbo-mode.js)）：

```js
(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This Turbo Mode example must run unsandboxed');
  }
  const vm = Scratch.vm;

  class TurboMode {
    getInfo() {
      return {
        id: 'turbomodeunsandboxed',
        name: 'Turbo Mode',
        blocks: [
          {
            opcode: 'set',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set turbo mode to [ENABLED]',
            arguments: {
              ENABLED: { type: Scratch.ArgumentType.STRING, menu: 'ENABLED_MENU' }
            }
          }
        ],
        menus: {
          ENABLED_MENU: { acceptReporters: true, items: ['on', 'off'] }
        }
      };
    }
    set(args) {
      vm.setTurboMode(args.ENABLED === 'on');
    }
  }
  Scratch.extensions.register(new TurboMode());
})(Scratch);
```

## 積木工具物件

沙箱積木只接收它的引數；它甚至不知道是哪個角色運行了它。非沙箱積木獲得**第二個**引數，習慣上叫 `util`，即 BlockUtility。`util.target` 是執行積木的實際角色（目標）（[下載](/example-extensions/unsandboxed/block-utility-examples.js)）：

```js
getSpriteName(args, util) {
  return util.target.getName();
}
doesVariableExist(args, util) {
  const variable = util.target.lookupVariableByNameAndType(args.NAME.toString(), args.TYPE);
  return !!variable;
}
```

::::warning
每個角色、指令碼和積木共享**一個** `util` 物件。Bilup 不是每次呼叫分配新的，而是更新共享物件的屬性。因此 `util` 只在積木執行的準確時刻有效。稍後讀取它（在 `setTimeout`、Promise 回呼、事件處理器內部）會得到錯誤的目標。請先把您需要的儲存到區域性變數中：

```js
// 不可靠：util.target 可能已更改
myBlock(args, util) {
  setTimeout(() => alert(util.target.getName()), 1000);
}

// 可靠：立即捕獲目標
myBlock(args, util) {
  const target = util.target;
  setTimeout(() => alert(target.getName()), 1000);
}
```
::::

一個常見習慣是在 IIFE 頂部為頻繁使用的物件起別名：

```js
const vm = Scratch.vm;
const runtime = vm.runtime;
const Cast = Scratch.Cast;
```

## 需要許可權的 API

沙箱擴充功能被隔離，因此它可以自由使用 `fetch` 和類似的。非沙箱擴充功能以頁面的全部權力執行，因此它在接觸網路、開啟視窗或重定向前必須請求許可權。這讓使用者掌握其隱私的控制權。這些許可權檢查還阻止專案偷偷帶入任意 JavaScript（例如 `javascript:` 重定向 URL）。

對某些知名靜態主機的請求可能會自動批准；其他的會提示使用者。不要假設任何一種方式。您的程式碼必須處理使用者說不的情況，就像在沒有網際網路連線時那樣行為。

### 網路：fetch、WebSocket、圖片、音訊

使用 `Scratch.fetch(url)` 而不是 `fetch(url)`。對於其他接觸網路的 API，將它們放在 `await Scratch.canFetch(url)` 後面：

```js
// 而不是 fetch(url)：
const response = await Scratch.fetch(url);

// WebSocket：
if (await Scratch.canFetch(url)) {
  const ws = new WebSocket(url);
}

// 圖片 / 音訊：
if (await Scratch.canFetch(src)) {
  const image = new Image();
  image.src = src;
}
```

### 開啟標籤頁或視窗

使用 `Scratch.openWindow(url)` 而不是 `window.open(url)`。它總是在新標籤頁或視窗中開啟。如果您必須自己呼叫 `window.open`，請將它放在 `await Scratch.canOpenWindow(url)` 後面：

```js
const win = await Scratch.openWindow(url);
// 帶特性：
const win = await Scratch.openWindow(url, 'width=400,height=400');
```

### 重定向頁面

使用 `Scratch.redirect(url)` 而不是 `location.href = url`，或放在 `await Scratch.canRedirect(url)` 後面。

裝置存取存在其他許可權檢查：`Scratch.canRecordAudio()`、`canRecordVideo()`、`canReadClipboard()`、`canNotify()`、`canGeolocate()`、`canEmbed()`、`canDownload()`。請參閱 [Scratch API 參考](/building-extensions/apis/scratch-api)。

## 練習

先不看提示嘗試這些；它教您 VM 是如何佈局的。

1. 一個點選綠旗的積木。（提示：`vm.greenFlag`。）
2. 一個返回角色 x 座標的報告積木。（提示：`util.target.x`。）
3. 一個將角色移到舞臺中心的命令。（提示：`util.target.setXY(0, 0)`。）

## 下一步

厭倦了硬重新整理？讓我們設定[一個更好的開發伺服器](/building-extensions/better-development-server)。

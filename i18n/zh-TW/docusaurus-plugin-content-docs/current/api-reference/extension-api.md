---
title: 擴充功能 API
sidebar_position: 4
---

擴充功能向積木區新增一個積木分類。本頁是面向作者的執行時 API 參考：全域 `Scratch` 物件、`BlockType` 和 `ArgumentType` 列舉，以及註冊入口點。逐步指南請從[建置擴充功能](/building-extensions/introduction)開始。

擴充功能是一個帶 `getInfo()` 方法的類，它描述擴充功能的積木，每個積木對應一個方法。它用 `Scratch.extensions.register` 註冊自己。

```js
class MyExtension {
    getInfo () {
        return {
            id: 'myextension',
            name: 'My Extension',
            color1: '#ff4c4c',
            blocks: [
                {
                    opcode: 'addTwo',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'add [A] and [B]',
                    arguments: {
                        A: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1},
                        B: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2}
                    }
                }
            ]
        };
    }
    addTwo (args) {
        return Scratch.Cast.toNumber(args.A) + Scratch.Cast.toNumber(args.B);
    }
}
Scratch.extensions.register(new MyExtension());
```

## `Scratch` 物件

對於非沙箱擴充功能，`Scratch` 是一個全域。它的始終存在成員來自 `scratch-vm/src/extension-support/tw-extension-api-common.js`：

- `Scratch.ArgumentType`、`Scratch.BlockType`、`Scratch.TargetType`、`Scratch.BlockShape`：下面的列舉。
- `Scratch.Cast`：積木用來規範化輸入的[型別強制轉換輔助工具](/api-reference/utilities)。請使用這些而不是原始的 `Number(...)`/`String(...)`。

非沙箱擴充功能獲得更多，當指令碼執行時每個擴充功能都會新增（`tw-unsandboxed-extension-runner.js`）：

- `Scratch.extensions.register(extensionObject)`：註冊您的擴充功能。`Scratch.extensions.unsandboxed` 在此環境中為 `true`。
- `Scratch.vm`：即時的 [`VirtualMachine`](/api-reference/vm-api)。
- `Scratch.renderer`：附加的渲染器。
- `Scratch.translate`：用於本地化字串的 format-message 輔助工具。
- 許可權檢查（每個返回 `Promise<boolean>`）：`Scratch.canFetch(url)`、`Scratch.canOpenWindow(url)`、`Scratch.canRedirect(url)`、`Scratch.canDownload(url, name)`、`Scratch.canEmbed(url)`、`Scratch.canRecordAudio()`、`Scratch.canRecordVideo()`、`Scratch.canReadClipboard()`、`Scratch.canNotify()`、`Scratch.canGeolocate()`。
- 受守衛的操作（每個先檢查匹配的許可權，然後行動）：`Scratch.fetch(url, options)`、`Scratch.download(url, file)`、`Scratch.openWindow(url, features)`、`Scratch.redirect(url)`。

總是透過這些輔助工具路由網路和視窗存取。它們詢問 VM 的安全管理器，這是使用者保持對擴充功能可以觸及範圍控制的方式。請參閱[沙箱與非沙箱](/building-extensions/unsandboxed)。

## BlockType

來自 `extension-support/block-type.js`：

| 值 | 含義 |
| --- | --- |
| `BlockType.COMMAND` (`'command'`) | 執行操作的堆疊積木。 |
| `BlockType.REPORTER` (`'reporter'`) | 返回數字或字串。 |
| `BlockType.BOOLEAN` (`'Boolean'`) | 返回真/假的六邊形報告積木。 |
| `BlockType.HAT` (`'hat'`) | 當條件變為真時啟動堆疊。 |
| `BlockType.EVENT` (`'event'`) | 無謂詞的帽子；在匹配事件觸發時執行。 |
| `BlockType.CONDITIONAL` (`'conditional'`) | C 積木；可以執行一個分支，然後繼續。 |
| `BlockType.LOOP` (`'loop'`) | C 積木；每次分支執行後重新求值。 |
| `BlockType.BUTTON` (`'button'`) | 積木區按鈕，不是可執行的積木。 |
| `BlockType.LABEL` (`'label'`) | 積木區中的文本標籤，不是積木。 |
| `BlockType.XML` (`'xml'`) | 任意 scratch-blocks XML。 |

## ArgumentType

來自 `extension-support/argument-type.js`。該型別控制引數顯示哪個輸入編輯器：

| 值 | 顯示的輸入 |
| --- | --- |
| `ArgumentType.NUMBER` (`'number'`) | 數字欄位。 |
| `ArgumentType.STRING` (`'string'`) | 文本欄位。 |
| `ArgumentType.BOOLEAN` (`'Boolean'`) | 六邊形布林凹槽（無預設值）。 |
| `ArgumentType.ANGLE` (`'angle'`) | 帶角度選擇器的數字欄位。 |
| `ArgumentType.COLOR` (`'color'`) | 顏色選擇器。 |
| `ArgumentType.MATRIX` (`'matrix'`) | 5x5 矩陣欄位。 |
| `ArgumentType.NOTE` (`'note'`) | 鋼琴音符選擇器。 |
| `ArgumentType.IMAGE` (`'image'`) | 積木標籤中的內聯影像（不是真正的輸入）。 |
| `ArgumentType.COSTUME` (`'costume'`) | 當前目標造型的下拉框。 |
| `ArgumentType.SOUND` (`'sound'`) | 當前目標聲音的下拉框。 |

在 `getInfo` 中，每個引數條目接受 `type`、可選的 `defaultValue` 和可選的 `menu`（擴充功能的 `menus` 中定義的選單名稱）。

## TargetType

來自 `extension-support/target-type.js`：`TargetType.SPRITE` (`'sprite'`) 和 `TargetType.STAGE` (`'stage'`)。由篩選欄位使用，例如積木的 `filter` 陣列。

## 積木方法

每個積木的 `opcode` 對映到擴充功能實例上的一個方法。它接收 `(args, util)`：

- `args`：一個按引數名鍵控的物件，持有當前輸入值（用 `Scratch.Cast` 強制轉換）。
- `util`：積木工具，包括 `util.target`（執行目標）、`util.thread`，以及用於 C 積木的 `util.startBranch(n, isLoop)`。請參閱[執行緒](/api-reference/threads)和[自訂 C 積木](/building-extensions/custom-c-blocks)。

報告積木返回它的值。命令積木不返回任何內容。返回一個 `Promise` 使積木非同步。請參閱[非同步性](/building-extensions/async)。

## 另請參閱

- [建置擴充功能：你好世界](/building-extensions/hello-world)
- [積木註冊](/api-reference/block-registration) 瞭解 `getInfo` 如何變成真正的積木
- [實用工具](/api-reference/utilities) 瞭解 `Cast` 和朋友們
- [擴充功能的 Scratch API](/building-extensions/apis/scratch-api)

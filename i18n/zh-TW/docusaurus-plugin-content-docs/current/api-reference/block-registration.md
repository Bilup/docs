---
title: 積木註冊
sidebar_position: 5
---

積木以兩種方式進入積木區：內建分類在執行時啟動時作為內部積木包註冊，擴充功能透過將 `getInfo()` 描述符變成真正的 scratch-blocks 的同一流水線註冊它們的積木。本頁描述這在 `scratch-vm/src/engine/runtime.js` 中如何發生。

## 內建積木包

核心分類（運動、外觀、聲音、事件、控制、偵測、運算、變數和自制積木）是 `scratch-vm/src/blocks/scratch3_*.js` 中的普通類。構造時，執行時呼叫 `_registerBlockPackages()`，它實例化每個包並從中收集三樣東西：

- `getPrimitives()`：操作碼到實現函式的對映。這些儲存在 `runtime._primitives` 中，按操作碼鍵控（例如 `motion_movesteps`），直譯器呼叫它們。
- `getHats()`：帽子積木的後設資料（例如帽子是否重啟現有執行緒），儲存在 `runtime._hats` 中。
- `getMonitored()`：哪些報告積木可以顯示為舞臺監視器，合併到 `runtime.monitorBlockInfo` 中。

每個包也透過 `compilerRegisterExtension(name, object)` 註冊給編譯器，它作為 `ext_<name>` 附加到執行時，使編譯程式碼可以觸及它。

一個操作碼是分類名和積木名用下劃線連線，如 `looks_sayforsecs`。積木區的形狀、標籤和輸入來自 `scratch-blocks` 包中的 scratch-blocks 定義；VM 側只提供操作碼和它的行為。

## 擴充功能積木

擴充功能不編輯那些檔案。它們在 `getInfo()` 中描述自己的積木，並用 `Scratch.extensions.register` 註冊（請參閱[擴充功能 API](/api-reference/extension-api)）。擴充功能管理器執行 `getInfo()` 並將結果交給執行時的 `_registerExtensionPrimitives(extensionInfo)`，它：

1. 從擴充功能的 `id`、`name`、顏色（`color1`/`color2`/`color3`，回退到預設值）和圖示建置一個分類描述符，並將其推入 `runtime._blockInfo`。
2. 透過 `_convertForScratchBlocks` 轉換每個積木描述符來填充分類，該函式將 `text`、`blockType` 和 `arguments` 變成編輯器需要的 scratch-blocks XML。
3. 註冊任何自訂欄位型別，為每個發出 `EXTENSION_FIELD_ADDED`。
4. 用完成的分類發出 `EXTENSION_ADDED`，讓 GUI 將其新增到積木區。

重新載入擴充功能的積木會呼叫 `_refreshExtensionPrimitives`，它重建分類併發出 `BLOCKSINFO_UPDATE`。移除一個會呼叫 `_unregisterExtensionPrimitives` 併發出 `EXTENSION_REMOVED`。請參閱[事件](/api-reference/events)。

## 積木描述符

`getInfo()` 的 `blocks` 陣列中的每個條目看起來像這樣：

```js
{
    opcode: 'doThing',
    blockType: Scratch.BlockType.COMMAND,
    text: 'do thing with [INPUT]',
    arguments: {
        INPUT: {
            type: Scratch.ArgumentType.STRING,
            defaultValue: 'hello'
        }
    }
}
```

執行時用擴充功能 ID 給操作碼加名稱空間，因此擴充功能 `myext` 上的 `doThing` 變成操作碼 `myext_doThing`，並在積木執行時呼叫擴充功能實例的 `doThing` 方法。`text` 中的佔位符（如 `[INPUT]`）與 `arguments` 中的鍵匹配。

## 編譯積木

直譯器路徑直接使用積木方法。對於想讓積木透過 Bilup 的 JavaScript 編譯器執行的擴充功能，`vm.exports.compiler.register(extensionId, blocks)` 為每個操作碼註冊一個帶 `type`（`any`、`number`、`numberOrNaN`、`string`、`boolean`、`command` 之一）和一個 `compile` 函式的描述符。請參閱[編譯擴充功能](/building-extensions/compiled/overview)。

## 另請參閱

- [擴充功能 API](/api-reference/extension-api)
- [執行緒](/api-reference/threads) 瞭解註冊積木如何執行
- [事件](/api-reference/events)
- [建置自訂 C 積木](/building-extensions/custom-c-blocks)

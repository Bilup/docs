---
title: 雜項 API
sidebar_position: 12
---

# 雜項 API

既然您可以編寫擴充功能，這裡有 `getInfo()` 和 `Scratch` 物件上可用的更多選項。除非另有說明，這些在**沙箱和非沙箱**擴充功能中都有效，並且可以自由組合。

## 積木顏色

`color1`、`color2` 和 `color3` 分別設定積木顏色、輸入顏色和選單顏色。`color1` 應該最亮，`color3` 最暗。使用十六進位制程式碼（[下載](/example-extensions/color.js)）：

```js
getInfo() {
  return {
    id: 'colorexample',
    name: 'Color Example',
    color1: '#ff0000',
    color2: '#00ff00',
    color3: '#0000ff',
    blocks: [ /* ... */ ]
  };
}
```

替代積木顏色模式（高對比度、深色和外掛預設）會自動從這些值生成。

## docsURI

`docsURI` 在擴充功能積木列表的頂部新增一個開啟文件頁面的按鈕：

```js
getInfo() {
  return {
    id: 'hellodocs',
    name: 'Hello Docs!',
    docsURI: 'https://example.com/my-extension-docs',
    blocks: [ /* ... */ ]
  };
}
```

## disableMonitor

Bilup 自動為任何無輸入的 `REPORTER` 積木（並且與 Scratch 不同，`BOOLEAN` 積木也是）提供一個監視器核取方塊。在積木上設定 `disableMonitor: true` 來隱藏該核取方塊（[下載](/example-extensions/unmonitorable.js)）。注意這不會移除有人用擴充功能舊版本建立的監視器。

## Scratch.Cast

Scratch 有自己的型別轉換和比較規則，帶有許多怪癖。與其重新發明它們，不如使用 `Scratch.Cast`（[下載](/example-extensions/cast.js)）：

```js
toNumber({INPUT})   { return Scratch.Cast.toNumber(INPUT); }
castToString({INPUT}) { return Scratch.Cast.toString(INPUT); }
toBoolean({INPUT})  { return Scratch.Cast.toBoolean(INPUT); }

compare({A, B}) {
  const c = Scratch.Cast.compare(A, B);
  // 使用 < 0、> 0 或 === 0。不要使用 === 1 或 === -1。
  if (c === 0) return 'Equal';
  return c > 0 ? 'A is greater' : 'B is greater';
}
```

完整的參考在[實用 API 頁面](/building-extensions/apis/utility-apis)。

## hideFromPalette

`hideFromPalette: true` 從積木區隱藏積木而不移除它，因此專案中已有的副本繼續工作。這是[向後相容更改](/building-extensions/compatibility)的主要工具。載入 [hidden-1.js](/example-extensions/hidden-1.js) 並儲存一個使用其積木的專案，然後載入 [hidden-2.js](/example-extensions/hidden-2.js)（同一擴充功能，積木現在隱藏）並重新開啟專案：現有積木仍然執行，但它從積木區消失了。

## filter

如果積木只在角色中有意義，或只在舞臺中有意義，將 `filter` 設定為包含 `Scratch.TargetType.SPRITE` 或 `Scratch.TargetType.STAGE` 的陣列（[下載](/example-extensions/filter.js)）：

```js
{
  opcode: 'sprites',
  blockType: Scratch.BlockType.COMMAND,
  text: 'available in ONLY sprites',
  filter: [Scratch.TargetType.SPRITE]
}
```

`filter` 隻影響積木顯示在哪個積木區。透過拖放或背包仍可能最終把積木放到"錯誤"的目標中，因此在重要時您的程式碼仍必須檢查 `util.target.isStage`。要完全隱藏積木，使用 `hideFromPalette`，而不是 `filter: []`。

## 圖示

有三種附加影像的方式：

- 擴充功能上的 `menuIconURI`：積木區中顯示的影像。回退到 `blockIconURI`，然後是彩色圓圈。
- 擴充功能上的 `blockIconURI`：每個積木上的預設圖示。
- 積木上的 `blockIconURI`：覆蓋該積木的擴充功能圖示。

每個都必須是 [data: URL](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)。首選 SVG；至少 64x64 的 PNG 或 JPG 也可以。保持正方形。請參閱 [icons.js](/example-extensions/icons.js)。

## 內聯影像

透過新增型別為 `Scratch.ArgumentType.IMAGE` 且帶 `dataURI` 的引數，將影像放入積木內部。設定 `flipRTL: true` 在從右到左的語言中映象它。請參閱 [inline-images.js](/example-extensions/inline-images.js)。

## 分隔符

要在積木區中分隔積木組，請將字串 `'---'` 放入 `blocks` 陣列（[下載](/example-extensions/separators.js)）：

```js
blocks: [
  { opcode: 'block1', blockType: Scratch.BlockType.COMMAND, text: 'group 1' },
  '---',
  { opcode: 'block2', blockType: Scratch.BlockType.COMMAND, text: 'group 2' }
]
```

## 終止積木

`isTerminal: true` 阻止另一個積木連線到 `COMMAND` 積木的下面（[下載](/example-extensions/terminal.js)）。它看起來像"停止全部"，但它不會停止指令碼；它只阻擋底部連線。迴圈末尾的終止積木不會自行停止迴圈。

## 下一步

接下來，[事件和帽子積木](/building-extensions/hats)（如果您跳過了），或[API 參考頁面](/building-extensions/apis/scratch-api)瞭解 `Scratch` 物件、VM、渲染器和音訊引擎的完整表面。

---
title: 實用工具
sidebar_position: 9
---

`scratch-vm/src/util/` 持有引擎到處使用的小型輔助模組。擴充功能作者最常需要 `Cast`；當您直接使用 VM 時其餘的很方便。`Cast` 作為 `Scratch.Cast` 暴露給擴充功能（請參閱[擴充功能 API](/api-reference/extension-api)）。

## Cast

`util/cast.js` 按 Scratch 積木的方式轉換值。Scratch 是鬆散型別的，因此期望數字的積木必須接受 `"5"`、`true` 或 `"apple"` 並表現可預測。總是用 `Cast` 強制轉換輸入，而不是原始的 JavaScript 轉換，這樣您的積木與 Scratch 的規則完全匹配。

- `Cast.toNumber(value)`：轉換為數字，將非數字輸入視為 `0`（`NaN` 也視為 `0`）。
- `Cast.toBoolean(value)`：用 Scratch 的規則轉換為布林值（字串 `""`、`"0"` 和 `"false"` 是假）。
- `Cast.toString(value)`：轉換為字串。
- `Cast.compare(v1, v2)`：Scratch 的比較。返回負數、`0` 或正數，兩邊看起來像數字時按數字比較，否則不區分大小寫。
- `Cast.toListIndex(index, length, acceptAll)`：將 Scratch 列表索引（包括 `"last"`、`"random"`、`"all"`）變成真正的索引，或越界標記。
- `Cast.toRgbColorList(value)` / `Cast.toRgbColorObject(value)`：將顏色（`#rrggbb` 字串或十進位制數）解析為 `[r, g, b]` 或 `{r, g, b, a}`。
- `Cast.isInt(value)`：值是否是整數（或整數值字串）。
- `Cast.isWhiteSpace(value)`：值是否是 `null`、空或只有空白。

## Color

`util/color.js` 在顏色表示之間轉換。值是 `{r, g, b}` 物件（0 到 255）、`#rrggbb` 十六進位制字串、HSV 物件（`{h, s, v}`）或 24 位十進位制數。

`Color.decimalToHex`、`Color.decimalToRgb`、`Color.hexToRgb`、`Color.rgbToHex`、`Color.rgbToDecimal`、`Color.hexToDecimal`、`Color.hsvToRgb`、`Color.rgbToHsv`，以及用於混合兩種顏色的 `Color.mixRgb(rgb0, rgb1, fraction1)`。

## MathUtil

`util/math-util.js`：

- `MathUtil.degToRad(deg)` / `MathUtil.radToDeg(rad)`。
- `MathUtil.clamp(n, min, max)`：限制在範圍內。
- `MathUtil.wrapClamp(n, min, max)`：圍繞範圍環繞（像方向）。
- `MathUtil.tan(angle)`：以度為單位的正切，在極點返回 `Infinity` 而不是巨大的浮點數。
- `MathUtil.scale(i, iMin, iMax, oMin, oMax)`：將數字從一個範圍重新對映到另一個。
- `MathUtil.inclusiveRandIntWithout(lower, upper, excluded)`：範圍內的隨機整數，跳過一個值。

## 其他輔助工具

- `util/string-util.js`（`StringUtil`）：字串輔助工具，包括用於名稱去重的 `StringUtil.unusedName(name, existing)`。
- `util/uid.js`：為積木、變數和目標生成唯一 ID。
- `util/base64-util.js`（`Base64Util`）：在資產的 base64 和位元組陣列之間轉換。
- `util/timer.js`（`Timer`）：序列器和積木使用的毫秒計時器。
- `util/clone.js`（`Clone`）：淺/深複製輔助工具。
- `util/log.js`：VM 的日誌記錄器。

## 另請參閱

- [擴充功能 API](/api-reference/extension-api) 瞭解 `Scratch.Cast`
- [VM API](/api-reference/vm-api)
- [積木註冊](/api-reference/block-registration)

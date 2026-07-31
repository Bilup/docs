---
title: 实用工具
sidebar_position: 9
---

`scratch-vm/src/util/` 持有引擎到处使用的小型辅助模块。扩展作者最常需要 `Cast`；当您直接使用 VM 时其余的很方便。`Cast` 作为 `Scratch.Cast` 暴露给扩展（请参阅[扩展 API](/api-reference/extension-api)）。

## Cast

`util/cast.js` 按 Scratch 积木的方式转换值。Scratch 是松散类型的，因此期望数字的积木必须接受 `"5"`、`true` 或 `"apple"` 并表现可预测。总是用 `Cast` 强制转换输入，而不是原始的 JavaScript 转换，这样您的积木与 Scratch 的规则完全匹配。

- `Cast.toNumber(value)`：转换为数字，将非数字输入视为 `0`（`NaN` 也视为 `0`）。
- `Cast.toBoolean(value)`：用 Scratch 的规则转换为布尔值（字符串 `""`、`"0"` 和 `"false"` 是假）。
- `Cast.toString(value)`：转换为字符串。
- `Cast.compare(v1, v2)`：Scratch 的比较。返回负数、`0` 或正数，两边看起来像数字时按数字比较，否则不区分大小写。
- `Cast.toListIndex(index, length, acceptAll)`：将 Scratch 列表索引（包括 `"last"`、`"random"`、`"all"`）变成真正的索引，或越界标记。
- `Cast.toRgbColorList(value)` / `Cast.toRgbColorObject(value)`：将颜色（`#rrggbb` 字符串或十进制数）解析为 `[r, g, b]` 或 `{r, g, b, a}`。
- `Cast.isInt(value)`：值是否是整数（或整数值字符串）。
- `Cast.isWhiteSpace(value)`：值是否是 `null`、空或只有空白。

## Color

`util/color.js` 在颜色表示之间转换。值是 `{r, g, b}` 对象（0 到 255）、`#rrggbb` 十六进制字符串、HSV 对象（`{h, s, v}`）或 24 位十进制数。

`Color.decimalToHex`、`Color.decimalToRgb`、`Color.hexToRgb`、`Color.rgbToHex`、`Color.rgbToDecimal`、`Color.hexToDecimal`、`Color.hsvToRgb`、`Color.rgbToHsv`，以及用于混合两种颜色的 `Color.mixRgb(rgb0, rgb1, fraction1)`。

## MathUtil

`util/math-util.js`：

- `MathUtil.degToRad(deg)` / `MathUtil.radToDeg(rad)`。
- `MathUtil.clamp(n, min, max)`：限制在范围内。
- `MathUtil.wrapClamp(n, min, max)`：围绕范围环绕（像方向）。
- `MathUtil.tan(angle)`：以度为单位的正切，在极点返回 `Infinity` 而不是巨大的浮点数。
- `MathUtil.scale(i, iMin, iMax, oMin, oMax)`：将数字从一个范围重新映射到另一个。
- `MathUtil.inclusiveRandIntWithout(lower, upper, excluded)`：范围内的随机整数，跳过一个值。

## 其他辅助工具

- `util/string-util.js`（`StringUtil`）：字符串辅助工具，包括用于名称去重的 `StringUtil.unusedName(name, existing)`。
- `util/uid.js`：为积木、变量和目标生成唯一 ID。
- `util/base64-util.js`（`Base64Util`）：在资产的 base64 和字节数组之间转换。
- `util/timer.js`（`Timer`）：序列器和积木使用的毫秒计时器。
- `util/clone.js`（`Clone`）：浅/深复制辅助工具。
- `util/log.js`：VM 的日志记录器。

## 另请参阅

- [扩展 API](/api-reference/extension-api) 了解 `Scratch.Cast`
- [VM API](/api-reference/vm-api)
- [积木注册](/api-reference/block-registration)

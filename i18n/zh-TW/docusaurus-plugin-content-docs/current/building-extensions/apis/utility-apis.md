---
title: 實用 API
sidebar_position: 2
---

# 實用 API

`Scratch.Cast` 實現 Scratch 的型別強制轉換規則。使用它可以讓您的積木像內建積木一樣行為，而不是 JavaScript 的預設值。它在沙箱和非沙箱擴充功能中都可用。

因為積木引數可以是任何型別，與其宣告的 `type` 無關（請參閱[處理輸入](/building-extensions/inputs)），請在使用前轉換值。

## 數字轉換

```js
const Cast = Scratch.Cast;

Cast.toNumber('42');      // 42
Cast.toNumber('3.14');    // 3.14
Cast.toNumber('123abc');  // 123
Cast.toNumber('abc');     // 0
Cast.toNumber('');        // 0
Cast.toNumber(true);      // 1
Cast.toNumber(false);     // 0
Cast.toNumber(null);      // 0
Cast.toNumber(NaN);       // 0  (Scratch 將 NaN 對映為 0)
```

## 字串轉換

`Cast.toString(value)` 是 `String(value)`，並帶有 Scratch 圍繞它的期望。

```js
Cast.toString(42);     // '42'
Cast.toString(true);   // 'true'
Cast.toString(null);   // 'null'
```

不要依賴它用任何 Scratch 特定的方式格式化陣列或物件；它使用 JavaScript 的預設 `String()`。

## 布林轉換

Scratch 的布林規則與 JavaScript 不同：字串 `''`、`'0'` 和 `'false'` 都是假。

```js
Cast.toBoolean(true);       // true
Cast.toBoolean('');         // false
Cast.toBoolean('0');        // false
Cast.toBoolean('false');    // false
Cast.toBoolean('anything'); // true
Cast.toBoolean(0);          // false
Cast.toBoolean(1);          // true
```

## 比較

`Cast.compare(a, b)` 返回負數、零或正數。當兩邊看起來像數字時按數字比較，否則不區分大小寫地作為字串比較。

```js
Cast.compare('10', '9');        // > 0  (數字：10 > 9)
Cast.compare('apple', 'banana'); // < 0  (字串)
Cast.compare('5', '5');          // 0
```

總是用 `< 0`、`> 0` 或 `=== 0` 測試。永遠不要用 `=== 1` 或 `=== -1`；大小不保證。

## 型別檢查

```js
Cast.isInt(42);     // true
Cast.isInt('42');   // true (強制轉換後)
Cast.isInt(3.14);   // false
Cast.isWhiteSpace(' '); // true
```

## 顏色

```js
Cast.toRgbColorList('#ff0000');   // [255, 0, 0]
Cast.toRgbColorObject('#00ff00'); // {r: 0, g: 255, b: 0}
```

## 列表索引

`Cast.toListIndex(index, length, acceptAll)` 將 Scratch 列表索引（從 1 開始，支援 `"last"`、`"random"` 和 `"all"`）轉換為可用索引，超出範圍時返回 `Cast.LIST_INVALID`。

```js
const i = Cast.toListIndex(args.INDEX, list.value.length, false);
if (i !== Cast.LIST_INVALID) {
  return list.value[i - 1];
}
```

## 另請參閱

- [Scratch 物件 API](/building-extensions/apis/scratch-api)
- [雜項 API](/building-extensions/assorted-apis) 中的 `Scratch.Cast` 教程示例

---
title: 实用 API
sidebar_position: 2
---

# 实用 API

`Scratch.Cast` 实现 Scratch 的类型强制转换规则。使用它可以让您的积木像内置积木一样行为，而不是 JavaScript 的默认值。它在沙箱和非沙箱扩展中都可用。

因为积木参数可以是任何类型，与其声明的 `type` 无关（请参阅[处理输入](/building-extensions/inputs)），请在使用前转换值。

## 数字转换

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
Cast.toNumber(NaN);       // 0  (Scratch 将 NaN 映射为 0)
```

## 字符串转换

`Cast.toString(value)` 是 `String(value)`，并带有 Scratch 围绕它的期望。

```js
Cast.toString(42);     // '42'
Cast.toString(true);   // 'true'
Cast.toString(null);   // 'null'
```

不要依赖它用任何 Scratch 特定的方式格式化数组或对象；它使用 JavaScript 的默认 `String()`。

## 布尔转换

Scratch 的布尔规则与 JavaScript 不同：字符串 `''`、`'0'` 和 `'false'` 都是假。

```js
Cast.toBoolean(true);       // true
Cast.toBoolean('');         // false
Cast.toBoolean('0');        // false
Cast.toBoolean('false');    // false
Cast.toBoolean('anything'); // true
Cast.toBoolean(0);          // false
Cast.toBoolean(1);          // true
```

## 比较

`Cast.compare(a, b)` 返回负数、零或正数。当两边看起来像数字时按数字比较，否则不区分大小写地作为字符串比较。

```js
Cast.compare('10', '9');        // > 0  (数字：10 > 9)
Cast.compare('apple', 'banana'); // < 0  (字符串)
Cast.compare('5', '5');          // 0
```

总是用 `< 0`、`> 0` 或 `=== 0` 测试。永远不要用 `=== 1` 或 `=== -1`；大小不保证。

## 类型检查

```js
Cast.isInt(42);     // true
Cast.isInt('42');   // true (强制转换后)
Cast.isInt(3.14);   // false
Cast.isWhiteSpace(' '); // true
```

## 颜色

```js
Cast.toRgbColorList('#ff0000');   // [255, 0, 0]
Cast.toRgbColorObject('#00ff00'); // {r: 0, g: 255, b: 0}
```

## 列表索引

`Cast.toListIndex(index, length, acceptAll)` 将 Scratch 列表索引（从 1 开始，支持 `"last"`、`"random"` 和 `"all"`）转换为可用索引，超出范围时返回 `Cast.LIST_INVALID`。

```js
const i = Cast.toListIndex(args.INDEX, list.value.length, false);
if (i !== Cast.LIST_INVALID) {
  return list.value[i - 1];
}
```

## 另请参阅

- [Scratch 对象 API](/building-extensions/apis/scratch-api)
- [杂项 API](/building-extensions/assorted-apis) 中的 `Scratch.Cast` 教程示例

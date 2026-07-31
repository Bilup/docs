---
title: Utility APIs
sidebar_position: 2
---

# Utility APIs

`Scratch.Cast` implements Scratch's type-coercion rules. Using it keeps your blocks behaving the same way built-in blocks do, instead of JavaScript's defaults. It is available in both sandboxed and unsandboxed extensions.

Because a block argument can be any type regardless of its declared `type` (see [Dealing with inputs](/building-extensions/inputs)), cast values before you use them.

## Number conversion

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
Cast.toNumber(NaN);       // 0  (Scratch maps NaN to 0)
```

## String conversion

`Cast.toString(value)` is `String(value)` with Scratch's expectations around it.

```js
Cast.toString(42);     // '42'
Cast.toString(true);   // 'true'
Cast.toString(null);   // 'null'
```

Do not rely on it to format arrays or objects in any Scratch-specific way; it uses JavaScript's default `String()`.

## Boolean conversion

Scratch's boolean rules differ from JavaScript's: the strings `''`, `'0'`, and `'false'` are all false.

```js
Cast.toBoolean(true);       // true
Cast.toBoolean('');         // false
Cast.toBoolean('0');        // false
Cast.toBoolean('false');    // false
Cast.toBoolean('anything'); // true
Cast.toBoolean(0);          // false
Cast.toBoolean(1);          // true
```

## Comparison

`Cast.compare(a, b)` returns a negative number, zero, or a positive number. It compares numerically when both sides look like numbers, otherwise case-insensitively as strings.

```js
Cast.compare('10', '9');        // > 0  (numeric: 10 > 9)
Cast.compare('apple', 'banana'); // < 0  (string)
Cast.compare('5', '5');          // 0
```

Always test with `< 0`, `> 0`, or `=== 0`. Never `=== 1` or `=== -1`; the magnitude is not guaranteed.

## Type checks

```js
Cast.isInt(42);     // true
Cast.isInt('42');   // true (coerced)
Cast.isInt(3.14);   // false
Cast.isWhiteSpace(' '); // true
```

## Colors

```js
Cast.toRgbColorList('#ff0000');   // [255, 0, 0]
Cast.toRgbColorObject('#00ff00'); // {r: 0, g: 255, b: 0}
```

## List indices

`Cast.toListIndex(index, length, acceptAll)` converts a Scratch list index (1-based, with support for `"last"`, `"random"`, and `"all"`) into a usable index, or `Cast.LIST_INVALID` when out of range.

```js
const i = Cast.toListIndex(args.INDEX, list.value.length, false);
if (i !== Cast.LIST_INVALID) {
  return list.value[i - 1];
}
```

## See also

- [Scratch object API](/building-extensions/apis/scratch-api)
- [Assorted APIs](/building-extensions/assorted-apis) for the `Scratch.Cast` tutorial example

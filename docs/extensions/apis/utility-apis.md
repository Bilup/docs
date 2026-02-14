---
name: Utilities
---

# Utility APIs

Scratch provides various utility functions and objects that help extension developers handle common tasks like data conversion, string manipulation, mathematical operations, and color processing. These utilities are accessible through different namespaces and provide Scratch-compatible behavior.

## Overview

Utility APIs include:
- **Cast**: Data type conversion with Scratch semantics
- **String utilities**: Text processing and manipulation
- **Math utilities**: Mathematical operations and comparisons
- **Color utilities**: Color format conversion and manipulation
- **Variable utilities**: Variable and list management helpers
- **Block utilities**: Block execution context and controls

## Cast Utilities

### `Scratch.Cast`

The primary data conversion utility that implements Scratch's type coercion rules.

#### Number Conversion

```js
const Cast = Scratch.Cast;

// Basic number conversion
Cast.toNumber('42')        // 42
Cast.toNumber('3.14')      // 3.14
Cast.toNumber('0.1e10')    // 1000000000
Cast.toNumber('')          // 0
Cast.toNumber('abc')       // 0
Cast.toNumber('123abc')    // 123

// Boolean to number
Cast.toNumber(true)        // 1
Cast.toNumber(false)       // 0

// Special cases
Cast.toNumber(null)        // 0
Cast.toNumber(undefined)   // 0
Cast.toNumber(Infinity)    // Infinity
Cast.toNumber(-Infinity)   // -Infinity
Cast.toNumber(NaN)         // 0 (Scratch converts NaN to 0)

// Practical usage in blocks
myMathBlock(args) {
  const a = Cast.toNumber(args.A);
  const b = Cast.toNumber(args.B);
  return a + b; // Safe addition regardless of input types
}
```

#### String Conversion

```js
// Basic string conversion
Cast.toString(42)          // '42'
Cast.toString(3.14)        // '3.14'
Cast.toString(true)        // 'true'
Cast.toString(false)       // 'false'
Cast.toString(null)        // ''
Cast.toString(undefined)   // ''

// Special number formatting
Cast.toString(0)           // '0'
Cast.toString(-0)          // '0'
Cast.toString(Infinity)    // 'Infinity'
Cast.toString(-Infinity)   // '-Infinity'

// Array and object handling
Cast.toString([1, 2, 3])   // '1 2 3' (Scratch list format)
Cast.toString({})          // '[object Object]'

// Usage in text blocks
myTextBlock(args) {
  const text = Cast.toString(args.INPUT);
  return text.toUpperCase();
}
```

#### Boolean Conversion

```js
// Scratch boolean semantics
Cast.toBoolean(true)       // true
Cast.toBoolean(false)      // false
Cast.toBoolean('')         // false
Cast.toBoolean('0')        // false
Cast.toBoolean('false')    // false
Cast.toBoolean('anything') // true
Cast.toBoolean(0)          // false
Cast.toBoolean(1)          // true
Cast.toBoolean(-1)         // true

// Usage in conditional blocks
myConditionBlock(args) {
  return Cast.toBoolean(args.CONDITION);
}
```

#### Comparison Operations

```js
// Scratch-style comparison
Cast.compare('10', '9')     // 1 (numeric comparison: 10 > 9)
Cast.compare('10', '2')     // 1 (numeric comparison: 10 > 2)
Cast.compare('apple', 'banana') // -1 (string comparison)
Cast.compare('10', 'apple') // 1 (mixed: number > string)

// Return values: -1 (less), 0 (equal), 1 (greater)

// Usage in comparison blocks
isGreater(args) {
  return Cast.compare(args.A, args.B) > 0;
}

isEqual(args) {
  return Cast.compare(args.A, args.B) === 0;
}
```

#### Type Checking

```js
// Integer checking
Cast.isInt(42)             // true
Cast.isInt(3.14)           // false
Cast.isInt('42')           // true (coerced)
Cast.isInt('3.14')         // false

// Usage in validation
myIntegerBlock(args) {
  const value = args.NUMBER;
  if (!Cast.isInt(value)) {
    return 'Not an integer';
  }
  return Cast.toNumber(value);
}
```

### Color Utilities

```js
// RGB color list conversion (Scratch format)
Cast.toRgbColorList('#ff0000')    // [255, 0, 0]
Cast.toRgbColorList('#00ff00')    // [0, 255, 0]
Cast.toRgbColorList('#0000ff')    // [0, 0, 255]
Cast.toRgbColorList('red')        // [255, 0, 0] (named colors)

// RGB color object
Cast.toRgbColorObject('#ff0000')  // {r: 255, g: 0, b: 0}

// Usage in color blocks
setPenColor(args) {
  const [r, g, b] = Cast.toRgbColorList(args.COLOR);
  // Use r, g, b values...
}
```

## Best Practices

1. **Always use Cast utilities** for type conversion to ensure Scratch compatibility
2. **Validate inputs** before processing to prevent runtime errors
3. **Handle edge cases** gracefully (null, undefined, empty strings)
4. **Use appropriate data types** for your extension's context
5. **Cache expensive operations** when appropriate
6. **Provide sensible defaults** for optional parameters
7. **Document utility functions** clearly for maintenance

These utility APIs provide the foundation for creating robust, reliable extensions that handle data the same way Scratch does internally, ensuring consistent behavior across all user interactions.
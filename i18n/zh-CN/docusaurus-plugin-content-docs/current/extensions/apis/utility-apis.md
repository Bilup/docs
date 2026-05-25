---
name: Utilities
---

# 实用工具 API

Scratch 提供了各种实用函数和对象，帮助扩展开发者处理常见任务，如数据转换、字符串操作、数学运算和颜色处理。这些工具可通过不同的命名空间访问，并提供 Scratch 兼容的行为。

## 概述

实用工具 API 包括：
- **Cast**：具有 Scratch 语义的数据类型转换
- **String utilities**：文本处理和操作
- **Math utilities**：数学运算和比较
- **Color utilities**：颜色格式转换和操作
- **Variable utilities**：变量和列表管理辅助函数
- **Block utilities**：积木执行上下文和控制

## Cast 实用工具

### `Scratch.Cast`

实现 Scratch 类型强制转换规则的主要数据转换工具。

#### 数字转换

```javascript
const Cast = Scratch.Cast;

// 基本数字转换
Cast.toNumber('42')        // 42
Cast.toNumber('3.14')      // 3.14
Cast.toNumber('0.1e10')    // 1000000000
Cast.toNumber('')          // 0
Cast.toNumber('abc')       // 0
Cast.toNumber('123abc')    // 123

// 布尔值转数字
Cast.toNumber(true)        // 1
Cast.toNumber(false)       // 0

// 特殊情况
Cast.toNumber(null)        // 0
Cast.toNumber(undefined)   // 0
Cast.toNumber(Infinity)    // Infinity
Cast.toNumber(-Infinity)   // -Infinity
Cast.toNumber(NaN)         // 0 (Scratch 将 NaN 转换为 0)

// 在积木中的实际用法
myMathBlock(args) {
  const a = Cast.toNumber(args.A);
  const b = Cast.toNumber(args.B);
  return a + b; // 无论输入类型如何，安全相加
}
```

#### 字符串转换

```javascript
// 基本字符串转换
Cast.toString(42)          // '42'
Cast.toString(3.14)        // '3.14'
Cast.toString(true)        // 'true'
Cast.toString(false)       // 'false'
Cast.toString(null)        // ''
Cast.toString(undefined)   // ''

// 特殊数字格式
Cast.toString(0)           // '0'
Cast.toString(-0)          // '0'
Cast.toString(Infinity)    // 'Infinity'
Cast.toString(-Infinity)   // '-Infinity'

// 数组和对象处理
Cast.toString([1, 2, 3])   // '1 2 3' (Scratch 列表格式)
Cast.toString({})          // '[object Object]'

// 在文本积木中的用法
myTextBlock(args) {
  const text = Cast.toString(args.INPUT);
  return text.toUpperCase();
}
```

#### 布尔值转换

```javascript
// Scratch 布尔语义
Cast.toBoolean(true)       // true
Cast.toBoolean(false)      // false
Cast.toBoolean('')         // false
Cast.toBoolean('0')        // false
Cast.toBoolean('false')    // false
Cast.toBoolean('anything') // true
Cast.toBoolean(0)          // false
Cast.toBoolean(1)          // true
Cast.toBoolean(-1)         // true

// 在条件积木中的用法
myConditionBlock(args) {
  return Cast.toBoolean(args.CONDITION);
}
```

#### 比较操作

```javascript
// Scratch 风格比较
Cast.compare('10', '9')     // 1 (数字比较: 10 > 9)
Cast.compare('10', '2')     // 1 (数字比较: 10 > 2)
Cast.compare('apple', 'banana') // -1 (字符串比较)
Cast.compare('10', 'apple') // 1 (混合: 数字 > 字符串)

// 返回值: -1 (小于), 0 (等于), 1 (大于)

// 在比较积木中的用法
isGreater(args) {
  return Cast.compare(args.A, args.B) > 0;
}

isEqual(args) {
  return Cast.compare(args.A, args.B) === 0;
}
```

#### 类型检查

```javascript
// 整数检查
Cast.isInt(42)             // true
Cast.isInt(3.14)           // false
Cast.isInt('42')           // true (强制转换)
Cast.isInt('3.14')         // false

// 在验证中的用法
myIntegerBlock(args) {
  const value = args.NUMBER;
  if (!Cast.isInt(value)) {
    return 'Not an integer';
  }
  return Cast.toNumber(value);
}
```

### 颜色实用工具

```javascript
// RGB 颜色列表转换 (Scratch 格式)
Cast.toRgbColorList('#ff0000')    // [255, 0, 0]
Cast.toRgbColorList('#00ff00')    // [0, 255, 0]
Cast.toRgbColorList('#0000ff')    // [0, 0, 255]
Cast.toRgbColorList('red')        // [255, 0, 0] (命名颜色)

// RGB 颜色对象
Cast.toRgbColorObject('#ff0000')  // {r: 255, g: 0, b: 0}

// 在颜色积木中的用法
setPenColor(args) {
  const [r, g, b] = Cast.toRgbColorList(args.COLOR);
  // 使用 r, g, b 值...
}
```

## 最佳实践

1. **始终使用 Cast 工具** 进行类型转换，确保 Scratch 兼容性
2. **验证输入** 在处理前验证输入以防止运行时错误
3. **完美处理边缘情况**(null、undefined、空字符串)
4. **使用适当的数据类型** 适应扩展的上下文
5. **缓存复杂的操作** 在适当的时候
6. **为可选参数提供合理的默认值**
7. **清晰记录实用函数** 便于维护

这些实用工具 API 为创建可靠、可靠的扩展提供了基础，这些扩展以与 Scratch 内部相同的方式处理数据，确保在所有用户交互中行为一致。
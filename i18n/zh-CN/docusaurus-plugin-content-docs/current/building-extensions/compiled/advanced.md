---
title: 高级编译技巧
sidebar_position: 5
---

# 高级编译技巧

本页涵盖[`compiler.register` API](/building-extensions/compiled/structure) 超出普通报告积木的部分：命令积木、字段、可变参数输入、原始输入和接触运行时状态。这里的一切都对照 Bilup 自己的内置运算积木的编译方式验证过。

请牢记思维模型：`compile` **在编译时运行一次**，并返回**一个 JavaScript 字符串**。它自己不能做运行时工作；它决定生成的代码将做什么运行时工作。任何必须响应运行中项目的东西都必须位于您返回的字符串内部。

## 命令积木

给描述符 `type: COMMAND`。您返回的字符串用作语句（编译器附加 `;`），因此返回带副作用的表达式：

```js
compiler.register('myext', {
  logmessage: {
    type: T.COMMAND,
    compile: ({ input }) => `console.log(${input.string('MESSAGE')})`
  }
});
```

要运行多个语句，将它们包裹在立即调用函数中：

```js
compile: ({ input, target }) =>
  `(() => { const n = ${input.number('N')}; ${target}.setXY(n, n); })()`
```

## 接触运行时、目标和舞台

上下文给您指代生成作用域中引擎对象的变量名。将它们插值到您的源中：

```js
compiler.register('myext', {
  stagewidth: {
    type: T.NUMBER,
    compile: ({ runtime }) => `${runtime}.stageWidth`
  },
  myx: {
    type: T.NUMBER,
    compile: ({ target }) => `${target}.x`
  }
});
```

`runtime` 是运行时，`target` 是运行积木的目标，`stage` 是舞台。例如，内置舞台宽度积木编译为返回 `runtime.stageWidth` 的模板。

## 字段

`field(name)` 返回已 JSON 编码的字段值，因此作为字符串字面量拼接是安全的：

```js
compile: ({ field }) => `someTable[${field('CHOICE')}]`
// 如果 CHOICE 字段是 "red"，这变成：someTable["red"]
```

## 输入转换

选择与您的 JavaScript 期望匹配的转换。选择正确的避免输出中的冗余转换。

| 辅助工具 | 发出 |
|:--|:--|
| `input('A')` | 输入，转换为"any"。 |
| `input.number('A')` | 转换为数字。 |
| `input.numberOrNaN('A')` | 转换为可能为 `NaN` 的数字。 |
| `input.string('A')` | 转换为字符串。 |
| `input.boolean('A')` | 转换为布尔值。 |
| `input.raw('A')` | 无转换。对于运算符下拉框，这是裸运算符文本。 |

`input.raw` 是将运算符作为字段的积木构建表达式的方式。内置比较积木正是这样做的：

```js
compare: {
  type: T.BOOLEAN,
  compile: ({ input: i }) => `(${i.number('A')} ${i.raw('C')} ${i.number('B')})`
}
// 使用 C = "<"，这变成：(a < b)
```

只对您控制的值或固定菜单使用 `raw`。将任意的用户字符串作为原始源拼接是注入风险。

## 可变参数输入

接受可变数量输入的积木（如几个值的 `最小`/`最大`）从 `mutation` 读取数量。这是 Bilup 编译其可变参数 `min` 和 `max` 的逐字方式：

```js
const variadic = (name, input, mutation) => {
  const count = Math.max(2, parseInt(mutation.itemcount, 10) || 2);
  const parts = Array.from({ length: count }, (_, i) => input.number(`NUM${i + 1}`));
  return `Math.${name}(${parts.join(',')})`;
};

compiler.register('myext', {
  min: { type: T.NUMBER, compile: ({ input, mutation }) => variadic('min', input, mutation) },
  max: { type: T.NUMBER, compile: ({ input, mutation }) => variadic('max', input, mutation) }
});
```

## 选择结果类型

`type` 是积木产生的值，编译器用它来跳过消耗您输出的积木中的转换。要诚实：

- 只在结果总是真正的数字时使用 `NUMBER`。如果它可能是 `NaN`（可能失败的解析），使用 `NUMBER_OR_NAN`，否则编译器可能假设有效数字并跳过调用者需要的 `NaN` 保护。
- 当您无法承诺类型时使用 `ANY`，例如 `JSON.parse` 结果。

```js
jsonparse: { type: T.ANY, compile: ({ input: i }) => `JSON.parse(${i.string('A')})` }
```

## 优先级和括号

输入展开为整个表达式，而不仅仅是字面量，因此在运算符优先级可能改变含义的任何地方加上括号。优先包裹输入和整个结果：

```js
// 有风险：输入可能是 `a + b`
compile: ({ input: i }) => `${i.number('X')} ** 2`
// 安全
compile: ({ input: i }) => `((${i.number('X')}) ** 2)`
```

## 保持回退同步

每个编译积木仍然需要它的解释器方法（请参阅[您的第一个编译扩展](/building-extensions/compiled/first-extension)）。它在积木未编译时运行，因此必须计算相同的结果。当您更改编译逻辑时，也要更改回退。

## 不要做什么

编译器故意很窄，这就是重点。它没有受支持的 API 用于多遍编译、将共享辅助函数提升到输出中、挂钩编译器的生命周期，或在编译时保持跨积木状态。如果您发现自己想要这些，积木可能太大而不值得编译；请改为将其写为普通的[非沙箱积木](/building-extensions/unsandboxed)。

## 另请参阅

- [编译扩展概览](/building-extensions/compiled/overview)
- [遗留补丁方法](/building-extensions/compiled/patching)

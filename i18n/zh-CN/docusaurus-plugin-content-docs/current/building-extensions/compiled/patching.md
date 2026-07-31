---
title: 遗留补丁方法
sidebar_position: 3
---

# 遗留补丁方法

在 Bilup 添加[`compiler.register` API](/building-extensions/compiled/structure) 之前，编译扩展通过**修补编译器的内部代码生成器**工作。本页解释较旧的方法，以便您能识别和维护现有扩展。对于新工作，使用 `compiler.register`；它更短、受支持，并且不会因编译器重写而损坏。

::::warning
这里的一切都经过 Bilup 明确标记为不支持的 API。访问器字面上命名为 `i_will_not_ask_for_help_when_these_break`。编译器的内部已经被重写过一次（这就是兼容垫片存在的原因），并且它们可能再次更改。不要在此基础上构建新扩展。
::::

## 兼容垫片

旧的 TurboWarp 编译扩展修补两个生成器类：`ScriptTreeGenerator`（将积木变成中间树）和 `JSGenerator`（将该树变成 JavaScript）。Bilup 当前的编译器结构不同，因此它提供一个模拟旧类的兼容垫片：

```js
const compilerAPI = vm.exports.i_will_not_ask_for_help_when_these_break();
const { JSGenerator, ScriptTreeGenerator } = compilerAPI;
```

调用这会切换到遗留兼容模式。返回的对象行为足够像旧生成器，让现有扩展继续工作。

那些扩展使用的模式是一个"补丁"辅助工具，它包装一个方法同时保留原始方法：

```js
const PATCHES_ID = 'myextension_patches';
const patch = (obj, functions) => {
  if (obj[PATCHES_ID]) return;
  obj[PATCHES_ID] = {};
  for (const name in functions) {
    const original = obj[name];
    obj[PATCHES_ID][name] = original;
    obj[name] = function (...args) {
      const callOriginal = (...a) => (original ? original.call(this, ...a) : undefined);
      return functions[name].call(this, callOriginal, ...args);
    };
  }
};
```

然后它们修补两个生成器上的 `descendStackedBlock` 和 `descendInput` 以识别它们的积木操作码，在树阶段产生中间节点，并在 JavaScript 阶段发出源码。JavaScript 阶段使用从生成器导出中取出的 `TypedInput` 和类型常量（`TYPE_NUMBER` 等）等辅助工具，并写入 `this.source`。

您不需要学习细节来让这样的扩展存活；您需要知道（a）它依赖这个垫片，以及（b）现代等价物要小得多。

## 同一个积木，两种方式

遗留风格的"square"报告积木需要在每个阶段修补以匹配其操作码并发出 `(${n} * ${n})`。现代等价物是全部内容：

```js
vm.exports.compiler.register('mathutils', {
  square: {
    type: vm.exports.compiler.types.NUMBER,
    compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
  }
});
```

如果您正在维护遗留扩展并且负担得起，将它移植到 `compiler.register` 可以完全移除对不受支持垫片的依赖。

## 较新的内部访问器

Bilup 还暴露 `vm.exports.these_broke_before_and_will_break_again()`，它返回*当前*编译器内部（真正的 `IRGenerator`、`ScriptTreeGenerator`、`IntermediateInput`/`IntermediateStackBlock` 类，以及 `StackOpcode` / `InputOpcode` / `InputType` 枚举）。它带有相同的"不受支持，会损坏"警告。它的存在是为了真正需要接触新编译器的扩展；几乎没有扩展需要，因为 `compiler.register` 覆盖了正常情况。

## 下一步

跳过遗留路径，[以受支持的方式构建第一个编译扩展](/building-extensions/compiled/first-extension)。

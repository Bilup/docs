---
title: 遺留補丁方法
sidebar_position: 3
---

# 遺留補丁方法

在 Bilup 新增[`compiler.register` API](/building-extensions/compiled/structure) 之前，編譯擴充功能透過**修補編譯器的內部程式碼生成器**工作。本頁解釋較舊的方法，以便您能識別和維護現有擴充功能。對於新工作，使用 `compiler.register`；它更短、受支援，並且不會因編譯器重寫而損壞。

::::warning
這裡的一切都經過 Bilup 明確標記為不支援的 API。存取器字面上命名為 `i_will_not_ask_for_help_when_these_break`。編譯器的內部已經被重寫過一次（這就是相容墊片存在的原因），並且它們可能再次更改。不要在此基礎上建置新擴充功能。
::::

## 相容墊片

舊的 TurboWarp 編譯擴充功能修補兩個生成器類：`ScriptTreeGenerator`（將積木變成中間樹）和 `JSGenerator`（將該樹變成 JavaScript）。Bilup 當前的編譯器結構不同，因此它提供一個模擬舊類的相容墊片：

```js
const compilerAPI = vm.exports.i_will_not_ask_for_help_when_these_break();
const { JSGenerator, ScriptTreeGenerator } = compilerAPI;
```

呼叫這會切換到遺留相容模式。返回的物件行為足夠像舊生成器，讓現有擴充功能繼續工作。

那些擴充功能使用的模式是一個"補丁"輔助工具，它包裝一個方法同時保留原始方法：

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

然後它們修補兩個生成器上的 `descendStackedBlock` 和 `descendInput` 以識別它們的積木操作碼，在樹階段產生中間節點，並在 JavaScript 階段發出原始碼。JavaScript 階段使用從生成器匯出中取出的 `TypedInput` 和型別常量（`TYPE_NUMBER` 等）等輔助工具，並寫入 `this.source`。

您不需要學習細節來讓這樣的擴充功能存活；您需要知道（a）它依賴這個墊片，以及（b）現代等價物要小得多。

## 同一個積木，兩種方式

遺留風格的"square"報告積木需要在每個階段修補以匹配其操作碼併發出 `(${n} * ${n})`。現代等價物是全部內容：

```js
vm.exports.compiler.register('mathutils', {
  square: {
    type: vm.exports.compiler.types.NUMBER,
    compile: ({ input }) => `(${input.number('NUMBER')} ** 2)`
  }
});
```

如果您正在維護遺留擴充功能並且負擔得起，將它移植到 `compiler.register` 可以完全移除對不受支援墊片的依賴。

## 較新的內部存取器

Bilup 還暴露 `vm.exports.these_broke_before_and_will_break_again()`，它返回*當前*編譯器內部（真正的 `IRGenerator`、`ScriptTreeGenerator`、`IntermediateInput`/`IntermediateStackBlock` 類，以及 `StackOpcode` / `InputOpcode` / `InputType` 列舉）。它帶有相同的"不受支援，會損壞"警告。它的存在是為了真正需要接觸新編譯器的擴充功能；幾乎沒有擴充功能需要，因為 `compiler.register` 覆蓋了正常情況。

## 下一步

跳過遺留路徑，[以受支援的方式建置第一個編譯擴充功能](/building-extensions/compiled/first-extension)。

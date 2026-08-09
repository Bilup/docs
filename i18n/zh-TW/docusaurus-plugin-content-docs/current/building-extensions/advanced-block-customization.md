---
title: 進階積木自訂
sidebar_position: 10
---

# 進階積木自訂

本頁涵蓋一些超越正常積木描述格式的技巧。它們都需要[非沙箱擴充功能](/building-extensions/unsandboxed)，並且都觸及不是穩定 API 的 Bilup 內部。

::::warning
這裡的一切都操縱內部物件和編輯器的 DOM。當 Bilup 或 Blockly 更新時它可能損壞，它對螢幕閱讀器不可見，並且它在[打包器](/packager/overview)或播放器中不執行。只在正常積木格式確實做不到您需要的事情時使用它，並在每次 Bilup 更新後測試。
::::

## 執行時補丁輔助工具

許多進階擴充功能包裝現有的 Bilup 方法以新增行為，同時仍然呼叫原始方法。這個小輔助工具是安全執行此操作的常見模式，包括只補丁一次：

```js
const PATCHES_ID = '__myextension_patches';

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

每個替換函式接收 `callOriginal` 作為它的第一個引數，因此它決定是否以及何時執行原始方法：

```js
patch(vm.runtime.constructor.prototype, {
  visualReport(callOriginal, target, blockId, value) {
    callOriginal(target, blockId, value); // 保持正常行為
    // 然後用 blockId / value 做額外的操作
  }
});
```

如果您的擴充功能可以被停用，請保留匹配的 `unpatch`，並像上面那樣儲存原始方法，以便您可以恢復它們。

## 替換積木的視覺外觀

Bilup 透過 Blockly 將積木渲染為 SVG。非沙箱擴充功能可以在工作區 DOM 中找到自己的積木並替換它們的內容，例如顯示影像而不是文本。"影像積木"擴充功能就是這樣做的。

思路：給積木空（或接近空）的文本，然後每當工作區更改時，按分類和操作碼找到積木的 `<g>` 元素並重寫它的內容。

```js
function injectVisuals() {
  const workspace = document.querySelector('g.blocklyWorkspace');
  if (!workspace) return;
  workspace.querySelectorAll('g[data-category="Image Blocks"]').forEach((g) => {
    const block = vm.runtime.getEditingTarget()?.blocks.getBlock(g.dataset.id);
    if (block && block.opcode === 'imageBlocks_cat' && !g.querySelector('svg#custom')) {
      g.innerHTML = `<svg id="custom" width="92" height="92" viewBox="0,0,92,92">
        <image href="https://example.com/cat.png" height="92" width="92" />
      </svg><!--rotationCenter:46:46-->`;
    }
  });
}

vm.runtime.on('PROJECT_CHANGED', injectVisuals);
vm.runtime.on('BLOCK_DRAG_UPDATE', injectVisuals);
vm.runtime.on('BLOCK_DRAG_END', injectVisuals);
```

備註：

- 尾部的 `<!--rotationCenter:x:y-->` 註解是 Scratch 的 SVG 載入器標記中心的方式；保留它。
- 使用（幾乎）空的積木標籤，讓只有您的視覺外觀顯示。像 `‎` 這樣的零寬字元可以作為 `text` 值。
- 重新注入執行頻繁，因此保持 DOM 操作輕量，並在元素已經有您的自訂內容時儘早退出（`!g.querySelector('svg#custom')` 檢查）。
- 相同的 `foreignObject` 技巧可以嵌入 HTML、影片或 iframe，但嵌入越多，積木就越脆弱和沉重。驗證您插入的任何外部 URL。

## 接觸另一個擴充功能

非沙箱擴充功能可以看到哪些擴充功能已載入，並且如果知道內部結構，可以呼叫它們。這本質上很脆弱（它依賴其他擴充功能的私有形狀），因此將其視為最後手段並優雅地失敗。

```js
// 擴充功能是否已載入？
const loaded = vm.extensionManager.isExtensionLoaded('someid');

// 擴充功能的已註冊實例，如果您需要它的方法：
const instance = vm.runtime[`ext_someid`];
if (instance && typeof instance.someMethod === 'function') {
  instance.someMethod();
}
```

擴充功能之間沒有受支援的公共契約。如果您控制雙方，請優先使用您自己定義的小顯式介面（例如 `window` 上的知名屬性），而不是探查私有欄位，並且總是保護對方不存在的情況。

## 下一步

接下來，[一個專門的開發伺服器](/building-extensions/better-development-server)，它免去硬重新整理的麻煩。

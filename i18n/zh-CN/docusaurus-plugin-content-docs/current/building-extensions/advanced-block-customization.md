---
title: 高级积木自定义
sidebar_position: 10
---

# 高级积木自定义

本页涵盖一些超越正常积木描述格式的技巧。它们都需要[非沙箱扩展](/building-extensions/unsandboxed)，并且都触及不是稳定 API 的 Bilup 内部。

::::warning
这里的一切都操纵内部对象和编辑器的 DOM。当 Bilup 或 Blockly 更新时它可能损坏，它对屏幕阅读器不可见，并且它在[打包器](/packager/overview)或播放器中不运行。只在正常积木格式确实做不到您需要的事情时使用它，并在每次 Bilup 更新后测试。
::::

## 运行时补丁辅助工具

许多高级扩展包装现有的 Bilup 方法以添加行为，同时仍然调用原始方法。这个小辅助工具是安全执行此操作的常见模式，包括只补丁一次：

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

每个替换函数接收 `callOriginal` 作为它的第一个参数，因此它决定是否以及何时运行原始方法：

```js
patch(vm.runtime.constructor.prototype, {
  visualReport(callOriginal, target, blockId, value) {
    callOriginal(target, blockId, value); // 保持正常行为
    // 然后用 blockId / value 做额外的操作
  }
});
```

如果您的扩展可以被禁用，请保留匹配的 `unpatch`，并像上面那样存储原始方法，以便您可以恢复它们。

## 替换积木的视觉外观

Bilup 通过 Blockly 将积木渲染为 SVG。非沙箱扩展可以在工作区 DOM 中找到自己的积木并替换它们的内容，例如显示图像而不是文本。"图像积木"扩展就是这样做的。

思路：给积木空（或接近空）的文本，然后每当工作区更改时，按分类和操作码找到积木的 `<g>` 元素并重写它的内容。

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

备注：

- 尾部的 `<!--rotationCenter:x:y-->` 注释是 Scratch 的 SVG 加载器标记中心的方式；保留它。
- 使用（几乎）空的积木标签，让只有您的视觉外观显示。像 `‎` 这样的零宽字符可以作为 `text` 值。
- 重新注入运行频繁，因此保持 DOM 操作轻量，并在元素已经有您的自定义内容时尽早退出（`!g.querySelector('svg#custom')` 检查）。
- 相同的 `foreignObject` 技巧可以嵌入 HTML、视频或 iframe，但嵌入越多，积木就越脆弱和沉重。验证您插入的任何外部 URL。

## 接触另一个扩展

非沙箱扩展可以看到哪些扩展已加载，并且如果知道内部结构，可以调用它们。这本质上很脆弱（它依赖其他扩展的私有形状），因此将其视为最后手段并优雅地失败。

```js
// 扩展是否已加载？
const loaded = vm.extensionManager.isExtensionLoaded('someid');

// 扩展的已注册实例，如果您需要它的方法：
const instance = vm.runtime[`ext_someid`];
if (instance && typeof instance.someMethod === 'function') {
  instance.someMethod();
}
```

扩展之间没有受支持的公共契约。如果您控制双方，请优先使用您自己定义的小显式接口（例如 `window` 上的知名属性），而不是探查私有字段，并且总是保护对方不存在的情况。

## 下一步

接下来，[一个专门的开发服务器](/building-extensions/better-development-server)，它免去硬刷新的麻烦。

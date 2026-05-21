---
title: Compiler Patching
---

# 编译器补丁

Bilup 允许非沙盒化扩展修补编译器，以支持高级功能，如内联积木执行或自定义控制流。

> **⚠️ 高级主题：** 这需要深入了解 Scratch VM 和编译器架构。内部 API 可能会发生破坏性更改。

## 概述

编译器补丁涉及拦截对 `IRGenerator`(中间表示)和 `JSGenerator`(JavaScript 代码生成)的调用，以修改积木的编译方式。

## 辅助工具：补丁函数

使用辅助工具安全地修补和取消修补方法。

```javascript
const PATCHES_ID = "__patches_" + extensionId;

const patch = (obj, functions) => {
  if (obj[PATCHES_ID]) return;
  obj[PATCHES_ID] = {};
  for (const name in functions) {
    const original = obj[name];
    obj[PATCHES_ID][name] = obj[name];
    if (original) {
      obj[name] = function(...args) {
        const callOriginal = (...args) => original.call(this, ...args);
        return functions[name].call(this, callOriginal, ...args);
      };
    } else {
      obj[name] = function (...args) {
        return functions[name].call(this, () => {}, ...args);
      }
    }
  }
};
```

## 示例：内联积木

此示例演示如何创建一个"内联"积木，该积木执行子程序并返回值，本质上允许带有逻辑的自定义返回值积木。

### 1. 访问编译器

```javascript
const vm = Scratch.vm;
const runtime = vm.runtime;

// 检查编译器是否可用
if (vm.exports.IRGenerator && vm.exports.JSGenerator) {
  const IRGenerator = vm.exports.IRGenerator;
  const JSGenerator = vm.exports.JSGenerator;
  const ScriptTreeGenerator = IRGenerator.exports.ScriptTreeGenerator;
  const {Frame, TypedInput, TYPE_UNKNOWN} = JSGenerator.exports;
  
  // 应用补丁...
}
```

### 2. 修补 ScriptTreeGenerator (IR)

修改为您的积木生成中间表示的方式。

```javascript
patch(ScriptTreeGenerator.prototype, {
  descendInput(original, block) {
    if (block.opcode === "myExtension_inline") {
      return {
        kind: "myExtension.inline",
        stack: this.descendSubstack(block, "SUBSTACK")
      };
    }
    return original(block);
  }
});
```

### 3. 修补 JSGenerator (代码生成)

为自定义 IR 节点生成实际的 JavaScript 代码。

```javascript
patch(JSGenerator.prototype, {
  descendInput(original, node) {
    if (node.kind === "myExtension.inline") {
      const oldSrc = this.source;
      
      // 为子程序生成代码
      this.descendStack(node.stack, new Frame(false));
      const stackSrc = this.source.substring(oldSrc.length);
      
      // 重置源
      this.source = oldSrc;
      
      // 返回编译后的内联函数
      return new TypedInput(
        `(yield* (function*() {
            try {
                ${stackSrc};
                return "";
            } catch (e) {
                if (!e.inlineReturn) throw e;
                return e.value;
            }
        })())`,
        TYPE_UNKNOWN
      );
    }
    return original(node);
  }
});
```

## 自定义积木定义

您还需要定义使用此自定义编译逻辑的积木。

```javascript
{
  opcode: "inline",
  blockType: Scratch.BlockType.REPORTER,
  text: ["inline"],
  branchCount: 1, // Substack
  output: "Boolean",
  outputShape: 3
}
```

## 处理解释器模式

由于编译器可能在所有平台上被禁用或不支持，您还应该为解释器实现运行时逻辑。

```javascript
inline(args, util) {
  const thread = util.thread;
  const realBlockId = util.thread.peekStackFrame().op.id;
  const branchBlockId = thread.target.blocks.getBranch(realBlockId, 1);
  
  if (!branchBlockId) return "";
  
  // 执行分支并处理返回值的逻辑
  // ...
}
```

## 另见

- [非沙盒化扩展](../unsandboxed.md)
- [VM API](../apis/vm-api.md)
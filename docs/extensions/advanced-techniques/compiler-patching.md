---
title: Compiler Patching
---

# Compiler Patching

MistWarp allows unsandboxed extensions to patch the compiler to support advanced features like inline block execution or custom control flow.

> **⚠️ Advanced Topic:** This requires deep knowledge of the Scratch VM and compiler architecture. Breaking changes to internal APIs may occur.

## Overview

Compiler patching involves intercepting calls to the `IRGenerator` (Intermediate Representation) and `JSGenerator` (JavaScript Code Generation) to modify how blocks are compiled.

## Helper: Patching Function

Use a helper to safely patch and unpatch methods.

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

## Example: Inline Blocks

This example demonstrates how to create an "inline" block that executes a substack and returns a value, essentially allowing custom reporters with logic.

### 1. Accessing the Compiler

```javascript
const vm = Scratch.vm;
const runtime = vm.runtime;

// Check if compiler is available
if (vm.exports.IRGenerator && vm.exports.JSGenerator) {
  const IRGenerator = vm.exports.IRGenerator;
  const JSGenerator = vm.exports.JSGenerator;
  const ScriptTreeGenerator = IRGenerator.exports.ScriptTreeGenerator;
  const {Frame, TypedInput, TYPE_UNKNOWN} = JSGenerator.exports;
  
  // Apply patches...
}
```

### 2. Patching ScriptTreeGenerator (IR)

Modify how the Intermediate Representation is generated for your block.

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

### 3. Patching JSGenerator (Code Gen)

Generate the actual JavaScript code for the custom IR node.

```javascript
patch(JSGenerator.prototype, {
  descendInput(original, node) {
    if (node.kind === "myExtension.inline") {
      const oldSrc = this.source;
      
      // Generate code for the substack
      this.descendStack(node.stack, new Frame(false));
      const stackSrc = this.source.substring(oldSrc.length);
      
      // Reset source
      this.source = oldSrc;
      
      // Return the compiled inline function
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

## Custom Block Definition

You also need to define the block that uses this custom compilation logic.

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

## Handling Interpreter Mode

Since the compiler might be disabled or not supported on all platforms, you should also implement the runtime logic for the interpreter.

```javascript
inline(args, util) {
  const thread = util.thread;
  const realBlockId = util.thread.peekStackFrame().op.id;
  const branchBlockId = thread.target.blocks.getBranch(realBlockId, 1);
  
  if (!branchBlockId) return "";
  
  // Logic to execute branch and handle return values
  // ...
}
```

## See Also

- [Unsandboxed Extensions](../unsandboxed.md)
- [VM API](../apis/vm-api.md)

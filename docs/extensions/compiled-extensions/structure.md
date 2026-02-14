---
title: Extension Structure
sidebar_position: 2
---

# Extension Structure

A compiled extension follows a specific structure that integrates with MistWarp's compiler architecture. Understanding this structure is essential for creating effective compiled extensions.

## Basic Extension Template

Every compiled extension starts with this fundamental structure:

### Extension Declaration
The extension begins by checking for the unsandboxed environment, which is required for accessing compiler internals:

```javascript
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Extension needs to be run unsandboxed.");
  }
```

### Accessing Compiler Internals
Next, the extension obtains references to MistWarp's compiler components:

```javascript
const { vm, BlockType, ArgumentType } = Scratch;
const { runtime } = vm;

// Access the compiler internals
const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
const { JSGenerator, IRGenerator, ScriptTreeGenerator } = iwnafhwtb;
```

The `i_will_not_ask_for_help_when_these_break()` function provides access to internal APIs that may change between versions. The name serves as a warning that these APIs are not stable.

### Compiler Type System
Compiled extensions work with MistWarp's type system for optimization:

```javascript
const {
  TYPE_NUMBER,
  TYPE_STRING,
  TYPE_BOOLEAN,
  TYPE_UNKNOWN,
  TYPE_NUMBER_NAN,
  TypedInput,
  ConstantInput,
  VariableInput,
  Frame,
  sanitize
} = JSGenerator.unstable_exports;
```

## Patching System

Compiled extensions use a patching system to modify compiler behavior. The patching function ensures multiple extensions can coexist:

### Patch Function
```javascript
const PATCHES_ID = 'extensionname_patches';

const cst_patch = (obj, functions) => {
  if (obj[PATCHES_ID]) return; // Prevent double-patching
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
      obj[name] = function(...args) {
        return functions[name].call(this, () => {}, ...args);
      };
    }
  }
};
```

This system allows extensions to override compiler methods while preserving the ability to call the original implementation.

## Compiler Phase Patches

### JavaScript Generation Patch
The JSGenerator patch handles converting blocks into final JavaScript code:

```javascript
cst_patch(JSGenerator.prototype, {
  descendStackedBlock(fn, node, ...args) {
    let b = node.block;
    switch (node.kind) {
      case 'myextension.myblock':
        const input1 = this.descendInput(node.INPUT1).asNumber();
        const input2 = this.descendInput(node.INPUT2).asString();
        this.source += `vm.runtime.visualReport("${b.id}", Math.pow(${input1}, 2))\n`;
        return;
      default:
        return fn(node, ...args);
    }
  },
  
  descendInput(fn, node, ...args) {
    switch (node.kind) {
      case 'myextension.myblock':
        const input1 = this.descendInput(node.INPUT1).asNumber();
        return new TypedInput(`Math.pow(${input1}, 2)`, TYPE_NUMBER);
      default:
        return fn(node, ...args);
    }
  }
});
```

### Script Tree Generation Patch
The ScriptTreeGenerator patch identifies extension blocks and prepares them for compilation:

```javascript
cst_patch(ScriptTreeGenerator.prototype, {
  descendStackedBlock(fn, block, ...args) {
    switch (block.opcode) {
      case 'myextension_myblock':
        return {
          block,
          kind: 'myextension.myblock',
          INPUT1: this.descendInputOfBlock(block, 'INPUT1'),
          INPUT2: this.descendInputOfBlock(block, 'INPUT2'),
        };
      default:
        return fn(block, ...args);
    }
  },
  
  descendInput(fn, block, ...args) {
    // Similar structure for reporter blocks
    switch (block.opcode) {
      case 'myextension_myblock':
        return {
          block,
          kind: 'myextension.myblock',
          INPUT1: this.descendInputOfBlock(block, 'INPUT1'),
          INPUT2: this.descendInputOfBlock(block, 'INPUT2'),
        };
      default:
        return fn(block, ...args);
    }
  }
});
```

## Extension Class Definition

After setting up the patches, define the extension class:

### Basic Class Structure
```javascript
class MyExtension {
  getInfo() {
    return {
      id: 'myextension',
      name: 'My Extension',
      color1: '#2DA4A0',
      version: 1.0,
      blocks: [
        {
          opcode: 'myblock',
          text: 'calculate [INPUT1] squared',
          blockType: Scratch.BlockType.REPORTER,
          arguments: {
            INPUT1: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 5
            }
          },
          func: 'fallbackFunction'
        }
      ]
    };
  }
  
  fallbackFunction(args) {
    // Fallback implementation for non-compiled environments
    return Math.pow(args.INPUT1, 2);
  }
}
```

### Registration
```javascript
Scratch.extensions.register(new MyExtension());
```

## Input Type Handling

Compiled extensions must properly handle different input types:

### Type Conversion Methods
- `asNumber()`: Converts input to number with Scratch semantics
- `asString()`: Converts input to string
- `asBoolean()`: Converts input to boolean
- `asRaw()`: Uses input without type conversion
- `asSafe()`: Safely handles input with error checking

### Type-Specific Outputs
When generating code, specify the output type:

```javascript
// For number outputs
return new TypedInput(`Math.pow(${input}, 2)`, TYPE_NUMBER);

// For string outputs  
return new TypedInput(`"Result: " + ${input}`, TYPE_STRING);

// For boolean outputs
return new TypedInput(`${input} > 0`, TYPE_BOOLEAN);
```

## Error Handling

Compiled extensions should include proper error handling:

### Compilation Errors
```javascript
try {
  const input = this.descendInput(node.INPUT).asNumber();
  return new TypedInput(`Math.sqrt(${input})`, TYPE_NUMBER);
} catch (error) {
  // Fall back to safe default
  return new TypedInput(`0`, TYPE_NUMBER);
}
```

### Runtime Validation
```javascript
// Generate code with runtime validation
this.source += `vm.runtime.visualReport("${b.id}", 
  ${input} >= 0 ? Math.sqrt(${input}) : 0)\n`;
```

## Best Practices

### Naming Conventions
- Use consistent naming for block opcodes (`extension_blockname`)
- Use descriptive kind names (`extension.blockname`)
- Include extension name in patch IDs to avoid conflicts

### Performance Considerations
- Generate minimal, efficient JavaScript code
- Avoid unnecessary type conversions
- Use appropriate input methods (`asRaw()` when type doesn't matter)
- Cache expensive computations when possible

### Compatibility
- Always provide fallback functions for non-compiled environments
- Test with different input types and edge cases
- Handle undefined or invalid inputs gracefully

This structure provides the foundation for creating powerful compiled extensions that integrate seamlessly with MistWarp's compilation system while maintaining compatibility and performance.

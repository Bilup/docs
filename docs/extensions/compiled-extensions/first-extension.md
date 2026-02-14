---
title: Creating Your First Extension
sidebar_position: 4
---

# Creating Your First Extension

This tutorial walks through creating a simple compiled extension from scratch, demonstrating the key concepts and patterns you'll use in more complex extensions.

## Project Setup

Create a new JavaScript file for your extension. We'll build a "Math Utils" extension that provides optimized mathematical operations.

### Extension Header

Start with the basic extension structure:

```javascript
/**!
 * Math Utils Extension
 * @author Your Name
 * @version 1.0
 * @copyright MIT License
 */

(function(Scratch) {
  'use strict';
  
  // Verify unsandboxed environment
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Math Utils extension needs to be run unsandboxed.");
  }
```

### Accessing Compiler APIs

Get references to the necessary MistWarp components:

```javascript
  const { vm, BlockType, ArgumentType } = Scratch;
  const { runtime } = vm;
  
  // Access compiler internals
  const compilerAPI = vm.exports.i_will_not_ask_for_help_when_these_break();
  const { JSGenerator, IRGenerator, ScriptTreeGenerator } = compilerAPI;
  
  // Import type system
  const {
    TYPE_NUMBER,
    TYPE_STRING,
    TYPE_BOOLEAN,
    TypedInput,
    ConstantInput
  } = JSGenerator.unstable_exports;
```

## Setting Up the Patch System

Implement the patching mechanism:

```javascript
  const PATCHES_ID = 'mathutils_patches';
  
  const applyPatch = (obj, functions) => {
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
        obj[name] = function(...args) {
          return functions[name].call(this, () => {}, ...args);
        };
      }
    }
  };
```

## Creating Your First Block

Let's create a simple "square" block that calculates the square of a number.

### Script Tree Generation

First, handle the block identification phase:

```javascript
  applyPatch(ScriptTreeGenerator.prototype, {
    descendStackedBlock(fn, block, ...args) {
      switch (block.opcode) {
        case 'mathutils_square':
          return {
            block,
            kind: 'mathutils.square',
            NUMBER: this.descendInputOfBlock(block, 'NUMBER'),
          };
        default:
          return fn(block, ...args);
      }
    },
    
    descendInput(fn, block, ...args) {
      switch (block.opcode) {
        case 'mathutils_square':
          return {
            block,
            kind: 'mathutils.square',
            NUMBER: this.descendInputOfBlock(block, 'NUMBER'),
          };
        default:
          return fn(block, ...args);
      }
    }
  });
```

### JavaScript Generation

Next, implement the code generation:

```javascript
  applyPatch(JSGenerator.prototype, {
    descendStackedBlock(fn, node, ...args) {
      let b = node.block;
      switch (node.kind) {
        case 'mathutils.square':
          const number = this.descendInput(node.NUMBER).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", (${number} * ${number}));\n`;
          return;
        default:
          return fn(node, ...args);
      }
    },
    
    descendInput(fn, node, ...args) {
      switch (node.kind) {
        case 'mathutils.square':
          const number = this.descendInput(node.NUMBER).asNumber();
          return new TypedInput(`(${number} * ${number})`, TYPE_NUMBER);
        default:
          return fn(node, ...args);
      }
    }
  });
```

## Extension Class Definition

Define the extension class with block definitions:

```javascript
  class MathUtilsExtension {
    getInfo() {
      return {
        id: 'mathutils',
        name: 'Math Utils',
        color1: '#4C97FF',
        color2: '#4280D7',
        version: 1.0,
        blocks: [
          {
            opcode: 'square',
            text: 'square of [NUMBER]',
            blockType: BlockType.REPORTER,
            arguments: {
              NUMBER: {
                type: ArgumentType.NUMBER,
                defaultValue: 5
              }
            },
            func: 'squareFallback'
          }
        ]
      };
    }
    
    // Fallback function for non-compiled environments
    squareFallback(args) {
      const number = Number(args.NUMBER) || 0;
      return number * number;
    }
  }
```

## Testing Your Extension

### Basic Testing

Add some debugging to verify your extension is working:

```javascript
  console.log('Math Utils Extension loaded!');
  
  // Optional: Add debug info to blocks
  applyPatch(JSGenerator.prototype, {
    descendInput(fn, node, ...args) {
      switch (node.kind) {
        case 'mathutils.square':
          const number = this.descendInput(node.NUMBER).asNumber();
          console.log('Compiling square block with input:', number);
          return new TypedInput(`(${number} * ${number})`, TYPE_NUMBER);
        default:
          return fn(node, ...args);
      }
    }
  });
```

### Testing Procedure

1. Load your extension in MistWarp
2. Create a simple project using your "square" block
3. Try different input types:
   - Direct numbers: `square of (5)`
   - Variables: `square of (my variable)`
   - Complex expressions: `square of ((3 + 2))`
4. Check the compiled output for correctness

## Adding More Blocks

Let's add a more complex block with multiple inputs:

### Power Block

```javascript
// In ScriptTreeGenerator patch:
case 'mathutils_power':
  return {
    block,
    kind: 'mathutils.power',
    BASE: this.descendInputOfBlock(block, 'BASE'),
    EXPONENT: this.descendInputOfBlock(block, 'EXPONENT'),
  };

// In JSGenerator patch:
case 'mathutils.power':
  const base = this.descendInput(node.BASE).asNumber();
  const exponent = this.descendInput(node.EXPONENT).asNumber();
  return new TypedInput(`Math.pow(${base}, ${exponent})`, TYPE_NUMBER);

// In block definition:
{
  opcode: 'power',
  text: '[BASE] to the power of [EXPONENT]',
  blockType: BlockType.REPORTER,
  arguments: {
    BASE: {
      type: ArgumentType.NUMBER,
      defaultValue: 2
    },
    EXPONENT: {
      type: ArgumentType.NUMBER,
      defaultValue: 3
    }
  },
  func: 'powerFallback'
}
```

## Optimization Techniques

### Constant Folding

Optimize when inputs are constants:

```javascript
case 'mathutils.power':
  const base = this.descendInput(node.BASE);
  const exponent = this.descendInput(node.EXPONENT);
  
  // Check if both inputs are constants
  if (base instanceof ConstantInput && exponent instanceof ConstantInput) {
    const result = Math.pow(base.constantValue, exponent.constantValue);
    return new TypedInput(`${result}`, TYPE_NUMBER);
  }
  
  // Handle special cases
  if (exponent instanceof ConstantInput) {
    switch (exponent.constantValue) {
      case 2:
        const baseCode = base.asNumber();
        return new TypedInput(`(${baseCode} * ${baseCode})`, TYPE_NUMBER);
      case 0:
        return new TypedInput(`1`, TYPE_NUMBER);
      case 1:
        return new TypedInput(`${base.asNumber()}`, TYPE_NUMBER);
    }
  }
  
  // General case
  return new TypedInput(`Math.pow(${base.asNumber()}, ${exponent.asNumber()})`, TYPE_NUMBER);
```

## Complete Extension Example

Here's the complete, functional extension:

```javascript
/**!
 * Math Utils Extension
 * @author Your Name
 * @version 1.0
 */

(function(Scratch) {
  'use strict';
  
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Math Utils extension needs to be run unsandboxed.");
  }

  const { vm, BlockType, ArgumentType } = Scratch;
  const compilerAPI = vm.exports.i_will_not_ask_for_help_when_these_break();
  const { JSGenerator, ScriptTreeGenerator } = compilerAPI;
  const { TYPE_NUMBER, TypedInput, ConstantInput } = JSGenerator.unstable_exports;

  const PATCHES_ID = 'mathutils_patches';
  
  const applyPatch = (obj, functions) => {
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
        obj[name] = function(...args) {
          return functions[name].call(this, () => {}, ...args);
        };
      }
    }
  };

  // Script Tree Generation
  applyPatch(ScriptTreeGenerator.prototype, {
    descendStackedBlock(fn, block, ...args) {
      switch (block.opcode) {
        case 'mathutils_square':
          return {
            block,
            kind: 'mathutils.square',
            NUMBER: this.descendInputOfBlock(block, 'NUMBER'),
          };
        default:
          return fn(block, ...args);
      }
    },
    
    descendInput(fn, block, ...args) {
      switch (block.opcode) {
        case 'mathutils_square':
          return {
            block,
            kind: 'mathutils.square',
            NUMBER: this.descendInputOfBlock(block, 'NUMBER'),
          };
        default:
          return fn(block, ...args);
      }
    }
  });

  // JavaScript Generation
  applyPatch(JSGenerator.prototype, {
    descendStackedBlock(fn, node, ...args) {
      let b = node.block;
      switch (node.kind) {
        case 'mathutils.square':
          const number = this.descendInput(node.NUMBER).asNumber();
          this.source += `vm.runtime.visualReport("${b.id}", (${number} * ${number}));\n`;
          return;
        default:
          return fn(node, ...args);
      }
    },
    
    descendInput(fn, node, ...args) {
      switch (node.kind) {
        case 'mathutils.square':
          const number = this.descendInput(node.NUMBER);
          
          // Optimize constants
          if (number instanceof ConstantInput) {
            const result = number.constantValue * number.constantValue;
            return new TypedInput(`${result}`, TYPE_NUMBER);
          }
          
          // General case
          const numberCode = number.asNumber();
          return new TypedInput(`(${numberCode} * ${numberCode})`, TYPE_NUMBER);
        default:
          return fn(node, ...args);
      }
    }
  });

  class MathUtilsExtension {
    getInfo() {
      return {
        id: 'mathutils',
        name: 'Math Utils',
        color1: '#4C97FF',
        blocks: [
          {
            opcode: 'square',
            text: 'square of [NUMBER]',
            blockType: BlockType.REPORTER,
            arguments: {
              NUMBER: {
                type: ArgumentType.NUMBER,
                defaultValue: 5
              }
            },
            func: 'squareFallback'
          }
        ]
      };
    }
    
    squareFallback(args) {
      const number = Number(args.NUMBER) || 0;
      return number * number;
    }
    
    constructor() {
      console.log('Math Utils Extension loaded!');
    }
  }

  Scratch.extensions.register(new MathUtilsExtension());

})(Scratch);
```

## Next Steps

Now that you have a working compiled extension:

1. **Add more mathematical operations** (cube root, factorial, etc.)
2. **Implement string manipulation functions** 
3. **Create boolean logic operations**
4. **Add conditional optimizations** for common patterns
5. **Implement error handling** for edge cases

Each addition will deepen your understanding of the compilation system and help you create more sophisticated extensions.

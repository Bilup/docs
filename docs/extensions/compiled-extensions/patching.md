---
title: Patching the Compiler
sidebar_position: 3
---

# Patching the Compiler

The core mechanism of compiled extensions is patching MistWarp's compiler to inject custom code generation logic. This process involves modifying three key compiler phases to handle extension blocks.

## Understanding the Compilation Pipeline

MistWarp's compiler transforms Scratch blocks through several phases:

1. **Block Parsing**: Raw block data is processed
2. **Script Tree Generation**: Blocks are organized into a tree structure
3. **IR Generation**: The tree is converted to intermediate representation
4. **JavaScript Generation**: Final JavaScript code is produced

Compiled extensions hook into phases 2 and 4, skipping the IR phase for direct optimization.

## Patch Implementation Strategy

### Safe Patching Pattern

The patching system ensures multiple extensions can coexist without conflicts:

```javascript
const PATCHES_ID = 'myextension_patches';

const cst_patch = (obj, functions) => {
  // Prevent double-patching
  if (obj[PATCHES_ID]) return;
  obj[PATCHES_ID] = {};
  
  for (const name in functions) {
    const original = obj[name];
    obj[PATCHES_ID][name] = obj[name];
    
    if (original) {
      // Wrap existing function
      obj[name] = function(...args) {
        const callOriginal = (...args) => original.call(this, ...args);
        return functions[name].call(this, callOriginal, ...args);
      };
    } else {
      // Create new function
      obj[name] = function(...args) {
        return functions[name].call(this, () => {}, ...args);
      };
    }
  }
};
```

This pattern preserves the original functionality while adding extension-specific behavior.

## Script Tree Generation Patching

The Script Tree Generator identifies blocks and converts them into a structured format for compilation.

### Handling Different Block Types

```javascript
cst_patch(ScriptTreeGenerator.prototype, {
  descendStackedBlock(fn, block, ...args) {
    switch (block.opcode) {
      // Command blocks (hat/stack blocks)
      case 'myextension_command':
        return {
          block,
          kind: 'myextension.command',
          INPUT1: this.descendInputOfBlock(block, 'INPUT1'),
          INPUT2: this.descendInputOfBlock(block, 'INPUT2'),
        };
        
      // Boolean blocks
      case 'myextension_comparison':
        return {
          block,
          kind: 'myextension.comparison',
          LEFT: this.descendInputOfBlock(block, 'LEFT'),
          RIGHT: this.descendInputOfBlock(block, 'RIGHT'),
        };
        
      default:
        return fn(block, ...args);
    }
  },
  
  descendInput(fn, block, ...args) {
    switch (block.opcode) {
      // Reporter blocks (return values)
      case 'myextension_reporter':
        return {
          block,
          kind: 'myextension.reporter',
          VALUE: this.descendInputOfBlock(block, 'VALUE'),
        };
        
      // Boolean reporters
      case 'myextension_predicate':
        return {
          block,
          kind: 'myextension.predicate',
          TEST: this.descendInputOfBlock(block, 'TEST'),
        };
        
      default:
        return fn(block, ...args);
    }
  }
});
```

### Input Processing

The `descendInputOfBlock` method processes block inputs and handles different connection types:

- **Direct values**: Numbers, strings, booleans entered directly
- **Block connections**: Outputs from other blocks
- **Variable references**: References to variables or lists
- **Dropdown selections**: Menu choices

## JavaScript Generation Patching

The JavaScript Generator produces the final executable code for each block.

### Command Block Implementation

Command blocks execute actions but don't return values:

```javascript
cst_patch(JSGenerator.prototype, {
  descendStackedBlock(fn, node, ...args) {
    let b = node.block;
    switch (node.kind) {
      case 'myextension.setVariable':
        const varName = this.descendInput(node.VARIABLE).asString();
        const value = this.descendInput(node.VALUE).asUnknown();
        this.source += `target.variables[${varName}] = ${value};\n`;
        return;
        
      case 'myextension.logMessage':
        const message = this.descendInput(node.MESSAGE).asString();
        this.source += `console.log(${message});\n`;
        return;
        
      default:
        return fn(node, ...args);
    }
  }
});
```

### Reporter Block Implementation

Reporter blocks return values and must specify their type:

```javascript
cst_patch(JSGenerator.prototype, {
  descendInput(fn, node, ...args) {
    switch (node.kind) {
      case 'myextension.mathOperation':
        const left = this.descendInput(node.LEFT).asNumber();
        const right = this.descendInput(node.RIGHT).asNumber();
        const operator = this.descendInput(node.OPERATOR).asRaw();
        return new TypedInput(`(${left} ${operator} ${right})`, TYPE_NUMBER);
        
      case 'myextension.stringManipulation':
        const text = this.descendInput(node.TEXT).asString();
        const operation = this.descendInput(node.OPERATION).asRaw();
        
        switch (operation) {
          case 'uppercase':
            return new TypedInput(`${text}.toUpperCase()`, TYPE_STRING);
          case 'lowercase':
            return new TypedInput(`${text}.toLowerCase()`, TYPE_STRING);
          default:
            return new TypedInput(`${text}`, TYPE_STRING);
        }
        
      default:
        return fn(node, ...args);
    }
  }
});
```

## Advanced Patching Techniques

### Conditional Code Generation

Generate different code based on input types or values:

```javascript
case 'myextension.smartOperation':
  const input = this.descendInput(node.INPUT);
  
  if (input instanceof ConstantInput) {
    // Optimize for constant values
    const value = input.constantValue;
    if (typeof value === 'number') {
      return new TypedInput(`${value * 2}`, TYPE_NUMBER);
    }
  }
  
  // General case
  const inputCode = input.asNumber();
  return new TypedInput(`(${inputCode} * 2)`, TYPE_NUMBER);
```

### Error Handling in Generated Code

Include runtime error checking in generated JavaScript:

```javascript
case 'myextension.safeDivision':
  const dividend = this.descendInput(node.DIVIDEND).asNumber();
  const divisor = this.descendInput(node.DIVISOR).asNumber();
  
  return new TypedInput(
    `(${divisor} !== 0 ? ${dividend} / ${divisor} : 0)`,
    TYPE_NUMBER
  );
```

### Performance Optimizations

#### Inline Constant Operations
```javascript
case 'myextension.power':
  const base = this.descendInput(node.BASE);
  const exponent = this.descendInput(node.EXPONENT);
  
  // Optimize common cases
  if (exponent instanceof ConstantInput) {
    switch (exponent.constantValue) {
      case 2:
        return new TypedInput(`(${base.asNumber()} * ${base.asNumber()})`, TYPE_NUMBER);
      case 0.5:
        return new TypedInput(`Math.sqrt(${base.asNumber()})`, TYPE_NUMBER);
    }
  }
  
  // General case
  return new TypedInput(`Math.pow(${base.asNumber()}, ${exponent.asNumber()})`, TYPE_NUMBER);
```

#### Loop Unrolling for Known Iterations
```javascript
case 'myextension.repeat':
  const count = this.descendInput(node.COUNT);
  
  if (count instanceof ConstantInput && count.constantValue <= 10) {
    // Unroll small loops
    let code = '';
    for (let i = 0; i < count.constantValue; i++) {
      code += this.descendSubstack(node.SUBSTACK);
    }
    this.source += code;
    return;
  }
  
  // Use regular loop for larger counts
  const countCode = count.asNumber();
  this.source += `for (let i = 0; i < ${countCode}; i++) {\n`;
  this.source += this.descendSubstack(node.SUBSTACK);
  this.source += '}\n';
  return;
```

## Debugging Patch Issues

### Common Problems and Solutions

**Infinite Recursion**
- Always call the original function (`fn`) for unhandled cases
- Check patch conditions carefully to avoid circular calls

**Type Mismatches**
- Use appropriate input conversion methods
- Validate input types before processing
- Provide fallbacks for unexpected types

**Missing Block Handling**
- Ensure all block opcodes are handled in both phases
- Test with various block combinations and nesting levels

### Development Testing

Create test cases for different scenarios:

```javascript
// Test constant optimization
case 'myextension.test':
  const input = this.descendInput(node.INPUT);
  console.log('Input type:', input.constructor.name);
  console.log('Input value:', input instanceof ConstantInput ? input.constantValue : 'dynamic');
  
  // Your implementation here
```

Patching the compiler requires careful attention to detail and thorough testing, but it enables unprecedented performance optimizations for Scratch extensions.

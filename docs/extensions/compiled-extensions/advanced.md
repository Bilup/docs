---
title: Advanced Techniques
sidebar_position: 5
---

# Advanced Techniques

Once you understand the basics of compiled extensions, you can employ sophisticated techniques to create highly optimized and feature-rich extensions. This section covers advanced patterns used by professional extension developers.

## Advanced Type System Usage

### Custom Type Definitions

Create your own type checking and conversion logic:

```javascript
// Define custom type predicates
const isArrayLike = (input) => {
  if (input instanceof ConstantInput) {
    const value = input.constantValue;
    return typeof value === 'string' && value.startsWith('[');
  }
  return false;
};

// Custom type conversion
const asArray = (input) => {
  if (isArrayLike(input)) {
    return `JSON.parse(${input.asString()})`;
  }
  return `[${input.asString()}]`;
};
```

### Polymorphic Operations

Handle different input types dynamically:

```javascript
case 'myextension.smartConcat':
  const left = this.descendInput(node.LEFT);
  const right = this.descendInput(node.RIGHT);
  
  // Generate type-aware concatenation
  const leftCode = left.asUnknown();
  const rightCode = right.asUnknown();
  
  return new TypedInput(
    `(Array.isArray(${leftCode}) && Array.isArray(${rightCode}) ? 
      ${leftCode}.concat(${rightCode}) : 
      String(${leftCode}) + String(${rightCode}))`,
    TYPE_UNKNOWN
  );
```

## Performance Optimization Strategies

### Loop Optimization

Transform high-level loops into efficient JavaScript:

```javascript
case 'myextension.vectorOperation':
  const vector = this.descendInput(node.VECTOR);
  const operation = this.descendInput(node.OPERATION);
  
  if (operation instanceof ConstantInput) {
    const op = operation.constantValue;
    const vectorCode = vector.asRaw();
    
    switch (op) {
      case 'magnitude':
        return new TypedInput(
          `Math.sqrt(${vectorCode}.reduce((sum, x) => sum + x * x, 0))`,
          TYPE_NUMBER
        );
      case 'normalize':
        return new TypedInput(
          `(() => {
            const v = ${vectorCode};
            const mag = Math.sqrt(v.reduce((sum, x) => sum + x * x, 0));
            return mag > 0 ? v.map(x => x / mag) : v;
          })()`,
          TYPE_UNKNOWN
        );
    }
  }
  
  // Fallback for dynamic operations
  return new TypedInput(
    `performVectorOperation(${vector.asRaw()}, ${operation.asString()})`,
    TYPE_UNKNOWN
  );
```

### Memory-Efficient Code Generation

Minimize object allocations in generated code:

```javascript
case 'myextension.efficientStringBuilder':
  const parts = this.descendInput(node.PARTS);
  
  // Generate efficient string concatenation
  if (parts instanceof ConstantInput && Array.isArray(parts.constantValue)) {
    // Compile-time optimization for constant arrays
    const result = parts.constantValue.join('');
    return new TypedInput(`"${result}"`, TYPE_STRING);
  }
  
  // Runtime optimization using array join
  return new TypedInput(
    `${parts.asRaw()}.join('')`,
    TYPE_STRING
  );
```

## Advanced Code Generation Patterns

### Template-Based Code Generation

Create reusable code templates:

```javascript
const generateMathOperation = (operation, inputs, resultType = TYPE_NUMBER) => {
  const inputCodes = inputs.map(input => input.asNumber());
  
  const templates = {
    'add': `(${inputCodes.join(' + ')})`,
    'multiply': `(${inputCodes.join(' * ')})`,
    'max': `Math.max(${inputCodes.join(', ')})`,
    'min': `Math.min(${inputCodes.join(', ')})`,
    'average': `((${inputCodes.join(' + ')}) / ${inputCodes.length})`
  };
  
  return new TypedInput(templates[operation] || '0', resultType);
};

// Usage in block implementation
case 'myextension.mathOp':
  const operation = this.descendInput(node.OPERATION).asRaw();
  const inputs = [
    this.descendInput(node.INPUT1),
    this.descendInput(node.INPUT2),
    this.descendInput(node.INPUT3)
  ].filter(input => input); // Remove undefined inputs
  
  return generateMathOperation(operation, inputs);
```

### Conditional Compilation

Generate different code based on compilation context:

```javascript
case 'myextension.platformSpecific':
  const feature = this.descendInput(node.FEATURE).asString();
  
  // Check compilation environment
  const isPackaged = this.isPackaged || false;
  const targetPlatform = this.targetPlatform || 'web';
  
  if (isPackaged && targetPlatform === 'electron') {
    return new TypedInput(
      `require('electron').${feature}`,
      TYPE_UNKNOWN
    );
  } else if (targetPlatform === 'web') {
    return new TypedInput(
      `navigator.${feature} || null`,
      TYPE_UNKNOWN
    );
  }
  
  return new TypedInput(`null`, TYPE_UNKNOWN);
```

## State Management

### Extension-Scoped Variables

Create persistent state that survives compilation:

```javascript
// In extension constructor
this.compilationState = {
  counters: new Map(),
  generatedFunctions: new Set(),
  optimizationLevel: 1
};

// In code generation
case 'myextension.uniqueId':
  const category = this.descendInput(node.CATEGORY).asString();
  
  // Get unique ID for this compilation
  if (!this.compilationState.counters.has(category)) {
    this.compilationState.counters.set(category, 0);
  }
  
  const id = this.compilationState.counters.get(category);
  this.compilationState.counters.set(category, id + 1);
  
  return new TypedInput(`"${category}_${id}"`, TYPE_STRING);
```

### Function Hoisting

Generate helper functions once and reuse them:

```javascript
case 'myextension.complexOperation':
  const input = this.descendInput(node.INPUT).asNumber();
  
  // Generate helper function if not already present
  if (!this.compilationState.generatedFunctions.has('complexHelper')) {
    this.compilationState.generatedFunctions.add('complexHelper');
    
    // Add function to top of generated code
    this.source = `
      const complexHelper = (x) => {
        // Complex mathematical operation
        return Math.sin(x) * Math.cos(x * 2) + Math.tan(x / 3);
      };
      ${this.source}
    `;
  }
  
  return new TypedInput(`complexHelper(${input})`, TYPE_NUMBER);
```

## Error Handling and Debugging

### Compile-Time Validation

Validate inputs during compilation:

```javascript
case 'myextension.validateInput':
  const input = this.descendInput(node.INPUT);
  
  // Validate constant inputs at compile time
  if (input instanceof ConstantInput) {
    const value = input.constantValue;
    if (typeof value !== 'number' || value < 0) {
      console.warn(`Invalid input to validateInput block: ${value}`);
      return new TypedInput(`0`, TYPE_NUMBER);
    }
    
    // Pre-compute result for valid constants
    return new TypedInput(`${Math.sqrt(value)}`, TYPE_NUMBER);
  }
  
  // Generate runtime validation for dynamic inputs
  const inputCode = input.asNumber();
  return new TypedInput(
    `(${inputCode} >= 0 ? Math.sqrt(${inputCode}) : 0)`,
    TYPE_NUMBER
  );
```

### Debug Information Generation

Include debugging aids in generated code:

```javascript
case 'myextension.debugBlock':
  const value = this.descendInput(node.VALUE);
  const label = this.descendInput(node.LABEL).asString();
  
  if (this.debugMode) {
    const valueCode = value.asUnknown();
    return new TypedInput(
      `((val) => {
        console.log('Debug [' + ${label} + ']:', val);
        return val;
      })(${valueCode})`,
      value.type || TYPE_UNKNOWN
    );
  }
  
  // In production, pass through without debugging
  return value;
```

## Integration with External Libraries

### Safe Library Loading

Generate code that gracefully handles missing libraries:

```javascript
case 'myextension.useLibrary':
  const libraryName = this.descendInput(node.LIBRARY).asString();
  const method = this.descendInput(node.METHOD).asString();
  const args = this.descendInput(node.ARGS).asRaw();
  
  return new TypedInput(
    `(typeof ${libraryName} !== 'undefined' && ${libraryName}.${method} ? 
      ${libraryName}.${method}(${args}) : 
      null)`,
    TYPE_UNKNOWN
  );
```

### Dynamic Import Generation

Create code that loads modules at runtime:

```javascript
case 'myextension.dynamicImport':
  const moduleName = this.descendInput(node.MODULE).asString();
  
  // Generate dynamic import code
  return new TypedInput(
    `await import(${moduleName}).then(module => module.default || module)`,
    TYPE_UNKNOWN
  );
```

## Testing and Validation

### Automated Test Generation

Create tests for your compiled blocks:

```javascript
const generateTestCases = (blockKind, testCases) => {
  return testCases.map(testCase => {
    const { inputs, expected, description } = testCase;
    
    return {
      blockKind,
      inputs,
      expected,
      description,
      test: () => {
        // Generate minimal test project
        const result = compileTestBlock(blockKind, inputs);
        return result === expected;
      }
    };
  });
};

// Usage
const testCases = generateTestCases('myextension.square', [
  { inputs: { NUMBER: 5 }, expected: 25, description: 'Square of 5' },
  { inputs: { NUMBER: 0 }, expected: 0, description: 'Square of 0' },
  { inputs: { NUMBER: -3 }, expected: 9, description: 'Square of negative' }
]);
```

## Performance Monitoring

### Compilation Metrics

Track compilation performance:

```javascript
const trackCompilation = (blockKind, startTime) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration > 10) {
    console.warn(`Slow compilation for ${blockKind}: ${duration}ms`);
  }
  
  // Store metrics for analysis
  if (!this.compilationMetrics) {
    this.compilationMetrics = new Map();
  }
  
  const existing = this.compilationMetrics.get(blockKind) || [];
  existing.push(duration);
  this.compilationMetrics.set(blockKind, existing);
};

// Use in block implementation
case 'myextension.complexBlock':
  const startTime = performance.now();
  
  // Your implementation here
  const result = /* ... */;
  
  trackCompilation('myextension.complexBlock', startTime);
  return result;
```

These advanced techniques enable you to create compiled extensions that rival the performance and functionality of native JavaScript code while maintaining the visual programming paradigm of Scratch.

## Advanced Compiler API Integration

### Accessing Extended Compiler APIs

Beyond basic patching, you can access deeper compiler functionality for sophisticated code generation:

```javascript
// Check for extended compiler features
if (vm.exports.i_will_not_ask_for_help_when_these_break) {
    const compilerAPI = vm.exports.i_will_not_ask_for_help_when_these_break();
    
    // Access additional compiler components
    if (compilerAPI.JSGenerator && compilerAPI.ScriptTreeGenerator) {
        const { Frame, TypedInput, TYPE_UNKNOWN } = compilerAPI.JSGenerator.unstable_exports;
        patchAdvancedCompiler(compilerAPI, { Frame, TypedInput, TYPE_UNKNOWN });
    }
}

function patchAdvancedCompiler(api, types) {
    const { JSGenerator, ScriptTreeGenerator } = api;
    const { Frame, TypedInput, TYPE_UNKNOWN } = types;
    
    // Store original methods
    const jsDescendStackedBlock = JSGenerator.prototype.descendStackedBlock;
    const stDescendStackedBlock = ScriptTreeGenerator.prototype.descendStackedBlock;
    
    // Enhanced patching with frame management
    JSGenerator.prototype.descendStackedBlock = function(node) {
        if (node.kind?.startsWith('myExtension.')) {
            return handleAdvancedBlock.call(this, node, types);
        }
        return jsDescendStackedBlock.call(this, node);
    };
}
```

### Frame-Based Code Generation

Create blocks that manage their own execution contexts and variable scopes:

```javascript
function generateSwitchBlock(node, generator, types) {
    const { Frame, TypedInput, TYPE_UNKNOWN } = types;
    
    // Create a breakable frame for switch statements
    const switchFrame = new Frame(false);
    switchFrame.isBreakable = true;
    switchFrame.switchData = {
        value: generator.localVariables.next(),
        cases: [],
        hasDefault: false
    };
    
    // Generate switch variable
    const switchVar = switchFrame.switchData.value;
    const valueExpr = generator.descendInput(node.value).asUnknown();
    
    // Start switch statement
    generator.source += `let ${switchVar} = ${valueExpr};\nswitch(${switchVar}) {\n`;
    
    // Process cases with custom frame context
    generator.pushFrame(switchFrame);
    const stackCode = generator.descendStackWithCustomContext(node.stack, switchFrame);
    generator.popFrame();
    
    generator.source += stackCode;
    generator.source += '}\n';
    
    return new TypedInput('', TYPE_UNKNOWN);
}

// Handle case blocks within switch context
function generateCaseBlock(node, generator, types) {
    const { TypedInput, TYPE_UNKNOWN } = types;
    
    // Find parent switch frame
    const switchFrame = generator.frames.findLast(frame => frame.switchData);
    if (!switchFrame) {
        return; // Not inside a switch
    }
    
    const caseValue = generator.descendInput(node.value).asUnknown();
    const caseVar = generator.localVariables.next();
    
    // Generate case with fall-through logic
    generator.source += `case (${switchFrame.switchData.value}): `;
    generator.source += `(${caseVar} = (${caseValue}));\n`;
    generator.source += `case (${caseVar}): {\n`;
    
    // Process case body
    if (node.stack) {
        const caseFrame = new Frame(false);
        caseFrame.isBreakable = true;
        generator.pushFrame(caseFrame);
        generator.descendStack(node.stack);
        generator.popFrame();
    }
    
    generator.source += 'break;\n}\n';
}
```

### Multi-Phase Compilation Support

Handle complex blocks that require multiple compilation passes:

```javascript
class AdvancedBlockCompiler {
    constructor(generator, types) {
        this.generator = generator;
        this.types = types;
        this.pendingBlocks = new Map();
        this.compiledBlocks = new Set();
    }
    
    // First pass: collect block structure
    collectBlockStructure(node) {
        if (node.kind === 'myExtension.complexBlock') {
            this.pendingBlocks.set(node.id, {
                node,
                dependencies: this.findDependencies(node),
                variables: this.extractVariables(node)
            });
        }
    }
    
    // Second pass: generate optimized code
    generateOptimizedCode(blockId) {
        if (this.compiledBlocks.has(blockId)) return;
        
        const blockData = this.pendingBlocks.get(blockId);
        if (!blockData) return;
        
        // Ensure dependencies are compiled first
        blockData.dependencies.forEach(dep => {
            this.generateOptimizedCode(dep);
        });
        
        // Generate this block's code
        this.compileBlock(blockData);
        this.compiledBlocks.add(blockId);
    }
    
    compileBlock(blockData) {
        const { node, variables } = blockData;
        const { Frame, TypedInput } = this.types;
        
        // Pre-allocate variables for efficiency
        const varDeclarations = variables.map(v => 
            `let ${v.name} = ${v.initialValue || 'undefined'}`
        ).join(', ');
        
        if (varDeclarations) {
            this.generator.source += `${varDeclarations};\n`;
        }
        
        // Generate optimized block body
        const optimizedFrame = new Frame(false);
        optimizedFrame.optimizations = {
            precomputedValues: this.precomputeConstants(node),
            inlinedFunctions: this.identifyInlineable(node)
        };
        
        this.generator.pushFrame(optimizedFrame);
        this.generateBlockBody(node);
        this.generator.popFrame();
    }
}
```

### Compiler Hook Integration

Integrate with the compiler's lifecycle hooks for advanced optimizations:

```javascript
function setupCompilerHooks(api) {
    const { JSGenerator } = api;
    
    // Hook into compilation start
    const originalCompile = JSGenerator.prototype.compile;
    JSGenerator.prototype.compile = function() {
        // Pre-compilation analysis
        this.extensionData = this.extensionData || {};
        this.extensionData.optimizations = new Map();
        
        // Analyze script for optimization opportunities
        this.analyzeForOptimizations();
        
        const result = originalCompile.call(this);
        
        // Post-compilation cleanup
        this.finalizeOptimizations();
        
        return result;
    };
    
    // Add analysis methods
    JSGenerator.prototype.analyzeForOptimizations = function() {
        // Detect loop patterns for unrolling
        this.detectLoopPatterns();
        
        // Identify constant expressions
        this.identifyConstants();
        
        // Find function call patterns for inlining
        this.analyzeFunctionCalls();
    };
    
    JSGenerator.prototype.detectLoopPatterns = function() {
        // Implementation for loop optimization detection
        const loopBlocks = this.findBlocksByType('control_repeat');
        loopBlocks.forEach(block => {
            if (this.isConstantRepeatCount(block)) {
                this.extensionData.optimizations.set(block.id, {
                    type: 'loop_unroll',
                    repeatCount: this.getConstantValue(block.TIMES)
                });
            }
        });
    };
}
```

### Runtime Integration Patterns

Seamlessly integrate compiled code with runtime systems:

```javascript
function createRuntimeBridge(extension) {
    return {
        // Bridge compiled code back to runtime when needed
        invokeRuntime(method, args) {
            return vm.runtime[method].apply(vm.runtime, args);
        },
        
        // Access target and stage data
        getTarget() {
            return vm.runtime.getEditingTarget();
        },
        
        // Thread-safe variable access
        getVariable(name, target) {
            target = target || this.getTarget();
            return target.lookupVariableByNameAndType(name, '');
        },
        
        setVariable(name, value, target) {
            target = target || this.getTarget();
            const variable = target.lookupVariableByNameAndType(name, '');
            if (variable) {
                variable.value = value;
                vm.runtime.getMonitorState().requestUpdate(
                    new Map([['id', variable.id]])
                );
            }
        },
        
        // Safe list operations
        getList(name, target) {
            target = target || this.getTarget();
            return target.lookupVariableByNameAndType(name, 'list');
        },
        
        // Event emission for compiled blocks
        emitEvent(eventName, data) {
            vm.runtime.emit(eventName, data);
        }
    };
}

// Use in compiled block implementations
function generateRuntimeBridgeCode(generator) {
    generator.source += `
        const bridge = this.getRuntimeBridge();
        
        // Example: compiled block that needs runtime access
        const result = bridge.invokeRuntime('someMethod', [arg1, arg2]);
        bridge.setVariable('result', result);
    `;
}
```

These advanced compiler integration techniques enable you to create sophisticated compiled extensions that seamlessly blend high-performance generated code with Scratch's runtime environment, achieving both optimal performance and full feature compatibility.

---
title: 高级技术
sidebar_position: 5
---

# 高级技术

一旦您理解了编译扩展的基础知识，就可以使用复杂的技术来创建高度优化和功能丰富的扩展。本节介绍专业扩展开发人员使用的高级模式。

## 高级类型系统使用

### 自定义类型定义

创建您自己的类型检查和转换逻辑：

```javascript
// 定义自定义类型函数
const isArrayLike = (input) => {
  if (input instanceof ConstantInput) {
    const value = input.constantValue;
    return typeof value === 'string' && value.startsWith('[');
  }
  return false;
};

// 自定义类型转换
const asArray = (input) => {
  if (isArrayLike(input)) {
    return `JSON.parse(${input.asString()})`;
  }
  return `[${input.asString()}]`;
};
```

### 多态操作

动态处理不同的输入类型：

```javascript
case 'myextension.smartConcat':
  const left = this.descendInput(node.LEFT);
  const right = this.descendInput(node.RIGHT);
  
  // 生成类型感知连接
  const leftCode = left.asUnknown();
  const rightCode = right.asUnknown();
  
  return new TypedInput(
    `(Array.isArray(${leftCode}) && Array.isArray(${rightCode}) ? 
      ${leftCode}.concat(${rightCode}) : 
      String(${leftCode}) + String(${rightCode}))`,
    TYPE_UNKNOWN
  );
```

## 性能优化策略

### 循环优化

将高级循环转换为高效的 JavaScript：

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
  
  // 动态操作的回退
  return new TypedInput(
    `performVectorOperation(${vector.asRaw()}, ${operation.asString()})`,
    TYPE_UNKNOWN
  );
```

### 内存高效代码生成

最小化生成代码中的对象分配：

```javascript
case 'myextension.efficientStringBuilder':
  const parts = this.descendInput(node.PARTS);
  
  // 生成高效的字符串连接
  if (parts instanceof ConstantInput && Array.isArray(parts.constantValue)) {
    // 常量数组的编译时优化
    const result = parts.constantValue.join('');
    return new TypedInput(`"${result}"`, TYPE_STRING);
  }
  
  // 使用数组连接的运行时优化
  return new TypedInput(
    `${parts.asRaw()}.join('')`,
    TYPE_STRING
  );
```

## 高级代码生成模式

### 基于模板的代码生成

创建可重用的代码模板：

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

// 在积木实现中使用
case 'myextension.mathOp':
  const operation = this.descendInput(node.OPERATION).asRaw();
  const inputs = [
    this.descendInput(node.INPUT1),
    this.descendInput(node.INPUT2),
    this.descendInput(node.INPUT3)
  ].filter(input => input); // 移除未定义的输入
  
  return generateMathOperation(operation, inputs);
```

### 条件编译

根据编译上下文生成不同的代码：

```javascript
case 'myextension.platformSpecific':
  const feature = this.descendInput(node.FEATURE).asString();
  
  // 检查编译环境
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

## 状态管理

### 扩展范围变量

创建在编译过程中持续存在的持久状态：

```javascript
// 在扩展构造函数中
this.compilationState = {
  counters: new Map(),
  generatedFunctions: new Set(),
  optimizationLevel: 1
};

// 在代码生成中
case 'myextension.uniqueId':
  const category = this.descendInput(node.CATEGORY).asString();
  
  // 获取此编译的唯一ID
  if (!this.compilationState.counters.has(category)) {
    this.compilationState.counters.set(category, 0);
  }
  
  const id = this.compilationState.counters.get(category);
  this.compilationState.counters.set(category, id + 1);
  
  return new TypedInput(`"${category}_${id}"`, TYPE_STRING);
```

### 函数提升

生成一次辅助函数并重用它们：

```javascript
case 'myextension.complexOperation':
  const input = this.descendInput(node.INPUT).asNumber();
  
  // 如果尚未存在，生成辅助函数
  if (!this.compilationState.generatedFunctions.has('complexHelper')) {
    this.compilationState.generatedFunctions.add('complexHelper');
    
    // 将函数添加到生成代码的顶部
    this.source = `
      const complexHelper = (x) => {
        // 复杂数学运算
        return Math.sin(x) * Math.cos(x * 2) + Math.tan(x / 3);
      };
      ${this.source}
    `;
  }
  
  return new TypedInput(`complexHelper(${input})`, TYPE_NUMBER);
```

## 错误处理和调试

### 编译时验证

在编译期间验证输入：

```javascript
case 'myextension.validateInput':
  const input = this.descendInput(node.INPUT);
  
  // 在编译时验证常量输入
  if (input instanceof ConstantInput) {
    const value = input.constantValue;
    if (typeof value !== 'number' || value < 0) {
      console.warn(`Invalid input to validateInput block: ${value}`);
      return new TypedInput(`0`, TYPE_NUMBER);
    }
    
    // 为有效常量预先计算结果
    return new TypedInput(`${Math.sqrt(value)}`, TYPE_NUMBER);
  }
  
  // 为动态输入生成运行时验证
  const inputCode = input.asNumber();
  return new TypedInput(
    `(${inputCode} >= 0 ? Math.sqrt(${inputCode}) : 0)`,
    TYPE_NUMBER
  );
```

### 调试信息生成

在生成的代码中包含调试辅助工具：

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
  
  // 在生产环境中，直接传递而不进行调试
  return value;
```

## 与外部库集成

### 安全库加载

生成完美处理缺失库的代码：

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

### 动态导入生成

创建在运行时加载模块的代码：

```javascript
case 'myextension.dynamicImport':
  const moduleName = this.descendInput(node.MODULE).asString();
  
  // 生成动态导入代码
  return new TypedInput(
    `await import(${moduleName}).then(module => module.default || module)`,
    TYPE_UNKNOWN
  );
```

## 测试和验证

### 自动测试生成

为您编译的积木创建测试：

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
        // 生成最小测试项目
        const result = compileTestBlock(blockKind, inputs);
        return result === expected;
      }
    };
  });
};

// 使用
const testCases = generateTestCases('myextension.square', [
  { inputs: { NUMBER: 5 }, expected: 25, description: 'Square of 5' },
  { inputs: { NUMBER: 0 }, expected: 0, description: 'Square of 0' },
  { inputs: { NUMBER: -3 }, expected: 9, description: 'Square of negative' }
]);
```

## 性能监控

### 编译数据

跟踪编译性能：

```javascript
const trackCompilation = (blockKind, startTime) => {
  const endTime = performance.now();
  const duration = endTime - startTime;
  
  if (duration > 10) {
    console.warn(`Slow compilation for ${blockKind}: ${duration}ms`);
  }
  
  // 存储数据用于分析
  if (!this.compilationMetrics) {
    this.compilationMetrics = new Map();
  }
  
  const existing = this.compilationMetrics.get(blockKind) || [];
  existing.push(duration);
  this.compilationMetrics.set(blockKind, existing);
};

// 在积木实现中使用
case 'myextension.complexBlock':
  const startTime = performance.now();
  
  // 您的实现在这里
  const result = /* ... */;
  
  trackCompilation('myextension.complexBlock', startTime);
  return result;
```

这些高级技术使您能够创建性能和功能与原始 JavaScript 代码相媲美的编译扩展，同时保持 Scratch 的可视化编程范式。

## 高级编译器 API 集成

### 访问扩展编译器 API

除了基本补丁之外，您还可以访问更深层的编译器功能以进行复杂的代码生成：

```javascript
// 检查扩展编译器功能
if (vm.exports.i_will_not_ask_for_help_when_these_break) {
    const compilerAPI = vm.exports.i_will_not_ask_for_help_when_these_break();
    
    // 访问额外的编译器组件
    if (compilerAPI.JSGenerator && compilerAPI.ScriptTreeGenerator) {
        const { Frame, TypedInput, TYPE_UNKNOWN } = compilerAPI.JSGenerator.unstable_exports;
        patchAdvancedCompiler(compilerAPI, { Frame, TypedInput, TYPE_UNKNOWN });
    }
}

function patchAdvancedCompiler(api, types) {
    const { JSGenerator, ScriptTreeGenerator } = api;
    const { Frame, TypedInput, TYPE_UNKNOWN } = types;
    
    // 存储原始方法
    const jsDescendStackedBlock = JSGenerator.prototype.descendStackedBlock;
    const stDescendStackedBlock = ScriptTreeGenerator.prototype.descendStackedBlock;
    
    // 带帧管理的增强补丁
    JSGenerator.prototype.descendStackedBlock = function(node) {
        if (node.kind?.startsWith('myExtension.')) {
            return handleAdvancedBlock.call(this, node, types);
        }
        return jsDescendStackedBlock.call(this, node);
    };
}
```

### 基于帧的代码生成

创建管理自己执行上下文和变量作用域的积木：

```javascript
function generateSwitchBlock(node, generator, types) {
    const { Frame, TypedInput, TYPE_UNKNOWN } = types;
    
    // 为 switch 语句创建可中断的帧
    const switchFrame = new Frame(false);
    switchFrame.isBreakable = true;
    switchFrame.switchData = {
        value: generator.localVariables.next(),
        cases: [],
        hasDefault: false
    };
    
    // 生成 switch 变量
    const switchVar = switchFrame.switchData.value;
    const valueExpr = generator.descendInput(node.value).asUnknown();
    
    // 开始 switch 语句
    generator.source += `let ${switchVar} = ${valueExpr};\nswitch(${switchVar}) {\n`;
    
    // 使用自定义帧上下文处理 case
    generator.pushFrame(switchFrame);
    const stackCode = generator.descendStackWithCustomContext(node.stack, switchFrame);
    generator.popFrame();
    
    generator.source += stackCode;
    generator.source += '}\n';
    
    return new TypedInput('', TYPE_UNKNOWN);
}

// 处理 switch 上下文中的 case 积木
function generateCaseBlock(node, generator, types) {
    const { TypedInput, TYPE_UNKNOWN } = types;
    
    // 查找父级 switch 帧
    const switchFrame = generator.frames.findLast(frame => frame.switchData);
    if (!switchFrame) {
        return; // 不在 switch 内部
    }
    
    const caseValue = generator.descendInput(node.value).asUnknown();
    const caseVar = generator.localVariables.next();
    
    // 生成带 fall-through 逻辑的 case
    generator.source += `case (${switchFrame.switchData.value}): `;
    generator.source += `(${caseVar} = (${caseValue}));\n`;
    generator.source += `case (${caseVar}): {\n`;
    
    // 处理 case 体
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

### 多阶段编译支持

处理需要多个编译遍数的复杂积木：

```javascript
class AdvancedBlockCompiler {
    constructor(generator, types) {
        this.generator = generator;
        this.types = types;
        this.pendingBlocks = new Map();
        this.compiledBlocks = new Set();
    }
    
    // 第一遍：收集积木结构
    collectBlockStructure(node) {
        if (node.kind === 'myExtension.complexBlock') {
            this.pendingBlocks.set(node.id, {
                node,
                dependencies: this.findDependencies(node),
                variables: this.extractVariables(node)
            });
        }
    }
    
    // 第二遍：生成优化代码
    generateOptimizedCode(blockId) {
        if (this.compiledBlocks.has(blockId)) return;
        
        const blockData = this.pendingBlocks.get(blockId);
        if (!blockData) return;
        
        // 确保依赖项先被编译
        blockData.dependencies.forEach(dep => {
            this.generateOptimizedCode(dep);
        });
        
        // 生成此积木的代码
        this.compileBlock(blockData);
        this.compiledBlocks.add(blockId);
    }
    
    compileBlock(blockData) {
        const { node, variables } = blockData;
        const { Frame, TypedInput } = this.types;
        
        // 预分配变量以提高效率
        const varDeclarations = variables.map(v => 
            `let ${v.name} = ${v.initialValue || 'undefined'}`
        ).join(', ');
        
        if (varDeclarations) {
            this.generator.source += `${varDeclarations};\n`;
        }
        
        // 生成优化的积木体
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

### 编译器钩子集成

与编译器的生命周期钩子集成以进行高级优化：

```javascript
function setupCompilerHooks(api) {
    const { JSGenerator } = api;
    
    // 挂钩到编译开始
    const originalCompile = JSGenerator.prototype.compile;
    JSGenerator.prototype.compile = function() {
        // 预编译分析
        this.extensionData = this.extensionData || {};
        this.extensionData.optimizations = new Map();
        
        // 分析脚本以寻找优化机会
        this.analyzeForOptimizations();
        
        const result = originalCompile.call(this);
        
        // 编译后清理
        this.finalizeOptimizations();
        
        return result;
    };
    
    // 添加分析方法
    JSGenerator.prototype.analyzeForOptimizations = function() {
        // 检测循环模式以进行展开
        this.detectLoopPatterns();
        
        // 识别常量表达式
        this.identifyConstants();
        
        // 查找函数调用模式以进行内联
        this.analyzeFunctionCalls();
    };
    
    JSGenerator.prototype.detectLoopPatterns = function() {
        // 循环优化检测的实现
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

### 运行时集成模式

将编译代码与运行时系统无缝集成：

```javascript
function createRuntimeBridge(extension) {
    return {
        // 在需要时将编译代码桥接到运行时
        invokeRuntime(method, args) {
            return vm.runtime[method].apply(vm.runtime, args);
        },
        
        // 访问目标和舞台数据
        getTarget() {
            return vm.runtime.getEditingTarget();
        },
        
        // 线程安全的变量访问
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
        
        // 安全的列表操作
        getList(name, target) {
            target = target || this.getTarget();
            return target.lookupVariableByNameAndType(name, 'list');
        },
        
        // 编译积木的事件发射
        emitEvent(eventName, data) {
            vm.runtime.emit(eventName, data);
        }
    };
}

// 在编译积木实现中使用
function generateRuntimeBridgeCode(generator) {
    generator.source += `
        const bridge = this.getRuntimeBridge();
        
        // 示例：需要运行时访问的编译积木
        const result = bridge.invokeRuntime('someMethod', [arg1, arg2]);
        bridge.setVariable('result', result);
    `;
}
```

这些高级编译器集成技术使您能够创建复杂的编译扩展，将高性能生成代码与 Scratch 的运行时环境无缝融合，同时实现最佳性能和完整功能兼容性。
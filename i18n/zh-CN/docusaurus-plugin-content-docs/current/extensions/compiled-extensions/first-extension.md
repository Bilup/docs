---
title: 创建您的第一个扩展
sidebar_position: 4
---

# 创建您的第一个扩展

本教程从头开始创建一个简单的编译扩展，展示您将在更复杂的扩展中使用的关键概念和模式。

## 项目设置

为您的扩展创建一个新的 JavaScript 文件。我们将构建一个"数学工具"扩展，提供优化的数学运算。

### 扩展头

从基本扩展结构开始：

```javascript
/**!
 * Math Utils Extension
 * @author Your Name
 * @version 1.0
 * @copyright MIT License
 */

(function(Scratch) {
  'use strict';
  
  // 验证非沙箱环境
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Math Utils extension needs to be run unsandboxed.");
  }
```

### 访问编译器 API

获取必要的 Bilup 组件引用：

```javascript
  const { vm, BlockType, ArgumentType } = Scratch;
  const { runtime } = vm;
  
  // 访问编译器内部
  const compilerAPI = vm.exports.i_will_not_ask_for_help_when_these_break();
  const { JSGenerator, IRGenerator, ScriptTreeGenerator } = compilerAPI;
  
  // 导入类型系统
  const {
    TYPE_NUMBER,
    TYPE_STRING,
    TYPE_BOOLEAN,
    TypedInput,
    ConstantInput
  } = JSGenerator.unstable_exports;
```

## 设置补丁系统

实现补丁机制：

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

## 创建您的第一个积木

让我们创建一个简单的"平方"积木来计算数字的平方。

### 脚本树生成

首先处理积木识别阶段：

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

### JavaScript 生成

接下来，实现代码生成：

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

## 扩展类定义

定义带有积木定义的扩展类：

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
    
    // 非编译环境的回退函数
    squareFallback(args) {
      const number = Number(args.NUMBER) || 0;
      return number * number;
    }
  }
```

## 测试您的扩展

### 基本测试

添加一些调试以验证您的扩展是否工作：

```javascript
  console.log('Math Utils Extension loaded!');
  
  // 可选：向积木添加调试信息
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

### 测试过程

1. 在 Bilup 中加载您的扩展
2. 使用您的"平方"积木创建一个简单的项目
3. 尝试不同的输入类型：
   - 直接数字：`square of (5)`
   - 变量：`square of (my variable)`
   - 复杂表达式：`square of ((3 + 2))`
4. 检查编译输出的正确性

## 添加更多积木

让我们添加一个更复杂的多输入积木：

### 幂运算积木

```javascript
// 在 ScriptTreeGenerator 补丁中：
case 'mathutils_power':
  return {
    block,
    kind: 'mathutils.power',
    BASE: this.descendInputOfBlock(block, 'BASE'),
    EXPONENT: this.descendInputOfBlock(block, 'EXPONENT'),
  };

// 在 JSGenerator 补丁中：
case 'mathutils.power':
  const base = this.descendInput(node.BASE).asNumber();
  const exponent = this.descendInput(node.EXPONENT).asNumber();
  return new TypedInput(`Math.pow(${base}, ${exponent})`, TYPE_NUMBER);

// 在积木定义中：
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

## 优化技术

### 常量折叠

当输入为常量时进行优化：

```javascript
case 'mathutils.power':
  const base = this.descendInput(node.BASE);
  const exponent = this.descendInput(node.EXPONENT);
  
  // 检查两个输入是否都是常量
  if (base instanceof ConstantInput && exponent instanceof ConstantInput) {
    const result = Math.pow(base.constantValue, exponent.constantValue);
    return new TypedInput(`${result}`, TYPE_NUMBER);
  }
  
  // 处理特殊情况
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
  
  // 一般情况
  return new TypedInput(`Math.pow(${base.asNumber()}, ${exponent.asNumber()})`, TYPE_NUMBER);
```

## 完整扩展示例

这是完整的功能扩展：

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

  // 脚本树生成
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

  // JavaScript 生成
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
          
          // 优化常量
          if (number instanceof ConstantInput) {
            const result = number.constantValue * number.constantValue;
            return new TypedInput(`${result}`, TYPE_NUMBER);
          }
          
          // 一般情况
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

## 下一步

现在您有了一个工作的编译扩展：

1. **添加更多数学运算**(立方根、阶乘等)
2. **实现字符串操作函数**
3. **创建布尔逻辑运算**
4. **添加常见模式的条件优化**
5. **实现边缘情况的错误处理**

每次添加都将加深您对编译系统的理解，并帮助您创建更复杂的扩展。
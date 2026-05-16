---
title: 扩展结构
sidebar_position: 2
---

# 扩展结构

编译扩展遵循特定的结构，与 Bilup 的编译器架构集成。理解此结构对于创建有效的编译扩展至关重要。

## 基本扩展模板

每个编译扩展都从这个基本结构开始：

### 扩展声明
扩展首先检查非沙箱环境，这是访问编译器内部所必需的：

```javascript
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Extension needs to be run unsandboxed.");
  }
```

### 访问编译器内部
接下来，扩展获取 Bilup 的编译器组件引用：

```javascript
const { vm, BlockType, ArgumentType } = Scratch;
const { runtime } = vm;

// 访问编译器内部
const iwnafhwtb = vm.exports.i_will_not_ask_for_help_when_these_break();
const { JSGenerator, IRGenerator, ScriptTreeGenerator } = iwnafhwtb;
```

`i_will_not_ask_for_help_when_these_break()` 函数提供对内部 API 的访问，这些 API 可能在版本之间更改。名称作为警告，表示这些 API 不稳定。

### 编译器类型系统
编译扩展使用 Bilup 的类型系统进行优化：

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

## 修补系统

编译扩展使用修补系统来修改编译器行为。修补函数确保多个扩展可以共存：

### 修补函数
```javascript
const PATCHES_ID = 'extensionname_patches';

const cst_patch = (obj, functions) => {
  if (obj[PATCHES_ID]) return; // 防止重复修补
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

此系统允许扩展覆盖编译器方法，同时保留调用原始实现的能力。

## 编译器阶段修补

### JavaScript 生成修补
JSGenerator 修补处理将积木转换为最终 JavaScript 代码：

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

### 脚本树生成修补
ScriptTreeGenerator 修补识别扩展积木并为编译做准备：

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
    // 返回值积木的类似结构
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

## 扩展类定义

设置修补后，定义扩展类：

### 基本类结构
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
    // 非编译环境的回退实现
    return Math.pow(args.INPUT1, 2);
  }
}
```

### 注册
```javascript
Scratch.extensions.register(new MyExtension());
```

## 输入类型处理

编译扩展必须正确处理不同的输入类型：

### 类型转换方法
- `asNumber()`: 将输入转换为数字（遵循 Scratch 语义）
- `asString()`: 将输入转换为字符串
- `asBoolean()`: 将输入转换为布尔值
- `asRaw()`: 不进行类型转换使用输入
- `asSafe()`: 通过错误检查安全处理输入

### 特定类型输出
生成代码时，指定输出类型：

```javascript
// 数字输出
return new TypedInput(`Math.pow(${input}, 2)`, TYPE_NUMBER);

// 字符串输出  
return new TypedInput(`"Result: " + ${input}`, TYPE_STRING);

// 布尔输出
return new TypedInput(`${input} > 0`, TYPE_BOOLEAN);
```

## 错误处理

编译扩展应包含适当的错误处理：

### 编译错误
```javascript
try {
  const input = this.descendInput(node.INPUT).asNumber();
  return new TypedInput(`Math.sqrt(${input})`, TYPE_NUMBER);
} catch (error) {
  // 回退到安全默认值
  return new TypedInput(`0`, TYPE_NUMBER);
}
```

### 运行时验证
```javascript
// 生成带运行时验证的代码
this.source += `vm.runtime.visualReport("${b.id}", 
  ${input} >= 0 ? Math.sqrt(${input}) : 0)\n`;
```

## 最佳实践

### 命名规范
- 对积木操作码使用一致的命名（`extension_blockname`）
- 使用描述性的种类名称（`extension.blockname`）
- 在修补 ID 中包含扩展名称以避免冲突

### 性能考虑
- 生成最小、高效的 JavaScript 代码
- 避免不必要的类型转换
- 使用适当的输入方法（类型无关时使用 `asRaw()`）
- 尽可能缓存昂贵的计算

### 兼容性
- 始终为非编译环境提供回退函数
- 使用不同的输入类型和边缘情况测试
- 优雅地处理未定义或无效的输入

此结构为创建强大的编译扩展提供了基础，这些扩展与 Bilup 的编译系统无缝集成，同时保持兼容性和性能。
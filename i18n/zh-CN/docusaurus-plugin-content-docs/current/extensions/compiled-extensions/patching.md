---
title: 修补编译器
sidebar_position: 3
---

# 修补编译器

编译扩展的核心机制是修补 Bilup 的编译器以注入自定义代码生成逻辑。此过程涉及修改三个关键编译器阶段来处理扩展积木。

## 理解编译管道

Bilup 的编译器通过多个阶段转换 Scratch 积木：

1. **积木解析**：处理原始积木数据
2. **脚本树生成**：将积木组织成树结构
3. **IR 生成**：将树转换为中间表示
4. **JavaScript 生成**：生成最终的 JavaScript 代码

编译扩展挂钩到阶段 2 和 4，跳过 IR 阶段以进行直接优化。

## 修补实现策略

### 安全修补模式

修补系统确保多个扩展可以共存而不冲突：

```javascript
const PATCHES_ID = 'myextension_patches';

const cst_patch = (obj, functions) => {
  // 防止重复修补
  if (obj[PATCHES_ID]) return;
  obj[PATCHES_ID] = {};
  
  for (const name in functions) {
    const original = obj[name];
    obj[PATCHES_ID][name] = obj[name];
    
    if (original) {
      // 包装现有函数
      obj[name] = function(...args) {
        const callOriginal = (...args) => original.call(this, ...args);
        return functions[name].call(this, callOriginal, ...args);
      };
    } else {
      // 创建新函数
      obj[name] = function(...args) {
        return functions[name].call(this, () => {}, ...args);
      };
    }
  }
};
```

此模式在添加扩展特定行为的同时保留原始功能。

## 脚本树生成修补

脚本树生成器识别积木并将其转换为结构化格式以供编译。

### 处理不同的积木类型

```javascript
cst_patch(ScriptTreeGenerator.prototype, {
  descendStackedBlock(fn, block, ...args) {
    switch (block.opcode) {
      // 命令积木（帽子/堆叠积木）
      case 'myextension_command':
        return {
          block,
          kind: 'myextension.command',
          INPUT1: this.descendInputOfBlock(block, 'INPUT1'),
          INPUT2: this.descendInputOfBlock(block, 'INPUT2'),
        };
        
      // 布尔积木
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
      // 返回值积木
      case 'myextension_reporter':
        return {
          block,
          kind: 'myextension.reporter',
          VALUE: this.descendInputOfBlock(block, 'VALUE'),
        };
        
      // 布尔返回值
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

### 输入处理

`descendInputOfBlock` 方法处理积木输入并处理不同的连接类型：

- **直接值**：直接输入的数字、字符串、布尔值
- **积木连接**：其他积木的输出
- **变量引用**：对变量或列表的引用
- **下拉选择**：菜单选项

## JavaScript 生成修补

JavaScript 生成器为每个积木生成最终的可执行代码。

### 命令积木实现

命令积木执行操作但不返回值：

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

### 返回值积木实现

返回值积木的返回值并必须指定其类型：

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

## 高级修补技术

### 条件代码生成

根据输入类型或值生成不同的代码：

```javascript
case 'myextension.smartOperation':
  const input = this.descendInput(node.INPUT);
  
  if (input instanceof ConstantInput) {
    // 优化常量值
    const value = input.constantValue;
    if (typeof value === 'number') {
      return new TypedInput(`${value * 2}`, TYPE_NUMBER);
    }
  }
  
  // 一般情况
  const inputCode = input.asNumber();
  return new TypedInput(`(${inputCode} * 2)`, TYPE_NUMBER);
```

### 生成代码中的错误处理

在生成的 JavaScript 中包含运行时错误检查：

```javascript
case 'myextension.safeDivision':
  const dividend = this.descendInput(node.DIVIDEND).asNumber();
  const divisor = this.descendInput(node.DIVISOR).asNumber();
  
  return new TypedInput(
    `(${divisor} !== 0 ? ${dividend} / ${divisor} : 0)`,
    TYPE_NUMBER
  );
```

### 性能优化

#### 内联常量操作
```javascript
case 'myextension.power':
  const base = this.descendInput(node.BASE);
  const exponent = this.descendInput(node.EXPONENT);
  
  // 优化常见情况
  if (exponent instanceof ConstantInput) {
    switch (exponent.constantValue) {
      case 2:
        return new TypedInput(`(${base.asNumber()} * ${base.asNumber()})`, TYPE_NUMBER);
      case 0.5:
        return new TypedInput(`Math.sqrt(${base.asNumber()})`, TYPE_NUMBER);
    }
  }
  
  // 一般情况
  return new TypedInput(`Math.pow(${base.asNumber()}, ${exponent.asNumber()})`, TYPE_NUMBER);
```

#### 已知迭代次数的循环展开
```javascript
case 'myextension.repeat':
  const count = this.descendInput(node.COUNT);
  
  if (count instanceof ConstantInput && count.constantValue <= 10) {
    // 展开小循环
    let code = '';
    for (let i = 0; i < count.constantValue; i++) {
      code += this.descendSubstack(node.SUBSTACK);
    }
    this.source += code;
    return;
  }
  
  // 对于较大计数使用常规循环
  const countCode = count.asNumber();
  this.source += `for (let i = 0; i < ${countCode}; i++) {\n`;
  this.source += this.descendSubstack(node.SUBSTACK);
  this.source += '}\n';
  return;
```

## 调试修补问题

### 常见问题和解决方案

**无限递归**
- 始终为未处理的情况调用原始函数（`fn`）
- 仔细检查修补条件以避免循环调用

**类型不匹配**
- 使用适当的输入转换方法
- 在处理前验证输入类型
- 为意外类型提供回退

**缺少积木处理**
- 确保在两个阶段中处理所有积木操作码
- 使用各种积木组合和嵌套级别进行测试

### 开发测试

为不同场景创建测试用例：

```javascript
// 测试常量优化
case 'myextension.test':
  const input = this.descendInput(node.INPUT);
  console.log('Input type:', input.constructor.name);
  console.log('Input value:', input instanceof ConstantInput ? input.constantValue : 'dynamic');
  
  // 您的实现在这里
```

修补编译器需要仔细关注细节和彻底测试，但它为 Scratch 扩展实现了前所未有的性能优化。
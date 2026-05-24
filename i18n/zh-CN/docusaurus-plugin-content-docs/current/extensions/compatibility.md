---
hide_table_of_contents: true
---

# 保持兼容性

一旦存在使用你的扩展的项目，至关重要的是你不要以破坏兼容性的方式更改扩展，因为这样做实际上会**损坏项目**。

## 绝不能更改的内容

### 扩展 ID 绝不能更改

```javascript
  getInfo() {
    return {
      // highlight-start
      // 此内容绝不能更改
      id: 'fetch'
      // highlight-end
      // ...
    };
  }
```

### 积木 opcode 和类型绝不能更改

相反，创建一个新积木并将旧积木标记为 `hideFromPalette: true`。

通常可以安全地将 blockType 从 REPORTER 更改为 BOOLEAN，或者从 HAT 更改为 EVENT，但将 HAT 转换为 BOOLEAN 会有问题。

```javascript
  getInfo() {
    return {
      // ...
      blocks: [
        {
          // highlight-start
          // 这些内容绝不能更改
          blockType: Scratch.BlockType.REPORTER,
          opcode: "fetch",
          // highlight-end
          // ...
        }
      ]
    };
  }
```

### 积木绝不能被移除

相反，创建一个新积木并将旧积木标记为 `hideFromPalette: true`。

```javascript
  getInfo() {
    return {
      // ...
      blocks: [
        // highlight-start
        // 此内容绝不能被删除
        {
          opcode: "old",
          hideFromPalette: true
          // highlight-end
          // ...
        }
      ]
    };
  }
```

### 参数 ID 和类型绝不能更改或移除

```javascript
  getInfo() {
    return {
      // ...
      blocks: [
        {
          // highlight-start
          // 参数 ID "INPUT" 绝不能更改或移除
          text: "block [INPUT]",
          arguments: {
            INPUT: {
              type: Scratch.ArgumentType.REPORTER,
              // highlight-end
              // ...
            }
          },
          // ...
        }
      ]
    };
  }
```

### 绝不能向现有积木添加参数

相反，创建一个新积木并将旧积木标记为 `hideFromPalette: true`。新积木可以基于旧积木重新实现：

```javascript
  getInfo() {
    return {
      // ...
      blocks: [
        {
          blockType: Scratch.BlockType.REPORTER,
          id: "oldBlock",
          text: "old [INPUT1]",
          arguments: {
            INPUT1: { /* ... */ }
          },
          hideFromPalette: true
        },
        {
          blockType: Scratch.BlockType.REPORTER,
          opcode: "newBlock",
          text: "new [INPUT1] [INPUT2]",
          arguments: {
            INPUT1: { /* ... */ },
            INPUT2: { /* ... */ }
          }
        }
      ]
    };
  }
  oldBlock(args) {
    return this.newBlock({
      ...args,
      INPUT2: "Default value"
    });
  }
  newBlock(args) {
    // ...
  }
```

### 不要修改 isTerminal

如果 COMMAND 积木还没有 `isTerminal: true`，不要添加它，因为这样做会导致连接在其下方的现有项目积木断裂。相反，创建一个新积木并可选地隐藏旧积木。

### 不要修改 acceptReporters

将输入菜单转换为字段菜单(反之亦然)是行不通的，会损坏项目。请创建一个新菜单和积木。

### 不要大幅改变积木行为

微小的错误修复通常是可以的，但重大更改可能会破坏项目。这有点难以量化；确保更改不会破坏项目的最佳方法是进行广泛测试。

## 可以更改的内容

你可以随时更改扩展元数据的这些部分：

- name
- docsURI
- color1, color2, color3
- menuIconURI 和 blockIconURI

你可以随时更改积木和参数的这些部分：

- text，只要它包含相同的参数(更改参数顺序是安全的)
- disableMonitor(启用 true 只隐藏复选标记，不删除现有监视器)
- hideFromPalette
- filter(添加 filter 只隐藏在调色板中，不删除现有积木)
- defaultValue
- 图像输入中的 dataURI 和 flipRTL

对于菜单，你可以随时更改 `text`，但不应该在没有仔细考虑的情况下更改 `value`。添加菜单项总是可以的，但删除菜单项是危险的。

## 如果需要破坏兼容性怎么办?

有时候除了破坏向后兼容性之外别无选择。在这种情况下，你应该**创建一个全新的扩展，使用完全新的 ID**，并保持旧版本不变。

例如，如果你的扩展 `fetch` 需要完全重新设计，你可以创建一个 ID 为 `fetch2` 的新扩展。

## 下一步

接下来，让我们学习[如何与世界分享你的扩展](./share)。
---
title: 扩展 API
sidebar_position: 3
---

# 扩展 API

扩展 API 允许开发者创建与 Bilup 中的 Scratch 编程环境集成的自定义积木和功能。

## 概述

Bilup 中的扩展提供：
- 具有独特功能的自定义积木
- 与外部服务和硬件的集成
- 超越标准 Scratch 积木的高级编程结构
- 自定义积木类别和组织

## 基本扩展结构

```javascript
// 基本扩展模板
class MyExtension {
  getInfo() {
    return {
      id: 'myextension',
      name: '我的扩展',
      blocks: [
        {
          opcode: 'myBlock',
          blockType: Scratch.BlockType.COMMAND,
          text: '用 [VALUE] 做某事',
          arguments: {
            VALUE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'hello'
            }
          }
        }
      ]
    };
  }

  myBlock(args) {
    console.log('用以下内容做某事:', args.VALUE);
  }
}

Scratch.extensions.register(new MyExtension());
```

## 积木类型

### 命令积木
执行操作但不返回值：

```javascript
{
  opcode: 'myCommand',
  blockType: Scratch.BlockType.COMMAND,
  text: '执行命令 [INPUT]'
}
```

### 报告积木
返回可在其他积木中使用的值：

```javascript
{
  opcode: 'myReporter',
  blockType: Scratch.BlockType.REPORTER,
  text: '从 [SOURCE] 获取值'
}
```

### 布尔积木
返回 true/false 值用于条件逻辑：

```javascript
{
  opcode: 'myBoolean',
  blockType: Scratch.BlockType.BOOLEAN,
  text: '[CONDITION] 是否为真?'
}
```

### 帽子积木
在特定事件发生时触发脚本：

```javascript
{
  opcode: 'myHat',
  blockType: Scratch.BlockType.HAT,
  text: '当某事发生时'
}
```

## 参数类型

```javascript
arguments: {
  STRING_ARG: {
    type: Scratch.ArgumentType.STRING,
    defaultValue: 'hello world'
  },
  NUMBER_ARG: {
    type: Scratch.ArgumentType.NUMBER,
    defaultValue: 42
  },
  BOOLEAN_ARG: {
    type: Scratch.ArgumentType.BOOLEAN
  },
  COLOR_ARG: {
    type: Scratch.ArgumentType.COLOR,
    defaultValue: '#ff0000'
  },
  ANGLE_ARG: {
    type: Scratch.ArgumentType.ANGLE,
    defaultValue: 90
  }
}
```

## 高级功能

### 自定义菜单
为积木参数创建下拉菜单：

```javascript
{
  opcode: 'selectOption',
  text: '选择 [OPTION]',
  arguments: {
    OPTION: {
      type: Scratch.ArgumentType.STRING,
      menu: 'myMenu'
    }
  }
}

// 在 getInfo() 中定义菜单
menus: {
  myMenu: {
    acceptReporters: true,
    items: [
      '选项 1',
      '选项 2',
      '选项 3'
    ]
  }
}
```

### 异步操作
处理 Promise 和异步操作：

```javascript
async myAsyncBlock(args) {
  try {
    const result = await fetch(args.URL);
    const data = await result.json();
    return data.value;
  } catch (error) {
    console.error('获取数据失败:', error);
    return '';
  }
}
```

## 最佳实践

1. **错误处理**：始终包含适当的错误处理
2. **性能**：避免在积木执行中阻塞操作
3. **用户体验**：提供清晰的积木文本和有用的默认值
4. **兼容性**：在不同项目类型和场景中测试

## 相关文档

- [开发扩展指南](../extensions/introduction)
- [VM API 参考](./vm-api)
- [扩展开发示例](../extensions/hello-world)
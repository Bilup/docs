---
title: Extension API
sidebar_position: 3
---

# Extension API

The Extension API allows developers to create custom blocks and functionality that integrates with the Scratch programming environment in MistWarp.

## Overview

Extensions in MistWarp provide:
- Custom blocks with unique functionality
- Integration with external services and hardware
- Advanced programming constructs beyond standard Scratch blocks
- Custom block categories and organization

## Basic Extension Structure

```javascript
// Basic extension template
class MyExtension {
  getInfo() {
    return {
      id: 'myextension',
      name: 'My Extension',
      blocks: [
        {
          opcode: 'myBlock',
          blockType: Scratch.BlockType.COMMAND,
          text: 'do something with [VALUE]',
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
    console.log('Doing something with:', args.VALUE);
  }
}

Scratch.extensions.register(new MyExtension());
```

## Block Types

### Command Blocks
Execute actions without returning values:

```javascript
{
  opcode: 'myCommand',
  blockType: Scratch.BlockType.COMMAND,
  text: 'execute command [INPUT]'
}
```

### Reporter Blocks
Return values that can be used in other blocks:

```javascript
{
  opcode: 'myReporter',
  blockType: Scratch.BlockType.REPORTER,
  text: 'get value from [SOURCE]'
}
```

### Boolean Blocks
Return true/false values for conditional logic:

```javascript
{
  opcode: 'myBoolean',
  blockType: Scratch.BlockType.BOOLEAN,
  text: 'is [CONDITION] true?'
}
```

### Hat Blocks
Trigger scripts when specific events occur:

```javascript
{
  opcode: 'myHat',
  blockType: Scratch.BlockType.HAT,
  text: 'when something happens'
}
```

## Argument Types

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

## Advanced Features

### Custom Menus
Create dropdown menus for block arguments:

```javascript
{
  opcode: 'selectOption',
  text: 'choose [OPTION]',
  arguments: {
    OPTION: {
      type: Scratch.ArgumentType.STRING,
      menu: 'myMenu'
    }
  }
}

// Define menu in getInfo()
menus: {
  myMenu: {
    acceptReporters: true,
    items: [
      'option 1',
      'option 2',
      'option 3'
    ]
  }
}
```

### Asynchronous Operations
Handle promises and async operations:

```javascript
async myAsyncBlock(args) {
  try {
    const result = await fetch(args.URL);
    const data = await result.json();
    return data.value;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return '';
  }
}
```

## Best Practices

1. **Error Handling**: Always include proper error handling
2. **Performance**: Avoid blocking operations in block execution
3. **User Experience**: Provide clear block text and helpful defaults
4. **Compatibility**: Test across different project types and scenarios

## Related Documentation

- [Development Extensions Guide](../extensions/introduction)
- [VM API Reference](./vm-api)
- [Extension Development Examples](../extensions/hello-world)

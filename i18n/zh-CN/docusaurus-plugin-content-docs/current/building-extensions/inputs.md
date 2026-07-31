---
title: 处理输入
sidebar_position: 3
---

# 处理输入

大多数积木将一个或多个值作为输入（也称为参数）。这里有一个报告两个值是否*严格*相等的积木，因此与 Scratch 的 `=` 积木不同，它将 `"a"` 和 `"A"` 视为不同（[下载](/example-extensions/strict-equality.js)）：

```js
class StrictEqualityExtension {
  getInfo() {
    return {
      id: 'strictequalityexample',
      name: 'Strict Equality',
      blocks: [
        {
          opcode: 'strictlyEquals',
          blockType: Scratch.BlockType.BOOLEAN,
          text: '[ONE] strictly equals [TWO]',
          arguments: {
            ONE: {
              type: Scratch.ArgumentType.STRING
            },
            TWO: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Second value'
            }
          }
        }
      ]
    };
  }

  strictlyEquals(args) {
    return args.ONE === args.TWO;
  }
}
Scratch.extensions.register(new StrictEqualityExtension());
```

## 声明参数

向积木添加一个 `arguments` 对象。每个键是一个参数。键名可以是您喜欢的任何格式（全大写是常见约定）。每个参数通常设置：

| 字段 | 类型 | 描述 |
|:-:|:-:|:--|
| `type` | `Scratch.ArgumentType.*` | 输入的形状以及默认文本框接受的内容。这只是编辑器的提示；您的代码收到的值仍然可以是任何类型。 |
| `defaultValue` | string | 可选。在积木区中预填的值。不要设置在布尔输入上。 |
| `menu` | string | 将输入变成下拉框。下面介绍。 |

参数类型：

| 值 | 接受 | 示例 |
|:-:|:--|:--|
| `Scratch.ArgumentType.STRING` | 任何文本 | 苹果, 123, true |
| `Scratch.ArgumentType.NUMBER` | 一个数字 | 123 |
| `Scratch.ArgumentType.BOOLEAN` | 一个布尔输入槽；拒绝放入非布尔值 | true |
| `Scratch.ArgumentType.COLOR` | 十六进制颜色 | #ff4c4c |
| `Scratch.ArgumentType.ANGLE` | 方向表盘（0 = 上，90 = 右，顺时针增加） | 90 |
| `Scratch.ArgumentType.MATRIX` | 5x5 开/关网格 | 1110101010... |
| `Scratch.ArgumentType.NOTE` | 钢琴音符选择器 | 60 |
| `Scratch.ArgumentType.COSTUME` | 当前角色中的造型名称 | 造型1 |
| `Scratch.ArgumentType.SOUND` | 当前角色中的声音名称 | 录制1 |
| `Scratch.ArgumentType.IMAGE` | 内联图像，不是输入（请参阅[杂项 API](/building-extensions/assorted-apis)） | 不适用 |

## 在积木中放置参数

Bilup 无法猜测每个输入在标签中的位置，因此您在 `text` 中用 `[参数名]` 标记它。每个参数必须在 `text` 中恰好出现一次。顺序无关紧要。

积木运行时，您的函数将接收一个对象作为第一个参数，其中每个参数都有一个属性。习惯上叫它 `args`，或解构它：

```js
// 使用 args.X
goto(args) {
  console.log(args.X, args.Y);
}

// 或解构
goto({X, Y}) {
  console.log(X, Y);
}
```

参数的值可以是字符串、数字或布尔值，**与声明的 `type` 无关**。类型是对编辑器的建议，绝不是保证。您的代码必须自己转换值，例如用 [`Scratch.Cast`](/building-extensions/assorted-apis#scratchcast)。

## 静态菜单

要给输入一个固定选择的下拉框，将其 `type` 设置为 `Scratch.ArgumentType.STRING`，添加一个命名菜单的 `menu`，并在 `menus` 对象中定义该菜单（[下载](/example-extensions/strings-1.js)）：

```js
class Strings1 {
  getInfo() {
    return {
      id: 'strings1example',
      name: 'Encoding',
      blocks: [
        {
          opcode: 'convert',
          blockType: Scratch.BlockType.REPORTER,
          text: 'convert [TEXT] to [FORMAT]',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Apple'
            },
            FORMAT: {
              type: Scratch.ArgumentType.STRING,
              menu: 'FORMAT_MENU'
            }
          }
        }
      ],
      menus: {
        FORMAT_MENU: {
          acceptReporters: true,
          items: ['uppercase', 'lowercase']
        }
      }
    };
  }

  convert(args) {
    // TEXT 可能是数字或布尔值，所以在对它调用字符串方法
    // 之前先转换为字符串。
    if (args.FORMAT === 'uppercase') {
      return args.TEXT.toString().toUpperCase();
    } else {
      return args.TEXT.toString().toLowerCase();
    }
  }
}
Scratch.extensions.register(new Strings1());
```

每个菜单是一个带有以下内容的对象：

| 字段 | 类型 | 描述 |
|:-:|:-:|:--|
| `items` | array | 字符串，或 `{text, value}` 对象（见下文）。不能为空。 |
| `acceptReporters` | boolean | 积木是否可以放入菜单。几乎总是将其设置为 `true`。 |

这里有一个重要区别。`acceptReporters: true` 的菜单是一个**输入**：用户可以向其中放入任何报告积木。`acceptReporters: false` 的菜单是一个**字段**：它只能始终是固定字符串之一。您几乎总是想要一个输入。唯一常见的例外是[事件帽子积木](/building-extensions/hats)，它们只支持字段菜单。

::::warning
在字段和输入之间切换菜单（更改 `acceptReporters`）是向后不兼容的更改，会损坏现有项目。提前决定。请参阅[保持兼容性](/building-extensions/compatibility)。
::::

将菜单直接设置为数组（而不是对象）会隐式地使它成为字段。避免这样做；总是使用带 `acceptReporters: true` 的对象形式。

## 分离显示文本和值

有时下拉框中显示的标签应该与您的代码收到的值不同。对这些项目使用 `{text, value}` 对象（[下载](/example-extensions/strings-2.js)）：

```js
menus: {
  FORMAT_MENU: {
    acceptReporters: true,
    items: [
      { text: 'UPPERCASE', value: 'up' },
      { text: 'lowercase', value: 'low' }
    ]
  }
}
```

下拉框显示"UPPERCASE"，但积木收到 `"up"`。

## 练习

1. 添加一个像 Scratch 的 `连接` 积木一样将两个参数连接成一个字符串的积木。将两者都转换为字符串，使 `连接 ((1 + 2)) ((3 + 4))` 得到 `"37"`，而不是 10。
2. 添加一个带数字输入和"奇"、"偶"菜单的布尔积木，按菜单所说的报告数字是奇数还是偶数。

## 下一步

到目前为止积木几乎立即完成。接下来，[如果一个积木需要等待某些东西](/building-extensions/async)，比如网络请求呢？

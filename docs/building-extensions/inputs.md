---
title: Dealing with inputs
sidebar_position: 3
---

# Dealing with inputs

Most blocks take one or more values as input (also called arguments or parameters). Here is a block that reports whether two values are *strictly* equal, so unlike Scratch's `=` block it treats `"a"` and `"A"` as different ([download](/example-extensions/strict-equality.js)):

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

## Declaring arguments

Add an `arguments` object to the block. Each key is one argument. The key name can be any format you like (all-caps is a common convention). Each argument commonly sets:

| Field | Type | Description |
|:-:|:-:|:--|
| `type` | `Scratch.ArgumentType.*` | The shape of the input and what the default text box accepts. This is only a hint for the editor; the value your code receives can still be any type. |
| `defaultValue` | string | Optional. The value pre-filled in the palette. Do not set it on boolean inputs. |
| `menu` | string | Turns the input into a dropdown. Covered below. |

Argument types:

| Value | Accepts | Example |
|:-:|:--|:--|
| `Scratch.ArgumentType.STRING` | Any text | apple, 123, true |
| `Scratch.ArgumentType.NUMBER` | A number | 123 |
| `Scratch.ArgumentType.BOOLEAN` | A boolean input slot; resists dropping non-booleans in | true |
| `Scratch.ArgumentType.COLOR` | A hex color | #ff4c4c |
| `Scratch.ArgumentType.ANGLE` | A direction dial (0 = up, 90 = right, increases clockwise) | 90 |
| `Scratch.ArgumentType.MATRIX` | A 5x5 on/off grid | 1110101010... |
| `Scratch.ArgumentType.NOTE` | A piano note picker | 60 |
| `Scratch.ArgumentType.COSTUME` | Costume names in the current sprite | costume1 |
| `Scratch.ArgumentType.SOUND` | Sound names in the current sprite | recording1 |
| `Scratch.ArgumentType.IMAGE` | An inline image, not an input (see [Assorted APIs](/building-extensions/assorted-apis)) | N/A |

## Placing arguments in the block

MistWarp cannot guess where each input goes in the label, so you mark it in `text` with `[ARGUMENT_NAME]`. Each argument must appear in `text` exactly once. Order does not matter.

When the block runs, your function receives an object as its first parameter with a property for each argument. It is conventional to call it `args`, or to destructure it:

```js
// Using args.X
goto(args) {
  console.log(args.X, args.Y);
}

// Or destructuring
goto({X, Y}) {
  console.log(X, Y);
}
```

The value of an argument may be a string, number, or boolean **regardless of the declared `type`**. The type is a suggestion for the editor, never a guarantee. Your code must convert values itself, for example with [`Scratch.Cast`](/building-extensions/assorted-apis#scratchcast).

## Static menus

To give an input a dropdown of fixed choices, set its `type` to `Scratch.ArgumentType.STRING`, add a `menu` naming the menu, and define that menu in a `menus` object ([download](/example-extensions/strings-1.js)):

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
    // TEXT could be a number or boolean, so convert to a string
    // before calling string methods on it.
    if (args.FORMAT === 'uppercase') {
      return args.TEXT.toString().toUpperCase();
    } else {
      return args.TEXT.toString().toLowerCase();
    }
  }
}
Scratch.extensions.register(new Strings1());
```

Each menu is an object with:

| Field | Type | Description |
|:-:|:-:|:--|
| `items` | array | Strings, or `{text, value}` objects (see below). Must not be empty. |
| `acceptReporters` | boolean | Whether blocks can be dropped into the menu. Almost always set this to `true`. |

There is an important distinction here. A menu with `acceptReporters: true` is an **input**: the user can drop any reporter block into it. A menu with `acceptReporters: false` is a **field**: it can only ever be one of the fixed strings. You almost always want an input. The only common exception is [event hat blocks](/building-extensions/hats), which only support field menus.

:::warning
Switching a menu between a field and an input (changing `acceptReporters`) is a backward-incompatible change that corrupts existing projects. Decide up front. See [Maintaining compatibility](/building-extensions/compatibility).
:::

Setting a menu directly to an array (instead of an object) implicitly makes it a field. Avoid that; always use the object form with `acceptReporters: true`.

## Separate display text and value

Sometimes the label shown in the dropdown should differ from the value your code receives. Use `{text, value}` objects for those items ([download](/example-extensions/strings-2.js)):

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

The dropdown shows "UPPERCASE", but the block receives `"up"`.

## Exercises

1. Add a block that joins two arguments into one string like Scratch's `join` block. Cast both to strings so `join ((1 + 2)) ((3 + 4))` gives `"37"`, not `10`.
2. Add a boolean block with a number input and a menu of "odd" and "even" that reports whether the number is odd or even, as the menu says.

## Next steps

So far blocks finish almost instantly. Next, [what if a block needs to wait for something](/building-extensions/async), like a network request?

---
title: 處理輸入
sidebar_position: 3
---

# 處理輸入

大多數積木將一個或多個值作為輸入（也稱為引數）。這裡有一個報告兩個值是否*嚴格*相等的積木，因此與 Scratch 的 `=` 積木不同，它將 `"a"` 和 `"A"` 視為不同（[下載](/example-extensions/strict-equality.js)）：

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

## 宣告引數

向積木新增一個 `arguments` 物件。每個鍵是一個引數。鍵名可以是您喜歡的任何格式（全大寫是常見約定）。每個引數通常設定：

| 欄位 | 型別 | 描述 |
|:-:|:-:|:--|
| `type` | `Scratch.ArgumentType.*` | 輸入的形狀以及預設文本框接受的內容。這只是編輯器的提示；您的程式碼收到的值仍然可以是任何型別。 |
| `defaultValue` | string | 可選。在積木區中預填的值。不要設定在布林輸入上。 |
| `menu` | string | 將輸入變成下拉框。下面介紹。 |

引數型別：

| 值 | 接受 | 示例 |
|:-:|:--|:--|
| `Scratch.ArgumentType.STRING` | 任何文本 | 蘋果, 123, true |
| `Scratch.ArgumentType.NUMBER` | 一個數字 | 123 |
| `Scratch.ArgumentType.BOOLEAN` | 一個布林輸入槽；拒絕放入非布林值 | true |
| `Scratch.ArgumentType.COLOR` | 十六進位制顏色 | #ff4c4c |
| `Scratch.ArgumentType.ANGLE` | 方向錶盤（0 = 上，90 = 右，順時針增加） | 90 |
| `Scratch.ArgumentType.MATRIX` | 5x5 開/關網格 | 1110101010... |
| `Scratch.ArgumentType.NOTE` | 鋼琴音符選擇器 | 60 |
| `Scratch.ArgumentType.COSTUME` | 當前角色中的造型名稱 | 造型1 |
| `Scratch.ArgumentType.SOUND` | 當前角色中的聲音名稱 | 錄製1 |
| `Scratch.ArgumentType.IMAGE` | 內聯影像，不是輸入（請參閱[雜項 API](/building-extensions/assorted-apis)） | 不適用 |

## 在積木中放置引數

Bilup 無法猜測每個輸入在標籤中的位置，因此您在 `text` 中用 `[引數名]` 標記它。每個引數必須在 `text` 中恰好出現一次。順序無關緊要。

積木執行時，您的函式將接收一個物件作為第一個引數，其中每個引數都有一個屬性。習慣上叫它 `args`，或解構它：

```js
// 使用 args.X
goto(args) {
  console.log(args.X, args.Y);
}

// 或解構
goto({X, Y}) {
  console.log(X, Y);
}
```

引數的值可以是字串、數字或布林值，**與宣告的 `type` 無關**。型別是對編輯器的建議，絕不是保證。您的程式碼必須自己轉換值，例如用 [`Scratch.Cast`](/building-extensions/assorted-apis#scratchcast)。

## 靜態選單

要給輸入一個固定選擇的下拉框，將其 `type` 設定為 `Scratch.ArgumentType.STRING`，新增一個命名選單的 `menu`，並在 `menus` 物件中定義該選單（[下載](/example-extensions/strings-1.js)）：

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
    // TEXT 可能是數字或布林值，所以在對它呼叫字串方法
    // 之前先轉換為字串。
    if (args.FORMAT === 'uppercase') {
      return args.TEXT.toString().toUpperCase();
    } else {
      return args.TEXT.toString().toLowerCase();
    }
  }
}
Scratch.extensions.register(new Strings1());
```

每個選單是一個帶有以下內容的物件：

| 欄位 | 型別 | 描述 |
|:-:|:-:|:--|
| `items` | array | 字串，或 `{text, value}` 物件（見下文）。不能為空。 |
| `acceptReporters` | boolean | 積木是否可以放入選單。幾乎總是將其設定為 `true`。 |

這裡有一個重要區別。`acceptReporters: true` 的選單是一個**輸入**：使用者可以向其中放入任何報告積木。`acceptReporters: false` 的選單是一個**欄位**：它只能始終是固定字串之一。您幾乎總是想要一個輸入。唯一常見的例外是[事件帽子積木](/building-extensions/hats)，它們只支援欄位選單。

::::warning
在欄位和輸入之間切換選單（更改 `acceptReporters`）是向後不相容的更改，會損壞現有專案。提前決定。請參閱[保持相容性](/building-extensions/compatibility)。
::::

將選單直接設定為陣列（而不是物件）會隱式地使它成為欄位。避免這樣做；總是使用帶 `acceptReporters: true` 的物件形式。

## 分離顯示文本和值

有時下拉框中顯示的標籤應該與您的程式碼收到的值不同。對這些專案使用 `{text, value}` 物件（[下載](/example-extensions/strings-2.js)）：

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

下拉框顯示"UPPERCASE"，但積木收到 `"up"`。

## 練習

1. 新增一個像 Scratch 的 `連線` 積木一樣將兩個引數連線成一個字串的積木。將兩者都轉換為字串，使 `連線 ((1 + 2)) ((3 + 4))` 得到 `"37"`，而不是 10。
2. 新增一個帶數字輸入和"奇"、"偶"選單的布林積木，按選單所說的報告數字是奇數還是偶數。

## 下一步

到目前為止積木幾乎立即完成。接下來，[如果一個積木需要等待某些東西](/building-extensions/async)，比如網路請求呢？

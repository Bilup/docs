---
title: 你好，世界！
sidebar_position: 2
---

# 你好，世界！

這裡有一個完整的擴充功能，它新增一個積木，一個返回"World!"的報告積木。將其儲存為 `hello-world.js`，放在您的[開發伺服器](/building-extensions/introduction)可以提供服務的位置（[下載](/example-extensions/hello-world.js)）。

```js
class HelloWorld {
  getInfo() {
    return {
      id: 'helloworld',
      name: 'It works!',
      blocks: [
        {
          opcode: 'hello',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Hello!'
        }
      ]
    };
  }

  hello() {
    return 'World!';
  }
}

Scratch.extensions.register(new HelloWorld());
```

在編輯器中載入它："新增擴充功能"，滾動到底部，"自訂擴充功能"，然後輸入您本地伺服器的 URL（或貼上程式碼 / 選擇檔案）。現在**不要**勾選"不進入沙箱執行擴充功能"。

片刻之後，一個名為"It works!"的擴展出現在積木區中。如果沒有，請開啟開發者控制台查詢錯誤。常見原因是 JavaScript 語法錯誤、執行時錯誤（兩者都顯示在控制台中），或廣告攔截器阻止了對 localhost 的請求。

現在讓我們按執行順序逐段瀏覽該檔案。

## 註冊

```js
Scratch.extensions.register(new HelloWorld());
```

`Scratch` 是 Bilup 交給每個擴充功能的全域物件。`Scratch.extensions.register` 是您的擴充功能告訴 Bilup 它存在的方式。類名（`HelloWorld`）無關緊要，也不需要唯一。

**恰好**呼叫一次 `register()`。如果您從不呼叫它，Bilup 會永遠等待您的擴充功能載入。如果您呼叫多次，行為是未定義的。

## getInfo()

```js
getInfo() {
  return {
    id: 'helloworld',
    name: 'It works!',
    blocks: [
      {
        opcode: 'hello',
        blockType: Scratch.BlockType.REPORTER,
        text: 'Hello!'
      }
    ]
  };
}
```

呼叫 `register()` 後，Bilup 會在您的物件上呼叫 `getInfo()` 來了解擴充功能。它必須返回一個描述擴充功能的物件：

| 欄位 | 型別 | 描述 |
|:-:|:-:|:--|
| `id` | string | 此擴充功能的唯一 ID。沒有兩個已載入的擴充功能可以共享一個 ID。只使用 `a-z` 和 `0-9`，不要用空格或符號。它成為每個積木內部操作碼的一部分，並且一旦專案使用它，就**絕不能更改**。 |
| `name` | string | 積木區中顯示的名稱。省略時預設為 `id`。 |
| `blocks` | array | 此擴充功能提供的積木。 |

每個積木物件通常具有：

| 欄位 | 型別 | 描述 |
|:-:|:-:|:--|
| `opcode` | string | 積木執行時執行的方法名。`opcode: 'hello'` 執行 `this.hello()`。在擴充功能內必須唯一。 |
| `blockType` | `Scratch.BlockType.*` | 積木的形狀和行為。見下文。 |
| `text` | string | 積木上顯示的標籤。引數佔位符放在這裡（下一頁）。 |
| `arguments` | object | 可選。[處理輸入](/building-extensions/inputs)中介紹。 |

常見的積木型別：

| 值 | 形狀 | 示例 |
|:-:|:--|:--|
| `Scratch.BlockType.COMMAND` | 堆疊積木，無返回值 | 移動 10 步 |
| `Scratch.BlockType.REPORTER` | 返回字串或數字的圓形積木 | x 座標 |
| `Scratch.BlockType.BOOLEAN` | 返回真/假的尖形積木 | 滑鼠按下? |
| `Scratch.BlockType.HAT` | 在條件上啟動指令碼 | 當響度 > 10 |
| `Scratch.BlockType.EVENT` | 在事件上啟動指令碼 | 當角色被點選時 |

`HAT` 和 `EVENT` 在[事件和帽子](/building-extensions/hats)中介紹。`CONDITIONAL` 和 `LOOP`（C 形積木）在[自訂 C 積木](/building-extensions/custom-c-blocks)中介紹。

## 積木函式

```js
hello() {
  return 'World!';
}
```

這是由 `opcode: 'hello'` 命名的方法。報告積木返回字串或數字；布林積木返回 `true` 或 `false`。不要返回 `null`、`undefined`、陣列或物件；這些不是有效的積木值，會導致問題。

## 快速迭代

更改檔案，然後重新載入編輯器頁面。有兩件事可以讓這更快：

- `?extension=` URL 引數會自動載入擴充功能。如果您的檔案在 `http://localhost:8080/hello-world.js`，開啟 `https://com.bilup.org/editor?extension=http://localhost:8080/hello-world.js` 來載入它，無需經過素材庫。
- 如果重新載入後更改沒有顯示，請使用瀏覽器的"硬重新整理"（忽略快取重新載入）。

## 練習

1. 將積木改為返回您最喜歡的數字而不是字串，並重命名積木文本以匹配。
2. 更改積木的操作碼（記住也要重新命名方法）。
3. 新增第二個 `blockType: Scratch.BlockType.BOOLEAN` 的積木，隨機返回 `true` 或 `false`。

## 下一步

接下來，[讓積木接受輸入](/building-extensions/inputs)。

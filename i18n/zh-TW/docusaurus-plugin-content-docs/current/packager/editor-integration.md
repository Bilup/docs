---
title: 編輯器整合
sidebar_position: 7
---

# 編輯器整合

Bilup 編輯器可以將當前專案直接交給打包器，因此您可以在一步之內從編輯到打包建置，而無需儲存和重新上傳檔案。在底層，這是編輯器和打包器之間的一次小型 `postMessage` 握手，本文件為工具開發者記錄了它。

## 握手

1. 編輯器在 `https://packager.bilup.org/?import_from=<編輯器來源>` 開啟打包器。
2. 打包器向編輯器回傳 `{ p4: { type: 'ready-for-import' } }`。
3. 編輯器回覆 `{ p4: { type: 'start-import' } }`，這樣打包器可以顯示載入狀態。
4. 編輯器匯出專案併發送 `{ p4: { type: 'finish-import', data, name } }`，傳輸 SB3 `ArrayBuffer`。
5. 如果匯出失敗，編輯器改為傳送 `{ p4: { type: 'cancel-import' } }`。

每條訊息都包裹在一個 `p4` 物件中。

## finish-import

```js
source.postMessage({
  p4: {
    type: 'finish-import',
    data: buffer,        // SB3 ArrayBuffer
    name: 'My Project.sb3'
  }
}, origin, [buffer]);    // buffer 被轉移，而不是複製
```

## 備註

- 編輯器只處理來源為 `https://packager.bilup.org` 的訊息。
- SB3 用 `vm.saveProjectSb3('arraybuffer')` 生成。
- 檔名是當前專案標題加 `.sb3` 字尾。

## 另請參閱

- [打包器概覽](/packager/overview)

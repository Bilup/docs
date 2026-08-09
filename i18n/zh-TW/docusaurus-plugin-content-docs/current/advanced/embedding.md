---
title: 嵌入
sidebar_position: 4
---

# 嵌入

您可以使用標準 `<iframe>` 將 Bilup 專案嵌入到任何網站中。嵌入只顯示舞臺和控制元件，沒有編輯器環繞。

```html
<iframe
  src="https://com.bilup.org/414716080/embed"
  width="482"
  height="412"
  frameborder="0"
  scrolling="no"
  allowfullscreen
></iframe>
```

將 `414716080` 替換為您的專案 ID。您可以選擇任意寬度和高度；播放器會自動調整大小。`482x412` 的 iframe 以不變形的 `480x360` 渲染舞臺（額外 52 畫素為控制欄留出空間）。嵌入具有透明背景，並在瀏覽器允許時提供全屏按鈕。

## Scratch 和 Bilup 專案

URL 中的 ID 可以是兩種專案之一：

- **Scratch 專案 ID**（純數字，如 `414716080`）嵌入在 Scratch 上共享的專案。
- **Bilup 社群專案 ID**（如 `p1784079025833421000VYnQRa`）嵌入在 Bilup 社群網站上共享的專案。這是專案頁面 URL 中的 ID，`https://com.bilup.org/project/p1784079025833421000VYnQRa`。

```html
<iframe src="https://com.bilup.org/p1784079025833421000VYnQRa/embed"></iframe>
```

兩者使用相同的 `/embed` 路徑、引數和下文描述的 postMessage API。

::::note
未共享的專案無法嵌入。請先分享專案，或者使用[Bilup 打包器](/packager/overview)打包後[嵌入打包檔案](/packager/embedding)。請參閱[未共享專案](/advanced/unshared-projects)。
::::

## URL 引數

所有[標準 URL 引數](/advanced/url-parameters)都適用於嵌入，另外還有幾個僅適用於嵌入的引數。

| 引數 | 作用 |
|-----------|--------------|
| `autoplay` | 專案載入後自動點選綠旗。 |
| `settings-button` | 在嵌入中新增進階設定按鈕。 |
| `fullscreen-background` | 設定全屏背景顏色。將 `#` 轉義為 `%23`。 |
| `addons` | 啟用特定外掛（見下文）。 |

```html
<iframe src="https://com.bilup.org/15832807/embed?autoplay&settings-button"></iframe>
```

聲音積木可能直到使用者與專案互動（例如點選）後才會播放。這是瀏覽器限制，不是 Bilup 可以繞過的，因此 autoplay 無法在載入時強制播放音訊。

### 嵌入中的外掛

嵌入預設不啟用任何外掛。`addons` 引數接受逗號分隔的外掛 ID 列表：

```
https://com.bilup.org/15832807/embed?addons=pause,gamepad,mute-project
```

嵌入中有用的外掛包括：

- `pause`（暫停按鈕）
- `mute-project`（靜音播放器）
- `remove-curved-stage-border`
- `drag-drop`（檔案拖放）
- `gamepad`（手柄支援）
- `clones`（克隆計數器）

隻影響編輯器的外掛在此處沒有效果。

## 響應式嵌入

要讓嵌入隨容器縮放，請將其包裹在帶內邊距的盒子中：

```html
<div style="position: relative; padding-bottom: 75%; height: 0;">
  <iframe
    src="https://com.bilup.org/123456789/embed"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen
  ></iframe>
</div>
```

`75%` 的內邊距提供匹配預設舞臺的 4:3 盒子。如果使用[自訂舞臺大小](/advanced/custom-stage-size)，請調整它。

## 執行時透過 postMessage 載入專案

宿主頁面可以不把專案 ID 放在 URL 中，而是在嵌入載入後將 SB3 傳送給它。這對於自訂載入器或專案來自專案 ID 之外的地方時非常有用。

傳送 `LOAD_SB3` 訊息：

```js
const iframe = document.getElementById('bilup-embed');
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3', // URL 字串、ArrayBuffer 或 Uint8Array
  title: '可選標題'
}, '*');
```

`data` 可以是：

- 嵌入將獲取的 **URL 字串**（必須支援 [CORS](/advanced/cors)），
- 原始 SB3 位元組的 **ArrayBuffer**，或
- 原始 SB3 位元組的 **Uint8Array**。

嵌入會回覆 `LOAD_SB3_RESPONSE` 訊息：

```js
window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg && msg.type === 'LOAD_SB3_RESPONSE') {
    // msg.status:  'success' 或 'error'
    // msg.message: 人類可讀的詳細資訊
    // msg.title:   您傳入的標題
    // msg.timestamp: 毫秒
    console.log(msg.status, msg.message);
  }
});
```

成功時 VM 會重啟並載入新專案。如果希望載入後自動啟動，請在嵌入 URL 中新增 `autoplay`。

出於安全考慮，嵌入只接受來自可信來源的 `LOAD_SB3`：同源頁面、`https://` 父頁面、用於本地測試的 `file://`，以及本地開發埠 `3000`、`8080` 和 `8601`。來自其他來源的訊息會被忽略。

## 安全

如果您根據使用者提供的資料建置嵌入連結，請對輸入進行清理。能夠注入任意 URL 引數的使用者可以改變嵌入的行為。您還可以新增 iframe `sandbox` 屬性進行縱深防禦：

```html
<iframe
  src="https://com.bilup.org/123456789/embed"
  sandbox="allow-scripts allow-same-origin allow-fullscreen"
></iframe>
```

## 當您需要更多控制

如果需要對載入螢幕、控制元件和單檔案打包進行控制，請使用[Bilup 打包器](/packager/overview)。打包專案也可以[嵌入](/packager/embedding)。

## 另請參閱

- [URL 引數](/advanced/url-parameters)
- [未共享專案](/advanced/unshared-projects)
- [打包器：嵌入](/packager/embedding)
- [CORS](/advanced/cors)

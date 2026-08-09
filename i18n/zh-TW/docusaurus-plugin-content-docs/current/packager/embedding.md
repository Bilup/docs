---
title: 嵌入
sidebar_position: 2
slug: /packager/embedding
---

# 嵌入打包專案

::::info
本頁講述嵌入[Bilup 打包器](/packager/overview)的輸出。如果您只是想嵌入共享專案而不打包它，請參閱[嵌入](/advanced/embedding)。
::::

當您將專案打包為 HTML 時，您會得到一個自包含的檔案，可以自己託管，並用 `<iframe>` 放入任何頁面：

```html
<iframe
  src="path_to_project.html"
  width="480"
  height="360"
  allowtransparency="true"
  frameborder="0"
  scrolling="no"
  allowfullscreen
></iframe>
```

`src` 取決於您如何匯出：

- **純 HTML**：單個 HTML 檔案的路徑。
- **Zip**：解壓縮後的 zip 中 `index.html` 的路徑。

如果您在打包器中啟用了螢幕控制元件（綠旗、停止、全屏），請在 `height` 上加上 `48`，這樣控制欄不會縮小舞臺。

因為打包專案只是您託管的檔案，嵌入它對未在 Scratch 上共享的專案也有效，與[託管嵌入播放器](/advanced/embedding)不同。

## 另請參閱

- [打包器概覽](/packager/overview)
- [嵌入共享專案](/advanced/embedding)

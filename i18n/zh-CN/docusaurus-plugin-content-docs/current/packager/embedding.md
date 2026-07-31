---
title: 嵌入
sidebar_position: 2
slug: /packager/embedding
---

# 嵌入打包项目

::::info
本页讲述嵌入[Bilup 打包器](/packager/overview)的输出。如果您只是想嵌入共享项目而不打包它，请参阅[嵌入](/advanced/embedding)。
::::

当您将项目打包为 HTML 时，您会得到一个自包含的文件，可以自己托管，并用 `<iframe>` 放入任何页面：

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

`src` 取决于您如何导出：

- **纯 HTML**：单个 HTML 文件的路径。
- **Zip**：解压后的 zip 中 `index.html` 的路径。

如果您在打包器中启用了屏幕控件（绿旗、停止、全屏），请在 `height` 上加上 `48`，这样控制栏不会缩小舞台。

因为打包项目只是您托管的文件，嵌入它对未在 Scratch 上共享的项目也有效，与[托管嵌入播放器](/advanced/embedding)不同。

## 另请参阅

- [打包器概览](/packager/overview)
- [嵌入共享项目](/advanced/embedding)

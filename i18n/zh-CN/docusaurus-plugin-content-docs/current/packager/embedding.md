---
slug: /packager/embedding
hide_table_of_contents: true
sidebar_label: 嵌入
---

# 嵌入打包器

:::info
此页面是关于 [Bilup 打包器](https://packager.bilup.org/) 的。如果你只是想要一种将 Scratch 项目轻松嵌入网站的方法，请参阅 [另一个嵌入页面](/embedding)。
:::

你可以将 Bilup 打包器的输出嵌入到另一个网站：

```html
<iframe src="path_to_project.html" width="480" height="360" allowtransparency="true" frameborder="0" scrolling="no" allowfullscreen></iframe>
```

根据你使用的环境、你存储项目的位置以及你命名的方式，`src` 属性会有所不同。

 - 如果你使用「纯 HTML」，它就是 HTML 文件的路径。
 - 如果你使用「Zip」，它是解压后的 ZIP 中包含的 `index.html` 文件的路径。

如果你启用了控制项，将 `height` 的值加 48 以避免舞台被缩小。

---
title: Embedding
sidebar_position: 2
slug: /packager/embedding
---

# Embedding a packaged project

:::info
This page is about embedding the output of the [MistWarp Packager](/packager/overview). If you just want to embed a shared project without packaging it, see [Embedding](/advanced/embedding) instead.
:::

When you package a project to HTML, you get a self-contained file you can host yourself and drop into any page with an `<iframe>`:

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

The `src` depends on how you exported:

- **Plain HTML:** the path to the single HTML file.
- **Zip:** the path to `index.html` inside the extracted zip.

If you enabled on-screen controls (green flag, stop, fullscreen) in the packager, add `48` to the `height` so the control bar does not shrink the stage.

Because a packaged project is just a file you host, embedding it works even for projects that are not shared on Scratch, unlike the [hosted embed player](/advanced/embedding).

## See also

- [Packager overview](/packager/overview)
- [Embedding shared projects](/advanced/embedding)

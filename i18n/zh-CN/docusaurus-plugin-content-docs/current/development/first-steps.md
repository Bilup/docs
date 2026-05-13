---
title: 第一步
sidebar_position: 3
---

# Bilup 品牌配置

本指南概述了如何为你的 Bilup 修改版配置品牌，包括重命名应用程序和自定义图标及链接。

## 重命名你的修改版

要重命名你的修改版，请在你 fork 的 Scratch GUI 仓库中的 `src/lib/constants/brand.js` 中更新 `APP_NAME` 属性：

```js
module.exports = {
    APP_NAME: 'YourModName',
    FEEDBACK_URL: 'https://scratch.mit.edu/users/username#comments',
    GITHUB_URL: 'https://github.com/YourModName'
};
```

你还可以更新 `FEEDBACK_URL` 和 `GITHUB_URL` 以指向你自己的反馈页面或 GitHub 仓库。
进行这些更改后，保存文件并重建项目以使更改生效。

## 更改图标

要更新你的修改版使用的图标：

1. 准备你的新图标作为 `.ico` 文件。
2. 导航到你 fork 的 Scratch GUI 中的 `static/` 目录。
3. 用你的新图标替换现有的 `favicon.ico` 文件。

确保新文件命名为 `favicon.ico`，以便正确识别。
替换文件后，重建项目以在浏览器中应用更改。
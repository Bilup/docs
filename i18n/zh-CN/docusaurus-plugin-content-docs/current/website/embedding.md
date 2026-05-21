---
slug: /embedding
hide_table_of_contents: true
---

# 嵌入

Bilup 可以使用标准 iframe 嵌入：

```html
<iframe src="https://editor.bilup.org/414716080/embed" width="482" height="412" frameborder="0" scrolling="no" allowfullscreen></iframe>
```

将 `414716080` 替换为你的项目 ID。你可以更改 iframe 的宽度和高度，玩家将自动调整大小以适应(482x412 将导致舞台以未失真的 480x360 渲染)。

嵌入的背景是透明的，在浏览器允许时会显示全屏按钮。

## 未分享的项目无法嵌入 {#unshared-projects}

未分享的项目 [无法在嵌入中显示](unshared-projects)。请确保你嵌入的项目是已分享的，或者使用 [Bilup 打包器](https://packager.bilup.org/) 代替。

## URL 参数 {#url-parameters}

所有 [标准 URL 参数](url-parameters.md) 都可用。你可以使用这些来控制用户名和其他内容。

还有一些仅在嵌入中可用的特殊参数：

### 自动播放 {#autoplay}

嵌入支持 `autoplay` 参数，这会在项目加载时自动点击绿旗。例如：https://editor.bilup.org/15832807/embed?autoplay

请注意，在用户与项目交互(例如点击)之前，声音积木可能无法工作。这是浏览器施加的限制。Bilup 无法解决此问题。

### 设置按钮 {#settings-button}

你可以选择使用 `settings-button` 参数在嵌入中启用设置按钮，它会打开一个类似于网站和编辑器中「高级设置」菜单的菜单。例如：https://editor.bilup.org/15832807/embed?autoplay&settings-button

### 全屏背景色 {#fullscreen-background}

在全屏模式之外，嵌入是透明的，因此你可以设置父元素的样式以更改背景色。

在全屏模式下，嵌入将使用白色或几乎黑色，这取决于用户的电脑是否配置为深色模式。

要覆盖此行为，请将 `fullscreen-background` 参数设置为 CSS 颜色值，如 `black` 或 `rgb(50,90,100)`。例如：https://editor.bilup.org/15832807/embed?fullscreen-background=yellow

你也可以使用十六进制颜色，如果用百分号编码转义 `#`：`%23abc123`。

### 插件 {#addons}

默认情况下，嵌入没有启用任何插件。这可以通过 `addons` 参数覆盖，它是一个要启用的插件 ID 的逗号分隔列表。例如：https://editor.bilup.org/15832807/embed?addons=pause,gamepad,mute-project

有用的插件及其 ID：

 - 「暂停按钮」是 `pause`
 - 「静音项目播放器模式」是 `mute-project`
 - 「移除弯曲舞台边框」是 `remove-curved-stage-border`
 - 「文件拖放」是 `drag-drop`
 - 「游戏手柄支持」是 `gamepad`
 - 「反转项目控制按钮顺序」是 `editor-buttons-reverse-order`
 - 「克隆计数器」是 `clones`

其他插件将不会对嵌入产生影响。

## 安全注意事项 {#security}

如果你使用用户提供的内容来生成嵌入链接，你应该清理任何参数，以确保用户不能提供任意的 URL 参数，因为其中一些可能导致意外行为。

## 需要更多控制?{#packager}

使用 [Bilup 打包器](https://packager.bilup.org/) 可以更好地控制加载屏幕和 UI。你也可以轻松地 [嵌入打包器的输出](/packager/embedding)。

## 捐赠 {#donations}

如果你在商业网站上使用 Bilup 嵌入，请考虑 [捐赠](/donate) 以支持托管和上游项目。❤️

## 许可证 {#license}

Bilup 采用 [GPLv3.0](https://github.com/Bilup/scratch-gui/blob/develop/LICENSE) 许可。我们认为，GPLv3.0 作品的 `<iframe>` 不会根据 GPLv3.0 创建衍生作品，而是创建「聚合作品」，其不需要遵守与衍生作品相同的要求。但是，我们不是律师，这不是法律建议。如果这对你很重要，请咨询律师。

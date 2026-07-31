---
title: 嵌入
sidebar_position: 4
---

# 嵌入

您可以使用标准 `<iframe>` 将 Bilup 项目嵌入到任何网站中。嵌入只显示舞台和控件，没有编辑器环绕。

```html
<iframe
  src="https://editor.bilup.org/414716080/embed"
  width="482"
  height="412"
  frameborder="0"
  scrolling="no"
  allowfullscreen
></iframe>
```

将 `414716080` 替换为您的项目 ID。您可以选择任意宽度和高度；播放器会自动调整大小。`482x412` 的 iframe 以不变形的 `480x360` 渲染舞台（额外 52 像素为控制栏留出空间）。嵌入具有透明背景，并在浏览器允许时提供全屏按钮。

## Scratch 和 Bilup 项目

URL 中的 ID 可以是两种项目之一：

- **Scratch 项目 ID**（纯数字，如 `414716080`）嵌入在 Scratch 上共享的项目。
- **Bilup 社区项目 ID**（如 `p1784079025833421000VYnQRa`）嵌入在 Bilup 社区网站上共享的项目。这是项目页面 URL 中的 ID，`https://editor.bilup.org/project/p1784079025833421000VYnQRa`。

```html
<iframe src="https://editor.bilup.org/p1784079025833421000VYnQRa/embed"></iframe>
```

两者使用相同的 `/embed` 路径、参数和下文描述的 postMessage API。

::::note
未共享的项目无法嵌入。请先分享项目，或者使用[Bilup 打包器](/packager/overview)打包后[嵌入打包文件](/packager/embedding)。请参阅[未共享项目](/advanced/unshared-projects)。
::::

## URL 参数

所有[标准 URL 参数](/advanced/url-parameters)都适用于嵌入，另外还有几个仅适用于嵌入的参数。

| 参数 | 作用 |
|-----------|--------------|
| `autoplay` | 项目加载后自动点击绿旗。 |
| `settings-button` | 在嵌入中添加高级设置按钮。 |
| `fullscreen-background` | 设置全屏背景颜色。将 `#` 转义为 `%23`。 |
| `addons` | 启用特定插件（见下文）。 |

```html
<iframe src="https://editor.bilup.org/15832807/embed?autoplay&settings-button"></iframe>
```

声音积木可能直到用户与项目交互（例如点击）后才会播放。这是浏览器限制，不是 Bilup 可以绕过的，因此 autoplay 无法在加载时强制播放音频。

### 嵌入中的插件

嵌入默认不启用任何插件。`addons` 参数接受逗号分隔的插件 ID 列表：

```
https://editor.bilup.org/15832807/embed?addons=pause,gamepad,mute-project
```

嵌入中有用的插件包括：

- `pause`（暂停按钮）
- `mute-project`（静音播放器）
- `remove-curved-stage-border`
- `drag-drop`（文件拖放）
- `gamepad`（手柄支持）
- `clones`（克隆计数器）

只影响编辑器的插件在此处没有效果。

## 响应式嵌入

要让嵌入随容器缩放，请将其包裹在带内边距的盒子中：

```html
<div style="position: relative; padding-bottom: 75%; height: 0;">
  <iframe
    src="https://editor.bilup.org/123456789/embed"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen
  ></iframe>
</div>
```

`75%` 的内边距提供匹配默认舞台的 4:3 盒子。如果使用[自定义舞台大小](/advanced/custom-stage-size)，请调整它。

## 运行时通过 postMessage 加载项目

宿主页面可以不把项目 ID 放在 URL 中，而是在嵌入加载后将 SB3 发送给它。这对于自定义加载器或项目来自项目 ID 之外的地方时非常有用。

发送 `LOAD_SB3` 消息：

```js
const iframe = document.getElementById('mistwarp-embed');
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3', // URL 字符串、ArrayBuffer 或 Uint8Array
  title: '可选标题'
}, '*');
```

`data` 可以是：

- 嵌入将获取的 **URL 字符串**（必须支持 [CORS](/advanced/cors)），
- 原始 SB3 字节的 **ArrayBuffer**，或
- 原始 SB3 字节的 **Uint8Array**。

嵌入会回复 `LOAD_SB3_RESPONSE` 消息：

```js
window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg && msg.type === 'LOAD_SB3_RESPONSE') {
    // msg.status:  'success' 或 'error'
    // msg.message: 人类可读的详细信息
    // msg.title:   您传入的标题
    // msg.timestamp: 毫秒
    console.log(msg.status, msg.message);
  }
});
```

成功时 VM 会重启并加载新项目。如果希望加载后自动启动，请在嵌入 URL 中添加 `autoplay`。

出于安全考虑，嵌入只接受来自可信来源的 `LOAD_SB3`：同源页面、`https://` 父页面、用于本地测试的 `file://`，以及本地开发端口 `3000`、`8080` 和 `8601`。来自其他来源的消息会被忽略。

## 安全

如果您根据用户提供的数据构建嵌入链接，请对输入进行清理。能够注入任意 URL 参数的用户可以改变嵌入的行为。您还可以添加 iframe `sandbox` 属性进行纵深防御：

```html
<iframe
  src="https://editor.bilup.org/123456789/embed"
  sandbox="allow-scripts allow-same-origin allow-fullscreen"
></iframe>
```

## 当您需要更多控制

如果需要对加载屏幕、控件和单文件打包进行控制，请使用[Bilup 打包器](/packager/overview)。打包项目也可以[嵌入](/packager/embedding)。

## 另请参阅

- [URL 参数](/advanced/url-parameters)
- [未共享项目](/advanced/unshared-projects)
- [打包器：嵌入](/packager/embedding)
- [CORS](/advanced/cors)

---
slug: /url-parameters
hide_table_of_contents: true
---

# URL 参数


:::note
## 只有那些"高级" URL 参数会在此处列出 {#only-hidden-url-parameters-are-listed-here}
Bilup 会自动将常见设置（如 Turbo 模式、FPS、高清画笔等）存储在 URL 中。此页面记录的是高级选项。
:::


## 用户名 {#username}

`username` 选项控制「用户名」积木的值。

https://editor.bilup.org/443603478?username=示例用户名

## 云变量服务器 {#cloud_host}

`cloud_host` 选项允许你修改 Bilup 将要连接到的云变量服务器，例如：

https://editor.bilup.org/12785898?cloud_host=wss://clouddata.bilup.org

在参数中包含 `ws://` 或 `wss://` 是可选的，但推荐包含。`wss://clouddata.bilup.org` 是 Bilup 使用的默认云数据服务器。不安全的 ws:// 服务器可能无法使用，因为 Bilup 使用 HTTPS。

无法使用此选项连接到 Scratch 的云变量服务器，因为它需要账户凭证，而 Bilup 无法支持。

## 自定义扩展 {#extension}

`extension` 选项可以从 URL 加载自定义扩展。请参阅 [自定义扩展](/extensions/introduction)。

<!-- 由于可能移除而注释 -->
<!--
## `scale` {#scale}

Controls the maximum relative scale of the player when in fullscreen mode.

https://editor.bilup.org/fullscreen?scale=2
-->

## 禁用编译器 {#nocompile}

`nocompile` 选项会关闭编译器。你可能不应该启用这个选项。

https://editor.bilup.org/?nocompile

## 项目 URL {#project_url}

`project_url` 选项告诉 Bilup 从任意 URL 下载项目数据。请不要与常规项目 ID 一起使用。

https://editor.bilup.org/?project_url=https://example.com/example.sb3

如果你不包含协议头，则会默认使用 https://。出于安全原因，http:// URL 通常无法工作。请注意，URL 需要是直接下载链接，并且必须支持 CORS（`Access-Control-Allow-Origin: *`）。[GitHub Pages](https://pages.github.com/) 会自动支持此功能且效果良好。

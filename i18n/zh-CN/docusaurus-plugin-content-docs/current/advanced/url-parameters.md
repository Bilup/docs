---
title: URL 参数
sidebar_position: 3
---

# URL 参数

您可以通过向 URL 添加参数来控制 Bilup 加载和运行项目的方式。这对于分享可复现的设置、嵌入具有特定选项的项目或自动化测试非常有用。

参数使用标准的查询字符串语法：URL 后加 `?`，然后是 `name=value` 对，用 `&` 连接。纯开关参数不取值：

```
https://com.bilup.org/123456789?turbo&fps=60&username=alice
```

::::note
当您在编辑器中更改常用设置（涡轮模式、FPS、高质量画笔、舞台大小、插值）时，Bilup 会替您将它们存储到 URL 中。下面的参数大多是您需要手动设置的"高级"参数，外加一些常用参数供参考。
::::

## 加载项目

| 参数 | 值 | 作用 |
|-----------|-------|--------------|
| (路径) | 项目 ID | `com.bilup.org/123456789` 加载该项目 |
| `project_url` | 直接 URL | 从任意启用 CORS 的 URL 加载 `.sb3`（或 `project.json`）。不要与项目 ID 组合使用。 |
| `clone` | git 仓库 URL | 从 Bilup git 仓库克隆项目（请参阅[Git 集成](/editor/git)）。 |

`project_url` 需要一个支持 [CORS](/advanced/cors)（`Access-Control-Allow-Origin: *`）的直接下载。省略协议时默认使用 `https://`；`http://` URL 通常无法工作。[GitHub Pages](https://pages.github.com/) 非常适合此项。

```
https://com.bilup.org/?project_url=https://example.com/project.sb3
```

## 性能与运行时

| 参数 | 值 | 作用 |
|-----------|-------|--------------|
| `fps` | 数字 | 设置[帧率](/advanced/custom-fps)。`0` 以显示器刷新率运行。 |
| `turbo` | 开关 | 启用[涡轮模式](/advanced/warp-timer)（不限制每帧节流）。 |
| `interpolate` | 开关 | 启用[插值](/advanced/interpolation)以获得更平滑的运动。 |
| `hqpen` | 开关 | 启用[高质量画笔](/advanced/high-quality-pen)。 |
| `limitless` | 开关 | 移除[杂项限制](/advanced/remove-limits)。 |
| `offscreen` | 开关 | [移除围栏](/advanced/remove-fencing)，让角色可以离开舞台。 |
| `clones` | 数字 | 设置最大克隆数（请参阅[无限克隆](/advanced/infinite-clones)）。 |
| `stuck` | 开关 | 启用[防卡死计时器](/advanced/warp-timer)。也接受 `warp_timer`。 |
| `nocompile` | 开关 | [禁用编译器](/advanced/disable-compiler)。您几乎永远不会想用它。 |

## 显示

| 参数 | 值 | 作用 |
|-----------|-------|--------------|
| `size` | `宽度x高度` | 设置[自定义舞台大小](/advanced/custom-stage-size)，例如 `size=640x360`。 |
| `scale` | 数字 | 限制舞台允许放大的程度。`scale=1` 保持其原生分辨率。 |
| `fullscreen-background` | CSS 颜色 | 全屏时显示的背景颜色。将 `#` 转义为 `%23`，例如 `%23abc123`。 |

## 账户与云 {#accounts-and-cloud}

| 参数 | 值 | 作用 |
|-----------|-------|--------------|
| `username` | 字符串 | 设置 `用户名` 积木返回的值，并用于[云变量](/advanced/cloud-variables)。以这种方式设置的用户名不会保存。 |
| `cloud_host` | `wss://...` URL | 将[云变量](/advanced/cloud-variables#cloud-host)指向不同的服务器。默认为 `wss://clouddata.turbowarp.org`。 |

## 协作

| 参数 | 值 | 作用 |
|-----------|-------|--------------|
| `room` | 房间代码 | 设置用户名后自动加入实时[协作](/editor/collaboration)房间。参数读取后会被从 URL 中移除。 |

## 扩展 {#extension}

| 参数 | 值 | 作用 |
|-----------|-------|--------------|
| `extension` | URL | 加载自定义扩展。可以重复以加载多个。 |

```
https://com.bilup.org/?extension=https://example.com/a.js&extension=https://example.com/b.js
```

这些扩展的用法请参阅[构建扩展](/building-extensions/introduction)。

## 仅嵌入参数

以下参数仅适用于[嵌入播放器](/advanced/embedding)：

| 参数 | 值 | 作用 |
|-----------|-------|--------------|
| `autoplay` | 开关 | 项目加载后自动点击绿旗。 |
| `addons` | 逗号列表 | 在嵌入中启用特定插件，例如 `addons=pause,gamepad`。 |
| `settings-button` | 开关 | 在嵌入中显示高级设置按钮。 |

## 另请参阅

- [嵌入](/advanced/embedding)
- [云变量](/advanced/cloud-variables)
- [CORS](/advanced/cors)
- [编辑器设置](/editor/settings)

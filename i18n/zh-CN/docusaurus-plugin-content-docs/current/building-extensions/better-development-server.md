---
title: 更好的开发服务器
sidebar_position: 11
---

# 更好的开发服务器

[简介](/building-extensions/introduction)中的 Python HTTP 服务器能用，但它有两个粗糙的边缘。本页是可选的，但平滑它们可以消除扩展开发中的大部分摩擦。

## 两个问题

1. **缓存。** `python3 -m http.server` 设置的缓存头让浏览器保留您的旧文件。编辑扩展后，您常常必须硬刷新（忽略缓存重新加载）才能看到更改。
2. **沙箱。** 任何不是从受信任来源提供的内容都会[沙箱](/building-extensions/sandbox)加载，这强制每个积木一帧的延迟。学习时这没问题，但它会掩盖您的积木发布后的真实行为。

## 在端口 8000 上提供服务以非沙箱开发

`http://localhost:8000/` 是 Bilup 信任的来源之一，因此从那里提供的扩展会自动以[非沙箱](/building-extensions/unsandboxed)方式加载，无需每次加载的提示。将您的静态服务器指向 8000 端口并直接加载文件：

```bash
cd path/to/your/extensions
python3 -m http.server 8000
```

然后加载 `http://localhost:8000/your-extension.js`（或用 `?extension=http://localhost:8000/your-extension.js` 自动加载）。它必须恰好是 8000 端口上的 `localhost`；`127.0.0.1` 和 `0.0.0.0` 不受信任。

给扩展一个包含您名字的 ID，如 `yournamefetch`，这样它不会与任何其他人的扩展 ID 冲突。

## 摆脱硬刷新

使用任何发送 no-cache 头的静态服务器，而不是裸的 Python 服务器。例如，安装了 Node.js：

```bash
npx http-server -p 8000 -c-1
```

`-c-1` 禁用缓存，因此普通刷新总是获取当前文件。任何等效的静态服务器都可以；唯一重要的是它在 8000 端口上运行并且不缓存。

## 下一步

有了更快的循环，让我们介绍[扩展可以使用的更多 API 和选项](/building-extensions/assorted-apis)。

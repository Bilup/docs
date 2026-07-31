---
title: 分享您的扩展
sidebar_position: 13
---

# 分享您的扩展

要分享扩展，您需要有地方托管它。

如果您只想在自己的项目中使用自己的扩展，并与[打包器](/packager/overview)一起分发它们，您不需要托管或提交任何东西。打包器总是将扩展捆绑并作为导出项目的一部分以非沙箱方式运行。

## 沙箱扩展

[沙箱扩展](/building-extensions/sandbox)可以托管在任何通过 HTTPS 提供静态文件的地方。[GitHub Pages](https://pages.github.com/) 是常见选择。注意 GitHub 的 `raw.githubusercontent.com` 链接**不能**作为扩展 URL；请改用 GitHub Pages（或其他静态主机）。

一旦它在公开的 HTTPS URL 上，就在编辑器中使用"添加扩展"、"自定义扩展"和该 URL 加载它，或用 `?extension=<url>` 自动加载。

## 非沙箱扩展

[非沙箱扩展](/building-extensions/unsandboxed)只从受信任的来源自动以非沙箱方式运行（请参阅[非沙箱页面](/building-extensions/unsandboxed)上的受信任前缀）。由于您不控制那些画廊域名，实际可行的选项是：

- **自己托管并让用户选择加入。** 像上面一样在任何公开 HTTPS URL 上提供服务。当有人加载该 URL 时，Bilup 会以沙箱方式加载它，除非他们明确选择信任它，因此请为您的用户记录该步骤。
- **将其放入 Bilup 扩展画廊。** 画廊位于 [extensions.bilup.org](https://extensions.bilup.org)；从该来源提供的扩展自动以非沙箱方式运行。请遵循画廊网站上的提交说明。

## 下一步

[结束](/building-extensions/wrapping-up)。

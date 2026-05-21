---
title: 嵌入
sidebar_position: 6
---

# 嵌入 Bilup 项目

Bilup 提供了强大的嵌入功能，允许你将项目集成到网站、应用程序和其他平台中，并具有增强的功能和自定义选项。

## 基本嵌入

### 简单的 iframe 嵌入
嵌入 Bilup 项目最简单的方法：

```html
<iframe
  src="https://editor.bilup.org/123456789/embed"
  width="480"
  height="360"
  frameborder="0"
  scrolling="no"
  allowfullscreen>
</iframe>
```

### 增强嵌入
支持的嵌入参数包括 `autoplay`、`addons` 以及标准的运行时选项，如 `turbo`、`fps`、`hqpen`、`interpolate` 和 `size`：

```html
<iframe
  src="https://editor.bilup.org/123456789/embed?autoplay&turbo&fps=60"
  width="800"
  height="600"
  frameborder="0"
  scrolling="no"
  allowfullscreen>
</iframe>
```

## 嵌入参数

### 基本参数

| 参数 | 值 | 描述 |
|-----------|--------|-------------|
| `autoplay` | 布尔值 | 加载时自动启动项目 |
| `username` | 字符串 | 设置积木使用的用户名 |
| `turbo` | 布尔值 | 启用 turbo 模式 |

### 显示参数

| 参数 | 值 | 描述 |
|-----------|--------|-------------|
| `fps` | 数字 | 设置帧率 |
| `hqpen` | 布尔值 | 高质量画笔渲染 |
| `size` | 宽x高 | 自定义舞台尺寸 |
| `interpolate` | 布尔值 | 启用运动插值 |

### 嵌入专用参数

| 参数 | 值 | 描述 |
|-----------|--------|-------------|
| `addons` | 逗号分隔列表 | 启用特定插件(例如 `pause,gamepad`) |
| `settings-button` | 布尔值 | 在播放器标题中显示设置按钮 |
| `fullscreen-background` | CSS 颜色 | 全屏背景颜色覆盖 |

## 高级嵌入

### 响应式嵌入
创建适应容器大小的响应式嵌入：

```html
<div style="position: relative; padding-bottom: 75%; height: 0;">
  <iframe
    src="https://editor.bilup.org/123456789/embed"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen>
  </iframe>
</div>
```

### 自定义主题
在嵌入中，主题和主题色不能通过 URL 参数控制。使用 iframe 周围的 CSS 或打包器来控制主题。

## JavaScript API 集成

### PostMessage 通信
嵌入接受 `LOAD_SB3` 消息以加载项目。详见指南：[/user-guide/embed-messaging](/user-guide/embed-messaging)。

```javascript
// 发送 SB3 到嵌入(URL 或二进制)
const iframe = document.getElementById('bilup-embed');
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3',
  title: '可选标题'
}, '*');

// 接收加载响应
window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'LOAD_SB3_RESPONSE') {
    console.log(event.data.status, event.data.message);
  }
});
```

### 事件处理
嵌入不会通过 `postMessage` 发出常规项目事件。如果你需要状态，请在嵌入上下文中使用 VM API。

## 打包器集成

### 独立嵌入
使用 Bilup 打包器获取独立嵌入：

1. 访问 [packager.bilup.org](https://packager.bilup.org)
2. 输入你的项目 URL 或上传项目文件
3. 配置嵌入选项
4. 下载生成的 HTML 文件

### 自托管嵌入
在你自己的服务器上托管项目：

```html
<!-- 自托管项目 -->
<iframe
  src="/path/to/your/project.html"
  width="480"
  height="360">
</iframe>
```

## 嵌入最佳实践

### 性能优化

#### 延迟加载
仅在需要时加载嵌入：

```javascript
// 使用 Intersection Observer 进行延迟加载
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const iframe = entry.target;
      iframe.src = iframe.dataset.src;
      observer.unobserve(iframe);
    }
  });
});

document.querySelectorAll('iframe[data-src]').forEach(iframe => {
  observer.observe(iframe);
});
```

#### 预加载
预加载关键资源：

```html
<link rel="preload" href="https://editor.bilup.org/assets/scratch-vm.js" as="script">
<link rel="preload" href="https://editor.bilup.org/assets/scratch-gui.js" as="script">
```

### 无障碍

#### 屏幕阅读器支持
为屏幕阅读器提供替代内容：

```html
<iframe
  src="https://editor.bilup.org/123456789/embed"
  title="互动数学游戏 - 练习加减法"
  aria-label="练习数学技能的 Scratch 游戏">
  <p>这是一个帮助练习加减法的互动数学游戏。如果你无法访问该游戏，请 <a href="/alternative-math-practice">尝试我们的替代版本</a>。</p>
</iframe>
```

#### 键盘导航
通过聚焦 iframe 或提供外部控件来确保嵌入的项目支持键盘导航。

## 安全注意事项

### 内容安全策略
为嵌入内容配置 CSP 头：

```http
Content-Security-Policy: frame-src https://editor.bilup.org;
```

### Sandbox 属性
使用 sandbox 属性以提高安全性：

```html
<iframe
  src="https://editor.bilup.org/123456789/embed"
  sandbox="allow-scripts allow-same-origin allow-fullscreen">
</iframe>
```

## 平台特定嵌入

### WordPress
使用 WordPress 短代码或嵌入块：

```php
// Bilup 嵌入的自定义短代码
function bilup_embed_shortcode($atts) {
  $atts = shortcode_atts([
    'id' => '',
    'width' => 480,
    'height' => 360,
    'autoplay' => false,
    'turbo' => false
  ], $atts);
  
  $src = "https://editor.bilup.org/{$atts['id']}/embed";
  if ($atts['autoplay']) $src .= "?autoplay";
  if ($atts['turbo']) $src .= $atts['autoplay'] ? "&turbo" : "?turbo";
  
  return "<iframe src='{$src}' width='{$atts['width']}' height='{$atts['height']}' frameborder='0'></iframe>";
}
add_shortcode('bilup', 'bilup_embed_shortcode');
```

### React/Vue.js
创建可复用组件：

```jsx
// React 组件
import React from 'react';

const BilupEmbed = ({ 
  projectId, 
  width = 480, 
  height = 360, 
  autoplay = false,
  turbo = false 
}) => {
  const params = new URLSearchParams();
  if (autoplay) params.append('autoplay', '');
  if (turbo) params.append('turbo', '');
  
  const src = `https://editor.bilup.org/${projectId}/embed?${params}`;
  
  return (
    <iframe
      src={src}
      width={width}
      height={height}
      frameBorder="0"
      allowFullScreen
    />
  );
};

export default BilupEmbed;
```

## 嵌入故障排除

### 常见问题

#### 项目无法加载
- 检查项目 ID 是否正确
- 确认项目已公开分享
- 检查网络连接
- 尝试不同的嵌入参数

#### 性能问题
- 启用 turbo 模式：`?turbo`
- 如有需要降低帧率：`?fps=30`
- 检查浏览器兼容性
- 监控内存使用

#### 显示问题
- 验证 iframe 尺寸
- 检查 CSS 冲突
- 测试响应式行为
- 验证 HTML 结构

### 调试
使用浏览器开发工具控制台和网络检查器。没有 `debug` URL 参数。

Bilup 的嵌入功能使将互动内容集成到任何网站或应用程序变得容易。使用这些功能为用户创建引人入胜的互动体验！

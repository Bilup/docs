---
title: 嵌入消息 API
---

# 嵌入消息 API

嵌入可以通过 `postMessage` 加载项目。当宿主页面想要控制项目源或实现自定义加载器时，这很有用。

## 消息：LOAD_SB3

向嵌入的播放器发送消息：

```javascript
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3', // URL 字符串、ArrayBuffer 或 Uint8Array
  title: '可选标题'
}, '*');
```

支持的 `data` 类型：
- URL 字符串：嵌入获取 URL 并加载 SB3
- ArrayBuffer：原始 SB3 数据
- Uint8Array：原始 SB3 数据

安全和来源规则：
- 允许同源
- 允许本地开发来源：`http://localhost:3000`、`http://localhost:8080`、`http://localhost:8601`、`https://localhost:8601`
- 通过 HTTPS 的 `window.open` 打开的父页面通常允许
- 允许 `file://` 用于本地测试

## 响应：LOAD_SB3_RESPONSE

嵌入发回响应：

```javascript
window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg && msg.type === 'LOAD_SB3_RESPONSE') {
    // status: 'success' | 'error'
    // message: 人类可读的详细信息
    // title: 请求中提供的可选标题
    // timestamp: 毫秒
    console.log(msg.status, msg.message, msg.title);
  }
});
```

## 示例：从 URL 加载

```javascript
const iframe = document.getElementById('bilup-embed');
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3',
  title: '我的项目'
}, '*');
```

## 示例：从 ArrayBuffer 加载

```javascript
async function loadBinary(iframe, url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  iframe.contentWindow.postMessage({
    type: 'LOAD_SB3',
    data: buf,
    title: '二进制加载'
  }, '*');
}
```

## 注意事项
- 成功时，VM 会重启并加载新项目，然后触发渲染器绘制
- 失败时，你将收到 `status: 'error'` 和一条消息
- 如果你希望在加载后自动启动项目，请在嵌入 URL 中使用 `autoplay`

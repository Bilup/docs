---
title: JavaScript 集成
sidebar_position: 8
---

# JavaScript 集成

Bilup 支持强大的扩展 API 和嵌入工作流。任意的「JavaScript 积木」不是 Bilup 的一部分；相反，请使用非沙盒化扩展以获得高级行为，或使用打包器在独立构建中包含自定义 JavaScript。

## 理解 Bilup 中的 JavaScript

### 支持什么？
- **非沙盒化扩展**：编写在编辑器上下文中运行并与 VM、渲染器和运行时交互的扩展。
- **打包器自定义 JS**：使用打包器导出时，在输出中包含自定义 JavaScript 以用于独立部署。
- **嵌入**：从宿主页面通过 `postMessage` 与嵌入的项目通信。

### 安全模型
- **沙盒化扩展**：访问受限；积木可能会有每帧延迟。
- **非沙盒化扩展**：完全访问内部 API；必须保持稳定且不阻塞主线程。
- **打包器 JS**：在你的打包应用上下文中运行；遵循 CSP 最佳实践。

## 启用高级行为

### 非沙盒化扩展
通过 URL 加载你的扩展或直接在 IIFE 中注册：
```
https://editor.bilup.org/?extension=https://example.com/extension.js
```

### 打包器
使用打包器将自定义 JS 注入导出的应用中。

:::warning 安全注意事项
非沙盒化扩展和打包器 JS 以提升的权限运行。只加载你信任的代码。
:::

## 非沙盒化扩展模式

## 与 Scratch 交互

### 访问变量
从非沙盒化扩展中读取和修改 Scratch 变量：

```javascript
// 获取变量值
const score = vm.runtime.getTargetForStage().variables[variableId].value;

// 设置变量值
vm.runtime.getTargetForStage().variables[variableId].value = 100;

// 按名称获取变量
const scoreVar = vm.runtime.getTargetForStage().lookupVariableByNameAndType('score', '');
scoreVar.value = 200;
```

### 控制角色
以编程方式操作角色：

```javascript
// 获取当前角色
const sprite = vm.runtime.getEditingTarget();

// 改变位置
sprite.setXY(100, 50);

// 改变造型
sprite.setCostume(0);

// 改变大小
sprite.setSize(150);

// 设置旋转
sprite.setDirection(90);
```

### 广播事件
触发 Scratch 广播：

```javascript
// 简单广播
vm.runtime.startHats('event_whenbroadcastreceived', {
  BROADCAST_OPTION: 'my_event'
});

// 带数据的广播
vm.runtime.startHats('event_whenbroadcastreceived', {
  BROADCAST_OPTION: 'data_received',
  data: { score: 100, level: 5 }
});
```

## Web API 集成（非沙盒化扩展）

### Fetch API
发出 HTTP 请求：

```javascript
// GET 请求
const response = await fetch('https://api.example.com/data');
const data = await response.json();
console.log(data);

// POST 请求
const response = await fetch('https://api.example.com/submit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Alice', score: 100 })
});
```

### 本地存储
跨会话持久化数据：

```javascript
// 保存数据
localStorage.setItem('gameData', JSON.stringify({
  highScore: 1000,
  playerName: 'Alice',
  level: 5
}));

// 加载数据
const gameData = JSON.parse(localStorage.getItem('gameData') || '{}');
const highScore = gameData.highScore || 0;
```

### 地理位置
访问用户位置：

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    console.log(`位置：${lat}，${lon}`);
  },
  (error) => {
    console.error('位置访问被拒绝：', error);
  }
);
```

### 摄像头和麦克风
访问媒体设备：

```javascript
// 获取摄像头流
const stream = await navigator.mediaDevices.getUserMedia({ video: true });
const video = document.createElement('video');
video.srcObject = stream;
video.play();

// 获取麦克风流
const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
```

## 外部库（打包器或宿主页面）

### 包含库
添加外部 JavaScript 库：

```javascript
// 动态加载库
const script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
document.head.appendChild(script);

// 等待库加载
script.onload = () => {
  // 库现在可用
  const chart = new Chart(ctx, config);
};
```

### 流行库

#### Chart.js 用于数据可视化
```javascript
// 创建图表
const ctx = document.createElement('canvas').getContext('2d');
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['红', '蓝', '黄'],
    datasets: [{
      data: [12, 19, 3],
      backgroundColor: ['red', 'blue', 'yellow']
    }]
  }
});
```

#### Three.js 用于 3D 图形
```javascript
// 创建 3D 场景
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// 添加到页面
```

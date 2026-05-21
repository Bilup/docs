---
title: JavaScript 集成
sidebar_position: 8
---

# JavaScript 集成

Bilup 支持强大的扩展 API 和嵌入工作流。任意的「JavaScript 积木」不是 Bilup 的一部分；相反，请使用非沙盒化扩展以获得高级行为，或使用打包器在独立构建中包含自定义 JavaScript。

## 理解 Bilup 中的 JavaScript

### 支持什么?
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

## Web API 集成(非沙盒化扩展)

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

## 外部库(打包器或宿主页面)

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
document.body.appendChild(renderer.domElement);
```

#### Socket.io 用于实时通信
```javascript
// 连接到 WebSocket 服务器
const socket = io('https://your-server.com');

socket.on('connect', () => {
  console.log('已连接到服务器');
});

socket.on('gameUpdate', (data) => {
  // 处理实时游戏更新
  updateGameState(data);
});
```

## 高级模式

### 自定义扩展
创建项目特定扩展：

```javascript
class MyCustomExtension {
  getInfo() {
    return {
      id: 'myextension',
      name: '我的自定义扩展',
      blocks: [
        {
          opcode: 'customBlock',
          blockType: 'reporter',
          text: '自定义计算 [NUM]',
          arguments: {
            NUM: { type: 'number', defaultValue: 10 }
          }
        }
      ]
    };
  }

  customBlock(args) {
    return Math.pow(args.NUM, 2) + 1;
  }
}

// 注册扩展(非沙盒化)
Scratch.extensions.register(new MyCustomExtension());
```

### 事件系统
创建自定义事件系统：

```javascript
class EventManager {
  constructor() {
    this.listeners = {};
  }

  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

const events = new EventManager();

// 在 Scratch 中使用
events.on('scoreUpdate', (score) => {
  vm.runtime.getTargetForStage().lookupVariableByNameAndType('score', '').value = score;
});
```

### 性能监控
监控项目性能：

```javascript
class PerformanceMonitor {
  constructor() {
    this.startTime = performance.now();
    this.frameCount = 0;
  }

  measureFrame() {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.startTime;
    
    if (elapsed >= 1000) {
      const fps = this.frameCount / (elapsed / 1000);
      console.log(`FPS: ${fps.toFixed(1)}`);
      
      this.frameCount = 0;
      this.startTime = currentTime;
    }
  }
}

const monitor = new PerformanceMonitor();
vm.runtime.on('PROJECT_RUN_START', () => {
  monitor.measureFrame();
});
```

## 集成模式

### 积木-JavaScript 桥接
创建积木和 JavaScript 之间的无缝集成：

```javascript
// 创建桥接对象
window.ScratchBridge = {
  // 从积木调用：(调用 js 函数 [bridge.calculate] 参数 [10])
  calculate: (input) => {
    return Math.complex.calculation(input);
  },
  
  // 从积木调用：(调用 js 函数 [bridge.saveData] 参数 [data])
  saveData: (data) => {
    localStorage.setItem('projectData', JSON.stringify(data));
    return '已保存';
  },
  
  // 从积木调用：(调用 js 函数 [bridge.loadData])
  loadData: () => {
    return JSON.parse(localStorage.getItem('projectData') || '{}');
  }
};
```

### 状态同步
保持 JavaScript 和 Scratch 状态同步：

```javascript
class StateSynchronizer {
  constructor(vm) {
    this.vm = vm;
    this.jsState = {};
    this.setupWatchers();
  }

  setupWatchers() {
    // 监视 Scratch 变量
    this.vm.runtime.on('VARIABLE_CHANGED', (variable) => {
      this.jsState[variable.name] = variable.value;
      this.onStateChange(variable.name, variable.value);
    });
  }

  updateScratchVariable(name, value) {
    const variable = this.vm.runtime.getTargetForStage()
      .lookupVariableByNameAndType(name, '');
    if (variable) {
      variable.value = value;
    }
  }

  onStateChange(name, value) {
    // 状态改变时的自定义逻辑
    console.log(`${name} 改变为 ${value}`);
  }
}
```

## 安全最佳实践

### 输入验证
始终验证来自外部来源的数据：

```javascript
function validateInput(input) {
  // 检查类型
  if (typeof input !== 'string') return false;
  
  // 检查长度
  if (input.length > 1000) return false;
  
  // 检查危险模式
  if (/<script|javascript:|data:/i.test(input)) return false;
  
  return true;
}
```

### 清理
在使用数据之前进行清理：

```javascript
function sanitizeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

### 错误处理
实施健壮的错误处理：

```javascript
try {
  const result = riskyOperation();
  return result;
} catch (error) {
  console.error('操作失败:', error);
  return '发生错误';
}
```

## 调试 JavaScript

### 控制台日志
使用控制台方法进行调试：

```javascript
console.log('调试信息:', data);
console.warn('警告信息');
console.error('发生错误');
console.table(arrayData);
```

### 浏览器开发者工具
- **F12**：打开开发者工具
- **Console 选项卡**：查看日志和执行代码
- **Sources 选项卡**：设置断点和调试
- **Network 选项卡**：监控 API 调用

### 性能分析
分析 JavaScript 性能：

```javascript
console.time('operation');
// 你的代码在这里
console.timeEnd('operation');
```

Bilup 中的 JavaScript 集成为创建复杂的交互式项目开辟了无限可能。在使用这些功能时要负责任，并始终考虑自定义代码的安全性问题!

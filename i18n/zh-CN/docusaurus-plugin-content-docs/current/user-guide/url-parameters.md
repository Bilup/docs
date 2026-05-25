---
title: URL 参数
sidebar_position: 10
---

# URL 参数

Bilup 支持 URL 参数，允许你加载项目并调整运行时和编译器行为。这些参数对于嵌入、自动化和分享可重现的设置非常有用。

## 基本用法

### URL 参数语法
使用标准查询字符串格式添加参数：
```
https://editor.bilup.org/?parameter1&parameter2=value&parameter3=value
```

### 多个参数
使用 `&` 组合多个参数：
```
https://editor.bilup.org/?turbo&fps=60&username=alice&autoplay
```

## 项目加载

### 按 ID 加载
按项目 ID 加载 Scratch 项目：
```
https://editor.bilup.org/123456789
```

### 从 URL 加载
从直接 URL 加载项目：
```
https://editor.bilup.org/?project_url=https://example.com/project.sb3
```

### 自动启动(仅嵌入)
在嵌入中自动启动项目：
```
https://editor.bilup.org/123456789?autoplay
```

### 用户名
设置云变量和积木使用的用户名：
```
https://editor.bilup.org/123456789?username=alice
```

## 性能

### Turbo 模式
启用加速模式：
```
https://editor.bilup.org/?turbo
```

### 帧率
设置自定义帧率：
```
https://editor.bilup.org/?fps=60     # 60 FPS
https://editor.bilup.org/?fps=120    # 120 FPS
https://editor.bilup.org/?fps=30     # 30 FPS(默认)
```

### 高质量画笔
启用抗锯齿画笔渲染：
```
https://editor.bilup.org/?hqpen
```

### 插值
启用帧插值以实现更平滑的运动：
```
https://editor.bilup.org/?interpolate
```

### 移除杂项限制
禁用某些运行时限制：
```
https://editor.bilup.org/?limitless
```

## 显示

### 自定义舞台尺寸
设置自定义舞台尺寸：
```
https://editor.bilup.org/?size=800x600
https://editor.bilup.org/?size=1920x1080
```

### 全屏背景(仅播放器)
控制全屏背景颜色：
```
https://editor.bilup.org/?fullscreen-background=%23abc123
```

### 屏幕外围栏
禁用屏幕外围栏：
```
https://editor.bilup.org/?offscreen
```

### 克隆限制
设置最大克隆数：
```
https://editor.bilup.org/?clones=300
```

## 扩展

### 加载扩展
按 URL 加载自定义扩展(推荐使用非沙盒化)：
```
https://editor.bilup.org/?extension=https://example.com/ext.js
https://editor.bilup.org/?extension=https://example.com/other.js
```

### 插件(仅嵌入)
在嵌入中启用特定插件：
```
https://editor.bilup.org/123456789/embed?addons=pause,gamepad
```

## 嵌入

### 自动播放和插件
嵌入特定选项：
```
https://editor.bilup.org/123456789/embed?autoplay
https://editor.bilup.org/123456789/embed?addons=pause,gamepad
```

## 开发

### 禁用编译器
关闭编译器(用于调试)：
```
https://editor.bilup.org/?nocompile
```

### 项目 URL
从直接 URL 加载项目数据：
```
https://editor.bilup.org/?project_url=https://example.com/project.sb3
```

### 云主机(嵌入/播放器)
覆盖云服务器：
```
https://editor.bilup.org/?cloud_host=wss://clouddata.bilup.org
```

## 参考

## 完整参数参考

### 性能
| 参数 | 值 | 描述 |
|-----------|--------|-------------|
| `turbo` | boolean | 启用 turbo 模式 |
| `fps` | number | 设置帧率 |
| `hqpen` | boolean | 高质量画笔 |
| `interpolate` | boolean | 启用插值 |
| `limitless` | boolean | 禁用杂项限制 |
| `stuck` | boolean | 启用 warp 计时器(仅播放器) |

### 显示
| 参数 | 值 | 描述 |
|-----------|--------|-------------|
| `size` | WIDTHxHEIGHT | 自定义舞台尺寸 |
| `fullscreen-background` | CSS color | 全屏背景颜色 |
| `offscreen` | boolean | 禁用屏幕外围栏 |

### 项目
| 参数 | 值 | 描述 |
|-----------|--------|-------------|
| `username` | string | 用户名 |
| `project_url` | URL | 从 URL 加载 |

### 扩展
| 参数 | 值 | 描述 |
|-----------|--------|-------------|
| `extension` | URL | 按 URL 加载扩展 |

### 开发
| 参数 | 值 | 描述 |
|-----------|--------|-------------|
| `nocompile` | boolean | 禁用编译器 |
| `cloud_host` | wss://... | 自定义云主机 |

## URL 参数示例

### 游戏设置
针对游戏优化：
```
https://editor.bilup.org/123456789?turbo&fps=60&interpolate
```

### 教育嵌入
简洁的教育嵌入：
```
https://editor.bilup.org/123456789/embed?autoplay&size=800x600
```

### 开发测试
开发环境：
```
https://editor.bilup.org/?turbo&fps=120&hqpen
```

### 高性能
最大性能：
```
https://editor.bilup.org/?turbo&fps=120&hqpen
```

### 无障碍模式
使用操作系统/浏览器的无障碍功能。主题在 UI 中控制，而不是通过 URL。

## URL 编码

### 特殊字符
在 URL 中编码特殊字符：
```
空格: %20
#: %23
&: %26
=: %3D
```

### 带编码的示例
```
https://editor.bilup.org/?fps=60&hqpen
```

## JavaScript URL 操作

### 读取参数
```javascript
const urlParams = new URLSearchParams(window.location.search);
const turboMode = urlParams.has('turbo');
const fps = urlParams.get('fps') || '30';
```

### 设置参数
```javascript
const url = new URL(window.location);
url.searchParams.set('fps', '60');
url.searchParams.set('turbo', '');
window.history.pushState({}, '', url);
```

### 编程构建 URL
```javascript
function buildBilupURL(projectId, options = {}) {
  const url = new URL(`https://editor.bilup.org/${projectId}`);
  
  Object.entries(options).forEach(([key, value]) => {
    if (value === true) {
      url.searchParams.set(key, '');
    } else if (value !== false && value !== null) {
      url.searchParams.set(key, value);
    }
  });
  
  return url.toString();
}

// 用法
const gameURL = buildBilupURL('123456789', {
  turbo: true,
  fps: 60,
  interpolate: true
});
```

## 最佳实践

### URL 长度
- 保持 URL 长度合理(少于 2000 个字符)
- 仅使用必要的参数
- 考虑使用简短的参数名称

### 用户体验
- 提供合理的默认值
- 谨慎使用自动播放
- 详细测试 URL

### 性能
- 组合兼容的性能参数
- 测试参数组合的性能影响
- 监控参数之间的冲突

URL 参数为 Bilup 提供了强大的自定义功能。使用它们为不同用户和用例创建定制体验!
---
title: 窗口系统
---

# 窗口系统

Bilup 包含一个由插件和某些 UI 功能使用的窗口系统。它提供可拖动、可调整大小的窗口，具有一致的外观和 API。

## 创建窗口

```js
// 全局可用作 WindowManager
const win = WindowManager.createWindow({
  title: 'Addon Settings',
  width: 900,
  height: 700,
  minWidth: 600,
  minHeight: 400,
  x: 100,
  y: 100,
  resizable: true,
  closable: true,
  maximizable: true,
  onClose: () => {
    // 清理
  }
});

// 添加内容
const el = win.getContentElement();
el.textContent = 'Hello';

win.show();
```

## 选项
- `id` (string) 唯一标识符（如果省略则自动生成）
- `title` (string) 标题
- `width`, `height` (number) 宽高
- `minWidth`, `minHeight` (number) 最小宽高
- `maxWidth`, `maxHeight` (number | null) 最大宽高
- `x`, `y` (number) 初始位置
- `resizable`, `closable`, `minimizable`, `maximizable` (boolean) 可调整大小、可关闭、可最小化、可最大化
- `className` (string) 类名
- `onClose`, `onMinimize`, `onMaximize`, `onRestore`, `onResize`, `onMove` (function) 回调函数

## 方法
- `show()` — 显示窗口
- `hide()` — 隐藏窗口
- `bringToFront()` — 提升 z-index
- `minimize()` — 最小化窗口
- `toggleMaximize()` — 最大化/恢复
- `getContentElement()` — 返回内容 DOM 元素以附加您的 UI

## 注意事项
- 窗口附加到 `document.body`
- 拖动使用标题区域；边缘添加了调整大小的手柄
- 系统管理 z-order 并防止窗口完全移出屏幕
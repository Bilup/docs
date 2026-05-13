---
title: 舞台组件
sidebar_position: 3
---

# 舞台组件

舞台组件是 Bilup 的中央视觉元素，用于渲染项目的舞台和角色。

## 概述

舞台组件处理：
- 渲染项目的视觉内容
- 管理角色定位和变换
- 处理舞台交互和事件
- 与 VM 协调视觉更新

## 架构

```
StageWrapper (容器)
  └── Stage (展示组件)
      ├── StageHeader
      ├── StageCanvas
      └── StageControls
```

## 主要功能

### 画布渲染
- 使用 WebGL 进行高性能渲染
- 支持自定义舞台尺寸
- 处理高清角色渲染
- 实现高效的脏区域更新

### 事件处理
- 鼠标和触摸交互
- 角色拖放
- 右键上下文菜单
- 舞台获得焦点时的键盘事件

### 性能优化
- 帧率限制
- 屏幕外角色的角色剔除
- 造型的纹理图集
- GPU 加速效果

## Props 接口

```typescript
interface StageProps {
  width: number;
  height: number;
  isFullScreen: boolean;
  isStarted: boolean;
  onGreenFlag: () => void;
  onStop: () => void;
  vm: VirtualMachine;
  // ... 其他 props
}
```

## 与 VM 的集成

舞台组件与 Bilup VM 紧密集成：

```javascript
// 监听 VM 渲染事件
vm.on('VISUAL_REPORT', this.handleVisualUpdate);
vm.on('PROJECT_CHANGED', this.handleProjectChange);
vm.on('SPRITE_INFO_REPORT', this.handleSpriteInfo);
```

## 造型管理

舞台处理所有角色的造型渲染：
- 加载和缓存造型数据
- 应用变换（旋转、缩放）
- 管理层叠（角色顺序）
- 处理造型切换动画

## Bilup 增强功能

Bilup 为标准 Scratch 舞台添加了多项增强功能：

### 性能模式
- 较慢设备的降低质量模式
- 帧率限制选项
- 角色数量限制执行

### 自定义舞台尺寸
- 支持非标准宽高比
- 运行时动态调整大小
- 响应式缩放

### 高级效果
- 超越 Scratch 的额外视觉效果
- GPU 着色器支持
- 自定义混合模式

## 测试

```javascript
// 舞台渲染测试示例
it('should render sprites correctly', () => {
  const stage = mount(<Stage {...defaultProps} />);
  const canvas = stage.find('canvas');
  expect(canvas).toHaveLength(1);
  expect(canvas.prop('width')).toBe(480);
  expect(canvas.prop('height')).toBe(360);
});
```

## 相关组件

- [容器概述](../containers/overview)
- [GUI 组件](gui-component)
- [角色选择器](sprite-selector)
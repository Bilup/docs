---
title: 造型标签页组件
sidebar_position: 5
---

# 造型管理组件

Bilup 中的造型管理系统由容器和组件组成，用于处理角色和舞台的视觉资源。

## 概述

造型管理系统允许用户：
- 查看和选择当前角色/舞台的造型
- 从库中或文件中添加新造型
- 使用内置的绘图编辑器编辑造型
- 管理造型属性和排序

## 容器架构

```
CostumeTab (Container)
  └── AssetPanel (Component)
      ├── Selector (用于造型列表)
      │   └── SortableAsset (用于每个造型)
      ├── ActionMenu (添加/编辑/上传)
      └── PaintEditorWrapper (编辑时)
          ├── AddCostume
          ├── UploadCostume
          └── PaintCostume
      └── CostumeEditor (编辑时)
```

## 主要功能

### 造型管理
- 显示造型缩略图和名称
- 通过拖放重新排序造型
- 确认后删除造型
- 复制现有造型
- 设置造型中心点

### 绘图编辑器集成
造型选项卡与 Bilup 的绘图编辑器集成：

```javascript
openPaintEditor = (costumeId) => {
  this.props.onEditCostume(costumeId);
  // 打开集成的绘图编辑器
};
```

### 文件格式支持
支持多种图像格式：
- **SVG**：矢量图形(推荐)
- **PNG**：带透明度的光栅图像
- **JPG**：不带透明度的光栅图像
- **GIF**：动画(使用第一帧)

## Props 接口

```typescript
interface CostumeTabProps {
  costumes: Array<CostumeData>;
  selectedCostumeId: string;
  onSelectCostume: (costumeId: string) => void;
  onNewCostume: () => void;
  onDeleteCostume: (costumeId: string) => void;
  onEditCostume: (costumeId: string) => void;
  vm: VirtualMachine;
}
```

## 状态管理

连接到 Redux 以获取造型状态：

```javascript
const mapStateToProps = state => ({
  costumes: state.targets.editingTarget?.costumes || [],
  selectedCostumeId: state.targets.editingTarget?.currentCostume,
  editingTarget: state.targets.editingTarget
});

const mapDispatchToProps = dispatch => ({
  onSelectCostume: id => dispatch(setActiveCostume(id)),
  onDeleteCostume: id => dispatch(deleteCostume(id)),
  // ... 其他操作
});
```

## 造型操作

### 添加造型

添加造型有多种方法：

1. **从库中添加**：从内置造型集合中选择
2. **上传**：从计算机加载图像文件
3. **绘制**：在绘图编辑器中创建新造型
4. **摄像头**：从网络摄像头捕获(如果可用)

### 造型属性

每个造型都有可配置的属性：
- **名称**：人类可读的标识符
- **中心点**：旋转/缩放原点
- **分辨率**：原始图像尺寸
- **数据 URI**：Base64 编码的图像数据

## 绘图编辑器集成

Bilup 包含一个复杂的绘图编辑器：

### 矢量工具
- 自由绘制的钢笔工具
- 形状工具(矩形、圆形、多边形)
- 带字体选择的文本工具
- 渐变和图案填充

### 位图工具
- 可调整大小和透明度的画笔
- 橡皮擦工具
- 填充桶
- 选择和变换工具

### 高级功能
- 图层支持
- 撤销/重做栈
- 缩放和平移
- 网格和辅助线

## 性能优化

### 缩略图生成
为了性能，造型会自动生成缩略图：

```javascript
generateThumbnail = (costume) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 80;
  canvas.height = 60;
  
  // 以缩略图大小渲染造型
  this.renderCostumeToCanvas(costume, canvas, ctx);
  return canvas.toDataURL();
};
```

### 懒加载
- 按需加载造型
- 缩略图缓存
- 渐进式图像加载

## Bilup 增强功能

### 默认造型
Bilup 附带独特的默认造型：
- 不再有默认角色或变量
- 增强的造型库
- 自定义矢量图形

### 高级导入
- 批量造型导入
- 支持动画 GIF
- 导入时优化 SVG

## 可访问性

- 通过键盘导航造型列表
- 屏幕阅读器的造型描述
- 高对比度模式支持
- 绘图编辑器中的焦点管理

## 测试

```javascript
describe('CostumeTab', () => {
  it('should display costumes for current sprite', () => {
    const costumes = [mockCostume1, mockCostume2];
    const wrapper = mount(
      <CostumeTab costumes={costumes} selectedCostumeId="costume1" />
    );
    expect(wrapper.find('CostumeListItem')).toHaveLength(2);
  });

  it('should open paint editor when editing costume', () => {
    const onEditCostume = jest.fn();
    const wrapper = mount(
      <CostumeTab onEditCostume={onEditCostume} />
    );
    wrapper.find('.edit-button').first().simulate('click');
    expect(onEditCostume).toHaveBeenCalled();
  });
});
```

## 相关组件

- [角色选择器](sprite-selector)
- [声音选项卡](sound-tab)
- [容器架构](../containers/overview)
---
title: 角色选择器组件
sidebar_position: 4
---

# 角色选择器组件

角色选择器允许用户在 Bilup 项目中选择和管理角色。

## 概述

角色选择器提供以下接口功能：
- 查看项目中的所有角色
- 选择角色进行编辑
- 创建新角色
- 复制和删除角色
- 管理角色属性

## 组件结构

```
SpriteSelectorContainer
  └── SpriteSelector
      ├── SpriteList
      │   └── SpriteInfo (for each sprite)
      └── ActionButton
          ├── NewSprite
          ├── UploadSprite
          └── SurpriseSprite
```

## 主要功能

### 角色管理
- 从库中添加新角色
- 从文件上传角色
- 生成随机随机角色
- 复制现有角色
- 带确认的删除角色

### 视觉指示器
- 当前角色高亮显示
- 造型缩略图
- 角色名称和重命名功能
- 可见性切换

### Bilup 默认值

Bilup 删除默认角色和变量。

默认舞台为空。

## Props 接口

```typescript
interface SpriteSelectorProps {
  sprites: Array<SpriteInfo>;
  selectedSpriteId: string;
  onSelectSprite: (spriteId: string) => void;
  onNewSprite: () => void;
  onDeleteSprite: (spriteId: string) => void;
  onDuplicateSprite: (spriteId: string) => void;
  vm: VirtualMachine;
}
```

## 状态管理

组件连接到 Redux 获取角色状态：

```javascript
const mapStateToProps = state => ({
  sprites: state.targets.sprites,
  selectedSpriteId: state.targets.selectedSprite,
  editingTarget: state.targets.editingTarget
});

const mapDispatchToProps = dispatch => ({
  onSelectSprite: spriteId => dispatch(setEditingTarget(spriteId)),
  onNewSprite: () => dispatch(openNewSpriteModal()),
  // ... 其他动作
});
```

## 角色操作

### 添加角色

添加角色的多种方式：

1. **从库中添加**：从内置角色集合中选择
2. **上传**：从本地文件加载角色
3. **绘制**：使用内置编辑器创建新角色
4. **随机**：从库中生成随机角色

### 角色属性

每个角色信息显示：
- 造型缩略图(自动生成)
- 角色名称(可内联编辑)
- 可见性切换
- 高级选项的上下文菜单

## 可访问性

角色选择器包含可访问性功能：
- 键盘导航
- 屏幕阅读器支持
- 高对比度模式兼容性
- 焦点管理

## 拖放

支持通过拖放重新排序角色：

```javascript
onDragEnd = (result) => {
  if (!result.destination) return;
  
  const newOrder = Array.from(this.props.sprites);
  const [removed] = newOrder.splice(result.source.index, 1);
  newOrder.splice(result.destination.index, 0, removed);
  
  this.props.onReorderSprites(newOrder);
};
```

## 与 VM 的集成

与 VM 通信以执行角色操作：

```javascript
// 创建新角色
vm.addSprite({
  name: spriteName,
  costume: selectedCostume,
  sounds: []
}).then(spriteId => {
  dispatch(setEditingTarget(spriteId));
});
```

## 性能考虑

- 造型缩略图的懒加载
- 角色数量较多的项目使用虚拟化
- 对重命名操作使用防抖
- 使用 React.memo 进行高效重新渲染

## 测试

```javascript
describe('SpriteSelector', () => {
  it('should display all sprites', () => {
    const sprites = [mockSprite1, mockSprite2];
    const wrapper = shallow(<SpriteSelector sprites={sprites} />);
    expect(wrapper.find('SpriteInfo')).toHaveLength(2);
  });

  it('should handle sprite selection', () => {
    const onSelectSprite = jest.fn();
    const wrapper = shallow(
      <SpriteSelector onSelectSprite={onSelectSprite} />
    );
    wrapper.find('SpriteInfo').first().simulate('click');
    expect(onSelectSprite).toHaveBeenCalled();
  });
});
```

## 相关组件

- [舞台组件](stage)
- [造型选项卡](costume-tab)
- [声音选项卡](sound-tab)
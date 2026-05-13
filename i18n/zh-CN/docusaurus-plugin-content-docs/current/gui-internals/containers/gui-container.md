---
title: GUI 容器
sidebar_position: 2
---

# GUI 容器

GUI 容器是主应用容器，连接 Redux store 并管理整体应用状态。

## 概述

GUI 容器负责：
- 从 Redux 获取应用状态
- 分发应用级 action
- 管理 VM 连接
- 协调子组件

## 状态映射

```javascript
const mapStateToProps = state => ({
  // 项目状态
  projectState: state.scratchGui.projectState,
  
  // 编辑器状态
  editorTab: state.scratchGui.editorTab,
  
  // 目标状态
  targets: state.scratchGui.targets,
  
  // 模式状态
  mode: state.scratchGui.mode,
  
  // 模态框状态
  modals: state.scratchGui.modals,
  
  // 主题状态
  theme: state.scratchGui.tw.theme
});
```

## Action 映射

```javascript
const mapDispatchToProps = dispatch => ({
  // 编辑器操作
  onActivateTab: tabIndex => dispatch(activateTab(tabIndex)),
  
  // 模式操作
  onToggleFullScreen: () => dispatch(toggleFullScreen()),
  
  // 模态框操作
  onOpenExtensionLibrary: () => dispatch(setModal('extensionLibrary', true)),
  
  // 主题操作
  onThemeChange: theme => dispatch(setTheme(theme))
});
```

## 生命周期

```javascript
componentDidMount() {
  // 初始化 VM 连接
  this.props.vm.attachRenderer(this.renderer);
  
  // 设置事件监听器
  this.props.vm.on('PROJECT_LOADED', this.handleProjectLoaded);
}

componentWillUnmount() {
  // 清理监听器
  this.props.vm.off('PROJECT_LOADED', this.handleProjectLoaded);
  
  // 分离渲染器
  this.props.vm.detachRenderer(this.renderer);
}
```

## 组件结构

```jsx
const GUIContainer = ({ vm, mode, children }) => {
  // 处理全屏模式
  if (mode.isFullScreen) {
    return <FullScreenStage vm={vm} />;
  }
  
  // 处理播放器模式
  if (mode.isPlayerOnly) {
    return <PlayerOnly vm={vm} />;
  }
  
  // 默认编辑器模式
  return <GUIComponent vm={vm}>{children}</GUIComponent>;
};
```

## 测试

```javascript
it('should render correctly in editor mode', () => {
  const state = { scratchGui: { mode: { isFullScreen: false, isPlayerOnly: false } } };
  const wrapper = mount(
    <Provider store={createStore(reducer, state)}>
      <GUIContainer vm={mockVm} />
    </Provider>
  );
  expect(wrapper.find(GUIComponent)).toHaveLength(1);
});
```

## 相关内容

- [容器概述](overview)
- [GUI 组件](../components/gui-component)
- [Redux Store](../state/redux-store)
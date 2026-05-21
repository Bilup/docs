---
title: 容器概述
sidebar_position: 1
---

# 容器与 HOC 概述

Bilup 使用容器组件和高阶组件(HOC)来分离展示逻辑和业务逻辑的关注点。

## 容器模式

Bilup 中的容器组件遵循以下模式：
- 连接到 Redux store 进行状态管理
- 处理副作用和 API 调用
- 将数据和回调传递给展示组件
- 管理组件生命周期

## 架构

```
Containers (Smart Components)
├── 数据获取和状态管理
├── 事件处理和副作用
└── Props 转换

Presentation Components (Dumb Components)
├── UI 渲染和样式
├── 用户交互处理
└── Prop 验证
```

## 常见容器模式

```javascript
// 容器组件
const SpriteListContainer = () => {
  const sprites = useSelector(state => state.targets.sprites);
  const selectedSpriteId = useSelector(state => state.targets.selectedSprite);
  const dispatch = useDispatch();

  const handleSelectSprite = useCallback(
    (spriteId) => dispatch(setEditingTarget(spriteId)),
    [dispatch]
  );

  const handleDeleteSprite = useCallback(
    (spriteId) => dispatch(deleteSprite(spriteId)),
    [dispatch]
  );

  return (
    <SpriteList
      sprites={sprites}
      selectedSpriteId={selectedSpriteId}
      onSelectSprite={handleSelectSprite}
      onDeleteSprite={handleDeleteSprite}
    />
  );
};

// 展示组件
const SpriteList = ({ sprites, selectedSpriteId, onSelectSprite, onDeleteSprite }) => (
  <div className="sprite-list">
    {sprites.map(sprite => (
      <SpriteItem
        key={sprite.id}
        sprite={sprite}
        isSelected={sprite.id === selectedSpriteId}
        onSelect={() => onSelectSprite(sprite.id)}
        onDelete={() => onDeleteSprite(sprite.id)}
      />
    ))}
  </div>
);
```

## 关键容器组件

### GUI Container
主应用容器，协调整个 Bilup 界面。

### Stage Wrapper
管理舞台状态、事件和 VM 集成。

### Blocks Container
处理积木工作区、工具箱和编辑状态。

### Modal Containers
管理各种模态对话框及其状态。

## 高阶组件 (HOCs)

HOC 提供跨组件的可复用功能：

### VM 连接 HOC
```javascript
const withVM = (WrappedComponent) => {
  return (props) => {
    const vm = useSelector(state => state.vm.instance);
    
    return <WrappedComponent {...props} vm={vm} />;
  };
};

// 使用
const ConnectedStage = withVM(Stage);
```

### 加载状态 HOC
```javascript
const withLoadingState = (WrappedComponent) => {
  return ({ isLoading, loadingMessage, ...props }) => {
    if (isLoading) {
      return <LoadingSpinner message={loadingMessage} />;
    }
    
    return <WrappedComponent {...props} />;
  };
};
```

### 错误边界 HOC
```javascript
const withErrorBoundary = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Component error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <ErrorFallback />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};
```

## 状态连接模式

### 基本 Redux 连接
```javascript
import { useSelector, useDispatch } from 'react-redux';

const MyContainer = () => {
  const data = useSelector(state => state.myData);
  const dispatch = useDispatch();
  
  const handleAction = useCallback(
    (payload) => dispatch(myAction(payload)),
    [dispatch]
  );
  
  return <MyComponent data={data} onAction={handleAction} />;
};
```

### 记忆化选择器
```javascript
import { createSelector } from 'reselect';

const getSprites = state => state.targets.sprites;
const getSelectedSpriteId = state => state.targets.selectedSprite;

const getSelectedSprite = createSelector(
  [getSprites, getSelectedSpriteId],
  (sprites, selectedId) => sprites.find(sprite => sprite.id === selectedId)
);

const SpriteEditorContainer = () => {
  const selectedSprite = useSelector(getSelectedSprite);
  // ...
};
```

## 性能考虑

### 避免不必要的重渲染
```javascript
// 对展示组件使用 React.memo
const SpriteItem = React.memo(({ sprite, isSelected, onSelect }) => (
  <div 
    className={`sprite-item ${isSelected ? 'selected' : ''}`}
    onClick={onSelect}
  >
    {sprite.name}
  </div>
));

// 对事件处理程序使用 useCallback
const SpriteListContainer = () => {
  const handleSelectSprite = useCallback(
    (spriteId) => dispatch(setEditingTarget(spriteId)),
    [dispatch]
  );
  
  // ...
};
```

### 选择性状态更新
```javascript
// 只订阅相关的状态切片
const MyContainer = () => {
  const relevantData = useSelector(state => ({
    sprites: state.targets.sprites,
    selectedId: state.targets.selectedSprite
  }), shallowEqual);
  
  // ...
};
```

## 容器测试

```javascript
describe('SpriteListContainer', () => {
  let store;
  
  beforeEach(() => {
    store = createMockStore({
      targets: {
        sprites: [mockSprite1, mockSprite2],
        selectedSprite: 'sprite1'
      }
    });
  });
  
  it('should pass correct props to presentation component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <SpriteListContainer />
      </Provider>
    );
    
    const spriteList = wrapper.find(SpriteList);
    expect(spriteList.prop('sprites')).toHaveLength(2);
    expect(spriteList.prop('selectedSpriteId')).toBe('sprite1');
  });
  
  it('should dispatch action when sprite selected', () => {
    const wrapper = mount(
      <Provider store={store}>
        <SpriteListContainer />
      </Provider>
    );
    
    wrapper.find(SpriteList).prop('onSelectSprite')('sprite2');
    
    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'targets/setEditingTarget',
      payload: 'sprite2'
    });
  });
});
```

## 最佳实践

### 分离关注点
- 让容器专注于数据和状态管理
- 让展示组件专注于 UI 和用户交互
- 避免将业务逻辑与展示逻辑混合

### 性能优化
- 对昂贵的计算使用记忆化
- 实现适当的 shouldComponentUpdate 逻辑
- 最小化状态订阅数量

### 错误处理
- 在错误边界中包装容器
- 优雅地处理异步操作失败
- 为错误状态提供备用 UI

### 测试策略
- 分别测试容器和展示组件
- 在容器测试中模拟外部依赖
- 专注于容器测试中的状态到 props 映射

## Bilup 特定模式

### VM 集成
大多数容器需要与 Bilup VM 交互：

```javascript
const BlocksContainer = () => {
  const vm = useSelector(state => state.vm.instance);
  
  useEffect(() => {
    if (vm) {
      vm.on('BLOCKS_NEED_UPDATE', handleBlocksUpdate);
      return () => vm.off('BLOCKS_NEED_UPDATE', handleBlocksUpdate);
    }
  }, [vm]);
  
  // ...
};
```

### 插件系统集成
容器可能需要与插件系统配合工作：

```javascript
const withAddonSupport = (WrappedComponent) => {
  return (props) => {
    const addons = useSelector(state => state.addons.enabled);
    const addonAPI = useAddonAPI();
    
    return (
      <WrappedComponent 
        {...props} 
        addons={addons}
        addonAPI={addonAPI}
      />
    );
  };
};
```

## 相关文档

- [GUI 容器](gui-container)
- [GUI 组件](../components/gui-component)
- [Redux Store](../state/home)
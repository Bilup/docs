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

## 架构

```
GUIContainer
├── MenuBarContainer
├── BlocksContainer (工作区)
├── StageWrapperContainer (舞台区)
├── TargetPaneContainer (角色/背景选择器)
├── CostumeTabContainer (造型管理)
├── SoundTabContainer (声音管理)
└── ModalContainer (叠加层)
```

## 应用初始化

容器处理复杂的初始化序列：

```javascript
const initializeApplication = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  
  try {
    // 初始化 VM
    const vm = new VirtualMachine();
    dispatch(setVM(vm));
    
    // 加载用户偏好设置
    const preferences = await loadUserPreferences();
    dispatch(setPreferences(preferences));
    
    // 初始化插件系统
    const addons = await loadEnabledAddons();
    dispatch(initializeAddons(addons));
    
    // 加载默认项目或恢复会话
    const savedProject = getSavedProject();
    if (savedProject) {
      await dispatch(loadProject(savedProject));
    } else {
      await dispatch(createDefaultProject());
    }
    
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError(error.message));
    dispatch(setLoading(false));
  }
};
```

## 事件处理

### 全局键盘快捷键
```javascript
const handleKeyDown = useCallback((event) => {
  const { key, ctrlKey, metaKey, shiftKey } = event;
  const cmd = ctrlKey || metaKey;
  
  // 当焦点在 Bilup 上时阻止浏览器快捷键
  if (document.activeElement?.closest('.gui')) {
    switch (true) {
      case cmd && key === 'n':
        event.preventDefault();
        dispatch(createNewProject());
        break;
        
      case cmd && key === 's':
        event.preventDefault();
        dispatch(saveProject());
        break;
        
      case cmd && key === 'z' && !shiftKey:
        event.preventDefault();
        dispatch(undo());
        break;
        
      case cmd && (key === 'y' || (key === 'z' && shiftKey)):
        event.preventDefault();
        dispatch(redo());
        break;
        
      case key === 'F11':
        event.preventDefault();
        dispatch(toggleFullScreen());
        break;
    }
  }
}, [dispatch]);

useEffect(() => {
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [handleKeyDown]);
```

### 窗口事件
```javascript
useEffect(() => {
  const handleBeforeUnload = (event) => {
    const state = store.getState();
    if (state.project.hasUnsavedChanges) {
      event.preventDefault();
      event.returnValue = '你还有未保存的更改。确定要离开吗?';
    }
  };
  
  const handleResize = () => {
    dispatch(setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight
    }));
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('resize', handleResize);
  };
}, []);
```

## 布局管理

### 响应式设计
```javascript
const useResponsiveLayout = () => {
  const [layoutMode, setLayoutMode] = useState('desktop');
  
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setLayoutMode('mobile');
      } else if (width < 1024) {
        setLayoutMode('tablet');
      } else {
        setLayoutMode('desktop');
      }
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);
  
  return layoutMode;
};
```

### 自适应 UI
```javascript
const AdaptiveGUI = () => {
  const layoutMode = useResponsiveLayout();
  
  const renderMobileLayout = () => (
    <div className="gui-mobile">
      <MobileMenuBar />
      <TabbedInterface>
        <Tab label="代码"><BlocksContainer /></Tab>
        <Tab label="造型"><CostumeTabContainer /></Tab>
        <Tab label="声音"><SoundTabContainer /></Tab>
      </TabbedInterface>
      <MobileStage />
    </div>
  );
  
  const renderDesktopLayout = () => (
    <div className="gui-desktop">
      <MenuBarContainer />
      <div className="gui-body">
        <BlocksContainer />
        <StageWrapperContainer />
        <AssetTabs />
      </div>
    </div>
  );
  
  return layoutMode === 'mobile' ? renderMobileLayout() : renderDesktopLayout();
};
```

## 错误处理

### 错误边界
```javascript
class GUIErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('GUI 错误:', error, errorInfo);
    
    // 向分析系统报告错误
    if (window.analytics) {
      window.analytics.track('GUI Error', {
        error: error.message,
        stack: error.stack,
        errorInfo
      });
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <ErrorScreen 
          error={this.state.error}
          onReload={() => window.location.reload()}
          onReport={() => this.reportError()}
        />
      );
    }
    
    return this.props.children;
  }
}
```

### 运行时错误处理
```javascript
const handleRuntimeError = useCallback((error) => {
  console.error('运行时错误:', error);
  
  dispatch(addNotification({
    type: 'error',
    message: `运行时错误: ${error.message}`,
    timeout: 5000
  }));
  
  // 如果错误严重则停止项目
  if (error.critical) {
    dispatch(stopProject());
  }
}, [dispatch]);
```

## 性能优化

### 代码分割
```javascript
const LazyBlocksContainer = React.lazy(() => import('./BlocksContainer'));
const LazyCostumeTab = React.lazy(() => import('./CostumeTabContainer'));

const GUIContainer = () => (
  <div className="gui">
    <MenuBarContainer />
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        <Route path="/blocks" component={LazyBlocksContainer} />
        <Route path="/costumes" component={LazyCostumeTab} />
      </Switch>
    </Suspense>
  </div>
);
```

### 记忆化
```javascript
const GUIContainer = React.memo(() => {
  // 组件实现
}, (prevProps, nextProps) => {
  // 自定义比较逻辑
  return prevProps.projectId === nextProps.projectId &&
         prevProps.activeTab === nextProps.activeTab;
});
```

## 测试

```javascript
describe('GUIContainer', () => {
  let store;
  
  beforeEach(() => {
    store = createMockStore({
      vm: { instance: null },
      gui: { activeTab: 'code', isLoading: false },
      project: { title: 'Test Project' }
    });
  });
  
  it('应该渲染主 GUI 结构', () => {
    const wrapper = mount(
      <Provider store={store}>
        <GUIContainer />
      </Provider>
    );
    
    expect(wrapper.find('.gui')).toHaveLength(1);
    expect(wrapper.find('MenuBarContainer')).toHaveLength(1);
    expect(wrapper.find('BlocksContainer')).toHaveLength(1);
  });
  
  it('应该处理 VM 初始化', async () => {
    const wrapper = mount(
      <Provider store={store}>
        <GUIContainer />
      </Provider>
    );
    
    await act(async () => {
      store.dispatch(setVM(new MockVM()));
    });
    
    wrapper.update();
    
    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'vm/setInstance',
      payload: expect.any(MockVM)
    });
  });
});
```

## 相关内容

- [容器概述](overview)
- [GUI 组件](../components/gui-component)
- [Redux Store](../state/redux-store)
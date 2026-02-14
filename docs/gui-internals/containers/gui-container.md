# GUI Container

The GUI Container is the root container component that orchestrates the entire MistWarp application interface.

## Overview

The GUI Container:
- Manages the overall application state
- Coordinates between major UI sections
- Handles global application events
- Provides the main layout structure
- Integrates with the VM and addon system

## Architecture

```
GUIContainer
├── MenuBarContainer
├── BlocksContainer (Workspace area)
├── StageWrapperContainer (Stage area)
├── TargetPaneContainer (Sprite/backdrop selector)
├── CostumeTabContainer (Asset management)
├── SoundTabContainer (Audio management)
└── ModalContainer (Overlays)
```

## Component Structure

```javascript
const GUIContainer = () => {
  const dispatch = useDispatch();
  const vm = useSelector(state => state.vm.instance);
  const projectTitle = useSelector(state => state.project.title);
  const isLoading = useSelector(state => state.gui.isLoading);
  const activeTab = useSelector(state => state.gui.activeTab);
  const isFullScreen = useSelector(state => state.gui.mode.isFullScreen);
  
  // Initialize application
  useEffect(() => {
    dispatch(initializeApplication());
  }, [dispatch]);
  
  // Handle VM events
  useEffect(() => {
    if (vm) {
      vm.on('PROJECT_LOADED', handleProjectLoaded);
      vm.on('PROJECT_CHANGED', handleProjectChanged);
      vm.on('RUNTIME_ERROR', handleRuntimeError);
      
      return () => {
        vm.off('PROJECT_LOADED', handleProjectLoaded);
        vm.off('PROJECT_CHANGED', handleProjectChanged);
        vm.off('RUNTIME_ERROR', handleRuntimeError);
      };
    }
  }, [vm]);
  
  if (isLoading) {
    return <LoadingScreen />;
  }
  
  return (
    <div className={`gui ${isFullScreen ? 'full-screen' : ''}`}>
      <MenuBarContainer />
      <div className="gui-body">
        <div className="workspace-area">
          <BlocksContainer />
        </div>
        <div className="stage-area">
          <StageWrapperContainer />
          <TargetPaneContainer />
        </div>
        <div className="asset-area">
          {activeTab === 'costumes' && <CostumeTabContainer />}
          {activeTab === 'sounds' && <SoundTabContainer />}
          {activeTab === 'code' && <BlocksContainer />}
        </div>
      </div>
      <ModalContainer />
    </div>
  );
};
```

## State Management

The GUI Container connects to multiple Redux slices:

```javascript
const mapStateToProps = state => ({
  // VM state
  vm: state.vm.instance,
  vmState: state.vm.state,
  
  // Project state
  projectTitle: state.project.title,
  projectId: state.project.id,
  hasUnsavedChanges: state.project.hasUnsavedChanges,
  
  // GUI state
  activeTab: state.gui.activeTab,
  isFullScreen: state.gui.mode.isFullScreen,
  isPlayerMode: state.gui.mode.isPlayer,
  isLoading: state.gui.isLoading,
  
  // Target state
  editingTarget: state.targets.editingTarget,
  
  // Addons state
  enabledAddons: state.addons.enabled,
  
  // User state
  user: state.session.user
});

const mapDispatchToProps = dispatch => ({
  onInitializeApplication: () => dispatch(initializeApplication()),
  onLoadProject: file => dispatch(loadProject(file)),
  onSaveProject: () => dispatch(saveProject()),
  onSetActiveTab: tab => dispatch(setActiveTab(tab)),
  onToggleFullScreen: () => dispatch(toggleFullScreen())
});
```

## Application Initialization

The container handles complex initialization sequences:

```javascript
const initializeApplication = () => async (dispatch, getState) => {
  dispatch(setLoading(true));
  
  try {
    // Initialize VM
    const vm = new VirtualMachine();
    dispatch(setVM(vm));
    
    // Load user preferences
    const preferences = await loadUserPreferences();
    dispatch(setPreferences(preferences));
    
    // Initialize addon system
    const addons = await loadEnabledAddons();
    dispatch(initializeAddons(addons));
    
    // Load default project or restore session
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

## Event Handling

### Global Keyboard Shortcuts
```javascript
const handleKeyDown = useCallback((event) => {
  const { key, ctrlKey, metaKey, shiftKey } = event;
  const cmd = ctrlKey || metaKey;
  
  // Prevent browser shortcuts when focused on MistWarp
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

### Window Events
```javascript
useEffect(() => {
  const handleBeforeUnload = (event) => {
    const state = store.getState();
    if (state.project.hasUnsavedChanges) {
      event.preventDefault();
      event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
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

## Layout Management

### Responsive Design
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

### Adaptive UI
```javascript
const AdaptiveGUI = () => {
  const layoutMode = useResponsiveLayout();
  
  const renderMobileLayout = () => (
    <div className="gui-mobile">
      <MobileMenuBar />
      <TabbedInterface>
        <Tab label="Code"><BlocksContainer /></Tab>
        <Tab label="Costumes"><CostumeTabContainer /></Tab>
        <Tab label="Sounds"><SoundTabContainer /></Tab>
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

## Error Handling

### Error Boundaries
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
    console.error('GUI Error:', error, errorInfo);
    
    // Report error to analytics
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

### Runtime Error Handling
```javascript
const handleRuntimeError = useCallback((error) => {
  console.error('Runtime error:', error);
  
  dispatch(addNotification({
    type: 'error',
    message: `Runtime error: ${error.message}`,
    timeout: 5000
  }));
  
  // Stop project if error is critical
  if (error.critical) {
    dispatch(stopProject());
  }
}, [dispatch]);
```

## Performance Optimization

### Code Splitting
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

### Memoization
```javascript
const GUIContainer = React.memo(() => {
  // Component implementation
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return prevProps.projectId === nextProps.projectId &&
         prevProps.activeTab === nextProps.activeTab;
});
```

## Testing

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
  
  it('should render main GUI structure', () => {
    const wrapper = mount(
      <Provider store={store}>
        <GUIContainer />
      </Provider>
    );
    
    expect(wrapper.find('.gui')).toHaveLength(1);
    expect(wrapper.find('MenuBarContainer')).toHaveLength(1);
    expect(wrapper.find('BlocksContainer')).toHaveLength(1);
  });
  
  it('should handle VM initialization', async () => {
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

## Related Components

- [Menu Bar Container](../components/menu-bar)
- [Components Overview](../components/gui-component)
- [Modal Container](../components/modals)

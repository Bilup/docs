---
title: 调试与测试
sidebar_position: 5
---

# Redux 调试与测试

在 Bilup 中调试和测试 Redux 状态需要理解 store 结构、有效使用开发工具以及实现全面的测试覆盖。

## 开发工具

### Redux DevTools

通过浏览器扩展访问 Redux DevTools：

```javascript
// 使用 DevTools 设置 Store
const configureStore = (initialState) => {
  const composeEnhancers = 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
};
```

DevTools 功能：
- **时间回溯**: 逐步浏览动作历史
- **状态检查**: 查看当前和历史状态
- **动作重放**: 从任意点重放动作
- **状态导入/导出**: 保存和加载状态快照

### 浏览器控制台调试

将调试辅助函数添加到 window 对象：

```javascript
// 添加到浏览器控制台用于调试
window.inspectReduxState = () => {
  const state = store.getState();
  console.log('Redux State:', state);
  return state;
};

window.dispatchAction = (action) => {
  store.dispatch(action);
  console.log('Dispatched:', action);
};

// 检查特定状态片段
window.getProjectState = () => store.getState().projectState;
window.getVMState = () => store.getState().vm;
window.getGUIState = () => store.getState().gui;
```

### 状态检查工具

```javascript
// 开发工具
const createStateInspector = (store) => {
  return {
    // 获取当前状态
    getState: () => store.getState(),
    
    // 获取特定状态片段
    getSlice: (path) => {
      const state = store.getState();
      return path.split('.').reduce((obj, key) => obj?.[key], state);
    },
    
    // 按谓词查找状态
    findInState: (predicate, obj = store.getState(), path = '') => {
      const results = [];
      
      Object.entries(obj).forEach(([key, value]) => {
        const currentPath = path ? `${path}.${key}` : key;
        
        if (predicate(value, key, currentPath)) {
          results.push({ path: currentPath, value });
        }
        
        if (typeof value === 'object' && value !== null) {
          results.push(...this.findInState(predicate, value, currentPath));
        }
      });
      
      return results;
    },
    
    // 监视状态变化
    watchState: (path, callback) => {
      let lastValue = this.getSlice(path);
      
      return store.subscribe(() => {
        const currentValue = this.getSlice(path);
        if (currentValue !== lastValue) {
          callback(currentValue, lastValue);
          lastValue = currentValue;
        }
      });
    }
  };
};

// 使用
const inspector = createStateInspector(store);
inspector.watchState('projectState.saveState', (current, previous) => {
  console.log(`保存状态已更改: ${previous} → ${current}`);
});
```

## 测试策略

### Reducer 测试

独立测试 reducers：

```javascript
import projectStateReducer from '../reducers/project-state';

describe('projectStateReducer', () => {
  const initialState = {
    projectId: null,
    projectTitle: '',
    isLoading: false,
    error: null,
    saveState: 'NOT_SAVED'
  };
  
  test('should handle SET_PROJECT_ID', () => {
    const action = { type: 'SET_PROJECT_ID', projectId: '123456789' };
    const newState = projectStateReducer(initialState, action);
    
    expect(newState.projectId).toBe('123456789');
    expect(newState).not.toBe(initialState); // 不可变性检查
  });
  
  test('should handle SET_PROJECT_LOADING', () => {
    const stateWithError = { ...initialState, error: 'Previous error' };
    const action = { type: 'SET_PROJECT_LOADING', isLoading: true };
    const newState = projectStateReducer(stateWithError, action);
    
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBe(null); // 错误应该被清除
  });
  
  test('should return current state for unknown actions', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = projectStateReducer(initialState, action);
    
    expect(newState).toBe(initialState);
  });
});
```

### Action Creator 测试

```javascript
import { setProjectTitle, loadProject } from '../actions/project-actions';

describe('Project Actions', () => {
  test('setProjectTitle should create correct action', () => {
    const title = 'My Project';
    const expectedAction = {
      type: 'SET_PROJECT_TITLE',
      title
    };
    
    expect(setProjectTitle(title)).toEqual(expectedAction);
  });
  
  test('loadProject should handle async loading', async () => {
    const mockDispatch = jest.fn();
    const mockGetState = jest.fn();
    
    // 模拟 fetch 请求
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ id: '123', title: 'Test Project' })
      })
    );
    
    const thunk = loadProject('123');
    await thunk(mockDispatch, mockGetState);
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_PROJECT_LOADING',
      isLoading: true
    });
    
    expect(mockDispatch).toHaveBeenCalledWith({
      type: 'SET_PROJECT',
      project: { id: '123', title: 'Test Project' }
    });
  });
});
```

### Store 集成测试

测试完整的 store 行为：

```javascript
import configureStore from '../store';

describe('Redux Store Integration', () => {
  let store;
  
  beforeEach(() => {
    store = configureStore();
  });
  
  test('should initialize with correct default state', () => {
    const state = store.getState();
    
    expect(state.projectState.projectId).toBe(null);
    expect(state.gui.theme.theme).toBe('light');
    expect(state.vm.targets).toEqual([]);
  });
  
  test('should handle action dispatch workflow', () => {
    // 设置项目 ID
    store.dispatch({
      type: 'SET_PROJECT_ID',
      projectId: '123456789'
    });
    
    let state = store.getState();
    expect(state.projectState.projectId).toBe('123456789');
    
    // 设置项目标题
    store.dispatch({
      type: 'SET_PROJECT_TITLE',
      title: 'My Project'
    });
    
    state = store.getState();
    expect(state.projectState.projectTitle).toBe('My Project');
  });
  
  test('should handle multiple state updates', () => {
    const actions = [
      { type: 'SET_PROJECT_ID', projectId: '123' },
      { type: 'SET_PROJECT_TITLE', title: 'Test' },
      { type: 'SET_THEME', theme: 'dark' },
      { type: 'SET_STAGE_SIZE', stageSize: 'small' }
    ];
    
    actions.forEach(action => store.dispatch(action));
    
    const state = store.getState();
    expect(state.projectState.projectId).toBe('123');
    expect(state.projectState.projectTitle).toBe('Test');
    expect(state.gui.theme.theme).toBe('dark');
    expect(state.gui.stage.stageSize).toBe('small');
  });
});
```

### Selector 测试

```javascript
import { 
  getProjectStatus, 
  getIsProjectLoaded, 
  getSpriteCount 
} from '../selectors';

describe('Selectors', () => {
  const mockState = {
    projectState: {
      projectId: '123',
      isLoading: false,
      saveState: 'NOT_SAVED'
    },
    vm: {
      targets: [
        { id: 'stage', isStage: true },
        { id: 'sprite1', isStage: false },
        { id: 'sprite2', isStage: false }
      ]
    }
  };
  
  test('getIsProjectLoaded should return correct value', () => {
    expect(getIsProjectLoaded(mockState)).toBe(true);
    
    const loadingState = {
      ...mockState,
      projectState: { ...mockState.projectState, isLoading: true }
    };
    expect(getIsProjectLoaded(loadingState)).toBe(false);
  });
  
  test('getProjectStatus should return correct status', () => {
    expect(getProjectStatus(mockState)).toBe('unsaved');
    
    const savedState = {
      ...mockState,
      projectState: { ...mockState.projectState, saveState: 'SAVED' }
    };
    expect(getProjectStatus(savedState)).toBe('saved');
  });
  
  test('getSpriteCount should count non-stage targets', () => {
    expect(getSpriteCount(mockState)).toBe(2);
  });
});
```

## 错误调试

### Redux 错误边界

```javascript
class ReduxErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Redux Error:', error);
    console.error('Error Info:', errorInfo);
    
    // 记录到错误跟踪服务
    if (window.errorTracker) {
      window.errorTracker.captureException(error, {
        context: 'Redux State',
        extra: errorInfo
      });
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>应用程序状态出现问题</h2>
          <details>
            <summary>错误详情</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
          <button onClick={() => window.location.reload()}>
            重新加载应用程序
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 状态验证

```javascript
// 状态形状验证
const validateState = (state) => {
  const errors = [];
  
  // 验证项目状态
  if (state.projectState.projectId && typeof state.projectState.projectId !== 'string') {
    errors.push('projectState.projectId must be string or null');
  }
  
  // 验证 VM 状态
  if (!Array.isArray(state.vm.targets)) {
    errors.push('vm.targets must be an array');
  }
  
  // 验证 GUI 状态
  const validThemes = ['light', 'dark', 'high-contrast'];
  if (!validThemes.includes(state.gui.theme.theme)) {
    errors.push(`gui.theme.theme must be one of: ${validThemes.join(', ')}`);
  }
  
  return errors;
};

// 在开发环境中使用
if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    const errors = validateState(store.getState());
    if (errors.length > 0) {
      console.error('State validation errors:', errors);
    }
  });
}
```

## 性能调试

### 动作性能监控

```javascript
const performanceDebugger = (store) => {
  const actionTimes = new Map();
  const slowActions = [];
  
  return {
    startTimer: (actionType) => {
      actionTimes.set(actionType, performance.now());
    },
    
    endTimer: (actionType) => {
      const startTime = actionTimes.get(actionType);
      if (startTime) {
        const duration = performance.now() - startTime;
        actionTimes.delete(actionType);
        
        if (duration > 10) {
          slowActions.push({ action: actionType, duration });
          console.warn(`Slow action: ${actionType} took ${duration.toFixed(2)}ms`);
        }
        
        return duration;
      }
    },
    
    getSlowActions: () => slowActions,
    
    reset: () => {
      actionTimes.clear();
      slowActions.length = 0;
    }
  };
};
```

### 内存使用跟踪

```javascript
const memoryTracker = (store) => {
  const measurements = [];
  
  return {
    measure: (label) => {
      const state = store.getState();
      const stateSize = JSON.stringify(state).length;
      
      measurements.push({
        label,
        timestamp: Date.now(),
        stateSize,
        heapUsed: performance.memory?.usedJSHeapSize || 0
      });
    },
    
    getReport: () => {
      return measurements.map((m, i) => {
        const prev = measurements[i - 1];
        return {
          ...m,
          stateDelta: prev ? m.stateSize - prev.stateSize : 0,
          heapDelta: prev ? m.heapUsed - prev.heapUsed : 0
        };
      });
    }
  };
};
```

## 调试常见问题

### 状态未更新

```javascript
// 检查 reducer 是否处理动作
const debugReducer = (reducer) => (state, action) => {
  console.log(`Reducer called with action: ${action.type}`);
  console.log('Previous state:', state);
  
  const newState = reducer(state, action);
  
  console.log('New state:', newState);
  console.log('State changed:', newState !== state);
  
  return newState;
};
```

### 动作未调用

```javascript
// 包装 dispatch 进行调试
const debugDispatch = (originalDispatch) => (action) => {
  console.log('Dispatching action:', action);
  
  try {
    const result = originalDispatch(action);
    console.log('Action dispatched successfully');
    return result;
  } catch (error) {
    console.error('Error dispatching action:', error);
    throw error;
  }
};

store.dispatch = debugDispatch(store.dispatch);
```

### 组件未重新渲染

```javascript
// 调试 useSelector
const useDebugSelector = (selector, equalityFn) => {
  const selected = useSelector(selector, equalityFn);
  
  useEffect(() => {
    console.log('Selector result changed:', selected);
  }, [selected]);
  
  return selected;
};
```

Bilup 中的 Redux 调试需要系统化的测试、监控和错误处理方法，以确保整个应用程序的可靠状态管理。
---
title: 中间件
sidebar_position: 4
---

# Redux 中间件

Bilup 中的中间件通过在 action 到达 reducer 之前拦截它们来扩展 Redux 功能。这实现了诸如 VM 同步、持久化、日志记录和异步操作等功能。

## Store 配置

### 基本设置

```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// 配置 store
const configureStore = (initialState) => {
  const composeEnhancers = 
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(thunk))
  );
};

export default configureStore;
```

### 开发工具

开发环境的 Redux DevTools 配置：

```javascript
// Redux DevTools 配置
const devToolsConfig = {
  // 限制动作历史记录
  maxAge: 50,
  
  // 跟踪动作
  trace: true,
  
  // 序列化状态
  serialize: {
    options: {
      undefined: true,
      function: true
    }
  },
  
  // 动作清理器
  actionSanitizer: (action) => ({
    ...action,
    // 从开发工具中移除大的 payload
    payload: action.type.includes('ASSET_') ? 
      '[Asset Data]' : action.payload
  }),
  
  // 状态清理器
  stateSanitizer: (state) => ({
    ...state,
    // 隐藏敏感数据
    assets: '[Assets Hidden]'
  })
};
```

## 自定义中间件

### VM 中间件

将 Redux 动作与虚拟机同步：

```javascript
// src/middleware/vm-middleware.js
const vmMiddleware = (vm) => (store) => (next) => (action) => {
  const result = next(action);
  
  // 将某些动作与 VM 同步
  switch (action.type) {
    case 'SET_EDITING_TARGET':
      vm.setEditingTarget(action.targetId);
      break;
      
    case 'SET_TURBO_MODE':
      vm.setTurboMode(action.turboMode);
      break;
      
    case 'SET_COMPATIBLE_MODE':
      vm.setCompatibilityMode(action.compatibilityMode);
      break;
  }
  
  return result;
};

export default vmMiddleware;
```

### 持久化中间件

自动将某些状态更改保存到 localStorage：

```javascript
// src/middleware/persistence-middleware.js
const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // 持久化某些状态更改
  const persistActions = [
    'SET_THEME',
    'SET_STAGE_SIZE',
    'SET_ADDON_ENABLED',
    'SET_ADDON_SETTINGS'
  ];
  
  if (persistActions.includes(action.type)) {
    const state = store.getState();
    localStorage.setItem('bilup-settings', JSON.stringify({
      theme: state.gui.theme,
      stageSize: state.gui.stage.stageSize,
      addons: state.addons
    }));
  }
  
  return result;
};

export default persistenceMiddleware;
```

## 状态同步

### VM 监听器

处理 Redux store 和 VM 之间的双向通信：

```javascript
// src/lib/vm-listener.js
class VMListener {
  constructor(store) {
    this.store = store;
    this.vm = null;
  }
  
  attachVM(vm) {
    this.vm = vm;
    this.setupVMListeners();
  }
  
  setupVMListeners() {
    this.vm.on('targetsUpdate', this.handleTargetsUpdate.bind(this));
    this.vm.on('MONITORS_UPDATE', this.handleMonitorsUpdate.bind(this));
    this.vm.on('PROJECT_LOADED', this.handleProjectLoaded.bind(this));
    this.vm.on('PROJECT_CHANGED', this.handleProjectChanged.bind(this));
  }
  
  handleTargetsUpdate(data) {
    this.store.dispatch({
      type: 'UPDATE_TARGETS',
      targets: data.targetList,
      editingTarget: data.editingTarget
    });
  }
  
  handleMonitorsUpdate(monitors) {
    this.store.dispatch({
      type: 'UPDATE_MONITORS',
      monitors: monitors
    });
  }
  
  handleProjectLoaded() {
    this.store.dispatch({
      type: 'SET_PROJECT_LOADING',
      isLoading: false
    });
    
    this.store.dispatch({
      type: 'SET_SAVE_STATE',
      saveState: 'SAVED'
    });
  }
  
  handleProjectChanged() {
    this.store.dispatch({
      type: 'SET_SAVE_STATE',
      saveState: 'NOT_SAVED'
    });
  }
}

export default VMListener;
```

### 资源加载中间件

处理异步资源加载：

```javascript
// src/middleware/asset-middleware.js
const assetMiddleware = (assetManager) => (store) => (next) => (action) => {
  if (action.type === 'LOAD_ASSET_REQUEST') {
    // 调用加载状态
    store.dispatch({
      type: 'SET_ASSET_LOADING',
      assetId: action.assetId,
      isLoading: true
    });
    
    // 异步加载资源
    assetManager.loadAsset(action.assetId)
      .then(assetData => {
        store.dispatch({
          type: 'LOAD_ASSET_SUCCESS',
          assetId: action.assetId,
          data: assetData
        });
      })
      .catch(error => {
        store.dispatch({
          type: 'LOAD_ASSET_ERROR',
          assetId: action.assetId,
          error: error.message
        });
      });
  }
  
  return next(action);
};

export default assetMiddleware;
```

## 开发中间件

### 动作日志器

在开发模式下记录所有动作：

```javascript
// 用于动作日志记录的开发中间件
const actionLogger = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`Action: ${action.type}`);
    console.log('Payload:', action);
    console.log('Previous State:', store.getState());
    
    const result = next(action);
    
    console.log('New State:', store.getState());
    console.groupEnd();
    
    return result;
  }
  
  return next(action);
};

export default actionLogger;
```

### 性能监控器

跟踪动作性能：

```javascript
const performanceMiddleware = (store) => (next) => (action) => {
  const start = performance.now();
  
  const result = next(action);
  
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 10) { // 记录慢速动作
    console.warn(`Slow action: ${action.type} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
};
```

## 错误处理

### 错误边界中间件

捕获并处理动作中的错误：

```javascript
const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux action error:', error);
    
    // 调用错误动作
    store.dispatch({
      type: 'GLOBAL_ERROR',
      error: {
        message: error.message,
        stack: error.stack,
        action: action.type
      }
    });
    
    // 防止状态损坏
    return { type: 'ERROR_HANDLED' };
  }
};
```

## 异步操作

### Thunk 动作

使用 redux-thunk 进行异步操作：

```javascript
// src/actions/project-actions.js
export const loadProject = (projectId) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'SET_PROJECT_LOADING', isLoading: true });
    
    try {
      const projectData = await fetch(`/api/projects/${projectId}`).then(r => r.json());
      
      dispatch({
        type: 'SET_PROJECT',
        project: projectData
      });
      
      dispatch({ type: 'SET_PROJECT_LOADING', isLoading: false });
      
    } catch (error) {
      dispatch({
        type: 'SET_PROJECT_ERROR',
        error: error.message
      });
    }
  };
};
```

### Saga 模式

用于复杂异步工作流：

```javascript
// src/middleware/saga-middleware.js
const sagaMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // 处理 saga 动作
  if (action.meta && action.meta.saga) {
    const saga = action.meta.saga;
    runSaga(saga, action, store);
  }
  
  return result;
};

const runSaga = async (saga, action, store) => {
  try {
    const generator = saga(action);
    let next = generator.next();
    
    while (!next.done) {
      const effect = next.value;
      
      if (effect.type === 'CALL') {
        const result = await effect.fn(...effect.args);
        next = generator.next(result);
      } else if (effect.type === 'PUT') {
        store.dispatch(effect.action);
        next = generator.next();
      }
    }
  } catch (error) {
    store.dispatch({
      type: 'SAGA_ERROR',
      error: error.message,
      saga: saga.name
    });
  }
};
```

## 测试中间件

### 中间件测试

```javascript
import vmMiddleware from '../middleware/vm-middleware';

describe('VM Middleware', () => {
  let mockVM, store, next, middleware;
  
  beforeEach(() => {
    mockVM = {
      setEditingTarget: jest.fn(),
      setTurboMode: jest.fn()
    };
    
    store = { getState: jest.fn() };
    next = jest.fn();
    middleware = vmMiddleware(mockVM)(store)(next);
  });
  
  test('should call VM methods for relevant actions', () => {
    const action = { type: 'SET_EDITING_TARGET', targetId: 'sprite1' };
    
    middleware(action);
    
    expect(next).toHaveBeenCalledWith(action);
    expect(mockVM.setEditingTarget).toHaveBeenCalledWith('sprite1');
  });
  
  test('should pass through unrelated actions', () => {
    const action = { type: 'UNRELATED_ACTION' };
    
    middleware(action);
    
    expect(next).toHaveBeenCalledWith(action);
    expect(mockVM.setEditingTarget).not.toHaveBeenCalled();
  });
});
```

## 最佳实践

### 中间件顺序

中间件的顺序很重要：

```javascript
const store = createStore(
  rootReducer,
  applyMiddleware(
    errorMiddleware,      // 第一：捕获所有错误
    actionLogger,        // 第二：记录动作
    persistenceMiddleware, // 第三：处理持久化
    vmMiddleware(vm),    // 第四：与 VM 同步
    thunk               // 最后：处理异步动作
  )
);
```

### 性能考虑

- 保持中间件轻量级
- 避免在中间件中进行复杂操作
- 对频繁动作使用防抖：

```javascript
const debounceMiddleware = (store) => (next) => {
  const debounced = new Map();
  
  return (action) => {
    if (action.meta && action.meta.debounce) {
      const key = `${action.type}_${action.meta.key || 'default'}`;
      
      if (debounced.has(key)) {
        clearTimeout(debounced.get(key));
      }
      
      debounced.set(key, setTimeout(() => {
        next(action);
        debounced.delete(key);
      }, action.meta.debounce));
      
      return action;
    }
    
    return next(action);
  };
};
```

中间件提供了强大的钩子来拦截 Redux 的动作流，实现日志记录、持久化和 VM 同步等横切关注点，同时保持 reducer 纯净和专注。
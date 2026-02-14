---
title: Middleware
sidebar_position: 4
---

# Redux Middleware

Middleware in MistWarp extends Redux functionality by intercepting actions before they reach reducers. This enables features like VM synchronization, persistence, logging, and async operations.

## Store Configuration

### Basic Setup

```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

// Configure store
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

### Development Tools

Redux DevTools configuration for development:

```javascript
// Redux DevTools configuration
const devToolsConfig = {
  // Limit action history
  maxAge: 50,
  
  // Trace actions
  trace: true,
  
  // Serialize state
  serialize: {
    options: {
      undefined: true,
      function: true
    }
  },
  
  // Action sanitizer
  actionSanitizer: (action) => ({
    ...action,
    // Remove large payloads from dev tools
    payload: action.type.includes('ASSET_') ? 
      '[Asset Data]' : action.payload
  }),
  
  // State sanitizer
  stateSanitizer: (state) => ({
    ...state,
    // Hide sensitive data
    assets: '[Assets Hidden]'
  })
};
```

## Custom Middleware

### VM Middleware

Synchronizes Redux actions with the Virtual Machine:

```javascript
// src/middleware/vm-middleware.js
const vmMiddleware = (vm) => (store) => (next) => (action) => {
  const result = next(action);
  
  // Sync certain actions with VM
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

### Persistence Middleware

Automatically saves certain state changes to localStorage:

```javascript
// src/middleware/persistence-middleware.js
const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Persist certain state changes
  const persistActions = [
    'SET_THEME',
    'SET_STAGE_SIZE',
    'SET_ADDON_ENABLED',
    'SET_ADDON_SETTINGS'
  ];
  
  if (persistActions.includes(action.type)) {
    const state = store.getState();
    localStorage.setItem('mistwarp-settings', JSON.stringify({
      theme: state.gui.theme,
      stageSize: state.gui.stage.stageSize,
      addons: state.addons
    }));
  }
  
  return result;
};

export default persistenceMiddleware;
```

## State Synchronization

### VM Listener

Handles bidirectional communication between Redux store and VM:

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

### Asset Loading Middleware

Handles asynchronous asset loading:

```javascript
// src/middleware/asset-middleware.js
const assetMiddleware = (assetManager) => (store) => (next) => (action) => {
  if (action.type === 'LOAD_ASSET_REQUEST') {
    // Dispatch loading state
    store.dispatch({
      type: 'SET_ASSET_LOADING',
      assetId: action.assetId,
      isLoading: true
    });
    
    // Load asset asynchronously
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

## Development Middleware

### Action Logger

Logs all actions in development mode:

```javascript
// Development middleware for action logging
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

### Performance Monitor

Tracks action performance:

```javascript
const performanceMiddleware = (store) => (next) => (action) => {
  const start = performance.now();
  
  const result = next(action);
  
  const end = performance.now();
  const duration = end - start;
  
  if (duration > 10) { // Log slow actions
    console.warn(`Slow action: ${action.type} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
};
```

## Error Handling

### Error Boundary Middleware

Catches and handles errors in actions:

```javascript
const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error('Redux action error:', error);
    
    // Dispatch error action
    store.dispatch({
      type: 'GLOBAL_ERROR',
      error: {
        message: error.message,
        stack: error.stack,
        action: action.type
      }
    });
    
    // Prevent state corruption
    return { type: 'ERROR_HANDLED' };
  }
};
```

## Async Operations

### Thunk Actions

Using redux-thunk for async operations:

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

### Saga Pattern

For complex async workflows:

```javascript
// src/middleware/saga-middleware.js
const sagaMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Handle saga actions
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

## Testing Middleware

### Middleware Testing

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

## Best Practices

### Middleware Order

The order of middleware matters:

```javascript
const store = createStore(
  rootReducer,
  applyMiddleware(
    errorMiddleware,      // First: catch all errors
    actionLogger,        // Second: log actions
    persistenceMiddleware, // Third: handle persistence
    vmMiddleware(vm),    // Fourth: sync with VM
    thunk               // Last: handle async actions
  )
);
```

### Performance Considerations

- Keep middleware lightweight
- Avoid expensive operations in middleware
- Use debouncing for frequent actions:

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

Middleware provides powerful hooks into Redux's action flow, enabling cross-cutting concerns like logging, persistence, and VM synchronization while keeping reducers pure and focused.

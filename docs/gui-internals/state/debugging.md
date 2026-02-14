---
title: Debugging & Testing
sidebar_position: 5
---

# Redux Debugging & Testing

Debugging and testing Redux state in MistWarp requires understanding the store structure, using development tools effectively, and implementing comprehensive test coverage.

## Development Tools

### Redux DevTools

Access Redux DevTools through browser extensions:

```javascript
// Store setup with DevTools
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

DevTools features:
- **Time Travel**: Step through action history
- **State Inspection**: View current and historical state
- **Action Replay**: Replay actions from any point
- **State Import/Export**: Save and load state snapshots

### Browser Console Debugging

Add debugging helpers to window object:

```javascript
// Add to browser console for debugging
window.inspectReduxState = () => {
  const state = store.getState();
  console.log('Redux State:', state);
  return state;
};

window.dispatchAction = (action) => {
  store.dispatch(action);
  console.log('Dispatched:', action);
};

// Inspect specific state slices
window.getProjectState = () => store.getState().projectState;
window.getVMState = () => store.getState().vm;
window.getGUIState = () => store.getState().gui;
```

### State Inspection Utilities

```javascript
// Development utilities
const createStateInspector = (store) => {
  return {
    // Get current state
    getState: () => store.getState(),
    
    // Get specific slice
    getSlice: (path) => {
      const state = store.getState();
      return path.split('.').reduce((obj, key) => obj?.[key], state);
    },
    
    // Find state by predicate
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
    
    // Monitor state changes
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

// Usage
const inspector = createStateInspector(store);
inspector.watchState('projectState.saveState', (current, previous) => {
  console.log(`Save state changed: ${previous} → ${current}`);
});
```

## Testing Strategies

### Reducer Testing

Test reducers in isolation:

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
    expect(newState).not.toBe(initialState); // Immutability check
  });
  
  test('should handle SET_PROJECT_LOADING', () => {
    const stateWithError = { ...initialState, error: 'Previous error' };
    const action = { type: 'SET_PROJECT_LOADING', isLoading: true };
    const newState = projectStateReducer(stateWithError, action);
    
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBe(null); // Error should be cleared
  });
  
  test('should return current state for unknown actions', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const newState = projectStateReducer(initialState, action);
    
    expect(newState).toBe(initialState);
  });
});
```

### Action Creator Testing

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
    
    // Mock fetch
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

### Store Integration Testing

Test complete store behavior:

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
    // Set project ID
    store.dispatch({
      type: 'SET_PROJECT_ID',
      projectId: '123456789'
    });
    
    let state = store.getState();
    expect(state.projectState.projectId).toBe('123456789');
    
    // Set project title
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

### Selector Testing

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

## Error Debugging

### Error Boundary for Redux

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
    
    // Log to error tracking service
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
          <h2>Something went wrong with the application state</h2>
          <details>
            <summary>Error Details</summary>
            <pre>{this.state.error?.stack}</pre>
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### State Validation

```javascript
// State shape validation
const validateState = (state) => {
  const errors = [];
  
  // Validate project state
  if (state.projectState.projectId && typeof state.projectState.projectId !== 'string') {
    errors.push('projectState.projectId must be string or null');
  }
  
  // Validate VM state
  if (!Array.isArray(state.vm.targets)) {
    errors.push('vm.targets must be an array');
  }
  
  // Validate GUI state
  const validThemes = ['light', 'dark', 'high-contrast'];
  if (!validThemes.includes(state.gui.theme.theme)) {
    errors.push(`gui.theme.theme must be one of: ${validThemes.join(', ')}`);
  }
  
  return errors;
};

// Use in development
if (process.env.NODE_ENV === 'development') {
  store.subscribe(() => {
    const errors = validateState(store.getState());
    if (errors.length > 0) {
      console.error('State validation errors:', errors);
    }
  });
}
```

## Performance Debugging

### Action Performance Monitoring

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

### Memory Usage Tracking

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

## Debugging Common Issues

### State Not Updating

```javascript
// Check if reducer is handling action
const debugReducer = (reducer) => (state, action) => {
  console.log(`Reducer called with action: ${action.type}`);
  console.log('Previous state:', state);
  
  const newState = reducer(state, action);
  
  console.log('New state:', newState);
  console.log('State changed:', newState !== state);
  
  return newState;
};
```

### Action Not Dispatching

```javascript
// Wrap dispatch to debug
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

### Component Not Re-rendering

```javascript
// Debug useSelector
const useDebugSelector = (selector, equalityFn) => {
  const selected = useSelector(selector, equalityFn);
  
  useEffect(() => {
    console.log('Selector result changed:', selected);
  }, [selected]);
  
  return selected;
};
```

Redux debugging in MistWarp requires systematic approaches to testing, monitoring, and error handling to ensure reliable state management across the application.

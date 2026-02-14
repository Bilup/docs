---
title: Redux Store
sidebar_position: 1
---

# Redux Store

The Redux store is the central state management system in MistWarp's GUI. It maintains the application state and coordinates updates across all components. Understanding the store structure is crucial for developing and debugging MistWarp.

## Store Architecture

### Store Structure
```javascript
// Complete store state structure
const initialState = {
  // Project and editing state
  projectState: {
    projectId: null,
    projectTitle: '',
    isLoading: false,
    error: null,
    hasEverEnteredEditor: false,
    saveState: 'NOT_SAVED' // 'SAVED', 'SAVING', 'NOT_SAVED'
  },
  
  // Virtual Machine state
  vm: {
    editingTarget: null,
    targets: [],
    stage: null,
    monitors: [],
    isPlayerOnly: false,
    isStarted: false
  },
  
  // Interface state
  gui: {
    mode: {
      isPlayerOnly: false,
      isFullScreen: false,
      hasCloudData: false
    },
    theme: {
      theme: 'light',
      colors: {},
      customTheme: null
    },
    stage: {
      stageSize: 'large'
    }
  },
  
  // Modal and overlay state
  modals: {
    loadingProject: false,
    previewInfo: false,
    importingAsset: false,
    backdrop: false,
    costume: false,
    sound: false,
    sprite: false
  },
  
  // Alerts and notifications
  alerts: {
    alertsList: [],
    connectionBanner: false
  },
  
  // Cards and tutorials
  cards: {
    visible: true,
    content: [],
    activeDeckId: null,
    step: 0,
    x: 0,
    y: 0
  },
  
  // Asset management
  assets: {
    defaultProject: null,
    sounds: [],
    costumes: [],
    sprites: []
  },
  
  // Extension state
  extensions: {
    extensionLibraryVisible: false,
    extensions: {}
  },
  
  // Addon state
  addons: {
    addons: {},
    addonSettings: {},
    addonEnabled: {}
  }
};
```

## Store Configuration

### Store Setup
```javascript
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

// Import all reducers
import projectStateReducer from './reducers/project-state';
import vmReducer from './reducers/vm';
import guiReducer from './reducers/gui';
import modalsReducer from './reducers/modals';
import alertsReducer from './reducers/alerts';
import cardsReducer from './reducers/cards';
import assetsReducer from './reducers/assets';
import extensionsReducer from './reducers/extensions';
import addonsReducer from './reducers/addons';

// Combine reducers
const rootReducer = combineReducers({
  projectState: projectStateReducer,
  vm: vmReducer,
  gui: guiReducer,
  modals: modalsReducer,
  alerts: alertsReducer,
  cards: cardsReducer,
  assets: assetsReducer,
  extensions: extensionsReducer,
  addons: addonsReducer
});

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

## Core Reducers

### Project State Reducer
```javascript
// src/reducers/project-state.js
const initialProjectState = {
  projectId: null,
  projectTitle: '',
  isLoading: false,
  error: null,
  hasEverEnteredEditor: false,
  saveState: 'NOT_SAVED'
};

const projectStateReducer = (state = initialProjectState, action) => {
  switch (action.type) {
    case 'SET_PROJECT_ID':
      return {
        ...state,
        projectId: action.projectId
      };
      
    case 'SET_PROJECT_TITLE':
      return {
        ...state,
        projectTitle: action.title
      };
      
    case 'SET_PROJECT_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
        error: action.isLoading ? null : state.error
      };
      
    case 'SET_PROJECT_ERROR':
      return {
        ...state,
        error: action.error,
        isLoading: false
      };
      
    case 'SET_SAVE_STATE':
      return {
        ...state,
        saveState: action.saveState
      };
      
    case 'ENTER_EDITOR':
      return {
        ...state,
        hasEverEnteredEditor: true
      };
      
    default:
      return state;
  }
};

export default projectStateReducer;
```

### VM Reducer
```javascript
// src/reducers/vm.js
const initialVMState = {
  editingTarget: null,
  targets: [],
  stage: null,
  monitors: [],
  isPlayerOnly: false,
  isStarted: false
};

const vmReducer = (state = initialVMState, action) => {
  switch (action.type) {
    case 'SET_EDITING_TARGET':
      return {
        ...state,
        editingTarget: action.targetId
      };
      
    case 'UPDATE_TARGETS':
      return {
        ...state,
        targets: action.targets,
        stage: action.targets.find(target => target.isStage) || null
      };
      
    case 'UPDATE_MONITORS':
      return {
        ...state,
        monitors: action.monitors
      };
      
    case 'SET_PLAYER_ONLY':
      return {
        ...state,
        isPlayerOnly: action.isPlayerOnly
      };
      
    case 'SET_STARTED_STATE':
      return {
        ...state,
        isStarted: action.isStarted
      };
      
    default:
      return state;
  }
};

export default vmReducer;
```

### GUI Reducer
```javascript
// src/reducers/gui.js
const initialGUIState = {
  mode: {
    isPlayerOnly: false,
    isFullScreen: false,
    hasCloudData: false
  },
  theme: {
    theme: 'light',
    colors: {},
    customTheme: null
  },
  stage: {
    stageSize: 'large'
  }
};

const guiReducer = (state = initialGUIState, action) => {
  switch (action.type) {
    case 'SET_PLAYER_ONLY':
      return {
        ...state,
        mode: {
          ...state.mode,
          isPlayerOnly: action.isPlayerOnly
        }
      };
      
    case 'SET_FULL_SCREEN':
      return {
        ...state,
        mode: {
          ...state.mode,
          isFullScreen: action.isFullScreen
        }
      };
      
    case 'SET_THEME':
      return {
        ...state,
        theme: {
          ...state.theme,
          theme: action.theme
        }
      };
      
    case 'SET_CUSTOM_THEME':
      return {
        ...state,
        theme: {
          ...state.theme,
          customTheme: action.customTheme
        }
      };
      
    case 'SET_STAGE_SIZE':
      return {
        ...state,
        stage: {
          ...state.stage,
          stageSize: action.stageSize
        }
      };
      
    default:
      return state;
  }
};

export default guiReducer;
```

## State Selectors

### Creating Selectors
```javascript
// src/selectors/project-state.js
import { createSelector } from 'reselect';

// Basic selectors
export const getProjectState = state => state.projectState;
export const getProjectId = state => state.projectState.projectId;
export const getProjectTitle = state => state.projectState.projectTitle;
export const getIsLoading = state => state.projectState.isLoading;
export const getSaveState = state => state.projectState.saveState;

// Computed selectors
export const getIsProjectLoaded = createSelector(
  [getProjectId, getIsLoading],
  (projectId, isLoading) => projectId !== null && !isLoading
);

export const getHasUnsavedChanges = createSelector(
  [getSaveState],
  (saveState) => saveState === 'NOT_SAVED'
);

export const getProjectStatus = createSelector(
  [getIsLoading, getIsProjectLoaded, getHasUnsavedChanges],
  (isLoading, isLoaded, hasChanges) => {
    if (isLoading) return 'loading';
    if (!isLoaded) return 'no-project';
    if (hasChanges) return 'unsaved';
    return 'saved';
  }
);
```

### VM Selectors
```javascript
// src/selectors/vm.js
export const getVM = state => state.vm;
export const getEditingTarget = state => state.vm.editingTarget;
export const getTargets = state => state.vm.targets;
export const getStage = state => state.vm.stage;
export const getMonitors = state => state.vm.monitors;

export const getEditingTargetObject = createSelector(
  [getTargets, getEditingTarget],
  (targets, editingTargetId) => 
    targets.find(target => target.id === editingTargetId)
);

export const getSprites = createSelector(
  [getTargets],
  (targets) => targets.filter(target => !target.isStage)
);

export const getSpriteCount = createSelector(
  [getSprites],
  (sprites) => sprites.length
);
```

## Middleware

### Custom Middleware
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

### VM State Sync
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

## Performance Optimization

### Memoization
```javascript
// Use reselect for expensive computations
export const getTargetSpriteCounts = createSelector(
  [getTargets],
  (targets) => {
    // Expensive computation
    return targets.reduce((counts, target) => {
      if (!target.isStage) {
        const sprite = target.sprite;
        counts[sprite.name] = (counts[sprite.name] || 0) + 1;
      }
      return counts;
    }, {});
  }
);
```

### State Normalization
```javascript
// Normalize complex state structures
const normalizeTargets = (targets) => {
  const byId = {};
  const allIds = [];
  
  targets.forEach(target => {
    byId[target.id] = target;
    allIds.push(target.id);
  });
  
  return { byId, allIds };
};
```

## Debugging Tools

### State Inspection
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
```

### Action Logging
```javascript
// Development middleware for action logging
const actionLogger = (store) => (next) => (action) => {
  console.group(`Action: ${action.type}`);
  console.log('Payload:', action);
  console.log('Previous State:', store.getState());
  
  const result = next(action);
  
  console.log('New State:', store.getState());
  console.groupEnd();
  
  return result;
};
```

## Testing

### Reducer Testing
```javascript
import projectStateReducer from '../reducers/project-state';

describe('projectStateReducer', () => {
  test('should handle SET_PROJECT_ID', () => {
    const initialState = { projectId: null };
    const action = { type: 'SET_PROJECT_ID', projectId: '123456789' };
    const newState = projectStateReducer(initialState, action);
    
    expect(newState.projectId).toBe('123456789');
  });
  
  test('should handle SET_PROJECT_LOADING', () => {
    const initialState = { isLoading: false, error: 'Previous error' };
    const action = { type: 'SET_PROJECT_LOADING', isLoading: true };
    const newState = projectStateReducer(initialState, action);
    
    expect(newState.isLoading).toBe(true);
    expect(newState.error).toBe(null);
  });
});
```

### Store Testing
```javascript
import configureStore from '../store';

describe('Redux Store', () => {
  let store;
  
  beforeEach(() => {
    store = configureStore();
  });
  
  test('should initialize with correct state', () => {
    const state = store.getState();
    expect(state.projectState.projectId).toBe(null);
    expect(state.gui.theme.theme).toBe('light');
  });
  
  test('should handle action dispatch', () => {
    store.dispatch({
      type: 'SET_PROJECT_ID',
      projectId: '123456789'
    });
    
    const state = store.getState();
    expect(state.projectState.projectId).toBe('123456789');
  });
});
```

The Redux store in MistWarp provides a robust, predictable state management system that coordinates all aspects of the application. Understanding its structure and patterns is essential for effective development and debugging.

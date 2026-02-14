---
title: Reducers
sidebar_position: 2
---

# Redux Reducers

Reducers in MistWarp handle state transitions in response to dispatched actions. Each reducer manages a specific slice of the application state and follows Redux principles of immutability and predictability.
- VM state (runtime, performance)
- Addon state (enabled addons, settings)
## Store Structure

The complete store state structure includes:

```javascript
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

## Core Reducers

### Project State Reducer

Manages project loading, saving, and metadata:

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

Handles Virtual Machine state including targets, monitors, and runtime state:

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

Manages user interface state including themes, modes, and display settings:

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

## Reducer Composition

### Root Reducer

All reducers are combined into a single root reducer:

```javascript
import { combineReducers } from 'redux';

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

export default rootReducer;
```

### State Normalization

For complex state structures, normalization improves performance:

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

## Best Practices

### Immutability

Always return new state objects rather than mutating existing state:

```javascript
// Good: Creates new object
case 'UPDATE_PROPERTY':
  return {
    ...state,
    property: action.value
  };

// Bad: Mutates existing state
case 'UPDATE_PROPERTY':
  state.property = action.value;
  return state;
```

### Action Structure

Use consistent action structure with type and payload:

```javascript
// Consistent action structure
const setProjectTitle = (title) => ({
  type: 'SET_PROJECT_TITLE',
  title
});

// For complex payloads
const updateTargets = (targets, editingTarget) => ({
  type: 'UPDATE_TARGETS',
  targets,
  editingTarget
});
```

### Error Handling

Handle errors gracefully in reducers:

```javascript
case 'SET_PROJECT_ERROR':
  return {
    ...state,
    error: action.error,
    isLoading: false,
    // Clear any conflicting state
    projectId: state.error ? state.projectId : null
  };
```

Reducers form the backbone of MistWarp's state management, ensuring predictable and maintainable state transitions throughout the application.

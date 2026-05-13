---
title: Reducer
sidebar_position: 2
---

# Redux Reducers

Bilup 中的 Reducer 负责处理响应派发动作的状态转换。每个 reducer 管理应用状态的特定切片，并遵循 Redux 的不可变性和可预测性原则。
- VM 状态（运行时、性能）
- 插件状态（已启用插件、设置）
## Store 结构

完整的 store 状态结构包括：

```javascript
const initialState = {
  // 项目和编辑状态
  projectState: {
    projectId: null,
    projectTitle: '',
    isLoading: false,
    error: null,
    hasEverEnteredEditor: false,
    saveState: 'NOT_SAVED' // 'SAVED', 'SAVING', 'NOT_SAVED'
  },
  
  // 虚拟机状态
  vm: {
    editingTarget: null,
    targets: [],
    stage: null,
    monitors: [],
    isPlayerOnly: false,
    isStarted: false
  },
  
  // 界面状态
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
  
  // 模态框和覆盖层状态
  modals: {
    loadingProject: false,
    previewInfo: false,
    importingAsset: false,
    backdrop: false,
    costume: false,
    sound: false,
    sprite: false
  },
  
  // 警告和通知
  alerts: {
    alertsList: [],
    connectionBanner: false
  },
  
  // 卡片和教程
  cards: {
    visible: true,
    content: [],
    activeDeckId: null,
    step: 0,
    x: 0,
    y: 0
  },
  
  // 资源管理
  assets: {
    defaultProject: null,
    sounds: [],
    costumes: [],
    sprites: []
  },
  
  // 扩展状态
  extensions: {
    extensionLibraryVisible: false,
    extensions: {}
  },
  
  // 插件状态
  addons: {
    addons: {},
    addonSettings: {},
    addonEnabled: {}
  }
};
```

## 核心 Reducer

### 项目状态 Reducer

管理项目加载、保存和元数据：

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

处理虚拟机状态，包括目标、监视器和运行时状态：

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

管理用户界面状态，包括主题、模式和显示设置：

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

## Reducer 组合

### 根 Reducer

所有 reducer 组合成单个根 reducer：

```javascript
import { combineReducers } from 'redux';

// 导入所有 reducer
import projectStateReducer from './reducers/project-state';
import vmReducer from './reducers/vm';
import guiReducer from './reducers/gui';
import modalsReducer from './reducers/modals';
import alertsReducer from './reducers/alerts';
import cardsReducer from './reducers/cards';
import assetsReducer from './reducers/assets';
import extensionsReducer from './reducers/extensions';
import addonsReducer from './reducers/addons';

// 组合 reducer
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

### 状态规范化

对于复杂的状态结构，规范化可以提高性能：

```javascript
// 规范化复杂状态结构
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

## 最佳实践

### 不可变性

始终返回新的状态对象，而不是修改现有状态：

```javascript
// 良好：创建新对象
case 'UPDATE_PROPERTY':
  return {
    ...state,
    property: action.value
  };

// 不良：修改现有状态
case 'UPDATE_PROPERTY':
  state.property = action.value;
  return state;
```

### 动作结构

使用一致的动作结构，包含 type 和 payload：

```javascript
// 一致的动作结构
const setProjectTitle = (title) => ({
  type: 'SET_PROJECT_TITLE',
  title
});

// 对于复杂 payload
const updateTargets = (targets, editingTarget) => ({
  type: 'UPDATE_TARGETS',
  targets,
  editingTarget
});
```

### 错误处理

在 reducer 中优雅地处理错误：

```javascript
case 'SET_PROJECT_ERROR':
  return {
    ...state,
    error: action.error,
    isLoading: false,
    // 清除任何冲突状态
    projectId: state.error ? state.projectId : null
  };
```

Reducer 构成了 Bilup 状态管理的核心，确保整个应用程序中状态转换的可预测性和可维护性。
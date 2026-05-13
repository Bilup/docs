---
title: Redux Store
sidebar_position: 1
---

# Redux Store

Redux store 是 Bilup GUI 中的中央状态管理系统。它维护应用程序状态并协调整个组件的更新。了解 store 结构对于开发和调试 Bilup 至关重要。

## Store 架构

### Store 结构
```javascript
// 完整的 store 状态结构
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

## Store 配置

### Store 设置
```javascript
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

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

## 核心 Reducer

### 项目状态 Reducer
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

## 状态选择器

### 创建选择器
```javascript
// src/selectors/project-state.js
import { createSelector } from 'reselect';

// 基本选择器
export const getProjectState = state => state.projectState;
export const getProjectId = state => state.projectState.projectId;
export const getProjectTitle = state => state.projectState.projectTitle;
export const getIsLoading = state => state.projectState.isLoading;
export const getSaveState = state => state.projectState.saveState;

// 计算选择器
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

### VM 选择器
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

## 中间件

### 自定义中间件
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

### VM 状态同步
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

## 性能优化

### 记忆化
```javascript
// 使用 reselect 进行昂贵计算
export const getTargetSpriteCounts = createSelector(
  [getTargets],
  (targets) => {
    // 昂贵计算
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

### 状态规范化
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

## 调试工具

### 状态检查
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
```

### 动作日志
```javascript
// 用于动作日志记录的开发中间件
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

## 测试

### Reducer 测试
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

### Store 测试
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

Bilup 中的 Redux store 提供了一个健壮、可预测的状态管理系统，协调整个应用程序的各个方面。理解其结构和模式对于有效的开发和调试至关重要。
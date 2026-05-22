---
title: Redux Store 概述
sidebar_position: 1
---

# Redux Store 概述

Redux store 是 Bilup 的中央状态管理系统。它维护所有应用程序状态并协调组件之间的更新。

## 架构

Bilup 使用单个 Redux store，包含多个 reducer 管理应用程序状态的不同部分：

```javascript
const store = {
  projectState: {},   // 项目元数据和加载状态
  vm: {},            // 虚拟机状态(目标、监视器)
  gui: {},           // 界面状态(主题、模态框、舞台)
  alerts: {},        // 通知和错误消息
  assets: {},        // 声音、造型、角色
  extensions: {},    // 扩展加载和状态
  addons: {}         // 插件设置和状态
};
```

## Store 配置

Store 使用中间件和开发工具进行配置：

```javascript
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

const rootReducer = combineReducers({
  projectState: projectStateReducer,
  vm: vmReducer,
  gui: guiReducer,
  alerts: alertsReducer,
  assets: assetsReducer,
  extensions: extensionsReducer,
  addons: addonsReducer
});

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

## 关键状态片段

### Project State
管理项目元数据和加载状态：
- 项目 ID 和标题
- 加载状态和错误
- 保存状态跟踪

### VM State
与 Scratch 虚拟机交互：
- 当前编辑目标
- 所有角色和舞台
- 监视器和变量
- 运行时状态

### GUI State
控制界面外观和行为：
- 主题设置
- 模态框可见性
- 舞台大小和全屏模式
- 菜单状态

## 状态流程

1. **Actions** 从组件调用
2. **Reducers** 更新特定状态片段
3. **Selectors** 为组件提取数据
4. **Middleware** 处理副作用和持久化

## 开发工具

Redux DevTools 配置用于调试：

```javascript
const devToolsConfig = {
  maxAge: 50,
  trace: true,
  actionSanitizer: (action) => ({
    ...action,
    payload: action.type.includes('ASSET_') ? 
      '[Asset Data]' : action.payload
  })
};
```

## 下一步

- [了解 Reducers](./reducers) - 独立状态管理
- [探索 Selectors](./selectors) - 数据提取模式
- [理解 Middleware](./middleware) - 副作用和持久化
- [使用工具调试](./debugging) - 开发和调试技术
---
title: Redux Store Overview
sidebar_position: 1
---

# Redux Store Overview

The Redux store is MistWarp's central state management system. It maintains all application state and coordinates updates across components.

## Architecture

MistWarp uses a single Redux store with multiple reducers managing different parts of the application state:

```javascript
const store = {
  projectState: {},   // Project metadata and loading state
  vm: {},            // Virtual Machine state (targets, monitors)
  gui: {},           // Interface state (theme, modals, stage)
  alerts: {},        // Notifications and error messages
  assets: {},        // Sounds, costumes, sprites
  extensions: {},    // Extension loading and state
  addons: {}         // Addon settings and state
};
```

## Store Configuration

The store is configured with middleware and development tools:

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

## Key State Slices

### Project State
Manages project metadata and loading status:
- Project ID and title
- Loading states and errors
- Save status tracking

### VM State  
Interfaces with the Scratch Virtual Machine:
- Current editing target
- All sprites and stage
- Monitors and variables
- Runtime state

### GUI State
Controls interface appearance and behavior:
- Theme settings
- Modal visibility
- Stage size and fullscreen mode
- Menu states

## State Flow

1. **Actions** are dispatched from components
2. **Reducers** update specific state slices
3. **Selectors** extract data for components
4. **Middleware** handles side effects and persistence

## Development Tools

Redux DevTools are configured for debugging:

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

## Next Steps

- [Learn about Reducers](./reducers) - Individual state management
- [Explore Selectors](./selectors) - Data extraction patterns  
- [Understand Middleware](./middleware) - Side effects and persistence
- [Debug with Tools](./debugging) - Development and debugging techniques

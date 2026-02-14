---
title: Project Structure
sidebar_position: 3
---

# MistWarp Project Structure

Understanding MistWarp's project structure is essential for effective development. This guide explains how the codebase is organized and how different components interact.

## Repository Overview

MistWarp consists of several interconnected repositories:

```
MistWarp Ecosystem
├── scratch-gui/          # Main GUI application (React-based editor)
├── scratch-vm/           # Virtual machine and runtime engine
├── scratch-render/       # WebGL-based rendering engine  
├── scratch-blocks/       # Visual block editor (Blockly-based)
├── scratch-paint/        # Costume and backdrop editor
├── scratch-audio/        # Web Audio API implementation
├── packager/             # Web-based project packager
└── docs/                 # Documentation site (this site)
```

## scratch-gui Structure

The main GUI repository contains the React-based editor interface:

```
scratch-gui/
├── src/                          # Source code
│   ├── components/               # React UI components
│   │   ├── gui/                  # Main GUI component
│   │   ├── blocks/               # Block editor integration
│   │   ├── stage/                # Stage display component
│   │   ├── sprite-selector/      # Sprite management UI
│   │   ├── menu-bar/             # Top menu bar
│   │   └── ...                   # Other UI components
│   ├── containers/               # Redux-connected containers
│   │   ├── gui.jsx               # Main GUI container
│   │   ├── blocks.jsx            # Blocks editor container
│   │   ├── stage.jsx             # Stage container
│   │   └── ...                   # Other containers
│   ├── lib/                      # Utility libraries
│   │   ├── themes/               # Theme system
│   │   ├── storage.js            # Project storage
│   │   ├── vm-manager-hoc.jsx    # VM integration
│   │   └── ...                   # Other utilities
│   ├── reducers/                 # Redux reducers
│   │   ├── gui.js                # Main GUI state
│   │   ├── project-state.js      # Project loading state
│   │   ├── targets.js            # Sprite/stage state
│   │   └── ...                   # Other reducers
│   ├── addons/                   # Addon system
│   │   ├── api.js                # Addon API implementation
│   │   ├── hooks.js              # Integration hooks
│   │   ├── generated/            # Generated addon files
│   │   └── addons/               # Individual addon implementations
│   ├── css/                      # Global stylesheets
│   │   ├── colors.css            # Color definitions
│   │   ├── units.css             # Size and spacing units
│   │   └── ...                   # Other global styles
│   └── index.js                  # Application entry point
├── static/                       # Static assets
│   ├── favicon.ico               # Site favicon
│   ├── blocks-media/             # Block icons and media
│   └── example-extensions/       # Example extension files
├── test/                         # Test files
│   ├── unit/                     # Unit tests
│   ├── integration/              # Integration tests
│   └── fixtures/                 # Test data and mocks
├── webpack.config.js             # Webpack build configuration
├── package.json                  # NPM dependencies and scripts
└── README.md                     # Repository documentation
```

## Component Architecture

### Component Hierarchy

```
App
└── GUI (Main Interface)
    ├── MenuBar
    │   ├── File Menu
    │   ├── Edit Menu
    │   ├── Settings
    │   └── Theme Selector
    ├── GUI Body
    │   ├── Editor Panel (Left)
    │   │   ├── Tabs (Code/Costumes/Sounds)
    │   │   ├── Blocks Workspace
    │   │   ├── Costume Editor
    │   │   └── Sound Editor
    │   └── Stage Panel (Right)
    │       ├── Stage Header
    │       ├── Stage Canvas
    │       └── Target Pane
    │           ├── Sprite Selector
    │           └── Stage Selector
    └── Modals & Overlays
        ├── Extension Library
        ├── Costume Library
        ├── Sound Library
        ├── Settings Modal
        └── Alerts
```

### File Naming Conventions

Components follow consistent naming patterns:

```
src/components/component-name/
├── component-name.jsx        # Main component file
├── component-name.css        # Component styles
└── index.js                  # Export file (optional)

src/containers/
├── component-name.jsx        # Redux-connected container
└── component-name-hoc.jsx    # Higher-order component

src/lib/
├── utility-name.js           # Utility functions
└── utility-name-hoc.jsx      # Utility HOC
```

## State Management Structure

### Redux Store Organization

```javascript
{
    // Main GUI state
    scratchGui: {
        projectState: {           // Project loading/saving state
            loadingState: 'SHOWING_WITH_ID',
            projectId: '12345',
            error: null
        },
        editorTab: {              // Active editor tab
            activeTabIndex: 0     // 0=blocks, 1=costumes, 2=sounds
        },
        targets: {                // Sprites and stage
            sprites: {...},
            stage: {...},
            editingTarget: 'sprite1'
        },
        mode: {                   // Display mode
            isFullScreen: false,
            isPlayerOnly: false,
            isEmbedded: false
        },
        modals: {                 // Modal visibility
            extensionLibrary: false,
            costumeLibrary: false,
            soundLibrary: false
        },
        alerts: {                 // Notifications
            visible: true,
            alertsList: []
        },
        theme: {                  // Theme state
            theme: 'dark'
        },
        tw: {                     // MistWarp-specific state
            customStageSize: { width: 480, height: 360 },
            isWindowFullScreen: false
        }
    },
    
    // Localization state
    locales: {
        locale: 'en',
        isRtl: false,
        messages: {...}
    },
    
    // Paint editor state (when active)
    scratchPaint: {
        brushes: {...},
        selectedItems: [...],
        undoStack: [...]
    }
}
```

### Action Types

Actions follow the pattern `CATEGORY/ACTION_NAME`:

```javascript
// GUI actions
'gui/SET_EDITING_TARGET'
'gui/ACTIVATE_TAB' 
'gui/SET_FULL_SCREEN'

// Project actions
'project/LOAD_PROJECT_START'
'project/LOAD_PROJECT_SUCCESS'
'project/LOAD_PROJECT_ERROR'

// Modal actions
'modals/OPEN_EXTENSION_LIBRARY'
'modals/CLOSE_COSTUME_LIBRARY'

// Theme actions
'theme/SET_THEME'
'theme/LOAD_CUSTOM_THEME'
```

## Addon System Structure

### Addon Organization

```
src/addons/
├── api.js                        # Addon API implementation
├── hooks.js                      # Integration hooks for addons
├── generated/                    # Auto-generated files
│   ├── addon-entries.js          # Addon entry points
│   └── addon-manifests.js        # Addon metadata
└── addons/                       # Individual addon implementations
    ├── editor-devtools/           # Example addon
    │   ├── addon.json             # Addon manifest
    │   ├── _runtime_entry.js      # Runtime entry point
    │   ├── userscript.js          # Main addon code
    │   └── style.css              # Addon styles
    └── ...                        # Other addons
```

### Addon Manifest Structure

```json
{
    "name": "Editor DevTools",
    "description": "Developer tools for the block editor",
    "tags": ["development", "debugging"],
    "enabledByDefault": false,
    "userscripts": [
        {
            "url": "userscript.js",
            "matches": ["projects"]
        }
    ],
    "userstyles": [
        {
            "url": "style.css",
            "matches": ["projects"]
        }
    ],
    "settings": [
        {
            "id": "showConsole",
            "name": "Show Console",
            "type": "boolean",
            "default": true
        }
    ]
}
```

## Build System Structure

### Webpack Configuration

The build system uses Webpack with several specialized configurations:

```javascript
// webpack.config.js structure
module.exports = {
    entry: {
        app: './src/index.js',
        // Dynamic addon entries are added automatically
    },
    
    resolve: {
        alias: {
            // Package aliases for development
            'scratch-vm': path.resolve(__dirname, '../scratch-vm/src'),
            'scratch-render': path.resolve(__dirname, '../scratch-render/src')
        }
    },
    
    module: {
        rules: [
            // JavaScript/JSX processing
            {
                test: /\.jsx?$/,
                use: ['babel-loader']
            },
            
            // CSS processing with modules
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[name]_[local]_[hash:base64:5]'
                        }
                    },
                    'postcss-loader'
                ]
            },
            
            // Asset processing
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: ['file-loader']
            }
        ]
    },
    
    plugins: [
        // Addon processing plugin
        new AddonManifestPlugin(),
        
        // Development tools
        new webpack.HotModuleReplacementPlugin(),
        
        // Production optimizations
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
};
```

### Build Scripts

Package.json defines several build commands:

```json
{
    "scripts": {
        "start": "webpack-dev-server --mode development",
        "build": "webpack --mode production",
        "test": "jest",
        "lint": "eslint src/",
        "format": "prettier --write src/",
        "pull": "node scripts/pull-addons.js"
    }
}
```

## Development Environment

### Local Development Setup

For local development with linked packages:

```bash
# Clone repositories
git clone https://github.com/MistWarp/scratch-gui.git
git clone https://github.com/MistWarp/scratch-vm.git
git clone https://github.com/MistWarp/scratch-render.git

# Link VM and Render to GUI
cd scratch-vm && npm link
cd ../scratch-render && npm link
cd ../scratch-gui && npm link scratch-vm scratch-render

# Install dependencies and start
npm ci
npm start
```

### Environment Variables

Development environment can be customized:

```bash
# .env.local
NODE_ENV=development
REACT_APP_DEBUG=true
REACT_APP_ADDON_DEV_MODE=true

# Optional package overrides
REACT_APP_VM_ORIGIN=http://localhost:8073
REACT_APP_RENDER_ORIGIN=http://localhost:8074
```

### Development Tools Integration

```javascript
// Development mode utilities
if (process.env.NODE_ENV === 'development') {
    // Expose debugging utilities
    window.vm = vm;
    window.reduxStore = store;
    window.ScratchBlocks = ScratchBlocks;
    
    // Enable React DevTools
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || {};
    
    // Enable Redux DevTools
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}
```

## Testing Structure

### Test Organization

```
test/
├── unit/                         # Unit tests
│   ├── components/               # Component tests
│   ├── reducers/                 # Reducer tests
│   └── lib/                      # Utility tests
├── integration/                  # Integration tests
│   ├── gui-integration.test.js   # Full GUI tests
│   ├── vm-integration.test.js    # VM integration tests
│   └── addon-integration.test.js # Addon system tests
├── e2e/                          # End-to-end tests
│   ├── basic-functionality.test.js
│   ├── project-loading.test.js
│   └── addon-functionality.test.js
├── fixtures/                     # Test data
│   ├── projects/                 # Sample projects
│   ├── assets/                   # Test assets
│   └── mocks/                    # Mock data
└── setup/                        # Test configuration
    ├── jest.config.js
    ├── test-utils.js
    └── enzyme-adapter.js
```

### Test Utilities

```javascript
// test/setup/test-utils.js
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from '../../src/reducers';

export const renderWithRedux = (
    ui,
    { initialState, store = createStore(rootReducer, initialState) } = {}
) => {
    return {
        ...render(<Provider store={store}>{ui}</Provider>),
        store,
    };
};
```

## Documentation Structure

This documentation site is built with Docusaurus and organized as:

```
docs/
├── docs/                         # Documentation content
│   ├── getting-started/          # Getting started guides
│   ├── user-guide/               # User documentation
│   ├── development/              # Development guides
│   ├── gui-internals/            # Technical internals
│   ├── api-reference/            # API documentation
│   └── legacy/                   # Preserved old content
├── src/                          # Custom components and pages
├── static/                       # Static assets
├── docusaurus.config.js          # Site configuration
├── sidebars.js                   # Navigation structure
└── package.json                  # Dependencies and scripts
```

Understanding this structure will help you navigate the codebase effectively and contribute to MistWarp development. Each part has a specific purpose and clear interfaces with other components.

---

*For specific development workflows, see the [Building & Running](./building-running.md) guide.*

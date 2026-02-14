---
title: Architecture Deep Dive
sidebar_position: 2
---

# MistWarp GUI Architecture

This document provides an in-depth look at MistWarp's GUI architecture, design patterns, and core systems.

## System Architecture

### High-Level Overview

MistWarp follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                      │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  React Components │ │    CSS Modules   │ │  Theme Engine   ││
│  │  (UI Elements)    │ │   (Styling)      │ │  (Appearance)   ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      Business Logic Layer                   │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Containers    │ │      HOCs       │ │   Middleware    ││
│  │ (Data Binding)  │ │ (Cross-cutting) │ │ (Side Effects)  ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                      State Management Layer                 │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │  Redux Store    │ │    Reducers     │ │     Actions     ││
│  │ (Global State)  │ │ (State Logic)   │ │  (State Changes)││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│                        Engine Layer                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐│
│  │   Scratch VM    │ │ Scratch Render  │ │ Scratch Blocks  ││
│  │   (Runtime)     │ │   (Graphics)    │ │   (Editor)      ││
│  └─────────────────┘ └─────────────────┘ └─────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Core Design Principles

1. **Unidirectional Data Flow** - Data flows down, events flow up
2. **Component Composition** - Small, reusable components
3. **Separation of Concerns** - Clear responsibility boundaries  
4. **Immutable State** - Predictable state mutations
5. **Declarative UI** - Describe what UI should look like
6. **Performance First** - Optimized rendering and updates

## Component Architecture

### Component Hierarchy

```
App
├── GUI (Main Interface)
│   ├── MenuBar
│   ├── GUI Body
│   │   ├── Blocks Panel
│   │   │   ├── Blocks Tabs
│   │   │   └── Blocks Workspace
│   │   └── Stage Panel  
│   │       ├── Stage Header
│   │       ├── Stage Wrapper
│   │       │   └── Stage Canvas
│   │       └── Target Pane
│   │           ├── Sprite Selector
│   │           └── Stage Selector
│   └── Modals
│       ├── Extension Library
│       ├── Costume Library
│       ├── Sound Library
│       └── Settings Modal
└── Global Components
    ├── Alerts
    ├── Drag Layer
    └── Connection Modal
```

### Component Types

#### Presentation Components
Pure UI components focused on appearance:

```jsx
// Example: Button component
const Button = ({ children, onClick, disabled, className }) => (
    <button
        className={classNames(styles.button, className)}
        onClick={onClick}
        disabled={disabled}
    >
        {children}
    </button>
);
```

#### Container Components
Connected to Redux store for data:

```jsx
// Example: Connected sprite selector
const SpriteSelectorContainer = connect(
    state => ({
        sprites: state.targets.sprites,
        selectedSprite: state.targets.editingTarget
    }),
    dispatch => ({
        onSelectSprite: id => dispatch(setEditingTarget(id))
    })
)(SpriteSelector);
```

#### Higher-Order Components (HOCs)
Wrap components with additional functionality:

```jsx
// Example: Error boundary HOC
const withErrorBoundary = (WrappedComponent) => {
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = { hasError: false };
        }

        static getDerivedStateFromError(error) {
            return { hasError: true };
        }

        render() {
            if (this.state.hasError) {
                return <ErrorDisplay />;
            }
            return <WrappedComponent {...this.props} />;
        }
    };
};
```

## State Management Architecture

### Redux Store Structure

```js
{
    // Project and loading state
    scratchGui: {
        projectState: {
            loadingState: 'SHOWING_WITH_ID',
            projectId: '12345',
            error: null
        },
        
        // Editor state
        editorTab: {
            activeTabIndex: 0 // 0=code, 1=costumes, 2=sounds
        },
        
        // Target (sprite/stage) state
        targets: {
            sprites: {...},
            stage: {...},
            editingTarget: 'sprite1'
        },
        
        // UI state
        mode: {
            isFullScreen: false,
            isPlayerOnly: false,
            isEmbedded: false
        },
        
        // Modal visibility
        modals: {
            extensionLibrary: false,
            costumeLibrary: false,
            soundLibrary: false,
            settings: false
        },
        
        // Alerts and notifications
        alerts: {
            visible: true,
            alertsList: []
        },
        
        // MistWarp-specific state
        tw: {
            theme: 'dark',
            customStageSize: { width: 480, height: 360 },
            isWindowFullScreen: false
        }
    },
    
    // Localization
    locales: {
        locale: 'en',
        isRtl: false,
        messages: {...}
    }
}
```

### Data Flow Patterns

#### Standard Redux Flow
```
User Action → Component → Container → Action Creator → Reducer → Store → Component
```

#### VM Integration Flow
```
VM Event → VM Listener HOC → Redux Action → Reducer → Store → Components
```

#### Addon Integration Flow
```
Addon → Addon API → Component Modification/Event → Redux/VM Integration
```

## Engine Integration

### VM (Virtual Machine) Integration

The GUI communicates with the Scratch VM through a well-defined interface:

```jsx
class GUI extends React.Component {
    componentDidMount() {
        // Initialize VM listeners
        this.props.vm.on('PROJECT_LOADED', this.handleProjectLoaded);
        this.props.vm.on('PROJECT_START', this.handleProjectStart);
        this.props.vm.on('PROJECT_STOP_ALL', this.handleProjectStop);
        
        // Set up renderer
        this.props.vm.attachRenderer(this.renderer);
        this.props.vm.attachAudioEngine(this.audioEngine);
    }
    
    handleProjectLoaded = () => {
        this.props.onProjectLoaded();
        this.updateTargets();
    };
}
```

### Renderer Integration

Graphics rendering is handled by scratch-render:

```jsx
class Stage extends React.Component {
    componentDidMount() {
        // Initialize renderer
        this.renderer = new ScratchRender(this.canvas);
        this.props.vm.attachRenderer(this.renderer);
        
        // Set up event handlers
        this.attachMouseEvents();
        this.attachKeyboardEvents();
    }
    
    attachMouseEvents() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown);
        this.canvas.addEventListener('mousemove', this.handleMouseMove);
        this.canvas.addEventListener('mouseup', this.handleMouseUp);
    }
}
```

### Blocks Integration

The visual block editor integrates with Blockly:

```jsx
class Blocks extends React.Component {
    componentDidMount() {
        // Initialize Blockly workspace
        this.ScratchBlocks = VMScratchBlocks(this.props.vm);
        this.workspace = this.ScratchBlocks.inject(this.blocksContainer);
        
        // Set up block change listeners
        this.workspace.addChangeListener(this.handleBlocksChange);
    }
    
    handleBlocksChange = (event) => {
        if (event.type === 'create' || event.type === 'delete') {
            this.updateVM();
        }
    };
}
```

## Addon System Architecture

### Addon Loading Pipeline

```
Addon Manifest → Addon Loader → Runtime Entry → API Injection → Component Modification
```

### Addon API Structure

```js
class AddonAPI {
    constructor(addonId, tab) {
        this.addonId = addonId;
        this.tab = tab;
        this.settings = new AddonSettings(addonId);
        this.msg = new AddonMessage(addonId);
    }
    
    // Tab API for DOM manipulation
    get tab() {
        return {
            waitForElement: (selector) => {...},
            appendToSharedSpace: (config) => {...},
            createEditorModal: (config) => {...}
        };
    }
    
    // Settings API  
    get settings() {
        return {
            get: (key) => {...},
            addEventListener: (type, callback) => {...}
        };
    }
}
```

### Addon Integration Points

Addons can integrate at multiple levels:

1. **DOM Manipulation** - Direct UI modifications
2. **Component Wrapping** - Higher-order component injection
3. **Redux Integration** - State monitoring and modification
4. **VM Integration** - Runtime behavior modification
5. **CSS Injection** - Styling modifications

## Theme System Architecture

### CSS Variable System

MistWarp uses CSS custom properties for theming:

```css
:root {
    /* Color palette */
    --ui-primary: #4c97ff;
    --ui-secondary: #855cd6;
    --ui-white: #ffffff;
    --ui-black: #000000;
    
    /* Semantic colors */
    --text-primary: var(--ui-black);
    --background-primary: var(--ui-white);
    --border-color: #d9d9d9;
    
    /* Component-specific */
    --menu-bar-background: var(--ui-primary);
    --blocks-background: #f9f9f9;
    --stage-background: var(--ui-white);
}

[theme="dark"] {
    --text-primary: var(--ui-white);
    --background-primary: #1e1e1e;
    --border-color: #404040;
}
```

### Theme Engine

```js
class ThemeManager {
    constructor() {
        this.themes = new Map();
        this.currentTheme = 'light';
    }
    
    registerTheme(name, variables) {
        this.themes.set(name, variables);
    }
    
    applyTheme(name) {
        const theme = this.themes.get(name);
        if (!theme) return;
        
        const root = document.documentElement;
        Object.entries(theme).forEach(([key, value]) => {
            root.style.setProperty(`--${key}`, value);
        });
        
        this.currentTheme = name;
    }
}
```

## Performance Architecture

### Rendering Optimization

1. **React.memo** - Prevent unnecessary re-renders
2. **useMemo/useCallback** - Memoize expensive calculations
3. **Virtual Scrolling** - Handle large lists efficiently
4. **Code Splitting** - Load components on demand

### Memory Management

```js
class ComponentManager {
    componentDidMount() {
        // Set up listeners
        this.vm.on('PROJECT_LOADED', this.handleProjectLoaded);
    }
    
    componentWillUnmount() {
        // Clean up listeners to prevent memory leaks
        this.vm.off('PROJECT_LOADED', this.handleProjectLoaded);
        
        // Cancel pending requests
        this.abortController.abort();
    }
}
```

### Bundle Optimization

- **Tree Shaking** - Remove unused code
- **Code Splitting** - Split bundles by route/feature
- **Dynamic Imports** - Load addons on demand
- **Asset Optimization** - Compress images and fonts

## Error Handling Architecture

### Error Boundaries

```jsx
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log error to monitoring service
        console.error('Component Error:', error, errorInfo);
        
        // Report to analytics
        this.reportError(error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return <ErrorFallback error={this.state.error} />;
        }

        return this.props.children;
    }
}
```

### Global Error Handling

```js
// Global error handler
window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    // Report to monitoring service
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Report to monitoring service
});
```

## Testing Architecture

### Testing Strategy

1. **Unit Tests** - Individual component behavior
2. **Integration Tests** - Component interaction
3. **E2E Tests** - Full user workflows
4. **Visual Regression Tests** - UI consistency
5. **Performance Tests** - Render timing and memory usage

### Test Structure

```js
// Component test example
describe('Button Component', () => {
    it('renders correctly', () => {
        const { getByText } = render(
            <Button onClick={jest.fn()}>
                Click me
            </Button>
        );
        
        expect(getByText('Click me')).toBeInTheDocument();
    });
    
    it('calls onClick when clicked', () => {
        const handleClick = jest.fn();
        const { getByText } = render(
            <Button onClick={handleClick}>
                Click me
            </Button>
        );
        
        fireEvent.click(getByText('Click me'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
```

## Security Architecture

### Content Security Policy

```js
// CSP configuration
const cspDirectives = {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-eval'"], // Needed for VM
    styleSrc: ["'self'", "'unsafe-inline'"], // Needed for themes
    imgSrc: ["'self'", "data:", "blob:"],
    connectSrc: ["'self'", "https://api.scratch.mit.edu"]
};
```

### Addon Security

```js
// Addon sandboxing
class AddonSandbox {
    executeAddon(addonCode, api) {
        // Create restricted environment
        const sandbox = {
            addon: api,
            console: this.createRestrictedConsole(),
            // No access to window, document directly
        };
        
        // Execute in sandbox
        const execute = new Function(
            'addon', 'console',
            addonCode
        );
        
        execute(sandbox.addon, sandbox.console);
    }
}
```

This architecture provides the foundation for MistWarp's powerful, extensible, and performant GUI system. Each layer has clear responsibilities and interfaces, enabling maintainable and scalable development.

---

*For specific implementation details, see the individual component and system documentation sections.*

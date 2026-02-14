---
slug: /api-reference/
title: API Reference Overview
sidebar_position: 1
---

# MistWarp API Reference

This section provides comprehensive documentation for all APIs available in MistWarp, including the Virtual Machine API, GUI API, Extension API, and Addon API.

## API Categories

### 🔧 [VM API](./vm-api.md)
The Virtual Machine API provides programmatic control over project execution, sprites, and runtime behavior.

### 🎨 [GUI API](./gui-api.md)
The GUI API allows interaction with the user interface, including components, modals, and editor state.

### 🧩 [Extension API](./extension-api.md)
The Extension API enables creation of custom blocks and extensions that integrate with the Scratch programming environment.

### 🔌 [Addon API](./addon-api.md)
The Addon API provides tools for modifying and extending the MistWarp interface and behavior.

### 📡 [Events](./events.md)
Comprehensive event system documentation for listening to and dispatching events throughout MistWarp.

### 🧵 [Threads API](./threads.md)
Advanced thread management for controlling script execution, monitoring threads, and managing execution flow.

### 🛠️ [Utilities](./utilities.md)
Collection of utility functions and helpers available throughout the MistWarp codebase.

## Quick Start

### Accessing APIs

MistWarp exposes several global objects for API access:

```javascript
// Virtual Machine instance
const vm = window.vm;

// Redux store for GUI state (note: capital R in ReduxStore)
const store = window.ReduxStore;

// Scratch blocks (when available)
const ScratchBlocks = window.ScratchBlocks;

// Note: window.addons is not available as a global.
// Addons have their own API available within addon contexts.
```

### Basic Usage Examples

#### VM API Example
```javascript
// Start the project
vm.start();

// Get all sprites
const sprites = vm.runtime.targets.filter(target => !target.isStage);

// Listen for project events
vm.on('PROJECT_START', () => {
    console.log('Project started!');
});
```

#### GUI API Example
```javascript
// Access the Redux store (note: capital R in ReduxStore)
const state = store.getState();

// Get current editing target
const editingTarget = state.scratchGui.targets.editingTarget;

// Dispatch an action
store.dispatch({
    type: 'SET_EDITING_TARGET',
    targetId: 'sprite1'
});
```

#### Extension API Example
```javascript
class MyExtension {
    getInfo() {
        return {
            id: 'myextension',
            name: 'My Extension',
            blocks: [
                {
                    opcode: 'myBlock',
                    blockType: 'command',
                    text: 'my custom block'
                }
            ]
        };
    }
    
    myBlock() {
        console.log('Custom block executed!');
    }
}
```

#### Addon API Example
```javascript
export default async function ({ addon, msg }) {
    // Wait for an element to appear
    const button = await addon.tab.waitForElement('.green-flag');
    
    // Add click listener
    button.addEventListener('click', () => {
        console.log('Green flag clicked!');
    });
    
    // Add CSS
    addon.tab.addCSS(`
        .green-flag {
            background-color: red !important;
        }
    `);
}
```

## API Design Principles

### Consistency
All MistWarp APIs follow consistent patterns:

- **Naming**: camelCase for methods, kebab-case for events
- **Parameters**: Objects for complex parameters, primitives for simple ones
- **Return Values**: Promises for async operations, direct values for sync
- **Error Handling**: Consistent error types and messages

### Backwards Compatibility
MistWarp maintains backwards compatibility:

- **Deprecation Warnings**: Old APIs show warnings before removal
- **Transition Periods**: Adequate time provided for migration
- **Documentation**: Clear migration guides for API changes

### Type Safety
TypeScript definitions are provided for all APIs:

```typescript
interface VMAPI {
    start(): void;
    stop(): void;
    greenFlag(): void;
    runtime: Runtime;
}

interface ExtensionInfo {
    id: string;
    name: string;
    blocks: BlockDefinition[];
    menus?: MenuDefinition[];
}
```

## Authentication & Security

### Extension Security
Extensions run in different security contexts:

```javascript
// Sandboxed extensions (safe, limited access)
class SafeExtension {
    // Limited API access
    // No DOM access
    // No network access (except approved domains)
}

// Unsandboxed extensions (powerful, requires user permission)
class PowerfulExtension {
    // Full API access
    // DOM manipulation allowed
    // Network access allowed
}
```

### Addon Security
Addons have controlled access to MistWarp internals:

```javascript
// Addon manifest security settings
{
    "permissions": ["DOM", "CSS", "redux"],
    "unsafeAccess": false,
    "trustedDomains": ["example.com"]
}
```

## Rate Limiting

Some APIs have rate limiting to prevent abuse:

```javascript
// VM operations: 1000 calls per second
vm.runtime.startHats(...); // Rate limited

// GUI updates: 60 FPS maximum
store.dispatch(...); // Batched for performance

// Network requests: 10 per second
fetch('https://api.example.com'); // Rate limited
```

## Error Handling

### Error Types

```javascript
// VM errors
class VMError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'VMError';
        this.code = code;
    }
}

// GUI errors  
class GUIError extends Error {
    constructor(message, component) {
        super(message);
        this.name = 'GUIError';
        this.component = component;
    }
}

// Extension errors
class ExtensionError extends Error {
    constructor(message, extensionId) {
        super(message);
        this.name = 'ExtensionError';
        this.extensionId = extensionId;
    }
}
```

### Error Handling Patterns

```javascript
// Try-catch for synchronous operations
try {
    vm.start();
} catch (error) {
    if (error instanceof VMError) {
        console.error('VM Error:', error.message);
    }
}

// Promise catch for asynchronous operations
vm.loadProject(projectData)
    .then(() => console.log('Project loaded'))
    .catch(error => console.error('Load failed:', error));

// Event-based error handling
vm.on('ERROR', (error) => {
    console.error('VM Error:', error);
});
```

## Performance Considerations

### Efficient API Usage

```javascript
// ❌ Inefficient: Multiple separate calls
sprites.forEach(sprite => {
    // Note: vm.runtime.setEditingTarget doesn't exist
    // Use proper target selection methods instead
    vm.runtime.targets.forEach(target => {
        if (target.id === sprite.id) {
            // Perform operations on target
        }
    });
});

// ✅ Efficient: Single iteration
vm.runtime.targets.forEach(target => {
    if (!target.isStage) {
        // Perform sprite operations
    }
});
```

### Memory Management

```javascript
// ❌ Memory leak: Not removing listeners
vm.on('PROJECT_START', myHandler);

// ✅ Proper cleanup
vm.on('PROJECT_START', myHandler);
// Later...
vm.off('PROJECT_START', myHandler);
```

## Debugging APIs

### Debug Mode

```javascript
// Enable debug mode
window.DEBUG = true;

// VM inspection tools (these are examples of what you can access)
window.vmDebug = {
    inspectTarget: (targetId) => vm.runtime.getTargetById(targetId),
    inspectRuntime: () => vm.runtime,
    inspectTargets: () => vm.runtime.targets
};

// GUI inspection tools  
window.guiDebug = {
    inspectState: () => window.ReduxStore.getState(),
    inspectComponent: (selector) => document.querySelector(selector)
};
```

### Development Tools

```javascript
// VM inspection tools
window.vmDebug = {
    inspectTarget: (targetId) => vm.runtime.getTargetById(targetId),
    inspectRuntime: () => vm.runtime,
    inspectTargets: () => vm.runtime.targets
};

// GUI inspection tools  
window.guiDebug = {
    inspectState: () => window.ReduxStore.getState(),
    inspectComponent: (selector) => document.querySelector(selector)
};
```

## API Versioning

MistWarp uses semantic versioning for API changes:

```javascript
// Check API version
const apiVersion = window.MistWarp.API_VERSION; // "2.1.0"

// Version compatibility check
if (semver.gte(apiVersion, '2.0.0')) {
    // Use new API features
    vm.runtime.newFeature();
} else {
    // Fallback to older API
    vm.runtime.oldFeature();
}
```

## Migration Guides

When APIs change, migration guides are provided:

### From v1.x to v2.x
```javascript
// Old API (v1.x)
vm.loadProject(projectData, callback);

// New API (v2.x)
await vm.loadProject(projectData);
```

### Extension API Changes
```javascript
// Old Extension API
class OldExtension {
    getBlocks() { /* ... */ }
}

// New Extension API  
class NewExtension {
    getInfo() { /* ... */ }
}
```

## Best Practices

### API Usage Guidelines

1. **Check API availability** before using advanced features
2. **Handle errors gracefully** with proper error messages
3. **Clean up resources** when components unmount
4. **Use batch operations** for multiple related changes
5. **Follow security guidelines** for extensions and addons

### Performance Tips

1. **Throttle high-frequency operations** to avoid overwhelming the system
2. **Use memoization** for expensive calculations
3. **Implement lazy loading** for large datasets
4. **Monitor memory usage** and clean up properly

### Security Considerations

1. **Validate all inputs** before passing to APIs
2. **Use sandboxed mode** for untrusted extensions
3. **Request minimal permissions** for addons
4. **Sanitize user content** before display

---

*For detailed information about specific APIs, navigate to the individual API documentation pages using the sidebar.*

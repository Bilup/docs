---
title: Utilities
sidebar_position: 6
---

# Available Utilities

This page documents utilities and helper functions that are actually available in the MistWarp codebase.

## Project Operations

### Project Loading and Saving
The following project operations are available through the VM and GUI APIs:

```javascript
// Load a project (available through VM API)
await vm.loadProject(projectData);

// Save project state
const projectData = vm.toJSON();

// Download project as SB3 (through GUI components)
// This is typically handled by GUI components like SB3Downloader
```

## Browser APIs and DOM Utilities

### Basic DOM Operations
Standard DOM APIs are available for addon development:

```javascript
// Element selection
const element = document.querySelector('.selector');
const elements = document.querySelectorAll('.selector');

// Element creation
const button = document.createElement('button');
button.textContent = 'Click me';
button.className = 'custom-button';

// Event handling
element.addEventListener('click', handleClick);
```

### Addon-Specific Utilities
Addons have access to specialized utilities through the addon API:

```javascript
export default async function ({ addon, msg }) {
    // Wait for elements (addon-specific utility)
    const button = await addon.tab.waitForElement('.green-flag');
    
    // Add CSS (addon-specific utility)
    addon.tab.addCSS(`
        .green-flag {
            background-color: red !important;
        }
    `);
    
    // Access VM through addon context
    const vm = addon.tab.traps.vm;
}
```

## Available Third-Party Utilities

### Lodash Functions
Some lodash utilities are available in the codebase:

```javascript
import bindAll from 'lodash.bindall';

// Bind methods to instance
bindAll(this, ['method1', 'method2']);
```

### Storage APIs
Browser storage through the Storage API:

```javascript
// Local storage
localStorage.setItem('key', 'value');
const value = localStorage.getItem('key');

// Session storage  
sessionStorage.setItem('key', 'value');
```

## Redux Store Operations

### Accessing the Store
The Redux store is available globally:

```javascript
// Access the store (note: capital R in ReduxStore)
const store = window.ReduxStore;

// Get current state
const state = store.getState();

// Dispatch actions
store.dispatch({
    type: 'ACTION_TYPE',
    payload: data
});
```

### Common State Selectors
```javascript
// Get VM state
const vm = state.scratchGui.vm;

// Get current project state
const projectState = state.scratchGui.projectState;

// Get targets/sprites
const targets = state.scratchGui.targets;
```

## VM Utilities

### Target Management
```javascript
// Get all targets
const targets = vm.runtime.targets;

// Get sprites (non-stage targets)
const sprites = vm.runtime.targets.filter(target => !target.isStage);

// Get stage
const stage = vm.runtime.targets.find(target => target.isStage);

// Get target by ID
const target = vm.runtime.getTargetById(targetId);
```

### Project Control
```javascript
// Start/stop project
vm.start();
vm.stop();

// Green flag
vm.greenFlag();

// Set turbo mode
vm.setTurboMode(true);
```

## Event Handling

### VM Events
```javascript
// Listen to VM events
vm.on('PROJECT_LOADED', () => {
    console.log('Project loaded');
});

vm.on('PROJECT_CHANGED', () => {
    console.log('Project changed');
});

vm.on('PROJECT_START', () => {
    console.log('Project started');
});

vm.on('PROJECT_STOP_ALL', () => {
    console.log('Project stopped');
});
```

### Standard DOM Events
```javascript
// Standard event listeners
document.addEventListener('keydown', handleKeyDown);
window.addEventListener('resize', handleResize);
element.addEventListener('click', handleClick);
```

## File Operations

### File API
Modern browsers provide File API access:

```javascript
// File input handling
const input = document.createElement('input');
input.type = 'file';
input.accept = '.sb3,.sb2';

input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target.result;
            // Process file data
        };
        reader.readAsArrayBuffer(file);
    }
});
```

### Blob and URL Operations
```javascript
// Create blob
const blob = new Blob([data], { type: 'application/json' });

// Create download URL
const url = URL.createObjectURL(blob);

// Trigger download
const a = document.createElement('a');
a.href = url;
a.download = 'project.sb3';
a.click();

// Clean up
URL.revokeObjectURL(url);
```

## Performance Considerations

### Memory Management
```javascript
// Clean up event listeners
element.removeEventListener('click', handler);

// Clean up VM listeners
vm.off('PROJECT_LOADED', handler);

// Clean up object URLs
URL.revokeObjectURL(url);
```

### Efficient Operations
```javascript
// Use requestAnimationFrame for animations
function animate() {
    // Animation code
    requestAnimationFrame(animate);
}

// Use debouncing for frequent events (manual implementation)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
```

## Available Globals

The following globals are available in MistWarp:

```javascript
// VM instance
window.vm

// Redux store (note: capital R)
window.ReduxStore  

// Scratch Blocks (when blocks are loaded)
window.ScratchBlocks

// Debug flag
window.DEBUG
```

## Best Practices

### Error Handling
```javascript
try {
    // Risky operation
    vm.loadProject(projectData);
} catch (error) {
    console.error('Operation failed:', error);
    // Handle error appropriately
}
```

### Async Operations
```javascript
// Use async/await for promises
async function loadProject() {
    try {
        await vm.loadProject(projectData);
        console.log('Project loaded successfully');
    } catch (error) {
        console.error('Failed to load project:', error);
    }
}
```

### Resource Cleanup
```javascript
// Always clean up resources
function cleanup() {
    // Remove event listeners
    element.removeEventListener('click', handler);
    
    // Clear timeouts/intervals
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    
    // Remove VM listeners
    vm.off('PROJECT_LOADED', handler);
}
```

## Related Documentation

- [VM API Reference](./vm-api)
- [Addon API Reference](./addon-api)  
- [GUI API Reference](./gui-api)
- [Development Guide](../development)

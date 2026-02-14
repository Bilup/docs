---
title: Events
sidebar_position: 5
---

# Event System

MistWarp provides a comprehensive event system for communication between components, addons, and extensions.

## Overview

The event system enables:
- Component-to-component communication
- Addon integration with editor events
- Extension lifecycle management
- State change notifications
- User interaction tracking

## Redux Events

### State Change Events
Listen for Redux state changes:

```javascript
// Listen to all state changes
addon.tab.redux.addEventListener('statechanged', (event) => {
  const { action, prev, next } = event.detail;
  console.log('Action:', action.type);
});

// Filter specific actions
addon.tab.redux.addEventListener('statechanged', (event) => {
  const { action } = event.detail;
  
  switch (action.type) {
    case 'scratch-gui/targets/SET_TARGET':
      handleTargetChange(action.targetId);
      break;
    case 'scratch-gui/mode/SET_PLAYER':
      handleModeChange(action.isPlayerOnly);
      break;
  }
});
```

### Common Redux Actions

```javascript
// Target (sprite/stage) selection
'scratch-gui/targets/SET_TARGET'
'scratch-gui/targets/UPDATE_TARGET_LIST'

// Project state
'scratch-gui/project-state/SET_PROJECT_TITLE'
'scratch-gui/project-state/SET_PROJECT_SAVED'

// Editor mode
'scratch-gui/mode/SET_PLAYER'
'scratch-gui/mode/SET_FULLSCREEN'

// Blocks workspace
'scratch-gui/workspace-blocks/UPDATE_BLOCKS'
'scratch-gui/workspace-blocks/SET_BLOCKS'

// Modals
'scratch-gui/modals/OPEN_MODAL'
'scratch-gui/modals/CLOSE_MODAL'
```

## DOM Events

### Editor Navigation
Track URL and navigation changes:

```javascript
addon.tab.addEventListener('urlChange', (event) => {
  const { oldURL, newURL } = event.detail;
  
  if (newURL.includes('/editor')) {
    console.log('Entered editor mode');
  } else if (newURL.includes('/player')) {
    console.log('Entered player mode');
  }
});
```

### Component Events
Listen for specific component interactions:

```javascript
// Block workspace events
addon.tab.addEventListener('workspaceUpdate', (event) => {
  console.log('Workspace updated:', event.detail);
});

// Stage events
addon.tab.addEventListener('stageClick', (event) => {
  const { x, y } = event.detail;
  console.log(`Stage clicked at: (${x}, ${y})`);
});

// Sprite list events
addon.tab.addEventListener('spriteSelected', (event) => {
  console.log('Sprite selected:', event.detail.spriteId);
});
```

## Custom Events

### Dispatching Events
Create and dispatch custom events:

```javascript
// Simple custom event
addon.tab.dispatchEvent(new CustomEvent('myEvent', {
  detail: { data: 'example' }
}));

// Complex event with multiple data
addon.tab.dispatchEvent(new CustomEvent('projectAnalyzed', {
  detail: {
    spriteCount: 5,
    blockCount: 127,
    complexity: 'medium',
    timestamp: Date.now()
  }
}));
```

### Event Listeners
Listen for custom events:

```javascript
// Listen for specific custom events
addon.tab.addEventListener('projectAnalyzed', (event) => {
  const { spriteCount, blockCount, complexity } = event.detail;
  updateProjectStats(spriteCount, blockCount, complexity);
});

// Generic event listener
addon.tab.addEventListener('myEvent', handleMyEvent);

function handleMyEvent(event) {
  console.log('Custom event received:', event.detail);
}
```

## Extension Events

### Extension Lifecycle
Track extension loading and unloading:

```javascript
// Extension loaded
vm.runtime.on('EXTENSION_ADDED', (extensionId) => {
  console.log('Extension loaded:', extensionId);
});

// Extension removed
vm.runtime.on('EXTENSION_REMOVED', (extensionId) => {
  console.log('Extension removed:', extensionId);
});
```

### Block Events
Monitor block execution and interactions:

```javascript
// Block execution started
vm.runtime.on('BLOCK_GLOW_ON', (blockId) => {
  console.log('Block executing:', blockId);
});

// Block execution ended
vm.runtime.on('BLOCK_GLOW_OFF', (blockId) => {
  console.log('Block finished:', blockId);
});

// Block added to workspace
vm.runtime.on('BLOCKS_ADDED', (blockIds) => {
  console.log('Blocks added:', blockIds);
});
```

## Project Events

### Project Lifecycle
Track project loading, saving, and changes:

```javascript
// Project loaded
vm.runtime.on('PROJECT_LOADED', () => {
  console.log('Project loaded successfully');
});

// Project saved
addon.tab.addEventListener('projectSaved', (event) => {
  console.log('Project saved:', event.detail.title);
});

// Project modified
addon.tab.addEventListener('projectModified', (event) => {
  console.log('Project has unsaved changes');
});
```

### Asset Events
Monitor costume and sound changes:

```javascript
// Costume added
vm.runtime.on('COSTUME_ADDED', (costumeId, targetId) => {
  console.log(`Costume ${costumeId} added to ${targetId}`);
});

// Sound added
vm.runtime.on('SOUND_ADDED', (soundId, targetId) => {
  console.log(`Sound ${soundId} added to ${targetId}`);
});
```

## Performance Events

### Monitoring Performance
Track runtime performance metrics:

```javascript
// Frame rate changes
vm.runtime.on('FRAMERATE_CHANGED', (fps) => {
  console.log('FPS:', fps);
});

// Compile events
vm.runtime.on('COMPILE_START', () => {
  console.log('Compilation started');
});

vm.runtime.on('COMPILE_END', (success, errors) => {
  if (success) {
    console.log('Compilation successful');
  } else {
    console.error('Compilation errors:', errors);
  }
});
```

## Event Best Practices

### Memory Management
Properly clean up event listeners:

```javascript
export default async function ({ addon }) {
  const handleStateChange = (event) => {
    // Handle event
  };
  
  // Add listener
  addon.tab.redux.addEventListener('statechanged', handleStateChange);
  
  // Clean up when addon disabled
  addon.onDisabled = () => {
    addon.tab.redux.removeEventListener('statechanged', handleStateChange);
  };
}
```

### Event Filtering
Filter events to avoid performance issues:

```javascript
let lastUpdate = 0;
const THROTTLE_MS = 100;

addon.tab.redux.addEventListener('statechanged', (event) => {
  const now = Date.now();
  if (now - lastUpdate < THROTTLE_MS) {
    return; // Skip this update
  }
  lastUpdate = now;
  
  // Handle the event
  handleStateChange(event);
});
```

### Error Handling
Handle errors in event listeners gracefully:

```javascript
addon.tab.addEventListener('myEvent', (event) => {
  try {
    processEvent(event.detail);
  } catch (error) {
    console.error('Error processing event:', error);
    // Fallback behavior
  }
});
```

## Event Documentation

### Creating Event Documentation
Document custom events for other developers:

```javascript
/**
 * Dispatched when project analysis is complete
 * @event projectAnalyzed
 * @type {CustomEvent}
 * @property {Object} detail - Event data
 * @property {number} detail.spriteCount - Number of sprites
 * @property {number} detail.blockCount - Total blocks
 * @property {string} detail.complexity - Project complexity level
 */
```

## Related Documentation

- [Addon API Reference](./addon-api)
- [VM API Reference](./vm-api)
- [GUI API Reference](./gui-api)

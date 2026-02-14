---
title: Addon API
sidebar_position: 4
---

# Addon API

The Addon API provides tools for modifying and extending the MistWarp interface and behavior through the addon system.

## Overview

The Addon API allows developers to:
- Modify the MistWarp user interface
- Add new functionality to the editor
- Customize the appearance and behavior
- Integrate with external services and tools

## Basic Addon Structure

```javascript
// userscript.js
export default async function ({ addon, msg, console }) {
  // Addon initialization code
  console.log('Addon loaded:', addon.info.name);
  
  // Add custom functionality
  addon.tab.addEventListener('urlChange', handleUrlChange);
  
  function handleUrlChange(event) {
    console.log('URL changed:', event.detail.newURL);
  }
}
```

## API Objects

### addon.tab
Interface for DOM manipulation and editor interaction:

```javascript
// Wait for elements
const blocksPalette = await addon.tab.waitForElement('[class*="blocks_blocks"]');

// Add custom styles
addon.tab.addStyle(`
  .my-custom-class {
    background: var(--ui-primary);
  }
`);

// Listen for events
addon.tab.addEventListener('urlChange', callback);
addon.tab.addEventListener('statechanged', callback);

// Redux state access
const currentMode = addon.tab.redux.state.scratchGui.mode;
```

### addon.settings
Access to addon configuration:

```javascript
// Get setting values
const isEnabled = addon.settings.get('enabled');
const maxItems = addon.settings.get('maxItems');

// Listen for setting changes
addon.settings.addEventListener('change', (event) => {
  console.log('Setting changed:', event.detail);
});
```

### addon.info
Metadata about the current addon:

```javascript
console.log('Addon ID:', addon.info.id);
console.log('Addon name:', addon.info.name);
console.log('Version:', addon.info.version);
```

## DOM Manipulation

### Element Selection
Wait for and select DOM elements safely:

```javascript
// Wait for specific elements
const menuBar = await addon.tab.waitForElement('[class*="menu-bar"]');
const stageArea = await addon.tab.waitForElement('[class*="stage"]');

// Select existing elements
const blocks = addon.tab.querySelector('[class*="blocks_blocks"]');
```

### Adding Custom Elements

```javascript
// Create and add custom buttons
const customButton = document.createElement('button');
customButton.textContent = msg('my-button');
customButton.className = 'my-addon-button';
customButton.addEventListener('click', handleButtonClick);

// Find insertion point and add button
const menuBar = await addon.tab.waitForElement('[class*="menu-bar"]');
menuBar.appendChild(customButton);
```

## Event System

### Built-in Events

```javascript
// URL navigation changes
addon.tab.addEventListener('urlChange', (event) => {
  const { oldURL, newURL } = event.detail;
  console.log(`Navigation: ${oldURL} → ${newURL}`);
});

// Redux state changes
addon.tab.addEventListener('statechanged', (event) => {
  const { action, prev, next } = event.detail;
  if (action.type === 'scratch-gui/targets/SET_TARGET') {
    console.log('Target changed:', action.targetId);
  }
});
```

### Custom Events

```javascript
// Dispatch custom events
addon.tab.dispatchEvent(new CustomEvent('myAddonEvent', {
  detail: { data: 'example' }
}));

// Listen for custom events
addon.tab.addEventListener('myAddonEvent', (event) => {
  console.log('Custom event:', event.detail);
});
```

## Context Menus

### Block Context Menus
Add items to right-click menus on blocks:

```javascript
addon.tab.createBlockContextMenu((items, target) => {
  if (target.isStage === false) {
    items.push({
      enabled: true,
      text: msg('duplicate-sprite'),
      callback: () => {
        // Duplicate sprite functionality
      },
      separator: true
    });
  }
});
```

## Storage

### Local Storage
Persist data across sessions:

```javascript
// Store data
await addon.storage.setItem('myData', { count: 42 });

// Retrieve data
const data = await addon.storage.getItem('myData');
console.log('Stored count:', data?.count);

// Remove data
await addon.storage.removeItem('myData');
```

## Localization

### Message Functions
Support multiple languages:

```javascript
// Simple messages
const buttonText = msg('save-project');

// Messages with parameters
const confirmText = msg('confirm-delete', { name: spriteName });

// Conditional messages
const statusText = msg(isOnline ? 'online-status' : 'offline-status');
```

### Message Files
Define translations in `addons-l10n/`:

```json
// en.json
{
  "my-addon/save-project": "Save Project",
  "my-addon/confirm-delete": "Delete {name}?",
  "my-addon/online-status": "Connected",
  "my-addon/offline-status": "Disconnected"
}
```

## Settings Integration

### Setting Types
Define configurable options:

```json
// In addon manifest
"settings": [
  {
    "name": "Enable feature",
    "id": "enabled",
    "type": "boolean",
    "default": true
  },
  {
    "name": "Max items",
    "id": "maxItems", 
    "type": "positive_integer",
    "default": 10,
    "min": 1,
    "max": 100
  },
  {
    "name": "Color scheme",
    "id": "colorScheme",
    "type": "select",
    "options": [
      { "value": "auto", "name": "Automatic" },
      { "value": "light", "name": "Light" },
      { "value": "dark", "name": "Dark" }
    ],
    "default": "auto"
  }
]
```

## Performance Best Practices

1. **Use waitForElement()** instead of polling
2. **Cache DOM queries** when possible
3. **Remove event listeners** when addon is disabled
4. **Debounce frequent operations**
5. **Use requestAnimationFrame** for animations

## Lifecycle Management

```javascript
export default async function ({ addon }) {
  // Initialization
  console.log('Addon starting');
  
  // Setup functionality
  const cleanup = setupFeatures();
  
  // Cleanup when disabled
  addon.onDisabled = () => {
    console.log('Addon stopping');
    cleanup();
  };
}

function setupFeatures() {
  // Setup code here
  
  return () => {
    // Cleanup code here
  };
}
```

## Related Documentation

- [Addon Development Guide](../gui-internals/addons/home)
- [GUI API Reference](./gui-api)
- [Extension API Reference](./extension-api)

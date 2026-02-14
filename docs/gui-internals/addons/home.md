---
title: Addons System
sidebar_position: 1
---

# Addons System

MistWarp's addon system is based on the [Scratch Addons browser extension](https://scratchaddons.com/), providing a way to extend and customize the MistWarp editor interface and functionality.

## Architecture Overview

The addon system consists of several key components:

- **Addon Manager**: Loads and manages addon lifecycle
- **Settings Store**: Persistent storage for addon settings  
- **Redux Integration**: Connects addons to MistWarp's state management
- **Event System**: Allows addons to listen to and respond to editor events
- **API Layer**: Provides safe interfaces for addons to interact with MistWarp

## Addon Types

### User Scripts
JavaScript code that runs in the MistWarp editor context to add functionality:

```javascript
// Example userscript.js
export default async function ({ addon, msg }) {
  // Add custom menu item
  addon.tab.createBlockContextMenu((items, target) => {
    items.push({
      enabled: target.isStage === false,
      text: msg("rename-sprite"),
      callback: () => {
        // Custom functionality
      }
    });
  });
}
```

### User Styles
CSS modifications to customize the MistWarp interface:

```css
/* Example userstyle.css */
[class*="stage_stage-wrapper"] {
  border: 2px solid var(--ui-primary);
  border-radius: 8px;
}

.sa-editor-dark-mode [class*="blocks_blocks"] {
  background-color: #1e1e1e !important;
}
```

## Manifest Format

Each addon requires an `addon.json` manifest file:

```json
{
  "name": "Editor Dark Mode",
  "description": "Dark theme for the MistWarp editor",
  "credits": [
    {
      "name": "MistWarp Team"
    }
  ],
  "userscripts": [
    {
      "url": "userscript.js",
      "matches": ["https://warp.mistium.com/*"]
    }
  ],
  "userstyles": [
    {
      "url": "userstyle.css", 
      "matches": ["https://warp.mistium.com/*"],
      "if": {
        "settings": {
          "dark": true
        }
      }
    }
  ],
  "settings": [
    {
      "name": "Dark mode",
      "id": "dark",
      "type": "boolean",
      "default": true
    }
  ],
  "tags": ["theme", "dark", "editor"],
  "enabledByDefault": false,
  "versionAdded": "1.0.0",
  "updateUserstylesOnSettingsChange": true
}
```

## Settings System

Addons can define configurable settings:

### Setting Types

**Boolean Settings**
```json
{
  "name": "Enable feature",
  "id": "enabled",
  "type": "boolean", 
  "default": true
}
```

**Select Settings**
```json
{
  "name": "Theme variant",
  "id": "variant",
  "type": "select",
  "options": [
    {
      "value": "blue",
      "name": "Blue"
    },
    {
      "value": "green", 
      "name": "Green"
    }
  ],
  "default": "blue"
}
```

**Positive Integer Settings**
```json
{
  "name": "Animation speed",
  "id": "speed",
  "type": "positive_integer",
  "default": 100,
  "min": 50,
  "max": 500
}
```

## Addon API

Addons receive an API object with access to MistWarp functionality:

### Core API Structure

```javascript
export default async function ({ addon, msg, console }) {
  // addon.tab - DOM and UI manipulation
  // addon.settings - Access to addon settings
  // msg() - Localization function
  // console - Safe console logging
}
```

### Tab API

The `addon.tab` object provides methods for interacting with the editor:

```javascript
// Wait for specific elements to appear
const blocksPalette = await addon.tab.waitForElement('[class*="blocks_blocks"]');

// Add custom CSS classes
addon.tab.addStyle(`
  .my-custom-style {
    background: red;
  }
`);

// Listen for URL changes
addon.tab.addEventListener('urlChange', (event) => {
  console.log('URL changed to:', event.detail.newURL);
});

// Redux state access
const currentMode = addon.tab.redux.state.scratchGui.mode;
```

### Event Handling

```javascript
// Listen for sprite selection changes
addon.tab.redux.addEventListener('statechanged', (event) => {
  if (event.detail.action.type === 'scratch-gui/targets/SET_TARGET') {
    const newTarget = event.detail.action.targetId;
    // Handle sprite change
  }
});
```

### Context Menus

```javascript
// Add items to block context menus
addon.tab.createBlockContextMenu((items, target) => {
  if (target.isStage === false) {
    items.push({
      enabled: true,
      text: msg("duplicate-sprite"),
      callback: () => {
        // Duplicate sprite functionality
      }
    });
  }
});
```

## Built-in Addons

MistWarp includes several built-in addons:
### Developer Tools
- **Editor DevTools**: Block inspection and debugging tools
- **Sprite/Costume Browser**: Enhanced asset management
- **Performance Monitor**: Track frame rates and memory usage

### Interface Enhancements  
- **Dark Mode**: Dark theme for the editor interface
- **Compact Mode**: Reduced spacing for smaller screens
- **Custom Block Colors**: Personalized block category colors

### Workflow Improvements
- **Auto-Save**: Periodic project saving
- **Block Finder**: Search and highlight blocks in workspace
- **Mouse Wheel Volume**: Adjust sound volumes with scroll wheel

### Accessibility
- **High Contrast**: Improved color contrast for visibility
- **Keyboard Navigation**: Enhanced keyboard shortcuts
- **Screen Reader Support**: Better compatibility with assistive technology

## Localization

Addons support multiple languages through message files:

```javascript
// In userscript.js
export default async function ({ addon, msg }) {
  // Use msg() function for translatable text
  const buttonText = msg("save-project");
  const confirmText = msg("confirm-delete", { name: spriteName });
}
```

Message files are stored in `addons-l10n/` directory:
```json
// en.json
{
  "save-project": "Save Project",
  "confirm-delete": "Delete {name}?"
}

// es.json  
{
  "save-project": "Guardar Proyecto",
  "confirm-delete": "¿Eliminar {name}?"
}
```

## Development and Testing

### Local Development
Addons can be developed and tested locally by modifying files in:
```
scratch-gui/src/addons/addons/[addon-id]/
```

### Settings Interface
Addon settings can be accessed through the MistWarp settings panel under the "Addons" section.

### Debugging
Use the provided `console` object for safe logging:

```javascript
export default async function ({ addon, console }) {
  console.log("Addon initialized");
  console.warn("Deprecated feature used");
  console.error("Failed to load resource");
}
```

## Limitations and Compatibility

### Security Restrictions
- Addons run in the same context as MistWarp but with limited access
- No access to sensitive browser APIs like filesystem or network
- Cannot execute arbitrary code outside the addon sandbox

### Update Mechanism
Addons are pulled from the upstream Scratch Addons project with patches applied for MistWarp compatibility. Changes should generally be contributed upstream rather than made directly in MistWarp.

## Performance Considerations

### Best Practices
- Use `waitForElement()` instead of polling for DOM elements
- Remove event listeners when addon is disabled
- Minimize DOM queries and cache results when possible
- Use CSS animations instead of JavaScript animations when possible

### Resource Management
```javascript
export default async function ({ addon }) {
  const observer = new MutationObserver(callback);
  
  // Clean up when addon is disabled
  addon.onDisabled = () => {
    observer.disconnect();
  };
}
```

The addon system provides a powerful way to extend MistWarp while maintaining compatibility with the broader Scratch Addons ecosystem.

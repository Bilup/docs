---
title: GUI Themes
sidebar_position: 3
---

# GUI Themes

GUI themes control the overall interface appearance - backgrounds, text colors, and component styling. They're located in `src/lib/themes/gui/`.

## Available Themes

MistWarp includes three built-in GUI themes:

- **light**: Default bright interface
- **dark**: Dark interface with light text  
- **midnight**: Darker variant of dark theme

## Structure

Each GUI theme exports `guiColors` and `blockColors`:

```javascript
// src/lib/themes/gui/dark.js
const guiColors = {
    'color-scheme': 'dark',
    'ui-primary': '#111111',
    'ui-secondary': '#1e1e1e', 
    'ui-tertiary': '#2e2e2e',
    'text-primary': '#eeeeee',
    'menu-bar-background': '#333333',
    'input-background': '#1e1e1e',
    'page-background': '#111111',
    // ...more properties
};

const blockColors = {
    insertionMarker: '#cccccc'
};

export { guiColors, blockColors };
```

## Key Color Properties

### Core Interface

- `color-scheme`: 'light' or 'dark' (affects browser behavior)
- `ui-primary`: Main background color
- `ui-secondary`: Secondary background (panels, sidebars)
- `ui-tertiary`: Tertiary background (buttons, inputs)

### Text Colors

- `text-primary`: Main text color
- `link-color`: Link text color

### Component Backgrounds

- `menu-bar-background`: Top menu bar
- `input-background`: Text inputs and form fields
- `popover-background`: Dropdown menus and tooltips
- `page-background`: Main page background

### Modal Windows

- `ui-modal-overlay`: Background overlay (with transparency)
- `ui-modal-background`: Modal window background
- `ui-modal-foreground`: Modal text color
- `ui-modal-header-background`: Modal header background

### Special Effects

- `filter-icon-black`: CSS filter for black icons
- `filter-icon-gray`: CSS filter for gray icons  
- `filter-icon-white`: CSS filter for white icons

## Creating a Custom GUI Theme

### 1. Create Theme File

Create `src/lib/themes/gui/custom.js`:

```javascript
const guiColors = {
    'color-scheme': 'light', // or 'dark'
    
    // Core interface
    'ui-primary': '#f5f5f5',
    'ui-secondary': '#e0e0e0',
    'ui-tertiary': '#d0d0d0',
    
    // Text
    'text-primary': '#333333',
    
    // Components
    'menu-bar-background': '#2196F3',
    'input-background': '#ffffff',
    'page-background': '#fafafa',
    
    // Modals
    'ui-modal-overlay': '#000000aa',
    'ui-modal-background': '#ffffff',
    'ui-modal-foreground': '#333333',
    
    // Links
    'link-color': '#1976D2',
    
    // Icon filters (adjust for your color scheme)
    'filter-icon-black': 'none',
    'filter-icon-gray': 'grayscale(100%) brightness(0.7)',
    'filter-icon-white': 'brightness(0) invert(100%)'
};

const blockColors = {
    insertionMarker: '#666666',
    fieldBackground: '#ffffff'
};

export { guiColors, blockColors };
```

### 2. Register in Index

Add to `src/lib/themes/index.js`:

```javascript
import * as guiCustom from './gui/custom';

const GUI_CUSTOM = 'custom';
const GUI_MAP = {
    [GUI_LIGHT]: guiLight,
    [GUI_DARK]: guiDark, 
    [GUI_MIDNIGHT]: guiMidnight,
    [GUI_CUSTOM]: guiCustom
};
```

## Dark Theme Considerations

When creating dark themes:

### Color Contrast

Ensure sufficient contrast for accessibility:

```javascript
const guiColors = {
    'text-primary': '#eeeeee',      // Light text on dark background
    'ui-primary': '#111111',        // Dark background
    'input-background': '#1e1e1e',  // Slightly lighter for inputs
};
```

### Icon Filters

Adjust icon colors for dark backgrounds:

```javascript
const guiColors = {
    'filter-icon-black': 'invert(100%)',           // Make black icons white
    'filter-icon-gray': 'grayscale(100%) brightness(1.7)', // Brighten gray icons  
    'filter-icon-white': 'brightness(0) invert(100%)'      // Keep white icons white
};
```

### Block Colors

Dark themes may need different block insertion markers:

```javascript
const blockColors = {
    insertionMarker: '#cccccc',    // Light marker on dark background
    fieldBackground: '#2e2e2e'     // Dark field background
};
```

## CSS Integration

GUI colors are applied as CSS custom properties:

```css
:root {
    --ui-primary: #111111;
    --text-primary: #eeeeee;
    --menu-bar-background: #333333;
}

.menu-bar {
    background-color: var(--menu-bar-background);
    color: var(--text-primary);
}

.modal {
    background-color: var(--ui-modal-background);
    color: var(--ui-modal-foreground);
}
```

## Theme Detection

Components can detect the current theme:

```javascript
const isDark = theme.isDark(); // Returns true if color-scheme is 'dark'

// Conditional styling based on theme
const buttonStyle = {
    border: isDark ? '1px solid #555' : '1px solid #ccc'
};
```

## Browser Integration

The `color-scheme` property affects browser behavior:

```css
/* Applied automatically by theme system */
html {
    color-scheme: dark; /* or light */
}
```

This tells the browser to:
- Use appropriate scrollbar colors
- Apply dark/light mode to form controls
- Adjust default colors for unstyled elements

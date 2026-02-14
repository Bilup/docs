---
title: Accent Colors
sidebar_position: 2
---

# Accent Colors

Accent colors define the primary color scheme used throughout MistWarp's interface. They're located in `src/lib/themes/accent/` and can be mixed with any GUI or block theme.

## Available Accents

MistWarp includes many built-in accent colors:

- **Basic Colors**: Red, Orange, Yellow, Green, Blue, Purple, Pink
- **Pride Themes**: Rainbow, Trans, Gay, Rotur  
- **Gradient Themes**: Sunset, Ocean, Aurora, Cosmic, Fire, Nebula, Lavender, Mint, Cherry, Sky, Forest, Coral

## Structure

Each accent file exports `guiColors` and `blockColors`:

```javascript
// src/lib/themes/accent/blue.js
const guiColors = {
    'looks-secondary': 'hsla(215, 100%, 65%, 1)',
    'looks-transparent': 'hsla(215, 100%, 65%, 0.35)', 
    'looks-light-transparent': 'hsla(215, 100%, 65%, 0.15)',
    'looks-secondary-dark': 'hsla(215, 60%, 50%, 1)'
};

const blockColors = {};

export { guiColors, blockColors };
```

## Adding a New Accent

### 1. Create Accent File

Create `src/lib/themes/accent/purple.js`:

```javascript
const guiColors = {
    'looks-secondary': 'hsla(270, 100%, 65%, 1)',
    'looks-transparent': 'hsla(270, 100%, 65%, 0.35)',
    'looks-light-transparent': 'hsla(270, 100%, 65%, 0.15)', 
    'looks-secondary-dark': 'hsla(270, 60%, 50%, 1)'
};

const blockColors = {
    // Optional: Override specific block colors
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6', 
        tertiary: '#774DCB'
    }
};

export { guiColors, blockColors };
```

### 2. Register in Index

Add to `src/lib/themes/index.js`:

```javascript
import * as accentPurple from './accent/purple';

const ACCENTS = [
    // ...existing accents...
    {
        name: 'Purple',
        accent: accentPurple,
        description: 'Purple accent color',
        id: 'tw.accent.purple'
    }
];
```

## Color Properties

### GUI Colors

Accent colors primarily affect these GUI properties:

- `looks-secondary`: Primary accent color for UI elements
- `looks-transparent`: Semi-transparent version (35% opacity)
- `looks-light-transparent`: Light transparent version (15% opacity)  
- `looks-secondary-dark`: Darker variant for contrast

### Block Colors

Accent colors can override specific block category colors:

```javascript
const blockColors = {
    motion: {
        primary: '#4C97FF',    // Main block color
        secondary: '#4280D7',  // Block outline/shadow
        tertiary: '#3373CC'    // Darker variant
    },
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6',
        tertiary: '#774DCB'
    }
    // ...other categories
};
```

## Color Resolution

Accent colors are applied with this precedence:

1. **Accent colors** (highest priority)
2. GUI theme colors
3. Base theme colors (fallback)

Example resolution:
```javascript
// If accent defines 'looks-secondary', use that
// Otherwise, use GUI theme's 'looks-secondary' 
// Otherwise, use base light theme's 'looks-secondary'
theme.getGuiColors()['looks-secondary']
```

## Special Accent Types

### Gradient Accents

Some accents use gradients instead of solid colors:

```javascript
// src/lib/themes/accent/sunset.js
const guiColors = {
    'looks-secondary': 'linear-gradient(135deg, #ff6b6b, #feca57)',
    'looks-transparent': 'linear-gradient(135deg, rgba(255,107,107,0.35), rgba(254,202,87,0.35))',
    // ...
};
```

### Pride Flag Accents

Pride-themed accents often use multiple colors or patterns:

```javascript
// src/lib/themes/accent/rainbow.js  
const guiColors = {
    'looks-secondary': 'linear-gradient(90deg, #e40303, #ff8c00, #ffed00, #008018, #004cff, #732982)',
    // ...
};
```

## Usage in Components

Accent colors are automatically applied to components via CSS variables:

```css
.accent-button {
    background-color: var(--looks-secondary);
    border-color: var(--looks-secondary-dark);
}

.accent-button:hover {
    background-color: var(--looks-secondary-dark);
}
```

## Testing

Test your accent color by creating a theme instance:

```javascript
import { Theme } from './index';

const testTheme = new Theme('purple', 'light', 'three');
console.log(testTheme.getGuiColors()['looks-secondary']); // Should show purple
```

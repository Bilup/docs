---
title: Theming Overview
sidebar_position: 1
---

# MistWarp Theming System

MistWarp's theming system consists of three independent components that can be mixed and matched:

- **[Accent Colors](./accent-colors)** - Primary color scheme (red, blue, purple, etc.)
- **[GUI Themes](./gui-themes)** - Interface appearance (light, dark, midnight)
- **[Block Themes](./block-themes)** - Block colors and appearance (three, dark, high-contrast)

## Architecture

Themes are composed in `src/lib/themes/index.js`:

```javascript
class Theme {
    constructor(accent, gui, blocks, menuBarAlign, wallpaper, fonts) {
        this.accent = accent;     // Color accent (red, blue, etc.)
        this.gui = gui;           // Interface theme (light, dark, midnight)  
        this.blocks = blocks;     // Block appearance (three, dark, high-contrast)
        this.menuBarAlign = menuBarAlign;
        this.wallpaper = wallpaper;
        this.fonts = fonts;
    }
}
```

## How It Works

1. **Modular Design**: Each component (accent, GUI, blocks) is independent
2. **Color Merging**: Colors are resolved with precedence: Accent → GUI → Base
3. **CSS Variables**: Themes set CSS custom properties on the document root
4. **Dynamic Application**: Themes can be changed at runtime

## File Structure

```
src/lib/themes/
├── index.js              # Main theme system
├── guiHelpers.js         # Theme application logic
├── accent/               # Accent color definitions
├── gui/                  # Interface themes  
└── blocks/               # Block themes
```

## Preset Combinations

MistWarp includes these preset theme combinations:

```javascript
Theme.light = new Theme('red', 'light', 'three');
Theme.dark = new Theme('red', 'dark', 'three');  
Theme.midnight = new Theme('red', 'midnight', 'three');
Theme.highContrast = new Theme('red', 'light', 'high-contrast');
```

## Next Steps

- [Learn about Accent Colors](./accent-colors) - Add new color schemes
- [Explore GUI Themes](./gui-themes) - Customize interface appearance
- [Understand Block Themes](./block-themes) - Modify block colors
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

## GUI Themes

GUI themes control interface colors. Located in `src/lib/themes/gui/`.

### Structure

Each GUI theme exports `guiColors` and `blockColors`:

```javascript
// src/lib/themes/gui/dark.js
const guiColors = {
    'color-scheme': 'dark',
    'ui-primary': '#111111',
    'ui-secondary': '#1e1e1e',
    'text-primary': '#eeeeee',
    'menu-bar-background': '#333333',
    // ...more properties
};

const blockColors = {
    insertionMarker: '#cccccc'
};

export { guiColors, blockColors };
```

### Available GUI Themes
- **light**: Default light interface
- **dark**: Dark interface with light text
- **midnight**: Darker variant of dark theme

## Block Themes

Block themes control block appearance. Located in `src/lib/themes/blocks/`.

### Structure

```javascript
// src/lib/themes/blocks/three.js
const blockColors = {
    motion: {
        primary: '#4C97FF',
        secondary: '#4280D7',
        tertiary: '#3373CC'
    },
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6',
        tertiary: '#774DCB'
    }
    // ...other block categories
};

export { blockColors };
```

### Available Block Themes
- **three**: Default Scratch 3.0 colors
- **dark**: Dark-optimized block colors  
- **high-contrast**: Accessibility-focused colors
- **custom**: Placeholder for addon modifications

## Theme Application

Themes are applied through `guiHelpers.js`:

```javascript
import { applyGuiColors } from './guiHelpers';

const theme = new Theme('blue', 'dark', 'three');
applyGuiColors(theme);
```

### Color Resolution

Colors are resolved with precedence:
1. Accent colors
2. GUI theme colors  
3. Base light theme colors (fallback)

```javascript
theme.getGuiColors() // Merges accent + gui + base colors
theme.getBlockColors() // Merges accent + gui + block colors
```

## CSS Integration

Themes set CSS custom properties on the document root:

```css
:root {
    --looks-secondary: hsla(215, 100%, 65%, 1);
    --ui-primary: #111111;
    --text-primary: #eeeeee;
}
```

Components reference these variables:

```css
.menu-bar {
    background-color: var(--menu-bar-background);
    color: var(--text-primary);
}
```

## Preset Themes

MistWarp includes preset combinations:

```javascript
Theme.light = new Theme('red', 'light', 'three');
Theme.dark = new Theme('red', 'dark', 'three');  
Theme.midnight = new Theme('red', 'midnight', 'three');
Theme.highContrast = new Theme('red', 'light', 'high-contrast');
```

## File Locations

```
src/lib/themes/
├── index.js              # Main theme system
├── guiHelpers.js         # Theme application logic
├── accent/               # Accent color definitions
│   ├── red.js
│   ├── blue.js
│   └── ...
├── gui/                  # Interface themes
│   ├── light.js
│   ├── dark.js
│   └── midnight.js
└── blocks/               # Block themes
    ├── three.js
    ├── dark.js
    └── high-contrast.js
```

This modular system allows users to mix any accent color with any GUI theme and block theme independently.

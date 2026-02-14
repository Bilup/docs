---
title: Block Themes  
sidebar_position: 4
---

# Block Themes

Block themes control the colors and appearance of coding blocks in the workspace. They're located in `src/lib/themes/blocks/`.

## Available Themes

MistWarp includes several built-in block themes:

- **three**: Default Scratch 3.0 colors
- **dark**: Dark-optimized block colors
- **high-contrast**: Accessibility-focused high contrast colors
- **custom**: Placeholder for addon modifications

## Structure

Block themes export a `blockColors` object with colors for each block category:

```javascript
// src/lib/themes/blocks/three.js
const blockColors = {
    motion: {
        primary: '#4C97FF',    // Main block color
        secondary: '#4280D7',  // Block outline/border
        tertiary: '#3373CC'    // Darker variant
    },
    looks: {
        primary: '#9966FF',
        secondary: '#855CD6', 
        tertiary: '#774DCB'
    },
    sounds: {
        primary: '#CF63CF',
        secondary: '#C94FC9',
        tertiary: '#BD42BD'
    },
    control: {
        primary: '#FFAB19',
        secondary: '#EC9C13',
        tertiary: '#CF8B17'
    },
    event: {
        primary: '#FFBF00',
        secondary: '#E6AC00',
        tertiary: '#CC9900'
    },
    sensing: {
        primary: '#5CB1D6',
        secondary: '#47A8D1',
        tertiary: '#2E8EB8'
    },
    operators: {
        primary: '#59C059',
        secondary: '#46B946',
        tertiary: '#389438'
    },
    data: {
        primary: '#FF8C1A',
        secondary: '#FF8000',
        tertiary: '#DB6E00'
    },
    // Special elements
    insertionMarker: '#000000',
    fieldBackground: '#ffffff'
};

export { blockColors };
```

## Block Categories

### Core Categories

- **motion**: Movement and positioning blocks
- **looks**: Appearance and visual effect blocks  
- **sounds**: Audio and music blocks
- **control**: Flow control (loops, conditionals)
- **event**: Event handling blocks
- **sensing**: Input and detection blocks
- **operators**: Math and logic operations
- **data**: Variables and lists

### Special Colors

- **insertionMarker**: Color of block insertion indicator
- **fieldBackground**: Background color for input fields
- **text**: Text color within blocks
- **workspace**: Workspace background color

## Creating a Custom Block Theme

### 1. Create Theme File

Create `src/lib/themes/blocks/custom.js`:

```javascript
const blockColors = {
    motion: {
        primary: '#FF6B6B',    // Custom red for motion
        secondary: '#FF5252',
        tertiary: '#F44336'
    },
    looks: {
        primary: '#4ECDC4',    // Custom teal for looks
        secondary: '#26A69A', 
        tertiary: '#00796B'
    },
    sounds: {
        primary: '#FFD93D',    // Custom yellow for sounds
        secondary: '#FFC107',
        tertiary: '#FF8F00'
    },
    control: {
        primary: '#A8E6CF',    // Custom green for control
        secondary: '#81C784',
        tertiary: '#4CAF50'
    },
    event: {
        primary: '#FFB74D',    // Custom orange for events
        secondary: '#FF9800',
        tertiary: '#F57C00'
    },
    sensing: {
        primary: '#BA68C8',    // Custom purple for sensing
        secondary: '#9C27B0',
        tertiary: '#7B1FA2'  
    },
    operators: {
        primary: '#64B5F6',    // Custom blue for operators
        secondary: '#2196F3',
        tertiary: '#1976D2'
    },
    data: {
        primary: '#F06292',    // Custom pink for data
        secondary: '#E91E63',
        tertiary: '#C2185B'
    },
    
    // Special elements
    insertionMarker: '#333333',
    fieldBackground: '#ffffff',
    text: '#ffffff'
};

const extensions = {
    // Extension-specific colors can be defined here
    pen: {
        primary: '#0FBD8C',
        secondary: '#0DA57A',
        tertiary: '#0B8E69'
    }
};

export { blockColors, extensions };
```

### 2. Register in Index

Add to `src/lib/themes/index.js`:

```javascript
import * as blocksCustom from './blocks/custom';

const BLOCKS_CUSTOM_NEW = 'custom-new';
const BLOCKS_MAP = {
    [BLOCKS_THREE]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: blocksThree.blockColors,
        extensions: blocksThree.extensions,
        customExtensionColors: {},
        useForStage: true
    },
    // ...existing themes...
    [BLOCKS_CUSTOM_NEW]: {
        blocksMediaFolder: 'blocks-media/default',
        colors: blocksCustom.blockColors,
        extensions: blocksCustom.extensions || {},
        customExtensionColors: {},
        useForStage: true
    }
};
```

## High Contrast Theme

The high-contrast theme is designed for accessibility:

```javascript
// src/lib/themes/blocks/high-contrast.js
const blockColors = {
    motion: {
        primary: '#000080',    // Dark blue
        secondary: '#000070',
        tertiary: '#000060'
    },
    looks: {
        primary: '#800080',    // Dark purple  
        secondary: '#700070',
        tertiary: '#600060'
    },
    // Uses high contrast colors with clear distinctions
};
```

## Dark Block Theme

The dark theme optimizes colors for dark GUI themes:

```javascript
// src/lib/themes/blocks/dark.js  
const blockColors = {
    motion: {
        primary: '#6BB3FF',    // Brighter blue for dark backgrounds
        secondary: '#5AA3EF',
        tertiary: '#4993DF'
    },
    // Colors are brightened and adjusted for dark backgrounds
    insertionMarker: '#ffffff',  // White marker on dark background
    fieldBackground: '#2e2e2e'   // Dark field background
};
```

## Extension Colors

Block themes can define colors for extensions:

```javascript
const extensions = {
    pen: {
        primary: '#0FBD8C',
        secondary: '#0DA57A', 
        tertiary: '#0B8E69'
    },
    music: {
        primary: '#D65CD6',
        secondary: '#BD42BD',
        tertiary: '#A428A4'
    }
};

const customExtensionColors = {
    // Colors for specific extension IDs
    'my-custom-extension': {
        primary: '#FF6B6B',
        secondary: '#FF5252',
        tertiary: '#F44336'
    }
};
```

## Stage Integration

Some block themes are optimized for the stage area:

```javascript
const BLOCKS_MAP = {
    [BLOCKS_THREE]: {
        // ...
        useForStage: true    // Use this theme for stage blocks
    },
    [BLOCKS_DARK]: {
        // ...
        useForStage: false   // Don't use for stage (use light theme instead)
    }
};
```

## Color Application

Block colors are applied through CSS variables:

```css
.block-motion {
    background-color: var(--motion-primary);
    border-color: var(--motion-secondary);
}

.block-motion:hover {
    background-color: var(--motion-tertiary);
}
```

## Testing Block Colors

Test your block theme:

```javascript
import { Theme } from './index';

const testTheme = new Theme('red', 'light', 'custom');
const blockColors = testTheme.getBlockColors();
console.log(blockColors.motion.primary); // Should show your custom color
```

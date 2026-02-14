---
title: Interface Guide
sidebar_position: 2
---

# MistWarp Interface Guide

MistWarp's interface is designed to be both familiar to Scratch users and enhanced with powerful new features. This guide will help you navigate and customize the interface effectively.

## Main Interface Layout

### Overall Structure

```
┌─────────────────────────────────────────────────────┐
│                   Menu Bar                          │
├─────────────────────┬───────────────────────────────┤
│                     │         Stage Header          │
│                     ├───────────────────────────────┤
│    Blocks Panel     │                               │
│                     │          Stage               │
│   ┌─────────────┐   │                               │
│   │ Code   │    │   │                               │
│   │ Costumes│    │   ├───────────────────────────────┤
│   │ Sounds  │    │   │        Target Pane            │
│   └─────────────┘   │                               │
│                     │    ┌─────────┬─────────────┐   │
│   Blocks Workspace  │    │ Sprites │   Stage     │   │
│                     │    │         │   Selector  │   │
│                     │    └─────────┴─────────────┘   │
└─────────────────────┴───────────────────────────────┘
```

## Menu Bar

The top menu bar provides access to file operations, settings, and tools.

### File Menu
- **New**: Create a new project
- **Load from your computer**: Open local `.sb3` files
- **Load from Scratch**: Import from Scratch website
- **Save to your computer**: Export project as `.sb3`

### Edit Menu
- **Undo**: Reverse last action (Ctrl/Cmd+Z)
- **Redo**: Restore undone action (Ctrl/Cmd+Shift+Z)
- **Turbo Mode**: Toggle high-speed execution

### Settings
Click the gear icon (⚙️) to access:

#### Appearance
- **Theme**: Light, Dark, High Contrast
- **Language**: Interface language selection
- **Zoom**: Interface scaling options

#### Advanced
- **Framerate**: 30, 60, or custom FPS
- **High Quality Pen**: Anti-aliased drawing
- **Custom Stage Size**: Beyond 480x360
- **Compiler**: Enable/disable optimizations

### Addons
Click the addon icon (🧩) to:
- **Browse addons**: See all available enhancements
- **Enable/disable**: Toggle addon functionality
- **Configure**: Adjust addon settings
- **Custom addons**: Load user-created addons

## Blocks Panel (Left Side)

### Tab Navigation

#### Code Tab
The main programming interface with:
- **Block Categories**: Motion, Looks, Sound, Events, etc.
- **Block Search**: Find blocks quickly
- **Custom Blocks**: User-defined procedures
- **Extensions**: Additional block categories

#### Costumes Tab
Visual asset editor featuring:
- **Costume List**: All sprite costumes
- **Paint Editor**: Built-in drawing tools
- **Import Tools**: Add images from files or camera
- **Vector/Bitmap**: Choose editing mode

#### Sounds Tab
Audio management with:
- **Sound Library**: Built-in sound effects
- **Recording**: Record new sounds
- **Import**: Add audio files
- **Editing**: Trim and adjust sounds

### Blocks Workspace

The main coding area where you:
- **Drag blocks** from palette to scripts area
- **Connect blocks** to create programs
- **Duplicate scripts** by right-clicking
- **Organize code** with comments and spacing

#### Workspace Features
- **Zoom**: Mouse wheel or zoom controls
- **Pan**: Drag empty space to move view
- **Search**: Ctrl/Cmd+F to find blocks
- **Cleanup**: Organize blocks automatically

## Stage Panel (Right Side)

### Stage Display

The stage shows your project in action:
- **Green Flag**: Start all scripts
- **Stop Sign**: Stop all execution
- **Full Screen**: Expand stage to full window

#### Stage Controls
- **Turbo Mode**: ⚡ button for faster execution
- **Framerate Display**: Shows current FPS
- **Custom Size**: Resize beyond standard dimensions

### Stage Header

Additional controls above the stage:
- **Ask/Answer**: Input handling for projects
- **Variable Monitors**: Display variable values
- **Custom Controls**: Addon-provided features

### Target Pane

Manage sprites and the stage:

#### Sprite Selector
- **Add Sprite**: Choose from library, upload, or draw
- **Duplicate**: Copy existing sprites
- **Delete**: Remove sprites
- **Rename**: Change sprite names

#### Sprite Information
For selected sprites:
- **Name**: Sprite identifier
- **Position**: X and Y coordinates
- **Size**: Scale percentage
- **Direction**: Rotation angle
- **Visibility**: Show/hide on stage

#### Stage Selector
Backdrop and stage settings:
- **Add Backdrop**: Choose or create backgrounds
- **Stage Info**: Stage-specific properties
- **Global Variables**: Stage-level data

## Responsive Design

### Desktop Layout (1024px+)
Full side-by-side layout with all panels visible.

### Tablet Layout (768-1023px)
Stacked layout with collapsible panels.

### Mobile Layout (below 768px)
Single-column layout with tabbed navigation.

## Customization Options

### Interface Themes

#### Light Theme (Default)
Bright, high-contrast design similar to Scratch.

#### Dark Theme
Low-light optimized with dark backgrounds:
- Reduced eye strain
- Better focus in dark environments
- Customizable accent colors

#### High Contrast
Accessibility-focused design:
- Maximum contrast ratios
- Bold borders and outlines
- Screen reader optimized

### Layout Customization

#### Panel Sizes
- **Adjustable dividers**: Drag to resize panels
- **Collapse panels**: Hide when not needed
- **Remember preferences**: Layout saves automatically

#### Custom CSS
Advanced users can inject custom styles:
```css
/* Example: Larger block text */
.blocklyText {
    font-size: 14px !important;
}

/* Example: Custom color scheme */
:root {
    --ui-primary: #your-color;
}
```

## Keyboard Shortcuts

### Global Shortcuts
| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| New Project | Ctrl+N | Cmd+N |
| Open Project | Ctrl+O | Cmd+O |
| Save Project | Ctrl+S | Cmd+S |
| Undo | Ctrl+Z | Cmd+Z |
| Redo | Ctrl+Shift+Z | Cmd+Shift+Z |
| Full Screen | F11 | F11 |
| Start Project | Space | Space |
| Stop Project | Escape | Escape |

### Editor Shortcuts
| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Switch to Code | Ctrl+1 | Cmd+1 |
| Switch to Costumes | Ctrl+2 | Cmd+2 |
| Switch to Sounds | Ctrl+3 | Cmd+3 |
| Find Blocks | Ctrl+F | Cmd+F |
| Zoom In | Ctrl++ | Cmd++ |
| Zoom Out | Ctrl+- | Cmd+- |
| Reset Zoom | Ctrl+0 | Cmd+0 |

## Accessibility Features

### Screen Reader Support
- **ARIA labels**: Comprehensive labeling
- **Keyboard navigation**: Full keyboard access
- **Focus indicators**: Clear focus visualization

### High Contrast Mode
- **System integration**: Respects OS preferences
- **Custom themes**: Accessibility-focused options
- **Text scaling**: Respects browser text size

### Motor Accessibility
- **Large click targets**: Easier interaction
- **Drag alternatives**: Keyboard-based operations
- **Customizable shortcuts**: Configurable hotkeys

## Performance Optimization

### Interface Performance
- **Virtual scrolling**: Smooth large lists
- **Lazy loading**: Load content on demand
- **Efficient rendering**: Minimal redraws

### Memory Management
- **Resource cleanup**: Automatic garbage collection
- **Asset optimization**: Compressed images and sounds
- **Cache management**: Smart caching strategies

## Troubleshooting Interface Issues

### Common Problems

#### Interface Not Loading
1. Check browser compatibility
2. Clear browser cache
3. Disable conflicting extensions
4. Try incognito/private mode

#### Slow Performance
1. Close other browser tabs
2. Disable unnecessary addons
3. Reduce stage size if needed
4. Update graphics drivers

#### Layout Problems
1. Reset browser zoom to 100%
2. Clear local storage
3. Disable custom CSS
4. Try different browser

### Getting Help
- **Browser Console**: Check for error messages
- **GitHub Issues**: Report interface bugs
- **Community Discord**: Get real-time help
- **Documentation Search**: Find specific solutions

The MistWarp interface is designed to be powerful yet approachable. Take time to explore the features and customize the layout to match your workflow preferences.

---

*Next: Learn about [Projects](./projects.md) to start creating and managing your work.*

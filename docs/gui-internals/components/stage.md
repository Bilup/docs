# Stage Component

The Stage component is the central visual element of MistWarp that renders the project's stage and sprites.

## Overview

The Stage component handles:
- Rendering the project's visual content
- Managing sprite positioning and transformations
- Handling stage interactions and events
- Coordinating with the VM for visual updates

## Architecture

```
StageWrapper (container)
  └── Stage (presentation component)
      ├── StageHeader
      ├── StageCanvas
      └── StageControls
```

## Key Features

### Canvas Rendering
- Uses WebGL for high-performance rendering
- Supports custom stage sizes
- Handles HD sprite rendering
- Implements efficient dirty region updates

### Event Handling
- Mouse and touch interactions
- Drag and drop for sprites
- Right-click context menus
- Keyboard events when stage is focused

### Performance Optimizations
- Frame rate limiting
- Sprite culling for off-screen sprites
- Texture atlasing for costumes
- GPU-accelerated effects

## Props Interface

```typescript
interface StageProps {
  width: number;
  height: number;
  isFullScreen: boolean;
  isStarted: boolean;
  onGreenFlag: () => void;
  onStop: () => void;
  vm: VirtualMachine;
  // ... other props
}
```

## Integration with VM

The Stage component closely integrates with the MistWarp VM:

```javascript
// Listen for VM render events
vm.on('VISUAL_REPORT', this.handleVisualUpdate);
vm.on('PROJECT_CHANGED', this.handleProjectChange);
vm.on('SPRITE_INFO_REPORT', this.handleSpriteInfo);
```

## Costume Management

The stage handles costume rendering for all sprites:
- Loads and caches costume data
- Applies transformations (rotation, scale)
- Manages layering (sprite order)
- Handles costume switching animations

## MistWarp Enhancements

MistWarp adds several enhancements to the standard Scratch stage:

### Performance Mode
- Reduced quality mode for slower devices
- Framerate limiting options
- Sprite limit enforcement

### Custom Stage Sizes
- Support for non-standard aspect ratios
- Dynamic resizing during runtime
- Responsive scaling

### Advanced Effects
- Additional visual effects beyond Scratch
- GPU shader support
- Custom blend modes

## Testing

```javascript
// Example test for stage rendering
it('should render sprites correctly', () => {
  const stage = mount(<Stage {...defaultProps} />);
  const canvas = stage.find('canvas');
  expect(canvas).toHaveLength(1);
  expect(canvas.prop('width')).toBe(480);
  expect(canvas.prop('height')).toBe(360);
});
```

## Related Components

- [Container Overview](../containers/overview)
- [GUI Component](gui-component)
- [Sprite Selector](sprite-selector)

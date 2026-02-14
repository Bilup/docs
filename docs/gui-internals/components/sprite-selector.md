# Sprite Selector Component

The Sprite Selector allows users to choose and manage sprites in their MistWarp projects.

## Overview

The Sprite Selector provides an interface for:
- Viewing all sprites in the project
- Selecting sprites for editing
- Creating new sprites
- Duplicating and deleting sprites
- Managing sprite properties

## Component Structure

```
SpriteSelectorContainer
  └── SpriteSelector
      ├── SpriteList
      │   └── SpriteInfo (for each sprite)
      └── ActionButton
          ├── NewSprite
          ├── UploadSprite
          └── SurpriseSprite
```

## Key Features

### Sprite Management
- Add new sprites from library
- Upload sprite from file
- Generate random surprise sprites
- Duplicate existing sprites
- Delete sprites with confirmation

### Visual Indicators
- Current sprite highlighting
- Costume thumbnails
- Sprite names and rename functionality
- Visibility toggles

### MistWarp Defaults

MistWarp includes "Misty" as the default sprite instead of Scratch Cat:

```javascript
// Default sprite when creating new projects
const DEFAULT_SPRITE = {
  name: 'Misty',
  costume: 'misty-a',
  x: 0,
  y: 0,
  direction: 90,
  visible: true
};
```

## Props Interface

```typescript
interface SpriteSelectorProps {
  sprites: Array&lt;SpriteInfo&gt;;
  selectedSpriteId: string;
  onSelectSprite: (spriteId: string) => void;
  onNewSprite: () => void;
  onDeleteSprite: (spriteId: string) => void;
  onDuplicateSprite: (spriteId: string) => void;
  vm: VirtualMachine;
}
```

## State Management

The component connects to Redux for sprite state:

```javascript
const mapStateToProps = state => ({
  sprites: state.targets.sprites,
  selectedSpriteId: state.targets.selectedSprite,
  editingTarget: state.targets.editingTarget
});

const mapDispatchToProps = dispatch => ({
  onSelectSprite: spriteId => dispatch(setEditingTarget(spriteId)),
  onNewSprite: () => dispatch(openNewSpriteModal()),
  // ... other actions
});
```

## Sprite Operations

### Adding Sprites

Multiple ways to add sprites:

1. **From Library**: Choose from built-in sprite collection
2. **Upload**: Load sprite from local file
3. **Paint**: Create new sprite with built-in editor
4. **Surprise**: Generate random sprite from library

### Sprite Properties

Each sprite info displays:
- Costume thumbnail (automatically generated)
- Sprite name (editable inline)
- Visibility toggle
- Context menu for advanced options

## Accessibility

The Sprite Selector includes accessibility features:
- Keyboard navigation
- Screen reader support
- High contrast mode compatibility
- Focus management

## Drag and Drop

Supports reordering sprites via drag and drop:

```javascript
onDragEnd = (result) => {
  if (!result.destination) return;
  
  const newOrder = Array.from(this.props.sprites);
  const [removed] = newOrder.splice(result.source.index, 1);
  newOrder.splice(result.destination.index, 0, removed);
  
  this.props.onReorderSprites(newOrder);
};
```

## Integration with VM

Communicates with the VM for sprite operations:

```javascript
// Creating a new sprite
vm.addSprite({
  name: spriteName,
  costume: selectedCostume,
  sounds: []
}).then(spriteId => {
  dispatch(setEditingTarget(spriteId));
});
```

## Performance Considerations

- Lazy loading of costume thumbnails
- Virtualization for projects with many sprites
- Debounced rename operations
- Efficient re-rendering with React.memo

## Testing

```javascript
describe('SpriteSelector', () => {
  it('should display all sprites', () => {
    const sprites = [mockSprite1, mockSprite2];
    const wrapper = shallow(<SpriteSelector sprites={sprites} />);
    expect(wrapper.find('SpriteInfo')).toHaveLength(2);
  });

  it('should handle sprite selection', () => {
    const onSelectSprite = jest.fn();
    const wrapper = shallow(
      <SpriteSelector onSelectSprite={onSelectSprite} />
    );
    wrapper.find('SpriteInfo').first().simulate('click');
    expect(onSelectSprite).toHaveBeenCalled();
  });
});
```

## Related Components

- [Stage Component](stage)
- [Costume Tab](costume-tab)
- [Sound Tab](sound-tab)

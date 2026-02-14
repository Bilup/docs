# Costume Management Components

The costume management system in MistWarp consists of containers and components that handle visual assets for sprites and the stage.

## Overview

The costume management system allows users to:
- View and select costumes for the current sprite/stage
- Add new costumes from library or files
- Edit costumes using the built-in paint editor
- Manage costume properties and ordering

## Container Architecture

```
CostumeTab (Container)
  └── AssetPanel (Component)
      ├── Selector (for costume list)
      │   └── SortableAsset (for each costume)
      ├── ActionMenu (add/edit/upload)
      └── PaintEditorWrapper (when editing)
```
      │   ├── AddCostume
      │   ├── UploadCostume
      │   └── PaintCostume
      └── CostumeEditor (when editing)
```

## Key Features

### Costume Management
- Display costume thumbnails and names
- Reorder costumes via drag and drop
- Delete costumes with confirmation
- Duplicate existing costumes
- Set costume center points

### Paint Editor Integration
The Costume Tab integrates with MistWarp's paint editor:

```javascript
openPaintEditor = (costumeId) => {
  this.props.onEditCostume(costumeId);
  // Opens integrated paint editor
};
```

### File Format Support
Supports multiple image formats:
- **SVG**: Vector graphics (recommended)
- **PNG**: Raster with transparency
- **JPG**: Raster without transparency
- **GIF**: Animated (first frame used)

## Props Interface

```typescript
interface CostumeTabProps {
  costumes: Array&lt;CostumeData&gt;;
  selectedCostumeId: string;
  onSelectCostume: (costumeId: string) => void;
  onNewCostume: () => void;
  onDeleteCostume: (costumeId: string) => void;
  onEditCostume: (costumeId: string) => void;
  vm: VirtualMachine;
}
```

## State Management

Connects to Redux for costume state:

```javascript
const mapStateToProps = state => ({
  costumes: state.targets.editingTarget?.costumes || [],
  selectedCostumeId: state.targets.editingTarget?.currentCostume,
  editingTarget: state.targets.editingTarget
});

const mapDispatchToProps = dispatch => ({
  onSelectCostume: id => dispatch(setActiveCostume(id)),
  onDeleteCostume: id => dispatch(deleteCostume(id)),
  // ... other actions
});
```

## Costume Operations

### Adding Costumes

Multiple methods to add costumes:

1. **From Library**: Choose from built-in costume collection
2. **Upload**: Load image files from computer
3. **Paint**: Create new costume in paint editor
4. **Camera**: Capture from webcam (if available)

### Costume Properties

Each costume has configurable properties:
- **Name**: Human-readable identifier
- **Center Point**: Rotation/scaling origin
- **Resolution**: Original image dimensions
- **Data URI**: Base64 encoded image data

## Paint Editor Integration

MistWarp includes a sophisticated paint editor:

### Vector Tools
- Pen tool for freehand drawing
- Shape tools (rectangle, circle, polygon)
- Text tool with font selection
- Gradient and pattern fills

### Bitmap Tools
- Brush with adjustable size and opacity
- Eraser tool
- Fill bucket
- Select and transform tools

### Advanced Features
- Layer support
- Undo/redo stack
- Zoom and pan
- Grid and guides

## Performance Optimizations

### Thumbnail Generation
Costumes are automatically thumbnailed for performance:

```javascript
generateThumbnail = (costume) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 80;
  canvas.height = 60;
  
  // Render costume at thumbnail size
  this.renderCostumeToCanvas(costume, canvas, ctx);
  return canvas.toDataURL();
};
```

### Lazy Loading
- Costumes loaded on-demand
- Thumbnail caching
- Progressive image loading

## MistWarp Enhancements

### Default Costumes
MistWarp ships with unique default costumes:
- "Misty" sprite with multiple poses
- Enhanced costume library
- Custom vector graphics

### Advanced Import
- Batch costume import
- Animated GIF support
- SVG optimization on import

## Accessibility

- Keyboard navigation through costume list
- Screen reader descriptions for costumes
- High contrast mode support
- Focus management in paint editor

## Testing

```javascript
describe('CostumeTab', () => {
  it('should display costumes for current sprite', () => {
    const costumes = [mockCostume1, mockCostume2];
    const wrapper = mount(
      <CostumeTab costumes={costumes} selectedCostumeId="costume1" />
    );
    expect(wrapper.find('CostumeListItem')).toHaveLength(2);
  });

  it('should open paint editor when editing costume', () => {
    const onEditCostume = jest.fn();
    const wrapper = mount(
      <CostumeTab onEditCostume={onEditCostume} />
    );
    wrapper.find('.edit-button').first().simulate('click');
    expect(onEditCostume).toHaveBeenCalled();
  });
});
```

## Related Components

- [Sprite Selector](sprite-selector)
- [Sound Tab](sound-tab)
- [Container Architecture](../containers/overview)

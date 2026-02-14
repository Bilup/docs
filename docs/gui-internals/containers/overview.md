# Containers & HOCs Overview

MistWarp uses container components and Higher-Order Components (HOCs) to separate concerns between presentation and business logic.

## Container Pattern

Container components in MistWarp follow the pattern:
- Connect to Redux store for state management
- Handle side effects and API calls
- Pass data and callbacks to presentation components
- Manage component lifecycle

## Architecture

```
Containers (Smart Components)
├── Data fetching and state management
├── Event handling and side effects
└── Props transformation

Presentation Components (Dumb Components)
├── UI rendering and styling
├── User interaction handling
└── Prop validation
```

## Common Container Pattern

```javascript
// Container component
const SpriteListContainer = () => {
  const sprites = useSelector(state => state.targets.sprites);
  const selectedSpriteId = useSelector(state => state.targets.selectedSprite);
  const dispatch = useDispatch();

  const handleSelectSprite = useCallback(
    (spriteId) => dispatch(setEditingTarget(spriteId)),
    [dispatch]
  );

  const handleDeleteSprite = useCallback(
    (spriteId) => dispatch(deleteSprite(spriteId)),
    [dispatch]
  );

  return (
    <SpriteList
      sprites={sprites}
      selectedSpriteId={selectedSpriteId}
      onSelectSprite={handleSelectSprite}
      onDeleteSprite={handleDeleteSprite}
    />
  );
};

// Presentation component
const SpriteList = ({ sprites, selectedSpriteId, onSelectSprite, onDeleteSprite }) => (
  <div className="sprite-list">
    {sprites.map(sprite => (
      <SpriteItem
        key={sprite.id}
        sprite={sprite}
        isSelected={sprite.id === selectedSpriteId}
        onSelect={() => onSelectSprite(sprite.id)}
        onDelete={() => onDeleteSprite(sprite.id)}
      />
    ))}
  </div>
);
```

## Key Container Components

### GUI Container
The main application container that orchestrates the entire MistWarp interface.

### Stage Wrapper
Manages stage state, events, and VM integration.

### Blocks Container
Handles the block workspace, toolbox, and editing state.

### Modal Containers
Manage various modal dialogs and their state.

## Higher-Order Components (HOCs)

HOCs provide reusable functionality across components:

### VM Connection HOC
```javascript
const withVM = (WrappedComponent) => {
  return (props) => {
    const vm = useSelector(state => state.vm.instance);
    
    return <WrappedComponent {...props} vm={vm} />;
  };
};

// Usage
const ConnectedStage = withVM(Stage);
```

### Loading State HOC
```javascript
const withLoadingState = (WrappedComponent) => {
  return ({ isLoading, loadingMessage, ...props }) => {
    if (isLoading) {
      return <LoadingSpinner message={loadingMessage} />;
    }
    
    return <WrappedComponent {...props} />;
  };
};
```

### Error Boundary HOC
```javascript
const withErrorBoundary = (WrappedComponent) => {
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
      return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
      console.error('Component error:', error, errorInfo);
    }

    render() {
      if (this.state.hasError) {
        return <ErrorFallback />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};
```

## State Connection Patterns

### Basic Redux Connection
```javascript
import { useSelector, useDispatch } from 'react-redux';

const MyContainer = () => {
  const data = useSelector(state => state.myData);
  const dispatch = useDispatch();
  
  const handleAction = useCallback(
    (payload) => dispatch(myAction(payload)),
    [dispatch]
  );
  
  return <MyComponent data={data} onAction={handleAction} />;
};
```

### Memoized Selectors
```javascript
import { createSelector } from 'reselect';

const getSprites = state => state.targets.sprites;
const getSelectedSpriteId = state => state.targets.selectedSprite;

const getSelectedSprite = createSelector(
  [getSprites, getSelectedSpriteId],
  (sprites, selectedId) => sprites.find(sprite => sprite.id === selectedId)
);

const SpriteEditorContainer = () => {
  const selectedSprite = useSelector(getSelectedSprite);
  // ...
};
```

## Performance Considerations

### Avoiding Unnecessary Re-renders
```javascript
// Use React.memo for presentation components
const SpriteItem = React.memo(({ sprite, isSelected, onSelect }) => (
  <div 
    className={`sprite-item ${isSelected ? 'selected' : ''}`}
    onClick={onSelect}
  >
    {sprite.name}
  </div>
));

// Use useCallback for event handlers
const SpriteListContainer = () => {
  const handleSelectSprite = useCallback(
    (spriteId) => dispatch(setEditingTarget(spriteId)),
    [dispatch]
  );
  
  // ...
};
```

### Selective State Updates
```javascript
// Only subscribe to relevant state slices
const MyContainer = () => {
  const relevantData = useSelector(state => ({
    sprites: state.targets.sprites,
    selectedId: state.targets.selectedSprite
  }), shallowEqual);
  
  // ...
};
```

## Container Testing

```javascript
describe('SpriteListContainer', () => {
  let store;
  
  beforeEach(() => {
    store = createMockStore({
      targets: {
        sprites: [mockSprite1, mockSprite2],
        selectedSprite: 'sprite1'
      }
    });
  });
  
  it('should pass correct props to presentation component', () => {
    const wrapper = mount(
      <Provider store={store}>
        <SpriteListContainer />
      </Provider>
    );
    
    const spriteList = wrapper.find(SpriteList);
    expect(spriteList.prop('sprites')).toHaveLength(2);
    expect(spriteList.prop('selectedSpriteId')).toBe('sprite1');
  });
  
  it('should dispatch action when sprite selected', () => {
    const wrapper = mount(
      <Provider store={store}>
        <SpriteListContainer />
      </Provider>
    );
    
    wrapper.find(SpriteList).prop('onSelectSprite')('sprite2');
    
    const actions = store.getActions();
    expect(actions).toContainEqual({
      type: 'targets/setEditingTarget',
      payload: 'sprite2'
    });
  });
});
```

## Best Practices

### Separation of Concerns
- Keep containers focused on data and state management
- Keep presentation components focused on UI and user interactions
- Avoid mixing business logic with presentation logic

### Performance Optimization
- Use memoization for expensive calculations
- Implement proper shouldComponentUpdate logic
- Minimize the number of state subscriptions

### Error Handling
- Wrap containers in error boundaries
- Handle async operation failures gracefully
- Provide fallback UI for error states

### Testing Strategy
- Test containers and presentation components separately
- Mock external dependencies in container tests
- Focus on state-to-props mapping in container tests

## MistWarp-Specific Patterns

### VM Integration
Most containers need to interact with the MistWarp VM:

```javascript
const BlocksContainer = () => {
  const vm = useSelector(state => state.vm.instance);
  
  useEffect(() => {
    if (vm) {
      vm.on('BLOCKS_NEED_UPDATE', handleBlocksUpdate);
      return () => vm.off('BLOCKS_NEED_UPDATE', handleBlocksUpdate);
    }
  }, [vm]);
  
  // ...
};
```

### Addon System Integration
Containers may need to work with the addon system:

```javascript
const withAddonSupport = (WrappedComponent) => {
  return (props) => {
    const addons = useSelector(state => state.addons.enabled);
    const addonAPI = useAddonAPI();
    
    return (
      <WrappedComponent 
        {...props} 
        addons={addons}
        addonAPI={addonAPI}
      />
    );
  };
};
```

## Related Documentation

- [GUI Container](gui-container)
- [Components Overview](../components/gui-component)
- [Redux Store](../state/home)

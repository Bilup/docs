---
title: Blocks Component
sidebar_position: 2
---

# Blocks Component

The Blocks component is the central workspace where users create and edit their Scratch scripts. In MistWarp, this component has been enhanced with improved performance, additional features, and better developer tools.

## Component Overview

### Core Functionality
The Blocks component provides:
- **Visual Programming Interface**: Drag-and-drop block editing
- **Syntax Highlighting**: Color-coded block categories
- **Auto-completion**: Smart block suggestions
- **Error Detection**: Real-time script validation
- **Performance Optimization**: Efficient rendering and updates

### MistWarp Enhancements
- **Turbo Mode Integration**: Visual indicators for high-performance blocks
- **Advanced Block Types**: Custom JavaScript and extension blocks
- **Improved Search**: Enhanced block palette search functionality
- **Custom Themes**: Theming support for blocks workspace
- **Debugging Tools**: Integrated debugging and profiling features

## Architecture

### Component Structure
```jsx
// Simplified component structure
const BlocksComponent = () => {
  return (
    <div className="blocks-wrapper">
      <BlocksPalette />
      <BlocksWorkspace />
      <BlocksToolbox />
    </div>
  );
};
```

### Key Subcomponents

#### BlocksPalette
Displays available blocks organized by category:
```jsx
const BlocksPalette = () => {
  const categories = [
    'motion', 'looks', 'sound', 'events',
    'control', 'sensing', 'operators',
    'variables', 'myBlocks'
  ];
  
  return (
    <div className="blocks-palette">
      {categories.map(category => (
        <CategorySection key={category} category={category} />
      ))}
    </div>
  );
};
```

#### BlocksWorkspace
The main editing area where scripts are constructed:
```jsx
const BlocksWorkspace = () => {
  const { vm, isRtl, options } = useBlocksWorkspace();
  
  useEffect(() => {
    initializeWorkspace(vm, isRtl, options);
  }, [vm, isRtl, options]);
  
  return <div id="blocks-workspace" />;
};
```

## Block Categories

### Standard Categories

#### Motion Blocks
```javascript
// Motion block definitions
const motionBlocks = {
  'motion_movesteps': {
    message0: 'move %1 steps',
    args0: [{ type: 'input_value', name: 'STEPS' }],
    category: 'motion',
    colour: '#4C97FF'
  }
  // ... more motion blocks
};
```

#### Looks Blocks
```javascript
const looksBlocks = {
  'looks_sayforsecs': {
    message0: 'say %1 for %2 seconds',
    args0: [
      { type: 'input_value', name: 'MESSAGE' },
      { type: 'input_value', name: 'SECS' }
    ],
    category: 'looks',
    colour: '#9966FF'
  }
};
```

### MistWarp Extensions

#### TurboWarp Blocks
Enhanced blocks for improved functionality:
```javascript
const turboWarpBlocks = {
  'tw_debugger': {
    message0: 'breakpoint',
    category: 'tw',
    colour: '#FF6B6B'
  },
  'tw_getLastKey': {
    message0: 'last key pressed',
    output: 'String',
    category: 'tw',
    colour: '#FF6B6B'
  }
};
```

#### JavaScript Blocks
Custom JavaScript integration blocks:
```javascript
const javascriptBlocks = {
  'js_statement': {
    message0: 'run js %1',
    args0: [{ type: 'input_value', name: 'CODE' }],
    category: 'javascript',
    colour: '#F1C40F'
  }
};
```

## Workspace Management

### Workspace Initialization
```javascript
const initializeWorkspace = (vm, isRtl, options) => {
  const workspace = Blockly.inject('blocks-workspace', {
    toolbox: generateToolbox(),
    rtl: isRtl,
    zoom: {
      controls: true,
      wheel: true,
      startScale: options.zoom || 0.675
    },
    grid: {
      spacing: 40,
      length: 2,
      colour: '#ddd'
    },
    colours: getThemeColors()
  });
  
  // Connect to VM
  workspace.addChangeListener(vm.blockListener);
  vm.attachBlocksWorkspace(workspace);
  
  return workspace;
};
```

### Dynamic Toolbox Generation
```javascript
const generateToolbox = () => {
  return `
    <xml id="toolbox">
      <category name="Motion" colour="#4C97FF">
        ${generateMotionBlocks()}
      </category>
      <category name="Looks" colour="#9966FF">
        ${generateLooksBlocks()}
      </category>
      <!-- More categories -->
    </xml>
  `;
};
```

## Event Handling

### Block Changes
```javascript
const handleBlockChange = (event) => {
  if (event.type === Blockly.Events.BLOCK_CREATE) {
    onBlockCreate(event);
  } else if (event.type === Blockly.Events.BLOCK_DELETE) {
    onBlockDelete(event);
  } else if (event.type === Blockly.Events.BLOCK_MOVE) {
    onBlockMove(event);
  }
};
```

### Workspace Events
```javascript
const setupWorkspaceEvents = (workspace) => {
  workspace.addChangeListener((event) => {
    switch (event.type) {
      case Blockly.Events.UI:
        handleUIEvent(event);
        break;
      case Blockly.Events.BLOCK_CHANGE:
        handleBlockChange(event);
        break;
      case Blockly.Events.VAR_CREATE:
        handleVariableCreate(event);
        break;
    }
  });
};
```

## Theming Support

### Theme Integration
```javascript
const applyTheme = (theme) => {
  const workspace = Blockly.getMainWorkspace();
  
  workspace.setTheme(theme);
  updateBlockColors(theme);
  updateWorkspaceColors(theme);
};
```

### Custom Block Colors
```javascript
const getThemeColors = () => {
  const theme = getCurrentTheme();
  
  return {
    motion: theme.blocks.motion || '#4C97FF',
    looks: theme.blocks.looks || '#9966FF',
    sound: theme.blocks.sound || '#CF63CF',
    events: theme.blocks.events || '#FFBF00',
    control: theme.blocks.control || '#FFAB19',
    sensing: theme.blocks.sensing || '#5CB1D6',
    operators: theme.blocks.operators || '#59C059',
    variables: theme.blocks.variables || '#FF8C1A',
    myBlocks: theme.blocks.procedures || '#FF6680'
  };
};
```

## Performance Optimizations

### Virtual Scrolling
For large workspaces with many blocks:
```javascript
const VirtualizedWorkspace = () => {
  const [visibleBlocks, setVisibleBlocks] = useState([]);
  const workspaceRef = useRef();
  
  const updateVisibleBlocks = useCallback(() => {
    const viewport = getViewportBounds();
    const visible = getAllBlocks().filter(block => 
      isBlockInViewport(block, viewport)
    );
    setVisibleBlocks(visible);
  }, []);
  
  useEffect(() => {
    const workspace = workspaceRef.current;
    workspace.addChangeListener(updateVisibleBlocks);
    return () => workspace.removeChangeListener(updateVisibleBlocks);
  }, [updateVisibleBlocks]);
  
  return (
    <div ref={workspaceRef}>
      {visibleBlocks.map(block => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
};
```

### Efficient Rendering
```javascript
const optimizeBlockRendering = () => {
  // Batch DOM updates
  const batchUpdate = () => {
    requestAnimationFrame(() => {
      updateBlockPositions();
      updateBlockConnections();
      updateBlockHighlighting();
    });
  };
  
  // Debounce workspace changes
  const debouncedUpdate = debounce(batchUpdate, 16);
  
  workspace.addChangeListener(debouncedUpdate);
};
```

## Integration with VM

### Block Execution
```javascript
const executeBlock = (blockId) => {
  const block = workspace.getBlockById(blockId);
  const opcode = block.type;
  
  // Get block inputs
  const inputs = getBlockInputs(block);
  
  // Execute via VM
  return vm.runtime.executeBlock(opcode, inputs);
};
```

### Variable Management
```javascript
const createVariable = (name, type = '') => {
  const variable = workspace.createVariable(name, type);
  
  // Sync with VM
  vm.createVariable(variable.getId(), name, type);
  
  // Update blocks that use this variable
  updateVariableBlocks(variable);
  
  return variable;
};
```

## Debugging Features

### Block Highlighting
```javascript
const highlightExecutingBlock = (blockId) => {
  const block = workspace.getBlockById(blockId);
  if (block) {
    block.addSelect();
    setTimeout(() => block.removeSelect(), 300);
  }
};
```

### Execution Tracing
```javascript
const traceExecution = (enabled) => {
  if (enabled) {
    vm.runtime.on('BLOCK_EXECUTING', highlightExecutingBlock);
  } else {
    vm.runtime.off('BLOCK_EXECUTING', highlightExecutingBlock);
  }
};
```

## Accessibility

### Keyboard Navigation
```javascript
const setupKeyboardNavigation = () => {
  workspace.keyboardAccessibility = new Blockly.KeyboardShortcuts(workspace);
  
  // Custom shortcuts
  workspace.keyboardAccessibility.addShortcut(
    'Space',
    () => executeSelectedBlock(),
    'Execute selected block'
  );
};
```

### Screen Reader Support
```javascript
const setupScreenReader = () => {
  workspace.getAudioManager().load([
    ['block_created', 'Block created'],
    ['block_deleted', 'Block deleted'],
    ['block_connected', 'Blocks connected']
  ]);
};
```

## Testing

### Component Testing
```javascript
import { render, fireEvent } from '@testing-library/react';
import { BlocksComponent } from './blocks-component';

describe('BlocksComponent', () => {
  test('renders workspace correctly', () => {
    const { container } = render(<BlocksComponent />);
    expect(container.querySelector('#blocks-workspace')).toBeInTheDocument();
  });
  
  test('handles block creation', () => {
    const onBlockCreate = jest.fn();
    render(<BlocksComponent onBlockCreate={onBlockCreate} />);
    
    // Simulate block creation
    fireEvent.dragEnd(container.querySelector('.motion-block'));
    expect(onBlockCreate).toHaveBeenCalled();
  });
});
```

### Integration Testing
```javascript
describe('Blocks VM Integration', () => {
  test('executes blocks correctly', async () => {
    const vm = new VirtualMachine();
    const blocksComponent = mount(<BlocksComponent vm={vm} />);
    
    // Create and execute a simple block
    const moveBlock = createMoveBlock(10);
    const result = await vm.executeBlock(moveBlock);
    
    expect(result).toBe(true);
  });
});
```

The Blocks component is the heart of the MistWarp editing experience, providing a powerful and intuitive interface for visual programming. Its integration with the VM, theming system, and performance optimizations make it both user-friendly and efficient for creating complex projects.

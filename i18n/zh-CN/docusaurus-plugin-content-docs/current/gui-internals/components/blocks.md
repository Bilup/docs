---
title: 积木组件
sidebar_position: 2
---

# 积木组件

积木组件是用户创建和编辑 Scratch 脚本的中央工作区。在 Bilup 中，此组件已通过改进的性能、额外功能和更好的开发者工具得到增强。

## 组件概述

### 核心功能
积木组件提供：
- **可视化编程界面**：拖放积木编辑
- **语法高亮**：彩色编码的积木类别
- **自动完成**：智能积木建议
- **错误检测**：实时脚本验证
- **性能优化**：高效渲染和更新

### Bilup 增强功能
- **加速模式集成**：高性能积木的视觉指示器
- **高级积木类型**：自定义 JavaScript 和扩展积木
- **改进的搜索**：增强的积木面板搜索功能
- **自定义主题**：积木工作区的主题支持
- **调试工具**：集成调试和分析功能

## 架构

### 组件结构
```jsx
// 简化的组件结构
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

### 主要子组件

#### BlocksPalette
按类别显示可用积木：
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
构建脚本的主编辑区域：
```jsx
const BlocksWorkspace = () => {
  const { vm, isRtl, options } = useBlocksWorkspace();
  
  useEffect(() => {
    initializeWorkspace(vm, isRtl, options);
  }, [vm, isRtl, options]);
  
  return <div id="blocks-workspace" />;
};
```

## 积木类别

### 标准类别

#### 运动积木
```javascript
// 运动积木定义
const motionBlocks = {
  'motion_movesteps': {
    message0: 'move %1 steps',
    args0: [{ type: 'input_value', name: 'STEPS' }],
    category: 'motion',
    colour: '#4C97FF'
  }
  // ... 更多运动积木
};
```

#### 外观积木
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

### Bilup 扩展

#### TurboWarp 积木
增强功能的积木：
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

#### JavaScript 积木
自定义 JavaScript 集成积木：
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

## 工作区管理

### 工作区初始化
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
  
  // 连接到 VM
  workspace.addChangeListener(vm.blockListener);
  vm.attachBlocksWorkspace(workspace);
  
  return workspace;
};
```

### 动态工具箱生成
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
      <!-- 更多类别 -->
    </xml>
  `;
};
```

## 事件处理

### 积木变化
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

### 工作区事件
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

## 主题支持

### 主题集成
```javascript
const applyTheme = (theme) => {
  const workspace = Blockly.getMainWorkspace();
  
  workspace.setTheme(theme);
  updateBlockColors(theme);
  updateWorkspaceColors(theme);
};
```

### 自定义积木颜色
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

## 性能优化

### 虚拟滚动
对于包含许多积木的大型工作区：
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

### 高效渲染
```javascript
const optimizeBlockRendering = () => {
  // 批量 DOM 更新
  const batchUpdate = () => {
    requestAnimationFrame(() => {
      updateBlockPositions();
      updateBlockConnections();
      updateBlockHighlighting();
    });
  };
  
  // 防抖工作区变化
  const debouncedUpdate = debounce(batchUpdate, 16);
  
  workspace.addChangeListener(debouncedUpdate);
};
```

## 与 VM 的集成

### 积木执行
```javascript
const executeBlock = (blockId) => {
  const block = workspace.getBlockById(blockId);
  const opcode = block.type;
  
  // 获取积木输入
  const inputs = getBlockInputs(block);
  
  // 通过 VM 执行
  return vm.runtime.executeBlock(opcode, inputs);
};
```

### 变量管理
```javascript
const createVariable = (name, type = '') => {
  const variable = workspace.createVariable(name, type);
  
  // 与 VM 同步
  vm.createVariable(variable.getId(), name, type);
  
  // 更新使用此变量的积木
  updateVariableBlocks(variable);
  
  return variable;
};
```

## 调试功能

### 积木高亮
```javascript
const highlightExecutingBlock = (blockId) => {
  const block = workspace.getBlockById(blockId);
  if (block) {
    block.addSelect();
    setTimeout(() => block.removeSelect(), 300);
  }
};
```

### 执行追踪
```javascript
const traceExecution = (enabled) => {
  if (enabled) {
    vm.runtime.on('BLOCK_EXECUTING', highlightExecutingBlock);
  } else {
    vm.runtime.off('BLOCK_EXECUTING', highlightExecutingBlock);
  }
};
```

## 无障碍功能

### 键盘导航
```javascript
const setupKeyboardNavigation = () => {
  workspace.keyboardAccessibility = new Blockly.KeyboardShortcuts(workspace);
  
  // 自定义快捷键
  workspace.keyboardAccessibility.addShortcut(
    'Space',
    () => executeSelectedBlock(),
    'Execute selected block'
  );
};
```

### 屏幕阅读器支持
```javascript
const setupScreenReader = () => {
  workspace.getAudioManager().load([
    ['block_created', 'Block created'],
    ['block_deleted', 'Block deleted'],
    ['block_connected', 'Blocks connected']
  ]);
};
```

## 测试

### 组件测试
```javascript
import { render, fireEvent } from '@testing-library/react';
import { BlocksComponent } from './blocks-component';

describe('BlocksComponent', () => {
  test('正确渲染工作区', () => {
    const { container } = render(<BlocksComponent />);
    expect(container.querySelector('#blocks-workspace')).toBeInTheDocument();
  });
  
  test('处理积木创建', () => {
    const onBlockCreate = jest.fn();
    render(<BlocksComponent onBlockCreate={onBlockCreate} />);
    
    // 模拟积木创建
    fireEvent.dragEnd(container.querySelector('.motion-block'));
    expect(onBlockCreate).toHaveBeenCalled();
  });
});
```

### 集成测试
```javascript
describe('Blocks VM Integration', () => {
  test('正确执行积木', async () => {
    const vm = new VirtualMachine();
    const blocksComponent = mount(<BlocksComponent vm={vm} />);
    
    // 创建并执行一个简单的积木
    const moveBlock = createMoveBlock(10);
    const result = await vm.executeBlock(moveBlock);
    
    expect(result).toBe(true);
  });
});
```

积木组件是 Bilup 编辑体验的核心，为可视化编程提供了强大且直观的界面。它与 VM、主题系统和性能优化的集成使其既用户友好，又能高效地创建复杂项目。

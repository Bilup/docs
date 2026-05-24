---
title: 开发测试
sidebar_position: 5
---

# Bilup 开发中的测试

测试是 Bilup 开发的关键部分，确保代码质量、防止回归并在整个平台上保持可靠性。本指南涵盖 Bilup 开发的测试策略、工具和最佳实践。

## 测试策略

### 测试金字塔
Bilup 遵循全面的测试金字塔：

1. **单元测试** (70%)：测试单个函数和组件
2. **集成测试** (20%)：测试组件交互
3. **端到端测试** (10%)：测试完整的用户工作流程

### 测试类型

#### 组件测试
隔离测试 React 组件：
```javascript
import { render, fireEvent, screen } from '@testing-library/react';
import { BlocksComponent } from '../blocks-component';

describe('BlocksComponent', () => {
  test('正确渲染工作区', () => {
    render(<BlocksComponent />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

#### VM 测试
测试虚拟机功能：
```javascript
import VirtualMachine from 'scratch-vm';

describe('VirtualMachine', () => {
  let vm;
  
  beforeEach(() => {
    vm = new VirtualMachine();
  });
  
  test('应该执行简单脚本', async () => {
    const project = createTestProject();
    await vm.loadProject(project);
    
    vm.greenFlag();
    // 测试执行逻辑
  });
});
```

## 测试设置

### Jest 配置
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  moduleNameMapping: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/test/__mocks__/fileMock.js'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/playground/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

### 测试环境设置
```javascript
// test/setup.js
import '@testing-library/jest-dom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// 全局测试工具
global.fetch = require('jest-fetch-mock');
global.URL.createObjectURL = jest.fn();

// 模拟虚拟机
global.VirtualMachine = require('scratch-vm');
```

## 运行测试

### 测试命令
```bash
# 运行所有测试
npm test

# 在监听模式下运行测试
npm run test:watch

# 运行特定测试文件
npm test -- blocks-component.test.js

# 运行测试并生成覆盖率报告
npm run test:coverage

# 运行集成测试
npm run test:integration

# 运行端到端测试
npm run test:e2e
```

### 测试脚本
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:integration": "jest --testMatch='**/integration/**/*.test.js'",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open"
  }
}
```

## 单元测试

### 组件测试
```javascript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import SpriteSelector from '../sprite-selector';

const mockStore = configureStore([]);

describe('SpriteSelector', () => {
  let store;
  
  beforeEach(() => {
    store = mockStore({
      targets: {
        sprites: [
          { id: '1', name: 'Sprite1' },
          { id: '2', name: 'Sprite2' }
        ],
        editingTarget: '1'
      }
    });
  });
  
  test('正确显示角色', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SpriteSelector />
      </Provider>
    );
    
    expect(getByText('Sprite1')).toBeInTheDocument();
    expect(getByText('Sprite2')).toBeInTheDocument();
  });
  
  test('处理角色选择', () => {
    const onSelect = jest.fn();
    const { getByText } = render(
      <Provider store={store}>
        <SpriteSelector onSelectSprite={onSelect} />
      </Provider>
    );
    
    fireEvent.click(getByText('Sprite2'));
    expect(onSelect).toHaveBeenCalledWith('2');
  });
});
```

### Redux 测试
```javascript
import reducer from '../reducers/targets';
import * as actions from '../actions/targets';

describe('targets reducer', () => {
  test('should handle UPDATE_TARGETS', () => {
    const initialState = { sprites: [], editingTarget: null };
    const action = actions.updateTargets([
      { id: '1', name: 'Sprite1', isStage: false }
    ]);
    const expectedState = {
      sprites: [{ id: '1', name: 'Sprite1', isStage: false }],
      editingTarget: null
    };
    expect(reducer(initialState, action)).toEqual(expectedState);
  });
});
```

## 集成测试

### VM 集成
```javascript
describe('VM 集成', () => {
  let vm;
  let gui;
  
  beforeEach(() => {
    vm = new VirtualMachine();
    gui = mount(<GUI vm={vm} />);
  });
  
  test('正确加载项目', async () => {
    const project = createTestProject();
    
    await vm.loadProject(project);
    
    await waitFor(() => {
      expect(gui.find('SpriteSelector')).toHaveLength(1);
      expect(gui.find('BlocksWorkspace')).toHaveLength(1);
    });
  });
  
  test('正确执行积木', async () => {
    const project = createProjectWithMoveBlock(10);
    await vm.loadProject(project);
    
    const sprite = vm.runtime.targets[1];
    const initialX = sprite.x;
    
    vm.greenFlag();
    await vm.runtime.sequencer.stepAll();
    
    expect(sprite.x).toBe(initialX + 10);
  });
});
```

### 组件集成
```javascript
describe('组件集成', () => {
  test('积木和舞台正确通信', async () => {
    const store = createMockStore();
    const wrapper = mount(
      <Provider store={store}>
        <div>
          <BlocksComponent />
          <StageComponent />
        </div>
      </Provider>
    );
    
    // 模拟积木创建
    const workspace = Blockly.getMainWorkspace();
    const block = workspace.newBlock('motion_movesteps');
    block.setFieldValue('10', 'STEPS');
    
    // 执行积木
    vm.runtime.executeBlock(block);
    
    // 检查舞台更新
    await waitFor(() => {
      const stage = wrapper.find('StageComponent');
      expect(stage.prop('sprite').x).toBe(10);
    });
  });
});
```

## 端到端测试

### Cypress 设置
```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8601',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    video: true,
    screenshotOnRunFailure: true
  }
});
```

### E2E 测试示例
```javascript
// cypress/e2e/project-loading.cy.js
describe('项目加载', () => {
  it('应该从 URL 加载项目', () => {
    cy.visit('/123456789');
    
    // 等待项目加载
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
    
    // 检查项目正确加载
    cy.get('[data-testid="stage"]').should('be.visible');
    cy.get('[data-testid="sprite-selector"]').should('contain', 'Sprite1');
  });
  
  it('应该运行简单项目', () => {
    cy.visit('/123456789');
    cy.wait(2000); // 等待加载
    
    // 点击绿旗
    cy.get('[data-testid="green-flag"]').click();
    
    // 检查角色移动
    cy.get('[data-testid="sprite-1"]')
      .should('have.attr', 'transform')
      .and('include', 'translate');
  });
});
```

### 自定义命令
```javascript
// cypress/support/commands.js
Cypress.Commands.add('loadProject', (projectId) => {
  cy.visit(`/${projectId}`);
  cy.get('[data-testid="loading-spinner"]').should('not.exist');
});

Cypress.Commands.add('createSprite', (name) => {
  cy.get('[data-testid="add-sprite"]').click();
  cy.get('[data-testid="sprite-name-input"]').type(name);
  cy.get('[data-testid="create-sprite-button"]').click();
});

Cypress.Commands.add('addBlock', (blockType) => {
  cy.get(`[data-block="${blockType}"]`).dragTo('[data-testid="workspace"]');
});
```

## 性能测试

### 负载测试
```javascript
describe('性能测试', () => {
  test('应该处理大型项目', async () => {
    const largeProject = createProjectWithManySprites(100);
    
    const startTime = performance.now();
    await vm.loadProject(largeProject);
    const loadTime = performance.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // 最多 5 秒
  });
  
  test('应该保持良好 FPS', async () => {
    const project = createAnimationProject();
    await vm.loadProject(project);
    
    const fps = await measureFPS(() => {
      vm.greenFlag();
      return new Promise(resolve => setTimeout(resolve, 5000));
    });
    
    expect(fps).toBeGreaterThan(30);
  });
});
```

### 内存测试
```javascript
test('不应泄漏内存', async () => {
  const initialMemory = getMemoryUsage();

  // 加载和卸载多个项目
  for (let i = 0; i < 10; i++) {
    const project = createTestProject();
    await vm.loadProject(project);
    vm.clear();
  }

  // 强制内存回收
  if (global.gc) global.gc();

  const finalMemory = getMemoryUsage();
  const memoryIncrease = finalMemory - initialMemory;

  expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 最多 50MB
});
```

## 测试工具

### Mock 工厂
```javascript
// test/factories.js
export const createMockVM = () => ({
  runtime: {
    targets: [],
    sequencer: { stepAll: jest.fn() },
    getTargetForStage: jest.fn()
  },
  loadProject: jest.fn(),
  greenFlag: jest.fn(),
  stopAll: jest.fn()
});

export const createMockSprite = (overrides = {}) => ({
  id: 'sprite-1',
  name: 'Sprite1',
  x: 0,
  y: 0,
  direction: 90,
  size: 100,
  visible: true,
  ...overrides
});

export const createTestProject = () => ({
  targets: [
    createMockSprite({ isStage: true, name: 'Stage' }),
    createMockSprite({ name: 'Sprite1' })
  ],
  monitors: [],
  extensions: []
});
```

### 测试辅助函数
```javascript
// test/helpers.js
export const waitForVM = (vm, event) => {
  return new Promise(resolve => {
    vm.once(event, resolve);
  });
};

export const measureFPS = async (testFunction) => {
  const frames = [];
  const startTime = performance.now();
  
  const measureFrame = () => {
    frames.push(performance.now());
    if (performance.now() - startTime < 5000) {
      requestAnimationFrame(measureFrame);
    }
  };
  
  requestAnimationFrame(measureFrame);
  await testFunction();
  
  return frames.length / 5; // 5秒内的平均 FPS
};
```

## 持续集成

### GitHub Actions
```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm run test:coverage
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Upload coverage
      uses: codecov/codecov-action@v2
```

### 测试覆盖率
```bash
# 生成覆盖率报告
npm run test:coverage

# 在浏览器中查看覆盖率
open coverage/lcov-report/index.html

# 在 package.json 中设置覆盖率阈值
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

Bilup 的测试确保了所有组件的代码质量和可靠性。遵循这些实践来维护一个用户可以依赖的健壮、经过良好测试的代码库!

---
title: Development Testing
sidebar_position: 5
---

# Testing in MistWarp Development

Testing is a crucial part of MistWarp development, ensuring code quality, preventing regressions, and maintaining reliability across the platform. This guide covers testing strategies, tools, and best practices for MistWarp development.

## Testing Strategy

### Testing Pyramid
MistWarp follows a comprehensive testing pyramid:

1. **Unit Tests** (70%): Test individual functions and components
2. **Integration Tests** (20%): Test component interactions
3. **End-to-End Tests** (10%): Test complete user workflows

### Test Types

#### Component Tests
Test React components in isolation:
```javascript
import { render, fireEvent, screen } from '@testing-library/react';
import { BlocksComponent } from '../blocks-component';

describe('BlocksComponent', () => {
  test('renders workspace correctly', () => {
    render(<BlocksComponent />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

#### VM Tests
Test virtual machine functionality:
```javascript
import VirtualMachine from 'scratch-vm';

describe('VirtualMachine', () => {
  let vm;
  
  beforeEach(() => {
    vm = new VirtualMachine();
  });
  
  test('should execute simple script', async () => {
    const project = createTestProject();
    await vm.loadProject(project);
    
    vm.greenFlag();
    // Test execution logic
  });
});
```

## Test Setup

### Jest Configuration
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

### Test Environment Setup
```javascript
// test/setup.js
import '@testing-library/jest-dom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Global test utilities
global.fetch = require('jest-fetch-mock');
global.URL.createObjectURL = jest.fn();

// Mock VM
global.VirtualMachine = require('scratch-vm');
```

## Running Tests

### Test Commands
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- blocks-component.test.js

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run end-to-end tests
npm run test:e2e
```

### Test Scripts
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

## Unit Testing

### Component Testing
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
  
  test('displays sprites correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <SpriteSelector />
      </Provider>
    );
    
    expect(getByText('Sprite1')).toBeInTheDocument();
    expect(getByText('Sprite2')).toBeInTheDocument();
  });
  
  test('handles sprite selection', () => {
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

### Redux Testing
```javascript
import reducer from '../reducers/targets';
import * as actions from '../actions/targets';

describe('targets reducer', () => {
  test('should handle UPDATE_TARGETS', () => {
    const initialState = { sprites: [], editingTarget: null };
    const action = actions.updateTargets([
      { id: '1', name: 'Sprite1', isStage: false }
    ]);
    
    const newState = reducer(initialState, action);
    
    expect(newState.sprites).toHaveLength(1);
    expect(newState.sprites[0].name).toBe('Sprite1');
  });
});
```

## Integration Testing

### VM Integration
```javascript
describe('VM Integration', () => {
  let vm;
  let gui;
  
  beforeEach(() => {
    vm = new VirtualMachine();
    gui = mount(<GUI vm={vm} />);
  });
  
  test('loads project correctly', async () => {
    const project = createTestProject();
    
    await vm.loadProject(project);
    
    await waitFor(() => {
      expect(gui.find('SpriteSelector')).toHaveLength(1);
      expect(gui.find('BlocksWorkspace')).toHaveLength(1);
    });
  });
  
  test('executes blocks correctly', async () => {
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

### Component Integration
```javascript
describe('Component Integration', () => {
  test('blocks and stage communicate correctly', async () => {
    const store = createMockStore();
    const wrapper = mount(
      <Provider store={store}>
        <div>
          <BlocksComponent />
          <StageComponent />
        </div>
      </Provider>
    );
    
    // Simulate block creation
    const workspace = Blockly.getMainWorkspace();
    const block = workspace.newBlock('motion_movesteps');
    block.setFieldValue('10', 'STEPS');
    
    // Execute block
    vm.runtime.executeBlock(block);
    
    // Check stage updates
    await waitFor(() => {
      const stage = wrapper.find('StageComponent');
      expect(stage.prop('sprite').x).toBe(10);
    });
  });
});
```

## End-to-End Testing

### Cypress Setup
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

### E2E Test Examples
```javascript
// cypress/e2e/project-loading.cy.js
describe('Project Loading', () => {
  it('should load a project from URL', () => {
    cy.visit('/123456789');
    
    // Wait for project to load
    cy.get('[data-testid="loading-spinner"]').should('be.visible');
    cy.get('[data-testid="loading-spinner"]').should('not.exist');
    
    // Check project loaded correctly
    cy.get('[data-testid="stage"]').should('be.visible');
    cy.get('[data-testid="sprite-selector"]').should('contain', 'Sprite1');
  });
  
  it('should run a simple project', () => {
    cy.visit('/123456789');
    cy.wait(2000); // Wait for load
    
    // Click green flag
    cy.get('[data-testid="green-flag"]').click();
    
    // Check sprite moved
    cy.get('[data-testid="sprite-1"]')
      .should('have.attr', 'transform')
      .and('include', 'translate');
  });
});
```

### Custom Commands
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

## Performance Testing

### Load Testing
```javascript
describe('Performance Tests', () => {
  test('should handle large projects', async () => {
    const largeProject = createProjectWithManySprites(100);
    
    const startTime = performance.now();
    await vm.loadProject(largeProject);
    const loadTime = performance.now() - startTime;
    
    expect(loadTime).toBeLessThan(5000); // 5 seconds max
  });
  
  test('should maintain good FPS', async () => {
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

### Memory Testing
```javascript
test('should not leak memory', async () => {
  const initialMemory = getMemoryUsage();
  
  // Load and unload many projects
  for (let i = 0; i < 10; i++) {
    const project = createTestProject();
    await vm.loadProject(project);
    vm.clear();
  }
  
  // Force garbage collection
  if (global.gc) global.gc();
  
  const finalMemory = getMemoryUsage();
  const memoryIncrease = finalMemory - initialMemory;
  
  expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // 50MB max
});
```

## Test Utilities

### Mock Factories
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

### Test Helpers
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
  
  return frames.length / 5; // Average FPS over 5 seconds
};
```

## Continuous Integration

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

### Test Coverage
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html

# Set coverage thresholds in package.json
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

Testing in MistWarp ensures code quality and reliability across all components. Follow these practices to maintain a robust, well-tested codebase that users can depend on!

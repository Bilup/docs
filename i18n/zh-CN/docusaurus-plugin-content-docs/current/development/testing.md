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

// Mock VM
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
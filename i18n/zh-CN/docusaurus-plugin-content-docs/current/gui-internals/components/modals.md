---
title: 模态框组件
sidebar_position: 8
---

# 模态框组件

Bilup 使用各种模态对话框进行用户交互和确认。

## 概述

模态框组件提供：
- 用户确认和提示
- 设置和偏好设置界面
- 错误和信息消息
- 聚焦上下文中的复杂工作流

## 模态框架构

```
ModalContainer
  └── Modal (base component)
      ├── ModalHeader
      ├── ModalBody
      └── ModalFooter
          ├── PrimaryButton
          └── SecondaryButton
```

## 基础模态框组件

基础 Modal 提供通用功能：

```javascript
const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  actions,
  size = 'medium',
  closeOnEscape = true,
  closeOnBackdrop = true
}) => {
  useEffect(() => {
    if (isOpen && closeOnEscape) {
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={closeOnBackdrop ? onClose : undefined}>
      <div className={`modal modal-${size}`} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {actions && (
          <div className="modal-footer">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
```

## 常见模态框类型

### 确认模态框

用于破坏性操作：

```javascript
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    actions={[
      <Button key="cancel" onClick={onClose}>Cancel</Button>,
      <Button key="confirm" onClick={onConfirm} variant="danger">
        Confirm
      </Button>
    ]}
  >
    <p>{message}</p>
  </Modal>
);

// Usage
const handleDeleteSprite = () => {
  setShowConfirm(true);
};

<ConfirmationModal
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={() => {
    dispatch(deleteSprite(spriteId));
    setShowConfirm(false);
  }}
  title="Delete Sprite"
  message="Are you sure you want to delete this sprite? This action cannot be undone."
/>
```

### 加载模态框

用于长时间运行的操作：

```javascript
const LoadingModal = ({ isOpen, message, progress }) => (
  <Modal
    isOpen={isOpen}
    title="Loading"
    closeOnEscape={false}
    closeOnBackdrop={false}
  >
    <div className="loading-content">
      <div className="spinner" />
      <p>{message}</p>
      {progress !== undefined && (
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  </Modal>
);
```

### 设置模态框

复杂的设置界面：

```javascript
const SettingsModal = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState(getSettings());

  const handleSave = () => {
    saveSettings(settings);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      size="large"
      actions={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="save" onClick={handleSave} variant="primary">
          Save
        </Button>
      ]}
    >
      <SettingsForm settings={settings} onChange={setSettings} />
    </Modal>
  );
};
```

## Bilup 专用模态框

### 新项目模态框

```javascript
const NewProjectModal = ({ isOpen, onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState('');
  const [template, setTemplate] = useState('blank');

  const templates = [
    { id: 'blank', name: 'Blank Project', description: 'Start with empty stage and zero sprite' },
    { id: 'tutorial', name: 'Tutorial', description: 'Guided introduction to Bilup' },
    { id: 'game', name: 'Game Template', description: 'Pre-built game framework' }
  ];

  const handleCreate = () => {
    onCreateProject({
      name: projectName || 'Untitled Project',
      template
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="New Project"
      actions={[
        <Button key="cancel" onClick={onClose}>Cancel</Button>,
        <Button key="create" onClick={handleCreate} variant="primary">
          Create
        </Button>
      ]}
    >
      <div className="new-project-form">
        <label>
          Project Name:
          <input
            type="text"
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            placeholder="Enter project name"
          />
        </label>
        
        <label>Template:</label>
        <div className="template-grid">
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              className={`template-card ${template === tmpl.id ? 'selected' : ''}`}
              onClick={() => setTemplate(tmpl.id)}
            >
              <h4>{tmpl.name}</h4>
              <p>{tmpl.description}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
```

### 扩展管理器模态框

```javascript
const ExtensionManagerModal = ({ isOpen, onClose }) => {
  const [extensions, setExtensions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAvailableExtensions();
    }
  }, [isOpen]);

  const loadAvailableExtensions = async () => {
    setLoading(true);
    try {
      const extensionList = await fetchExtensions();
      setExtensions(extensionList);
    } catch (error) {
      console.error('Failed to load extensions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Extension Manager"
      size="large"
    >
      {loading ? (
        <div className="loading">Loading extensions...</div>
      ) : (
        <ExtensionList 
          extensions={extensions}
          onToggleExtension={handleToggleExtension}
        />
      )}
    </Modal>
  );
};
```

## 状态管理

模态框通过 Redux 管理：

```javascript
// Modal state slice
const modalSlice = createSlice({
  name: 'modals',
  initialState: {
    confirmation: { isOpen: false },
    settings: { isOpen: false },
    newProject: { isOpen: false },
    loading: { isOpen: false, message: '', progress: 0 }
  },
  reducers: {
    openModal: (state, action) => {
      const { modalType, props } = action.payload;
      state[modalType] = { isOpen: true, ...props };
    },
    closeModal: (state, action) => {
      const { modalType } = action.payload;
      state[modalType] = { ...state[modalType], isOpen: false };
    },
    updateModalProps: (state, action) => {
      const { modalType, props } = action.payload;
      state[modalType] = { ...state[modalType], ...props };
    }
  }
});

// Usage in components
const dispatch = useDispatch();

const showConfirmation = (message, onConfirm) => {
  dispatch(openModal({
    modalType: 'confirmation',
    props: { message, onConfirm }
  }));
};
```

## 可访问性功能

### 焦点管理
```javascript
const Modal = ({ isOpen, children }) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      modalRef.current?.focus();
      
      return () => {
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="modal"
    >
      {children}
    </div>
  );
};
```

### 键盘导航
- Tab 在模态框内循环
- Escape 键关闭
- Enter 键执行主要操作
- 箭头键用于列表导航

### 屏幕阅读器支持
- 正确的 ARIA 角色和标签
- 动态内容的实时区域
- 描述性公告

## 样式

模态框样式支持主题：

```scss
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: var(--color-background);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-large);
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  
  &.modal-small { width: 300px; }
  &.modal-medium { width: 500px; }
  &.modal-large { width: 800px; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-medium);
  border-bottom: 1px solid var(--color-border);
}

.modal-body {
  padding: var(--spacing-medium);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-small);
  padding: var(--spacing-medium);
  border-top: 1px solid var(--color-border);
}
```

## 测试

```javascript
describe('Modal Components', () => {
  it('should render when open', () => {
    const wrapper = mount(
      <Modal isOpen={true} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(wrapper.find('.modal')).toHaveLength(1);
    expect(wrapper.find('.modal-header h2')).toHaveText('Test Modal');
  });

  it('should not render when closed', () => {
    const wrapper = mount(
      <Modal isOpen={false} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    expect(wrapper.find('.modal')).toHaveLength(0);
  });

  it('should call onClose when escape key pressed', () => {
    const onClose = jest.fn();
    const wrapper = mount(
      <Modal isOpen={true} onClose={onClose} />
    );
    
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    
    expect(onClose).toHaveBeenCalled();
  });
});
```

## 相关组件

- [菜单栏组件](menu-bar)
- [GUI 组件](gui-component)
- [容器架构](../containers/overview)
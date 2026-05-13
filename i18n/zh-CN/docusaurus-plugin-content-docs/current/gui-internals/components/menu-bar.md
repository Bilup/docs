---
title: 菜单栏组件
sidebar_position: 7
---

# 菜单栏组件

菜单栏为 Bilup 提供主要导航和顶级操作。许多功能可以通过默认启用的插件来增强或添加。

## 概述

菜单栏包含（从左到右）：
- **错误菜单** - 发生编译错误时显示
- **文件** - 项目操作（新建、加载、保存、打包）
- **编辑** - 编辑操作（撤销、重做、涡轮模式、云变量、设置）
- **设置** - 主题和语言选择
- **模式** - 特殊编辑器模式（如 Caturday 模式）
- **项目控制** - 项目标题、保存状态和其他项目特定操作
- **插件增强** - 默认插件（如 workspace-tabs）添加书签功能

## 组件结构

```
MenuBarContainer
  └── MenuBar
      ├── ErrorMenu (条件渲染)
      ├── FileDropdown
      ├── EditDropdown  
      ├── SettingsMenu
      ├── ModeMenu (条件渲染)
      ├── ProjectTitle
      ├── SaveStatus
      └── UserControls
```

## 菜单组件

### 错误菜单
编译错误发生时显示：
- **错误列表**：显示角色编译错误
- **报告错误**：链接到错误报告页面

### 文件下拉菜单
项目文件操作：
- **新建项目**：创建一个带默认角色的空白项目
- **新建窗口**：在新窗口中打开 Bilup（桌面应用）
- **从计算机加载**：上传 .sb3 或 .sb2 文件
- **保存到计算机**：将项目下载为 .sb3
- **另存为副本**：创建项目副本
- **打包项目**：在 Bilup Packager 中打开
- **恢复点**：管理项目恢复点
- **自动保存控制**：暂停/恢复自动保存

### 编辑下拉菜单
编辑操作和项目设置：
- **恢复**：恢复最近删除的角色/造型/声音
- **涡轮模式**：切换涡轮模式以加快执行速度
- **云变量**：启用/禁用云变量支持
- **高级设置**：打开高级设置模态框
- **插件**：配置插件设置
- **扩展**：打开扩展库
项目管理：
- **工作区书签**：保存和导航到特定工作区位置（由插件提供）
  - 将当前位置添加为书签
  - 快速跳转到保存的工作区位置
  - 书签管理和组织

## 实现细节

### 项目标题
显示当前项目名称：

```javascript
const ProjectTitle = () => {
  const projectTitle = useSelector(state => 
    state.project.title || 'Untitled'
  );

  return (
    <div className="project-title">
      {projectTitle}
    </div>
  );
};
```

## Props 接口

```typescript
interface MenuBarProps {
  projectTitle: string;
  canUndo: boolean;
  canRedo: boolean;
  currentTheme: 'light' | 'dark' | 'high-contrast';
  onNewProject: () => void;
  onLoadProject: (file: File) => void;
  onSaveProject: () => void;
  onThemeChange: (theme: string) => void;
  vm: VirtualMachine;
}
```

## 状态管理

菜单栏连接到 Redux 状态：

```javascript
const mapStateToProps = state => ({
  projectTitle: state.project.title || 'Untitled',
  canUndo: state.vm.editingTarget?.undoStack.length > 0,
  canRedo: state.vm.editingTarget?.redoStack.length > 0,
  currentTheme: state.gui.theme
});

const mapDispatchToProps = dispatch => ({
  onNewProject: () => dispatch(createNewProject()),
  onLoadProject: file => dispatch(loadProject(file)),
  onSaveProject: () => dispatch(saveProject()),
  onUndo: () => dispatch(undo()),
  onRedo: () => dispatch(redo()),
  onThemeChange: theme => dispatch(setTheme(theme))
});
```

## Bilup 品牌

菜单栏显著显示 Bilup 品牌：

```javascript
const BilupBranding = () => (
  <div className="bilup-branding">
    <img src="/static/bilup-logo.svg" alt="Bilup" />
    <span className="brand-text">Bilup</span>
    <span className="version-info">v{BILUP_VERSION}</span>
  </div>
);
```

## 语言支持

Bilup 支持多种语言：

```javascript
const LanguageSelector = ({ currentLanguage, onLanguageChange }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh-cn', name: '简体中文' },
    { code: 'ja', name: '日本語' }
  ];

  return (
    <Select value={currentLanguage} onChange={onLanguageChange}>
      {languages.map(lang => (
        <Option key={lang.code} value={lang.code}>
          {lang.name}
        </Option>
      ))}
    </Select>
  );
};
```

## 键盘快捷键

菜单栏注册全局键盘快捷键：

```javascript
const keyboardShortcuts = {
  'Ctrl+N': 'newProject',
  'Ctrl+O': 'loadProject',
  'Ctrl+S': 'saveProject',
  'Ctrl+Z': 'undo',
  'Ctrl+Y': 'redo',
  'Ctrl+Shift+Z': 'redo',
  'F11': 'toggleFullScreen'
};

const handleKeyDown = (event) => {
  const shortcut = formatKeyboardShortcut(event);
  const action = keyboardShortcuts[shortcut];
  
  if (action) {
    event.preventDefault();
    dispatch({ type: action });
  }
};
```

## 响应式设计

菜单栏适应不同屏幕尺寸：

```scss
.menu-bar {
  display: flex;
  align-items: center;
  padding: 0 1rem;
  
  @media (max-width: 768px) {
    .menu-item-text {
      display: none;
    }
    
    .menu-item {
      padding: 0.5rem;
    }
  }
  
  @media (max-width: 480px) {
    .language-selector,
    .tutorials-menu {
      display: none;
    }
  }
}
```

## 可访问性

- 完整的键盘导航
- 屏幕阅读器支持
- 高对比度模式
- 焦点指示器
- ARIA 标签和角色

## 性能优化

- 记忆化菜单项
- 懒加载重量级菜单
- 语言选择器中的防抖搜索
- 使用 React.memo 进行高效重渲染

## 测试

```javascript
describe('MenuBar', () => {
  it('should display project title', () => {
    const wrapper = mount(
      <MenuBar projectTitle="My Project" />
    );
    expect(wrapper.find('.project-title')).toHaveText('My Project');
  });

  it('should handle new project creation', () => {
    const onNewProject = jest.fn();
    const wrapper = mount(
      <MenuBar onNewProject={onNewProject} />
    );
    wrapper.find('[data-test="new-project"]').simulate('click');
    expect(onNewProject).toHaveBeenCalled();
  });

  it('should show undo/redo state correctly', () => {
    const wrapper = mount(
      <MenuBar canUndo={false} canRedo={true} />
    );
    expect(wrapper.find('[data-test="undo"]')).toBeDisabled();
    expect(wrapper.find('[data-test="redo"]')).not.toBeDisabled();
  });
});
```

## 相关组件

- [GUI 组件](gui-component)
- [模态框组件](modals)
- [容器架构](../containers/overview)
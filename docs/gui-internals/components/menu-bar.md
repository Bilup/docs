# Menu Bar Component

The Menu Bar provides the main navigation and top-level actions for MistWarp. Many features can be enhanced or added by default-enabled addons.

## Overview

The Menu Bar contains (from left to right):
- **Error Menu** - Shows compilation errors when they occur
- **File** - Project operations (New, Load, Save, Package)
- **Edit** - Edit actions (Undo, Redo, Turbo Mode, Cloud Variables, Settings)
- **Settings** - Theme and language selection
- **Mode** - Special editor modes (like Caturday mode)
- **Project Controls** - Project title, save status, and other project-specific actions
- **Addon Enhancements** - Default addons like workspace-tabs add bookmark functionality

## Component Structure

```
MenuBarContainer
  └── MenuBar
      ├── ErrorMenu (conditional)
      ├── FileDropdown
      ├── EditDropdown  
      ├── SettingsMenu
      ├── ModeMenu (conditional)
      ├── ProjectTitle
      ├── SaveStatus
      └── UserControls
```

## Menu Components

### Error Menu
Appears when compilation errors occur:
- **Error List**: Shows sprite compilation errors
- **Report Bug**: Links to report the error

### File Dropdown
Project file operations:
- **New Project**: Creates a blank project with default sprite
- **New Window**: Opens MistWarp in a new window (desktop app)
- **Load from Computer**: Upload .sb3 or .sb2 files
- **Save to Computer**: Download project as .sb3
- **Save as Copy**: Create a copy of the project
- **Package Project**: Open in TurboWarp Packager
- **Restore Points**: Manage project restore points
- **Autosave Controls**: Pause/resume automatic saving

### Edit Dropdown
Edit operations and project settings:
- **Restore**: Restore recently deleted sprites/costumes/sounds
- **Turbo Mode**: Toggle turbo mode for faster execution
- **Cloud Variables**: Enable/disable cloud variable support
- **Advanced Settings**: Open the advanced settings modal
- **Addons**: Configure addon settings
- **Extensions**: Open the extension library
Project management:
- **Workspace Bookmarks**: Save and navigate to specific workspace positions (addon-provided)
  - Add current position as bookmark
  - Quick jump to saved workspace locations
  - Bookmark management and organization

## Implementation Details

### Project Title
Displays the current project name:

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

## Props Interface

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

## State Management

The MenuBar connects to Redux state:

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

## MistWarp Branding

The Menu Bar prominently displays MistWarp branding:

```javascript
const MistWarpBranding = () => (
  <div className="mistwarp-branding">
    <img src="/static/mistwarp-logo.svg" alt="MistWarp" />
    <span className="brand-text">MistWarp</span>
    <span className="version-info">v{MISTWARP_VERSION}</span>
  </div>
);
```

## Language Support

MistWarp supports multiple languages:

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

## Keyboard Shortcuts

The Menu Bar registers global keyboard shortcuts:

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

## Responsive Design

The Menu Bar adapts to different screen sizes:

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

## Accessibility

- Full keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- ARIA labels and roles

## Performance Optimizations

- Memoized menu items
- Lazy loading of heavy menus
- Debounced search in language selector
- Efficient re-rendering with React.memo

## Testing

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

## Related Components

- [GUI Component](gui-component)
- [Modal Components](modals)
- [Container Architecture](../containers/overview)

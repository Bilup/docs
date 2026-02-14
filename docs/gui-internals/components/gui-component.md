---
title: GUI Component Deep Dive
sidebar_position: 1
---

# GUI Component

The `GUI` component is the heart of MistWarp's interface, orchestrating all major UI elements and managing the overall application layout. This component serves as the main container that brings together the blocks editor, stage, sprite management, and various modals.

## Component Overview

Located at `src/components/gui/gui.jsx`, the GUI component is a complex React component that:

- Manages the overall application layout
- Coordinates between different editing modes (blocks, costumes, sounds)
- Handles full-screen and embedded modes
- Manages modal visibility and state
- Integrates with the theme system

## File Structure

```
src/components/gui/
├── gui.jsx              # Main GUI component
├── gui.css              # Component styles
├── icon--code.svg       # Code tab icon
├── icon--costumes.svg   # Costumes tab icon
├── icon--sounds.svg     # Sounds tab icon
└── icon--extensions.svg # Extensions button icon
```

## Component Architecture

### Main Layout Structure

```jsx
const GUIComponent = props => {
    return (
        <MediaQuery minWidth={1024}>
            {isDesktop => (
                <Box className={styles.pageWrapper}>
                    {/* Menu Bar */}
                    <MenuBar {...menuBarProps} />
                    
                    {/* Main Content Area */}
                    <Box className={styles.bodyWrapper}>
                        <Box className={styles.flexWrapper}>
                            
                            {/* Left Panel - Blocks Editor */}
                            <Box className={styles.editorWrapper}>
                                <Tabs selectedIndex={activeTabIndex}>
                                    <TabList className={styles.tabList}>
                                        <Tab className={styles.tab}>Code</Tab>
                                        <Tab className={styles.tab}>Costumes</Tab>
                                        <Tab className={styles.tab}>Sounds</Tab>
                                    </TabList>
                                    
                                    <TabPanel className={styles.tabPanel}>
                                        <Blocks vm={vm} />
                                    </TabPanel>
                                    <TabPanel className={styles.tabPanel}>
                                        <CostumeTab vm={vm} />
                                    </TabPanel>
                                    <TabPanel className={styles.tabPanel}>
                                        <SoundTab vm={vm} />
                                    </TabPanel>
                                </Tabs>
                            </Box>
                            
                            {/* Right Panel - Stage and Targets */}
                            <Box className={styles.stageAndTargetWrapper}>
                                <StageWrapper vm={vm} />
                                <TargetPane vm={vm} />
                            </Box>
                        </Box>
                    </Box>
                    
                    {/* Modals and Overlays */}
                    <ExtensionLibrary vm={vm} />
                    <CostumeLibrary vm={vm} />
                    <SoundLibrary vm={vm} />
                    <Alerts />
                </Box>
            )}
        </MediaQuery>
    );
};
```

## Key Features

### Responsive Layout

The GUI adapts to different screen sizes using `react-responsive`:

```jsx
<MediaQuery minWidth={1024}>
    {isDesktop => (
        <Box className={isDesktop ? styles.desktop : styles.mobile}>
            {/* Content adapts to screen size */}
        </Box>
    )}
</MediaQuery>
```

### Tab Management

The component manages three main editing tabs:

```jsx
const BLOCKS_TAB_INDEX = 0;
const COSTUMES_TAB_INDEX = 1;
const SOUNDS_TAB_INDEX = 2;

const handleActivateTab = (tabIndex) => {
    if (tabIndex === COSTUMES_TAB_INDEX) {
        onActivateCostumesTab();
    } else if (tabIndex === SOUNDS_TAB_INDEX) {
        onActivateSoundsTab();
    }
    onActivateTab(tabIndex);
};
```

### Mode Handling

Different display modes are supported:

```jsx
// Full screen mode
if (isFullScreen) {
    return (
        <div className={styles.fullscreenBackground}>
            <StageWrapper vm={vm} />
        </div>
    );
}

// Player-only mode  
if (isPlayerOnly) {
    return (
        <Box className={styles.playerOnly}>
            <StageWrapper vm={vm} />
            <Controls vm={vm} />
        </Box>
    );
}

// Embedded mode
if (isEmbedded) {
    return (
        <Box className={styles.embedded}>
            {/* Simplified interface */}
        </Box>
    );
}
```

## CSS Architecture

### Layout System

The GUI uses Flexbox for responsive layout:

```css
.flex-wrapper {
    display: flex;
    flex-direction: row;
    height: 100%;
    overflow: hidden;
}

.editor-wrapper {
    flex-basis: calc(1024px - 408px - (($space + $stage-standard-border-width) * 2));
    flex-grow: 1;
    flex-shrink: 0;
    position: relative;
    display: flex;
    flex-direction: column;
}

.stage-and-target-wrapper {
    display: flex;
    flex-direction: column;
    flex-basis: 0;
    padding-left: $space;
    padding-right: $space;
}
```

### Theme Integration

CSS variables enable dynamic theming:

```css
.page-wrapper {
    height: 100%;
    background-color: var(--ui-primary);
    color: var(--text-primary);
}

.body-wrapper {
    height: calc(100% - $menu-bar-height);
    background-color: var(--ui-primary);
}

.tab {
    background-color: var(--ui-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
}

.tab.is-selected {
    background-color: var(--ui-white);
    color: var(--text-primary);
}
```

### Responsive Breakpoints

```css
/* Desktop (1024px+) */
@media (min-width: 1024px) {
    .editor-wrapper {
        min-width: 480px;
    }
}

/* Tablet (768px - 1023px) */
@media (max-width: 1023px) {
    .flex-wrapper {
        flex-direction: column;
    }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
    .stage-and-target-wrapper {
        order: -1;
    }
}
```

## Props Interface

### Required Props

```typescript
interface GUIProps {
    vm: VM;                          // Scratch VM instance
    activeTabIndex: number;          // Current active tab (0-2)
    onActivateTab: (index: number) => void;
}
```

### Optional Props

```typescript
interface OptionalGUIProps {
    // Display modes
    isFullScreen?: boolean;
    isPlayerOnly?: boolean;
    isEmbedded?: boolean;
    
    // Project state
    loading?: boolean;
    projectId?: string;
    
    // Modal visibility
    extensionLibraryVisible?: boolean;
    costumeLibraryVisible?: boolean;
    soundLibraryVisible?: boolean;
    
    // Event handlers
    onRequestCloseExtensionLibrary?: () => void;
    onRequestCloseCostumeLibrary?: () => void;
    onRequestCloseSoundLibrary?: () => void;
    
    // Customization
    className?: string;
    style?: React.CSSProperties;
}
```

## State Management Integration

### Redux Connection

The GUI component connects to multiple Redux state slices:

```js
const mapStateToProps = state => ({
    // Tab management
    activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
    
    // Display modes
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isEmbedded: state.scratchGui.mode.isEmbedded,
    
    // Project state
    loading: getIsLoading(state.scratchGui.projectState.loadingState),
    projectId: state.scratchGui.projectState.projectId,
    
    // Modal visibility
    extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,
    costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
    soundLibraryVisible: state.scratchGui.modals.soundLibrary,
    
    // Theme
    theme: state.scratchGui.theme.theme,
    
    // MistWarp specific
    customStageSize: state.scratchGui.customStageSize
});
```

### Action Dispatchers

```js
const mapDispatchToProps = dispatch => ({
    onActivateTab: tabIndex => dispatch(activateTab(tabIndex)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    
    onRequestCloseExtensionLibrary: () => dispatch(closeExtensionLibrary()),
    onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary()),
    onRequestCloseSoundLibrary: () => dispatch(closeSoundLibrary())
});
```

## Event Handling

### Tab Switching

```js
const handleActivateTab = useCallback((tabIndex) => {
    // Special handling for certain tabs
    if (tabIndex === COSTUMES_TAB_INDEX) {
        onActivateCostumesTab();
    } else if (tabIndex === SOUNDS_TAB_INDEX) {
        onActivateSoundsTab();
    }
    
    onActivateTab(tabIndex);
    
    // Analytics tracking
    if (window.gtag) {
        window.gtag('event', 'tab_switch', {
            tab_name: ['blocks', 'costumes', 'sounds'][tabIndex]
        });
    }
}, [onActivateTab, onActivateCostumesTab, onActivateSoundsTab]);
```

### Keyboard Shortcuts

```js
useEffect(() => {
    const handleKeyDown = (e) => {
        // Tab switching shortcuts
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    handleActivateTab(BLOCKS_TAB_INDEX);
                    break;
                case '2':
                    e.preventDefault();
                    handleActivateTab(COSTUMES_TAB_INDEX);
                    break;
                case '3':
                    e.preventDefault();
                    handleActivateTab(SOUNDS_TAB_INDEX);
                    break;
            }
        }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
}, [handleActivateTab]);
```

## Performance Optimizations

### Memoization

```jsx
const GUI = React.memo(({ vm, activeTabIndex, ...props }) => {
    // Memoize expensive calculations
    const stageSize = useMemo(() => 
        resolveStageSize(props.stageSizeMode, props.isFullScreen),
        [props.stageSizeMode, props.isFullScreen]
    );
    
    // Memoize event handlers
    const handleActivateTab = useCallback((tabIndex) => {
        props.onActivateTab(tabIndex);
    }, [props.onActivateTab]);
    
    return (
        // Component JSX
    );
});
```

### Lazy Loading

```jsx
// Lazy load heavy components
const CostumeTab = React.lazy(() => import('../../containers/costume-tab.jsx'));
const SoundTab = React.lazy(() => import('../../containers/sound-tab.jsx'));

const GUI = () => (
    <Suspense fallback={<Loader />}>
        <TabPanel>
            <CostumeTab vm={vm} />
        </TabPanel>
        <TabPanel>
            <SoundTab vm={vm} />
        </TabPanel>
    </Suspense>
);
```

## Addon Integration Points

### Shared Spaces

The GUI provides several "shared spaces" where addons can inject content:

```js
// Available shared spaces
const SHARED_SPACES = {
    stageHeader: '.stage-header',
    editorTabs: '.tab-list',
    menuBar: '.menu-bar',
    fullscreenButton: '.fullscreen-button'
};

// Addon usage example
addon.tab.appendToSharedSpace({
    space: 'stageHeader',
    element: myButton,
    order: 1
});
```

### Component Wrapping

Addons can wrap GUI components:

```js
// HOC for wrapping GUI
const withAddonEnhancements = (WrappedComponent) => {
    return (props) => {
        // Addon modifications
        const enhancedProps = {
            ...props,
            additionalFeatures: true
        };
        
        return <WrappedComponent {...enhancedProps} />;
    };
};
```

## Testing

### Unit Tests

```js
describe('GUI Component', () => {
    let mockVM;
    
    beforeEach(() => {
        mockVM = {
            on: jest.fn(),
            off: jest.fn(),
            start: jest.fn(),
            greenFlag: jest.fn()
        };
    });
    
    it('renders without crashing', () => {
        render(
            <GUI 
                vm={mockVM}
                activeTabIndex={0}
                onActivateTab={jest.fn()}
            />
        );
    });
    
    it('switches tabs correctly', () => {
        const onActivateTab = jest.fn();
        const { getByText } = render(
            <GUI 
                vm={mockVM}
                activeTabIndex={0}
                onActivateTab={onActivateTab}
            />
        );
        
        fireEvent.click(getByText('Costumes'));
        expect(onActivateTab).toHaveBeenCalledWith(1);
    });
});
```

### Integration Tests

```js
describe('GUI Integration', () => {
    it('coordinates with VM correctly', async () => {
        const { container } = render(
            <Provider store={store}>
                <GUI vm={mockVM} />
            </Provider>
        );
        
        // Simulate VM events
        act(() => {
            mockVM.emit('PROJECT_LOADED');
        });
        
        await waitFor(() => {
            expect(container.querySelector('.blocks-wrapper')).toBeInTheDocument();
        });
    });
});
```

## Common Customizations

### Custom Tab

```jsx
// Adding a custom tab
const CustomGUI = (props) => (
    <GUI {...props}>
        <TabList className={styles.tabList}>
            <Tab>Code</Tab>
            <Tab>Costumes</Tab>
            <Tab>Sounds</Tab>
            <Tab>Extensions</Tab> {/* Custom tab */}
        </TabList>
        
        <TabPanel><Blocks vm={props.vm} /></TabPanel>
        <TabPanel><CostumeTab vm={props.vm} /></TabPanel>
        <TabPanel><SoundTab vm={props.vm} /></TabPanel>
        <TabPanel><ExtensionTab vm={props.vm} /></TabPanel>
    </GUI>
);
```

### Layout Modifications

```css
/* Custom layout for wider screens */
@media (min-width: 1440px) {
    .editor-wrapper {
        flex-basis: 60%;
    }
    
    .stage-and-target-wrapper {
        flex-basis: 40%;
    }
}
```

The GUI component is the cornerstone of MistWarp's interface, providing a flexible and extensible foundation for the entire application. Its modular design and integration points make it easy to customize and extend while maintaining performance and usability.

---

*For more details on specific child components, see their individual documentation pages.*

---
title: GUI 组件
sidebar_position: 1
---

# GUI 组件

`GUI` 组件是 Bilup 界面的核心，协调所有主要 UI 元素并管理整体应用布局。此组件作为主容器，将积木编辑器、舞台、角色管理和各种模态框整合在一起。

## 组件概述

GUI 组件位于 `src/components/gui/gui.jsx`，是一个复杂的 React 组件，它具有以下功能：

- 管理整体应用布局
- 协调不同的编辑模式(积木、造型、声音)
- 处理全屏和嵌入模式
- 管理模态框的可见性和状态
- 与主题系统集成

## 文件结构

```
src/components/gui/
├── gui.jsx              # 主 GUI 组件
├── gui.css              # 组件样式
├── icon--code.svg       # 代码选项卡图标
├── icon--costumes.svg   # 造型选项卡图标
├── icon--sounds.svg     # 声音选项卡图标
└── icon--extensions.svg # 扩展按钮图标
```

## 组件架构

### 主要布局结构

```jsx
const GUIComponent = props => {
    return (
        <MediaQuery minWidth={1024}>
            {isDesktop => (
                <Box className={styles.pageWrapper}>
                    {/* 菜单栏 */}
                    <MenuBar {...menuBarProps} />

                    {/* 主要内容区域 */}
                    <Box className={styles.bodyWrapper}>
                        <Box className={styles.flexWrapper}>

                            {/* 左侧面板 - 积木编辑器 */}
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

                            {/* 右侧面板 - 舞台和目标 */}
                            <Box className={styles.stageAndTargetWrapper}>
                                <StageWrapper vm={vm} />
                                <TargetPane vm={vm} />
                            </Box>
                        </Box>
                    </Box>
                    
                    {/* 模态框和覆盖层 */}
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

## 主要功能

### 响应式布局

GUI 使用 `react-responsive` 适应不同的屏幕尺寸：

```jsx
<MediaQuery minWidth={1024}>
    {isDesktop => (
        <Box className={isDesktop ? styles.desktop : styles.mobile}>
            {/* 内容根据屏幕尺寸调整 */}
        </Box>
    )}
</MediaQuery>
```

### 选项卡管理

组件管理三个主要编辑选项卡：

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

### 模式处理

支持不同的显示模式：

```jsx
// 全屏模式
if (isFullScreen) {
    return (
        <div className={styles.fullscreenBackground}>
            <StageWrapper vm={vm} />
        </div>
    );
}

// 仅播放器模式
if (isPlayerOnly) {
    return (
        <Box className={styles.playerOnly}>
            <StageWrapper vm={vm} />
            <Controls vm={vm} />
        </Box>
    );
}

// 嵌入模式
if (isEmbedded) {
    return (
        <Box className={styles.embedded}>
            {/* 简化界面 */}
        </Box>
    );
}
```

## CSS 架构

### 布局系统

GUI 使用 Flexbox 实现响应式布局：

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

### 主题集成

CSS 变量支持动态主题：

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

### 响应式断点

```css
/* 桌面端 (1024px+) */
@media (min-width: 1024px) {
    .editor-wrapper {
        min-width: 480px;
    }
}

/* 平板端 (768px - 1023px) */
@media (max-width: 1023px) {
    .flex-wrapper {
        flex-direction: column;
    }
}

/* 移动端 (< 768px) */
@media (max-width: 767px) {
    .stage-and-target-wrapper {
        order: -1;
    }
}
```

## Props 接口

### 必需 Props

```typescript
interface GUIProps {
    vm: VM;                          // Scratch VM 实例
    activeTabIndex: number;          // 当前活动选项卡 (0-2)
    onActivateTab: (index: number) => void;
}
```

### 可选 Props

```typescript
interface OptionalGUIProps {
    // 显示模式
    isFullScreen?: boolean;
    isPlayerOnly?: boolean;
    isEmbedded?: boolean;
    
    // 项目状态
    loading?: boolean;
    projectId?: string;
    
    // 模态框可见性
    extensionLibraryVisible?: boolean;
    costumeLibraryVisible?: boolean;
    soundLibraryVisible?: boolean;
    
    // 事件处理器
    onRequestCloseExtensionLibrary?: () => void;
    onRequestCloseCostumeLibrary?: () => void;
    onRequestCloseSoundLibrary?: () => void;
    
    // 自定义
    className?: string;
    style?: React.CSSProperties;
}
```

## 状态管理集成

### Redux 连接

GUI 组件连接到多个 Redux 状态片段：

```js
const mapStateToProps = state => ({
    // 选项卡管理
    activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
    
    // 显示模式
    isFullScreen: state.scratchGui.mode.isFullScreen,
    isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
    isEmbedded: state.scratchGui.mode.isEmbedded,
    
    // 项目状态
    loading: getIsLoading(state.scratchGui.projectState.loadingState),
    projectId: state.scratchGui.projectState.projectId,
    
    // 模态框可见性
    extensionLibraryVisible: state.scratchGui.modals.extensionLibrary,
    costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
    soundLibraryVisible: state.scratchGui.modals.soundLibrary,
    
    // 主题
    theme: state.scratchGui.theme.theme,
    
    // Bilup 特定
    customStageSize: state.scratchGui.customStageSize
});
```

### Action 分发器

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

## 事件处理

### 选项卡切换

```js
const handleActivateTab = useCallback((tabIndex) => {
    // 某些选项卡的特殊处理
    if (tabIndex === COSTUMES_TAB_INDEX) {
        onActivateCostumesTab();
    } else if (tabIndex === SOUNDS_TAB_INDEX) {
        onActivateSoundsTab();
    }
    
    onActivateTab(tabIndex);
    
    // 分析追踪
    if (window.gtag) {
        window.gtag('event', 'tab_switch', {
            tab_name: ['blocks', 'costumes', 'sounds'][tabIndex]
        });
    }
}, [onActivateTab, onActivateCostumesTab, onActivateSoundsTab]);
```

### 键盘快捷键

```js
useEffect(() => {
    const handleKeyDown = (e) => {
        // 选项卡切换快捷键
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

## 性能优化

### 记忆化

```jsx
const GUI = React.memo(({ vm, activeTabIndex, ...props }) => {
    // 记忆化耗时计算
    const stageSize = useMemo(() => 
        resolveStageSize(props.stageSizeMode, props.isFullScreen),
        [props.stageSizeMode, props.isFullScreen]
    );
    
    // 记忆化事件处理器
    const handleActivateTab = useCallback((tabIndex) => {
        props.onActivateTab(tabIndex);
    }, [props.onActivateTab]);
    
    return (
        // 组件 JSX
    );
});
```

### 懒加载

```jsx
// 懒加载重型组件
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

## 插件集成点

### 共享空间

GUI 提供多个"共享空间"供插件注入内容：

```js
// 可用的共享空间
const SHARED_SPACES = {
    stageHeader: '.stage-header',
    editorTabs: '.tab-list',
    menuBar: '.menu-bar',
    fullscreenButton: '.fullscreen-button'
};

// 插件使用示例
addon.tab.appendToSharedSpace({
    space: 'stageHeader',
    element: myButton,
    order: 1
});
```

### 组件包装

插件可以包装 GUI 组件：

```js
// 用于包装 GUI 的 HOC
const withAddonEnhancements = (WrappedComponent) => {
    return (props) => {
        // 插件修改
        const enhancedProps = {
            ...props,
            additionalFeatures: true
        };
        
        return <WrappedComponent {...enhancedProps} />;
    };
};
```

## 测试

### 单元测试

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
    
    it('渲染时不会崩溃', () => {
        render(
            <GUI 
                vm={mockVM}
                activeTabIndex={0}
                onActivateTab={jest.fn()}
            />
        );
    });
    
    it('正确切换选项卡', () => {
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

### 集成测试

```js
describe('GUI Integration', () => {
    it('与 VM 正确协调', async () => {
        const { container } = render(
            <Provider store={store}>
                <GUI vm={mockVM} />
            </Provider>
        );
        
        // 模拟 VM 事件
        act(() => {
            mockVM.emit('PROJECT_LOADED');
        });
        
        await waitFor(() => {
            expect(container.querySelector('.blocks-wrapper')).toBeInTheDocument();
        });
    });
});
```

## 常见自定义

### 自定义选项卡

```jsx
// 添加自定义选项卡
const CustomGUI = (props) => (
    <GUI {...props}>
        <TabList className={styles.tabList}>
            <Tab>Code</Tab>
            <Tab>Costumes</Tab>
            <Tab>Sounds</Tab>
            <Tab>Extensions</Tab> {/* 自定义选项卡 */}
        </TabList>
        
        <TabPanel><Blocks vm={props.vm} /></TabPanel>
        <TabPanel><CostumeTab vm={props.vm} /></TabPanel>
        <TabPanel><SoundTab vm={props.vm} /></TabPanel>
        <TabPanel><ExtensionTab vm={props.vm} /></TabPanel>
    </GUI>
);
```

### 布局修改

```css
/* 宽屏的自定义布局 */
@media (min-width: 1440px) {
    .editor-wrapper {
        flex-basis: 60%;
    }
    
    .stage-and-target-wrapper {
        flex-basis: 40%;
    }
}
```

GUI 组件是 Bilup 界面的基石，为整个应用提供了灵活且可扩展的基础。其模块化设计和集成点使其易于自定义和扩展，同时保持性能和可用性。

---

*有关特定子组件的更多详细信息，请参阅各自的文档页面。*

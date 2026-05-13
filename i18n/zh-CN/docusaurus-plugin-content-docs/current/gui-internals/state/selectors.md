---
title: 选择器
sidebar_position: 3
---

# Redux Selectors

选择器提供了从 Redux store 访问和计算派生状态的简洁方式。Bilup 使用 `reselect` 库进行记忆化选择器，通过防止不必要的重新计算来优化性能。

## 创建选择器

### 基本选择器

简单选择器直接访问 store 状态：

```javascript
// src/selectors/project-state.js
import { createSelector } from 'reselect';

// 基本选择器
export const getProjectState = state => state.projectState;
export const getProjectId = state => state.projectState.projectId;
export const getProjectTitle = state => state.projectState.projectTitle;
export const getIsLoading = state => state.projectState.isLoading;
export const getSaveState = state => state.projectState.saveState;
```

### 计算选择器

使用 `createSelector` 处理依赖多个状态片段的派生数据：

```javascript
// 计算选择器
export const getIsProjectLoaded = createSelector(
  [getProjectId, getIsLoading],
  (projectId, isLoading) => projectId !== null && !isLoading
);

export const getHasUnsavedChanges = createSelector(
  [getSaveState],
  (saveState) => saveState === 'NOT_SAVED'
);

export const getProjectStatus = createSelector(
  [getIsLoading, getIsProjectLoaded, getHasUnsavedChanges],
  (isLoading, isLoaded, hasChanges) => {
    if (isLoading) return 'loading';
    if (!isLoaded) return 'no-project';
    if (hasChanges) return 'unsaved';
    return 'saved';
  }
);
```

## VM 选择器

### 目标管理

```javascript
// src/selectors/vm.js
export const getVM = state => state.vm;
export const getEditingTarget = state => state.vm.editingTarget;
export const getTargets = state => state.vm.targets;
export const getStage = state => state.vm.stage;
export const getMonitors = state => state.vm.monitors;

export const getEditingTargetObject = createSelector(
  [getTargets, getEditingTarget],
  (targets, editingTargetId) => 
    targets.find(target => target.id === editingTargetId)
);

export const getSprites = createSelector(
  [getTargets],
  (targets) => targets.filter(target => !target.isStage)
);

export const getSpriteCount = createSelector(
  [getSprites],
  (sprites) => sprites.length
);
```

### 复杂计算

对于昂贵的计算，使用记忆化选择器：

```javascript
export const getTargetSpriteCounts = createSelector(
  [getTargets],
  (targets) => {
    // 昂贵计算
    return targets.reduce((counts, target) => {
      if (!target.isStage) {
        const sprite = target.sprite;
        counts[sprite.name] = (counts[sprite.name] || 0) + 1;
      }
      return counts;
    }, {});
  }
);
```

## GUI 选择器

### 主题和显示

```javascript
// src/selectors/gui.js
export const getGUI = state => state.gui;
export const getTheme = state => state.gui.theme.theme;
export const getThemeColors = state => state.gui.theme.colors;
export const getCustomTheme = state => state.gui.theme.customTheme;
export const getStageSize = state => state.gui.stage.stageSize;

export const getIsPlayerOnly = createSelector(
  [getGUI],
  (gui) => gui.mode.isPlayerOnly
);

export const getIsFullScreen = createSelector(
  [getGUI],
  (gui) => gui.mode.isFullScreen
);

export const getEffectiveTheme = createSelector(
  [getTheme, getCustomTheme],
  (theme, customTheme) => customTheme || theme
);
```

### 模式和布局

```javascript
export const getLayoutInfo = createSelector(
  [getGUI, getIsFullScreen, getStageSize],
  (gui, isFullScreen, stageSize) => {
    const baseLayout = {
      stageSize,
      isFullScreen
    };
    
    if (isFullScreen) {
      return {
        ...baseLayout,
        showToolbox: false,
        showSprites: false
      };
    }
    
    return {
      ...baseLayout,
      showToolbox: true,
      showSprites: true
    };
  }
);
```

## 资源选择器

### 造型和声音

```javascript
// src/selectors/assets.js
export const getAssets = state => state.assets;
export const getDefaultProject = state => state.assets.defaultProject;
export const getCostumes = state => state.assets.costumes;
export const getSounds = state => state.assets.sounds;

export const getCostumesByTarget = createSelector(
  [getCostumes, getTargets],
  (costumes, targets) => {
    const costumesByTarget = {};
    
    targets.forEach(target => {
      costumesByTarget[target.id] = costumes.filter(
        costume => costume.targetId === target.id
      );
    });
    
    return costumesByTarget;
  }
);

export const getSoundsByTarget = createSelector(
  [getSounds, getTargets],
  (sounds, targets) => {
    const soundsByTarget = {};
    
    targets.forEach(target => {
      soundsByTarget[target.id] = sounds.filter(
        sound => sound.targetId === target.id
      );
    });
    
    return soundsByTarget;
  }
);
```

## 扩展选择器

### 扩展状态

```javascript
// src/selectors/extensions.js
export const getExtensions = state => state.extensions;
export const getExtensionLibraryVisible = state => state.extensions.extensionLibraryVisible;
export const getLoadedExtensions = state => state.extensions.extensions;

export const getEnabledExtensions = createSelector(
  [getLoadedExtensions],
  (extensions) => Object.keys(extensions).filter(id => extensions[id].enabled)
);

export const getExtensionsByCategory = createSelector(
  [getLoadedExtensions],
  (extensions) => {
    const categories = {};
    
    Object.values(extensions).forEach(extension => {
      const category = extension.category || 'other';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(extension);
    });
    
    return categories;
  }
);
```

## 插件选择器

### 插件管理

```javascript
// src/selectors/addons.js
export const getAddons = state => state.addons;
export const getAddonsList = state => state.addons.addons;
export const getAddonSettings = state => state.addons.addonSettings;
export const getAddonEnabled = state => state.addons.addonEnabled;

export const getEnabledAddons = createSelector(
  [getAddonsList, getAddonEnabled],
  (addons, enabled) => 
    Object.keys(addons).filter(id => enabled[id])
);

export const getAddonWithSettings = createSelector(
  [getAddonsList, getAddonSettings, getAddonEnabled],
  (addons, settings, enabled) => {
    return Object.keys(addons).map(id => ({
      ...addons[id],
      id,
      settings: settings[id] || {},
      enabled: enabled[id] || false
    }));
  }
);
```

## 性能优化

### 记忆化模式

对昂贵计算使用 reselect：

```javascript
// 复杂角色分析的记忆化选择器
export const getSpriteAnalytics = createSelector(
  [getSprites, getCostumes, getSounds],
  (sprites, costumes, sounds) => {
    return sprites.map(sprite => {
      const spriteCostumes = costumes.filter(c => c.targetId === sprite.id);
      const spriteSounds = sounds.filter(s => s.targetId === sprite.id);
      
      return {
        id: sprite.id,
        name: sprite.name,
        costumeCount: spriteCostumes.length,
        soundCount: spriteSounds.length,
        totalSize: [
          ...spriteCostumes.map(c => c.dataFormat === 'svg' ? 1024 : c.size || 0),
          ...spriteSounds.map(s => s.size || 0)
        ].reduce((sum, size) => sum + size, 0)
      };
    });
  }
);
```

### 选择器组合

组合选择器以提高可重用性：

```javascript
// 基础选择器
const getEditingTargetId = state => state.vm.editingTarget;

// 组合选择器
export const getEditingTargetCostumes = createSelector(
  [getEditingTargetId, getCostumesByTarget],
  (targetId, costumesByTarget) => costumesByTarget[targetId] || []
);

export const getEditingTargetSounds = createSelector(
  [getEditingTargetId, getSoundsByTarget],
  (targetId, soundsByTarget) => soundsByTarget[targetId] || []
);
```

## 选择器测试

### 测试简单选择器

```javascript
import { getProjectId, getIsProjectLoaded } from '../selectors/project-state';

describe('Project State Selectors', () => {
  const mockState = {
    projectState: {
      projectId: '123456789',
      isLoading: false
    }
  };
  
  test('getProjectId should return project ID', () => {
    expect(getProjectId(mockState)).toBe('123456789');
  });
  
  test('getIsProjectLoaded should return true when project loaded', () => {
    expect(getIsProjectLoaded(mockState)).toBe(true);
  });
});
```

### 测试计算选择器

```javascript
import { getSpriteCount } from '../selectors/vm';

describe('VM Selectors', () => {
  const mockState = {
    vm: {
      targets: [
        { id: 'stage', isStage: true },
        { id: 'sprite1', isStage: false },
        { id: 'sprite2', isStage: false }
      ]
    }
  };
  
  test('getSpriteCount should count non-stage targets', () => {
    expect(getSpriteCount(mockState)).toBe(2);
  });
});
```

## 在组件中使用

### 连接选择器

使用 `useSelector` hook 使用选择器：

```javascript
import React from 'react';
import { useSelector } from 'react-redux';
import { getProjectStatus, getProjectTitle } from '../selectors/project-state';

const ProjectStatus = () => {
  const status = useSelector(getProjectStatus);
  const title = useSelector(getProjectTitle);
  
  return (
    <div className="project-status">
      <h3>{title}</h3>
      <span className={`status status-${status}`}>
        {status.replace('-', ' ')}
      </span>
    </div>
  );
};
```

### 多个选择器

```javascript
import { createStructuredSelector } from 'reselect';

const mapStateToProps = createStructuredSelector({
  sprites: getSprites,
  editingTarget: getEditingTargetObject,
  isLoading: getIsLoading,
  theme: getEffectiveTheme
});
```

选择器提供了一种高效且可维护的方式来访问 Redux 状态，同时通过记忆化确保最佳性能并防止不必要的重新渲染。
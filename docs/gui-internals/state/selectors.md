---
title: Selectors
sidebar_position: 3
---

# Redux Selectors

Selectors provide a clean way to access and compute derived state from the Redux store. MistWarp uses the `reselect` library for memoized selectors that optimize performance by preventing unnecessary re-computations.

## Creating Selectors

### Basic Selectors

Simple selectors directly access store state:

```javascript
// src/selectors/project-state.js
import { createSelector } from 'reselect';

// Basic selectors
export const getProjectState = state => state.projectState;
export const getProjectId = state => state.projectState.projectId;
export const getProjectTitle = state => state.projectState.projectTitle;
export const getIsLoading = state => state.projectState.isLoading;
export const getSaveState = state => state.projectState.saveState;
```

### Computed Selectors

Use `createSelector` for derived data that depends on multiple pieces of state:

```javascript
// Computed selectors
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

## VM Selectors

### Target Management

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

### Complex Computations

For expensive computations, use memoized selectors:

```javascript
export const getTargetSpriteCounts = createSelector(
  [getTargets],
  (targets) => {
    // Expensive computation
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

## GUI Selectors

### Theme and Display

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

### Mode and Layout

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

## Asset Selectors

### Costumes and Sounds

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

## Extension Selectors

### Extension State

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

## Addon Selectors

### Addon Management

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

## Performance Optimization

### Memoization Patterns

Use reselect for expensive computations:

```javascript
// Memoized selector for complex sprite analysis
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

### Selector Composition

Compose selectors for reusability:

```javascript
// Base selector
const getEditingTargetId = state => state.vm.editingTarget;

// Composed selectors
export const getEditingTargetCostumes = createSelector(
  [getEditingTargetId, getCostumesByTarget],
  (targetId, costumesByTarget) => costumesByTarget[targetId] || []
);

export const getEditingTargetSounds = createSelector(
  [getEditingTargetId, getSoundsByTarget],
  (targetId, soundsByTarget) => soundsByTarget[targetId] || []
);
```

## Selector Testing

### Testing Simple Selectors

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

### Testing Computed Selectors

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

## Usage in Components

### Connecting Selectors

Use selectors with `useSelector` hook:

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

### Multiple Selectors

```javascript
import { createStructuredSelector } from 'reselect';

const mapStateToProps = createStructuredSelector({
  sprites: getSprites,
  editingTarget: getEditingTargetObject,
  isLoading: getIsLoading,
  theme: getEffectiveTheme
});
```

Selectors provide an efficient and maintainable way to access Redux state while ensuring optimal performance through memoization and preventing unnecessary re-renders.

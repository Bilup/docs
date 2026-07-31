---
title: The Addons System
sidebar_position: 7
---

# The Addons System

Addons are small features that modify the editor: editor tweaks, extra tools, cosmetic changes. MistWarp's addon framework is inherited from the [Scratch Addons](https://scratchaddons.com/) browser extension, adapted to run inside the editor build. This page describes the two pieces you are most likely to work with: the settings store and the window system.

The addon code lives in `src/addons/`.

## Where addons come from

The addons and their translations are pulled from Scratch Addons and patched for use in TurboWarp and MistWarp. Most of `src/addons/` is generated: the `pull.js` script fetches the upstream source, applies patches, and writes the `addons/`, `addons-l10n/`, `libraries/`, and `generated/` folders. You normally do not edit those by hand. As the addons README puts it, feature requests go upstream, but bugs caused by the TurboWarp or MistWarp port are reported here.

The list of bundled addons is defined in `src/addons/addons.js` (used only by `pull.js`, not at runtime). It includes editor tools such as `editor-devtools`, `debugger`, `variable-manager`, `folders`, `block-switching`, and the `editor-theme3` addon that powers custom block themes.

## The settings store

Each addon has settings (at minimum, whether it is enabled). All of that is held by a single `SettingsStore` (`src/addons/settings-store.js`), used as a singleton through `src/addons/settings-store-singleton.js`:

```js
import SettingsStore from './settings-store';

const settingStore = new SettingsStore();
const urlParameters = new URLSearchParams(location.search);
if (urlParameters.has('addons')) {
    settingStore.parseUrlParameter(urlParameters.get('addons'));
} else {
    settingStore.readLocalStorage();
}

export default settingStore;
```

On startup the store loads settings from `localStorage` (key `tw:addons`), unless an `addons` URL parameter overrides them. `SettingsStore` extends an event-target shim, so other parts of the app subscribe to it and react when a setting changes.

Its main responsibilities:

- **Read and persist.** `readLocalStorage()` and `saveToLocalStorage()` load and store the settings, with `migrateSettings()` upgrading older saved formats (the store is at version 5).
- **Query.** `getAddonEnabled(id)`, `getAddonSetting(id, settingId)`, `getAddonManifest(id)`, and `getDefaultSettings(id)` answer what an addon's current configuration is, falling back to manifest defaults.
- **Change.** `setAddonEnabled(id, enabled)` and `setAddonSetting(id, settingId, value)` update a value, persist, and emit a change event so the affected addon can respond live. `resetAddon()` and `resetAllAddons()` revert to defaults.
- **Import and export.** `export({theme})` and `import(data)` move settings between instances, and `parseUrlParameter()` applies settings passed in a URL.
- **Conditions.** `evaluateCondition()` supports addon settings that only apply when other settings hold certain values.

The settings UI (in `src/addons/settings/`) is a view onto this store; changing a control calls `setAddonSetting`, and the store does the rest.

## The window system

Some addons open their own floating panels (the debugger and the variable manager, for example). Rather than each addon reinventing this, there is a shared window system in `src/addons/window-system/`, centered on `window-manager.js`.

`window-manager.js` exports a `WindowManager` object, a small API for creating and tracking windows:

```js
const WindowManager = {
    createWindow (options = {}) { /* ... */ },
    getWindow (id) { /* ... */ },
    getAllWindows () { /* ... */ },
    closeWindow (id) { /* ... */ },
    closeAllWindows () { /* ... */ },
    bringToFront (id) { /* ... */ }
};
```

It is also exposed globally as `window.wm`.

`createWindow` returns one of two implementations depending on the environment:

- **`AddonWindow`** is an in-page draggable, resizable window rendered inside the editor. This is the normal case.
- **`NativeAddonWindow`** is used when real OS windows are available (for example in the desktop app), opening a genuine popup window via `window.open` and keeping it positioned relative to the main window. `createWindow` picks this path only when native windows can be used and the window's id is not forced to stay in-page.

Either way the manager keeps a registry of active windows so it can look them up, focus them (`bringToFront`), and close them individually or all at once. Windows created through this system share styling and behavior (scrollbars, header buttons, focus handling), so addons get consistent panels without each one building its own.

## See also

- [Editor Addons](/editor/addons)
- [State Management](/internals/state)
- [Theming](/internals/theming)
- [Architecture](/internals/architecture)

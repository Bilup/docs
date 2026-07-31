---
title: Addon API
sidebar_position: 7
---

Addons are userscripts and userstyles that modify the editor and player. Each addon is a folder
under `scratch-gui/src/addons/addons/` with a manifest and one or more scripts. When an addon's
userscript runs, it receives an API object. This page is the reference for that object, defined in
`scratch-gui/src/addons/api.js`. For what addons are and how to use them, see
[Addons](/editor/addons).

## The userscript entry point

An addon userscript exports a default async function that receives the API object:

```js
export default async function ({addon, console, msg}) {
    const vm = addon.tab.traps.vm;
    // ... modify the editor ...
}
```

The object passed in has these members:

- `addon`: the addon API, split into `addon.tab`, `addon.settings`, and `addon.self` (below).
- `console`: the browser console.
- `global`: the global object.
- `msg(key, vars)`: a localized message from the addon's translations.
- `safeMsg(key, vars)`: the same, but HTML-escaped.

## addon.tab

`addon.tab` is the main surface for reaching into the page. It is an event target.

- `tab.traps`: escape hatches to editor internals:
  - `traps.vm`: the live [`VirtualMachine`](/api-reference/vm-api).
  - `traps.getBlockly()`: resolves with the Blockly instance once it is ready.
  - `traps.getWorkspace()`: the current Blockly workspace.
  - `traps.getPaper()`: resolves with the paper.js scope when the costume editor is open.
- `tab.redux`: access to the GUI's Redux store, including `tab.redux.state` and the
  `statechanged` event.
- `tab.waitForElement(selector, options)`: resolves with a matching DOM element once it appears.
  Options include `markAsSeen` (so the same element is not returned twice), a `condition`
  callback, a `reduxCondition` callback, and `reduxEvents` to wait for specific store actions.
- `tab.appendToSharedSpace({space, element, order, scope})`: insert an element into a known editor
  region (for example `stageHeader`) in a stable position relative to other addons.
- `tab.createBlockContextMenu(callback, {workspace, blocks, flyout, comments})`: add items to
  block or workspace context menus.
- `tab.scratchClass(...names, {others})`: resolve MistWarp's hashed CSS class names (for example
  `green-flag`) to their real runtime class names, so your styles and queries match.
- `tab.scratchMessage(id)`: look up one of the editor's own localized strings.
- `tab.copyImage(dataURL)`: copy a PNG data URL to the clipboard.
- `tab.createModal(title, {isOpen})`, `tab.confirm(...)`, `tab.prompt(...)`: editor-styled dialogs.
- `tab.displayNoneWhileDisabled(el, options)`: hide an element while the addon is disabled.
- `tab.editorMode`: the current editor mode string.
- `tab.direction`: `'ltr'` or `'rtl'` for the current locale.
- `tab.recolorable()`: an `<img>` whose SVG recolors itself to the current theme accent.

## addon.settings

`addon.settings` reads the addon's own settings, as declared in its manifest. It is an event
target.

- `settings.get(id)`: the current value of a setting.
- Listen for the `change` event to react when the user changes a setting:

```js
addon.settings.addEventListener('change', () => {
    const speed = addon.settings.get('speed');
    // ... apply the new value ...
});
```

## addon.self

`addon.self` is the addon's own state. It is an event target.

- `self.id`: the addon's ID.
- `self.disabled`: whether the addon is currently disabled.
- `self.getResource(path)`: resolve a bundled resource path to a usable URL.
- The `disabled` and `reenabled` events fire when the user toggles the addon while the editor is
  open, so an addon can clean up or re-apply its changes without a reload:

```js
addon.self.addEventListener('disabled', () => { /* undo changes */ });
addon.self.addEventListener('reenabled', () => { /* redo changes */ });
```

## Userstyles

Addons can also ship CSS. Static stylesheets are applied automatically, and settings can drive CSS
custom properties: a manifest setting produces a variable named
`--<addonId>-<settingId>`, and manifest `customCssVariables` can compute colors (blend, brighten,
threshold, and so on) that update when settings change.

## See also

- [Addons](/editor/addons) for the user-facing feature
- [Internals: addons system](/internals/addons-system)
- [VM API](/api-reference/vm-api)

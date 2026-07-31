---
title: Theming
sidebar_position: 6
---

# Theming

A MistWarp theme is a set of colors and options that turn into CSS custom properties on the document, plus a set of block colors that recolor the workspace. This page describes how a theme is represented, how it gets applied, and the things to watch out for when working near the theme system.

The engine lives in `src/lib/themes/`.

## What a theme is

A theme is an instance of the `Theme` class in `src/lib/themes/index.js`. It is a small, immutable bundle of choices:

- `accent`: the accent color set (from `src/lib/themes/accent/`).
- `gui`: the interface color scheme, one of `light`, `dark`, or `midnight` (from `src/lib/themes/gui/`).
- `blocks`: the block color palette, one of `three` (the default), `dark`, `high-contrast`, or `custom`.
- `menuBarAlign`, `wallpaper`, `fonts`, and an `appearance` object for finer options.

`Theme` is immutable: methods like `set(property, value)` and `setAppearance(changes)` return a new `Theme` rather than mutating the existing one. It also computes derived color maps on demand, most importantly:

- `getGuiColors()` merges accent, GUI, and block colors into the interface palette.
- `getBlockColors()` produces the block palette.
- `isDark()` reports whether the resulting scheme is dark.

Default themes for each GUI scheme are precomputed as `Theme.defaults.light`, `Theme.defaults.dark`, and so on.

## Detecting the starting theme

On boot, `src/lib/themes/themePersistance.js` decides which theme to use. It reads the stored preference from `localStorage` (`tw:theme`), migrating legacy `"light"` / `"dark"` values, restoring a saved custom theme by UUID, or importing an inline custom theme. If nothing is stored, it falls back to system preferences: `prefers-color-scheme: dark` and `prefers-contrast: more` are honored. This is the value the `theme` reducer starts from.

## Applying a theme: CSS custom properties

Applying a theme is done by `applyGuiColors(theme)` in `src/lib/themes/guiHelpers.js`. It writes CSS custom properties onto the document root (`document.documentElement`) so the whole app restyles at once. In broad strokes it:

- Writes every GUI color as a `--<name>` property (and a `--<name>-default` fallback) on the root, for example `--ui-primary`, `--looks-secondary`, `--text-primary`.
- Derives a few extras, such as `--ui-primary-rgb` for translucent overlays.
- Writes the block colors as `--editorTheme3-*` properties (per category: primary, secondary, tertiary, field background, plus workspace, toolbox, flyout, scrollbar, and grid colors).
- Computes the menu-bar background and, from its luminance, a readable `--menu-bar-foreground`, then an `--accent-foreground` the same way.
- Updates the `<meta name="theme-color">` tag so the browser chrome matches.
- Applies the wallpaper and loads theme fonts.

Because these are bare property names set on `documentElement` (not scoped, not prefixed), any component can consume them with `var(--...)`. This is deliberate, and it is also the reason the community site must prefix its own custom properties with `--mw-*`: unprefixed names like `--text` would collide with the editor's. See the CSS notes in [Contributing](/contributing/guidelines).

`applyGuiColors` is called from the `theme` reducer when the theme is first set up, and again whenever the theme changes. `TWThemeManagerHOC` sits early in the top-level HOC stack (see [Architecture](/internals/architecture)) specifically so the theme is applied before icons render, avoiding a flash of the wrong colors.

## Recoloring blocks

The interface restyles instantly from CSS variables, but the block workspace is drawn by scratch-blocks (a Blockly fork) and needs more than CSS. The `--editorTheme3-*` properties feed the injected block stylesheet, and changing block colors requires the workspace to be re-created or recolored. The editor re-keys the `Blocks` component on the theme's block identity (`theme.getBlocksThemeId()`) so switching block palettes rebuilds the workspace with the new colors, rather than trying to mutate it in place.

The stage's own block colors (used when the "touching color" style features run) come from `getStageBlockColors()`, which falls back to the light palette for block themes that are not meant to affect the stage.

## Custom themes

Beyond the built-in schemes, users can build custom themes. These are managed in `src/lib/themes/custom-themes.js` (`customThemeManager` and the `CustomTheme` class) and stored by UUID. A custom theme can also be embedded in a project so that opening the project offers to apply it; that prompt flow is backed by the `mwProjectTheme` reducer (see [State Management](/internals/state)) and handled by the VM listener.

## See also

- [Architecture](/internals/architecture)
- [State Management](/internals/state)
- [The Addons System](/internals/addons-system)
- [Contributing](/contributing/guidelines)

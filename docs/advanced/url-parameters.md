---
title: URL Parameters
sidebar_position: 3
---

# URL Parameters

You can control how MistWarp loads and runs a project by adding parameters to the URL. This is useful for sharing a reproducible setup, embedding a project with specific options, or automating tests.

Parameters use standard query-string syntax: a `?` after the URL, then `name=value` pairs joined with `&`. Parameters that are just switches take no value:

```
https://warp.mistium.com/123456789?turbo&fps=60&username=alice
```

:::note
MistWarp already stores common settings (turbo mode, FPS, high quality pen, stage size, interpolation) in the URL for you as you change them in the editor. The parameters below are mostly the "advanced" ones you would set by hand, plus the common ones for reference.
:::

## Loading a project

| Parameter | Value | What it does |
|-----------|-------|--------------|
| (path) | project ID | `warp.mistium.com/123456789` loads that project |
| `project_url` | direct URL | Loads a `.sb3` (or `project.json`) from any CORS-enabled URL. Do not combine with a project ID. |
| `clone` | git repo URL | Clones a project from a MistWarp git repository (see [Git integration](/editor/git)). |

`project_url` requires a direct download that supports [CORS](/advanced/cors) (`Access-Control-Allow-Origin: *`). `https://` is assumed if you omit the protocol; `http://` URLs usually will not work. [GitHub Pages](https://pages.github.com/) works well for this.

```
https://warp.mistium.com/?project_url=https://example.com/project.sb3
```

## Performance and runtime

| Parameter | Value | What it does |
|-----------|-------|--------------|
| `fps` | number | Sets the [frame rate](/advanced/custom-fps). `0` runs at the display's refresh rate. |
| `turbo` | switch | Enables [turbo mode](/advanced/warp-timer) (no per-frame throttling). |
| `interpolate` | switch | Enables [interpolation](/advanced/interpolation) for smoother motion. |
| `hqpen` | switch | Enables [high quality pen](/advanced/high-quality-pen). |
| `limitless` | switch | Removes [miscellaneous limits](/advanced/remove-limits). |
| `offscreen` | switch | [Removes fencing](/advanced/remove-fencing) so sprites can leave the stage. |
| `clones` | number | Sets the maximum clone count (see [Infinite Clones](/advanced/infinite-clones)). |
| `stuck` | switch | Enables the [warp timer](/advanced/warp-timer). Also accepted as `warp_timer`. |
| `nocompile` | switch | [Disables the compiler](/advanced/disable-compiler). You almost never want this. |

## Display

| Parameter | Value | What it does |
|-----------|-------|--------------|
| `size` | `WIDTHxHEIGHT` | Sets a [custom stage size](/advanced/custom-stage-size), for example `size=640x360`. |
| `scale` | number | Caps how large the stage is allowed to scale up. `scale=1` keeps it at its native resolution. |
| `fullscreen-background` | CSS color | Background color shown in fullscreen. Escape `#` as `%23`, for example `%23abc123`. |

## Accounts and cloud

| Parameter | Value | What it does |
|-----------|-------|--------------|
| `username` | string | Sets the value returned by the `username` block and used by [cloud variables](/advanced/cloud-variables). A username set this way is not saved. |
| `cloud_host` | `wss://...` URL | Points [cloud variables](/advanced/cloud-variables#cloud-host) at a different server. The default is `wss://clouddata.turbowarp.org`. |

## Collaboration

| Parameter | Value | What it does |
|-----------|-------|--------------|
| `room` | room code | Joins a live [collaboration](/editor/collaboration) room automatically once a username is set. The parameter is removed from the URL after it is read. |

## Extensions {#extension}

| Parameter | Value | What it does |
|-----------|-------|--------------|
| `extension` | URL | Loads a custom extension. Can be repeated to load several. |

```
https://warp.mistium.com/?extension=https://example.com/a.js&extension=https://example.com/b.js
```

See [Building Extensions](/building-extensions/introduction) for how these work.

## Embed-only parameters

These only apply to the [embed player](/advanced/embedding):

| Parameter | Value | What it does |
|-----------|-------|--------------|
| `autoplay` | switch | Presses the green flag automatically once the project loads. |
| `addons` | comma list | Enables specific addons in the embed, for example `addons=pause,gamepad`. |
| `settings-button` | switch | Shows an advanced-settings button in the embed. |

## See also

- [Embedding](/advanced/embedding)
- [Cloud Variables](/advanced/cloud-variables)
- [CORS](/advanced/cors)
- [Editor settings](/editor/settings)

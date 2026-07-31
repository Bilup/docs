---
title: Embedding
sidebar_position: 4
---

# Embedding

You can embed a MistWarp project into any website with a standard `<iframe>`. The embed shows just the stage and controls, with no editor around it.

```html
<iframe
  src="https://warp.mistium.com/414716080/embed"
  width="482"
  height="412"
  frameborder="0"
  scrolling="no"
  allowfullscreen
></iframe>
```

Replace `414716080` with your project's ID. You can pick any width and height; the player resizes to fit. A `482x412` iframe renders the stage at an undistorted `480x360` (the extra 52 pixels leave room for the control bar). Embeds have a transparent background and a fullscreen button where the browser allows it.

## Scratch and MistWarp projects

The ID in the URL can be either kind of project:

- A **Scratch project ID** (all digits, like `414716080`) embeds a project shared on Scratch.
- A **MistWarp community project ID** (like `p1784079025833421000VYnQRa`) embeds a project shared on the MistWarp community site. This is the ID in the project's page URL, `https://warp.mistium.com/project/p1784079025833421000VYnQRa`.

```html
<iframe src="https://warp.mistium.com/p1784079025833421000VYnQRa/embed"></iframe>
```

Both use the same `/embed` path, parameters, and postMessage API described below.

:::note
Unshared projects cannot be embedded. Share the project first, or package it with the [MistWarp Packager](/packager/overview) and [embed the packaged file](/packager/embedding) instead. See [Unshared Projects](/advanced/unshared-projects).
:::

## URL parameters

All [standard URL parameters](/advanced/url-parameters) work on embeds, plus a few that only apply to embeds.

| Parameter | What it does |
|-----------|--------------|
| `autoplay` | Presses the green flag automatically once the project loads. |
| `settings-button` | Adds an advanced-settings button to the embed. |
| `fullscreen-background` | Sets the fullscreen background color. Escape `#` as `%23`. |
| `addons` | Enables specific addons (see below). |

```html
<iframe src="https://warp.mistium.com/15832807/embed?autoplay&settings-button"></iframe>
```

Sound blocks may not play until the user interacts with the project (a click, for example). This is a browser restriction, not something MistWarp can bypass, so autoplay cannot force audio on load.

### Addons in embeds

Embeds start with no addons enabled. The `addons` parameter takes a comma-separated list of addon IDs:

```
https://warp.mistium.com/15832807/embed?addons=pause,gamepad,mute-project
```

Addons useful in embeds include:

- `pause` (pause button)
- `mute-project` (muted player)
- `remove-curved-stage-border`
- `drag-drop` (file drag and drop)
- `gamepad` (gamepad support)
- `clones` (clone counter)

Addons that only affect the editor have no effect here.

## Responsive embeds

To make an embed scale with its container, wrap it in a padded box:

```html
<div style="position: relative; padding-bottom: 75%; height: 0;">
  <iframe
    src="https://warp.mistium.com/123456789/embed"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allowfullscreen
  ></iframe>
</div>
```

The `75%` padding gives a 4:3 box to match the default stage. Adjust it if you use a [custom stage size](/advanced/custom-stage-size).

## Loading a project at runtime with postMessage

Instead of putting the project ID in the URL, the host page can send an SB3 to the embed after it loads. This is useful for custom loaders or when the project comes from somewhere other than a project ID.

Send a `LOAD_SB3` message:

```js
const iframe = document.getElementById('mistwarp-embed');
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3', // URL string, ArrayBuffer, or Uint8Array
  title: 'Optional title'
}, '*');
```

`data` may be:

- a **URL string** the embed will fetch (must support [CORS](/advanced/cors)),
- an **ArrayBuffer** of raw SB3 bytes, or
- a **Uint8Array** of raw SB3 bytes.

The embed replies with a `LOAD_SB3_RESPONSE` message:

```js
window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg && msg.type === 'LOAD_SB3_RESPONSE') {
    // msg.status:  'success' or 'error'
    // msg.message: human-readable detail
    // msg.title:   the title you passed in
    // msg.timestamp: milliseconds
    console.log(msg.status, msg.message);
  }
});
```

On success the VM restarts and loads the new project. Add `autoplay` to the embed URL if you want it to start on its own after loading.

For security, the embed only accepts `LOAD_SB3` from trusted origins: same-origin pages, `https://` parent pages, `file://` for local testing, and the local dev ports `3000`, `8080`, and `8601`. Messages from other origins are ignored.

## Security

If you build embed links from user-supplied data, sanitize the inputs. A user who can inject arbitrary URL parameters can change how the embed behaves. You can also add an iframe `sandbox` attribute for defense in depth:

```html
<iframe
  src="https://warp.mistium.com/123456789/embed"
  sandbox="allow-scripts allow-same-origin allow-fullscreen"
></iframe>
```

## When you need more control

For control over the loading screen, controls, and packaging as a single file, use the [MistWarp Packager](/packager/overview). Packaged projects can also be [embedded](/packager/embedding).

## See also

- [URL Parameters](/advanced/url-parameters)
- [Unshared Projects](/advanced/unshared-projects)
- [Packager: Embedding](/packager/embedding)
- [CORS](/advanced/cors)

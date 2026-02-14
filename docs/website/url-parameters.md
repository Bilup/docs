---
slug: /url-parameters
hide_table_of_contents: true
---

# URL Parameters


:::note
## Only "advanced" URL parameters are listed here {#only-hidden-url-parameters-are-listed-here}
MistWarp automatically stores common settings such as turbo mode, FPS, high quality pen, etc. in the URL. This page documents advanced options.
:::


## Username {#username}

The `username` option controls the value of the username block.

https://warp.mistium.com/443603478?username=ExampleUsername

## Cloud host {#cloud_host}

The `cloud_host` option lets you change the cloud variable server that MistWarp will connect to, for example:

https://warp.mistium.com/12785898?cloud_host=wss://clouddata.turbowarp.org

Inclusion of `ws://` or `wss://` is optional but recommended. `wss://clouddata.turbowarp.org` is the default cloud data server used by MistWarp. Insecure ws:// servers may not work because MistWarp uses HTTPS.

It is not possible to use this to connect to Scratch's cloud variable server as it requires account credentials which MistWarp can't support.

## Custom extensions {#extension}

The `extension` option loads a custom extension from a URL. See [Custom Extensions](/extensions/introduction).

<!-- Commented due to possible removal -->
<!--
## `scale` {#scale}

Controls the maximum relative scale of the player when in fullscreen mode.

https://turbowarp.org/fullscreen?scale=2
-->

## Disable compiler {#nocompile}

The `nocompile` option turns off the compiler. You probably shouldn't enable this.

https://warp.mistium.com/?nocompile

## Project URL {#project_url}

The `project_url` option tells MistWarp to download project data from an arbitrary URL. Do not use together with a regular project ID.

https://warp.mistium.com/?project_url=https://example.com/example.sb3

https:// is implied if you don't include a protocol. http:// URLs generally will not work for security reasons. Note that the URL needs to be a direct download and must support CORS (`Access-Control-Allow-Origin: *`). [GitHub Pages](https://pages.github.com/) will do this automatically and is known to work well.

---
title: Embed Messaging API
---

# Embed Messaging API

Embeds can load projects via `postMessage`. This is useful when the host page wants to control the project source or implement a custom loader.

## Message: LOAD_SB3

Send a message to the embedded player:

```js
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3', // URL string, ArrayBuffer, or Uint8Array
  title: 'Optional Title'
}, '*');
```

Supported `data` types:
- URL string: the embed fetches the URL and loads the SB3
- ArrayBuffer: raw SB3 data
- Uint8Array: raw SB3 data

Security and origin rules:
- Same-origin is allowed
- Local dev origins are allowed: `http://localhost:3000`, `http://localhost:8080`, `http://localhost:8601`, `https://localhost:8601`
- Parent pages opened via `window.open` with HTTPS are generally allowed
- `file://` is allowed for local testing

## Response: LOAD_SB3_RESPONSE

The embed sends back a response:

```js
window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg && msg.type === 'LOAD_SB3_RESPONSE') {
    // status: 'success' | 'error'
    // message: human-readable details
    // title: optional title provided in request
    // timestamp: milliseconds
    console.log(msg.status, msg.message, msg.title);
  }
});
```

## Example: Load from URL

```js
const iframe = document.getElementById('mistwarp-embed');
iframe.contentWindow.postMessage({
  type: 'LOAD_SB3',
  data: 'https://example.com/project.sb3',
  title: 'My Project'
}, '*');
```

## Example: Load from ArrayBuffer

```js
async function loadBinary(iframe, url) {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  iframe.contentWindow.postMessage({
    type: 'LOAD_SB3',
    data: buf,
    title: 'Binary Load'
  }, '*');
}
```

## Notes
- On success, the VM restarts and loads the new project, then triggers a renderer draw
- On failure, you receive `status: 'error'` with a message
- Use `autoplay` in the embed URL if you want the project to start automatically after load


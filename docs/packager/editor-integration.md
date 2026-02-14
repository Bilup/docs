---
title: Editor Integration
---

# Editor Integration

The MistWarp editor can send the current project to the Packager via `postMessage`. This enables a one-click flow from editing to packaging.

## Flow Overview

1. Editor opens the Packager: `https://packager.warp.mistium.com/?import_from=ORIGIN`
2. Packager signals readiness: `{ p4: { type: 'ready-for-import' } }`
3. Editor replies: `{ p4: { type: 'start-import' } }`
4. Editor sends project data and name: `{ p4: { type: 'finish-import', data, name } }`
5. On error, editor sends: `{ p4: { type: 'cancel-import' } }`

## Message Types

### ready-for-import (Packager → Editor)
Indicates the Packager is ready to receive project data.

### start-import (Editor → Packager)
Tells the Packager to show a loading state and prepare for incoming data.

### finish-import (Editor → Packager)
Includes the SB3 `ArrayBuffer` and filename:

```js
source.postMessage({
  p4: {
    type: 'finish-import',
    data: buffer, // ArrayBuffer
    name: 'project.sb3'
  }
}, origin, [buffer]); // transfer
```

### cancel-import (Editor → Packager)
Sent if the editor fails to export the project.

## Notes
- The editor only responds to messages from `https://packager.warp.mistium.com/`
- The editor exports SB3 via `vm.saveProjectSb3('arraybuffer')`
- The file name is derived from the current project title


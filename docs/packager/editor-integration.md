---
title: Editor Integration
sidebar_position: 7
---

# Editor integration

The MistWarp editor can hand the current project directly to the packager, so you can go from editing to a packaged build in one step without saving and re-uploading a file. Under the hood this is a small `postMessage` handshake between the editor and the packager, which is documented here for tool developers.

## The handshake

1. The editor opens the packager at `https://packager.warp.mistium.com/?import_from=<editor-origin>`.
2. The packager posts `{ p4: { type: 'ready-for-import' } }` back to the editor.
3. The editor replies `{ p4: { type: 'start-import' } }` so the packager can show a loading state.
4. The editor exports the project and posts `{ p4: { type: 'finish-import', data, name } }`, transferring the SB3 `ArrayBuffer`.
5. If the export fails, the editor posts `{ p4: { type: 'cancel-import' } }` instead.

Every message is wrapped in a `p4` object.

## finish-import

```js
source.postMessage({
  p4: {
    type: 'finish-import',
    data: buffer,        // SB3 ArrayBuffer
    name: 'My Project.sb3'
  }
}, origin, [buffer]);    // buffer is transferred, not copied
```

## Notes

- The editor only acts on messages whose origin is `https://packager.warp.mistium.com`.
- The SB3 is produced with `vm.saveProjectSb3('arraybuffer')`.
- The file name is the current project title with `.sb3` appended.

## See also

- [Packager overview](/packager/overview)

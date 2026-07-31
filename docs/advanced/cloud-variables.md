---
title: Cloud Variables
sidebar_position: 1
---

# Cloud Variables

Cloud variables are variables whose value is shared, in real time, between everyone who has the same project open. A variable is a cloud variable when its name starts with a cloud symbol (`☁`). You create one by checking "Cloud variable" in the "Make a Variable" dialog, exactly like in Scratch.

Cloud variables are how projects build leaderboards, visitor counters, simple multiplayer, and other shared state.

## The basics

- **Numbers only.** Cloud variables can only hold numbers. To share text, encode it as digits and decode it on the other side.
- **Shared while connected.** Values live on a cloud server only while people are in the project. There is no long-term history, and values can reset when the server restarts or when the project is empty for a while. Do not treat cloud variables as permanent storage.
- **Every viewer sees changes.** When one player changes a cloud variable, everyone else connected to the same project sees the new value shortly after.

MistWarp connects to a shared cloud server (`wss://clouddata.turbowarp.org`) by default, the same one TurboWarp uses. There is no limit on how many cloud variables a project may create (Scratch caps it at 10).

## When cloud variables do not connect

Cloud variables need all of the following to be true:

- The project has at least one cloud variable.
- You are viewing the project in the player, not editing it. Cloud variables are disabled while you edit a project you cannot save, so that editing does not interfere with live data.
- The project does not use the [video sensing](/extensions/video-sensing) extension. For privacy reasons, cloud variables are disabled whenever video sensing is active, so a project cannot quietly stream webcam data over the network.

## Choosing a different server {#cloud-host}

You can point a project at a different cloud server with the [`cloud_host` URL parameter](/advanced/url-parameters#accounts-and-cloud):

```
https://warp.mistium.com/12785898?cloud_host=wss://clouddata.turbowarp.org
```

Use a `wss://` (secure) URL. Insecure `ws://` servers usually fail because MistWarp is served over HTTPS. You cannot connect to Scratch's own cloud server this way, as that requires Scratch account credentials MistWarp does not have.

## Working with more than numbers

Because only numbers are allowed, projects that need lists, text, or structured data usually encode everything into one long number or a delimited numeric string and decode it on read. This is a normal Scratch technique and works the same in MistWarp. Keep updates infrequent (see below) and keep values reasonably sized.

## For bot and library developers {#advanced}

The cloud protocol is the [same as Scratch's](https://github.com/TurboWarp/cloud-server/blob/master/doc/protocol.md), so you can write your own client or bot. This is a free service run by volunteers, so a few rules keep it usable for everyone:

- **Send a `User-Agent`** with contact information (a profile link, email, or issue tracker) and, if applicable, your library name and version. Browser clients cannot set this, which is fine because the browser sends an `Origin` header instead. Do not pretend to be a browser.
- **Use string project IDs.** IDs are not limited to numbers. For a project that does not live on a public site, use something identifiable like `example.com/my-project`.
- **Open one connection and keep it.** Use an event-driven WebSocket that receives updates as they happen. Do not open and close a connection in a loop to poll values.
- **Do not spam updates.** The server buffers updates, may reorder them, and may drop some. Sending more than about 10 updates per second is pointless.
- **Respond to pings.** The server sends WebSocket ping frames; your client must reply with pongs or the connection drops.
- **Log close codes and raw server messages.** The 4xxx close codes are documented in the [protocol reference](https://github.com/TurboWarp/cloud-server/blob/master/doc/protocol.md); logging them makes problems diagnosable.

Do not use cloud variables to build unmoderated chat rooms, and do not abuse the service.

## See also

- [URL Parameters](/advanced/url-parameters) for `cloud_host` and other options
- [Special cloud behaviors](/packager/special-cloud-behaviors) for extra cloud features in packaged projects
- [Variables blocks](/blocks/variables)

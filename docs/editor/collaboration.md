---
title: Live collaboration
sidebar_position: 23
---

Live collaboration lets several people edit the same project at once, in real time. Everyone works in their own editor, and changes to blocks, sprites, costumes, and sounds sync between all of you, with live cursors showing who is working where.

:::warning
Live collaboration is an alpha feature and is still in early development. Projects edited in a collaborative session can be corrupted or broken. Keep your own [restore points](/editor/restore-points) or a saved copy while you use it.
:::

## Starting or joining a session

Open the **Tools** menu and choose **Live Collaboration**. The window shows the username you will appear as, and two options:

- **Create a New Room**: host a room. You get a room code (and a URL you can share) that others use to join. You are the room's **host**.
- **Join an Existing Room**: enter a room code to join a room someone else is hosting.

Sharing a room is done by sending its URL, which carries a `?room=` code; opening that link joins the room automatically.

## During a session

Once connected, the window lists everyone in the room. Each person shows their avatar and name, a **Host** or **You** badge where relevant, and a live description of what they are doing, for example "Editing code in Sprite1" or "Editing costume in the Stage". In the workspace you see other people's **cursors** with name labels as they move around.

**Copy Room URL to Share** copies the invite link, and **Leave Room** disconnects you.

## Host controls and privacy

The person who created the room is the host and has extra controls:

- **Kick** any other participant.
- Set the room to **Public** (anyone with the code can join) or **Private** (people must request approval).
- In a private room, **approve or deny** each pending join request.

When you join a private room you wait for the host to approve you before entering.

:::note
The host relays everyone's edits, which means the host can see the IP addresses of people who join, and in a room you create, joiners can see yours. The privacy notices in the window spell this out before you host or join.
:::

## Collaboration versus git

Live collaboration is for editing together at the same moment. For asynchronous teamwork, where people make changes separately and combine them later, use [git version control](/editor/git) instead.

## See also

- [Git version control](/editor/git)
- [Restore points](/editor/restore-points)
- [The block workspace](/editor/workspace)

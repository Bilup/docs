---
title: Migrating from Scratch
sidebar_position: 5
---

# Migrating from Scratch

MistWarp is Scratch with more on top. Everything you know from Scratch works the same way, so migrating is mostly a matter of opening your project and noticing what is new.

## Bringing a project over

MistWarp uses the same `.sb3` project format as Scratch.

1. In Scratch, use **File then Save to your computer** to download your project as an `.sb3` file.
2. In MistWarp, use **File then Load from your computer** and pick that file.

Your sprites, costumes, sounds, variables, and scripts come across intact. You can also save from MistWarp back to `.sb3` and open it again in Scratch, as long as you did not use blocks that only exist in MistWarp.

## What stays the same

- The blocks, categories, sprites, costumes, sounds, and stage all behave as they do in Scratch. See [Blocks overview](/blocks/overview).
- The standard Scratch sprite and backdrop libraries are still there.
- The paint editor and sound editor work the same. See [Costumes](/editor/costumes) and [Sounds](/editor/sounds).

## What is different

- **Projects run faster.** MistWarp compiles your blocks to JavaScript. Most projects just run quicker; a few that relied on Scratch's exact timing may behave slightly differently. See [Disable compiler](/advanced/disable-compiler) if you need to check behavior against the interpreter.
- **The default sprite is Misty**, not the Scratch Cat. Every Scratch sprite is still in the library.
- **You are not limited to 30 FPS or a 480x360 stage.** See [Custom FPS](/advanced/custom-fps) and [Custom stage size](/advanced/custom-stage-size).
- **There are more blocks and extensions**, including ones for the pen, video and face sensing, hardware, and more. See [Extensions overview](/extensions/overview).
- **You can customize the editor** with addons and themes. See [Addons](/editor/addons) and [Themes](/editor/themes).
- **There are developer tools**: a debugger, restore points, git, and collaboration. See [Debugger](/editor/debugger), [Restore points](/editor/restore-points), [Git](/editor/git), and [Collaboration](/editor/collaboration).

## Accounts and sharing

Scratch accounts and MistWarp accounts are separate. MistWarp has its own community platform; you sign in with a **Rotur account** to publish projects, follow people, and comment. You do not need an account to build, run, or save projects to your computer. See [Project management](/editor/project-management) for saving and sharing.

## A note on cloud variables

MistWarp supports cloud variables, but they are not linked to Scratch's cloud. A project that used Scratch cloud variables will still load; the cloud data itself does not transfer. See [Cloud variables](/advanced/cloud-variables).

## See also

- [Quick start](/getting-started/quick-start)
- [Editor tour](/getting-started/editor-tour)
- [Migrating from TurboWarp](/getting-started/migrating-from-turbowarp)

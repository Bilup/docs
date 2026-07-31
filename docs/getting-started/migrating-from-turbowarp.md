---
title: Migrating from TurboWarp
sidebar_position: 6
---

# Migrating from TurboWarp

MistWarp is built on TurboWarp, so if you already use TurboWarp the editor will look and behave almost identically. The compiler, arbitrary frame rate, custom stage size, addons, themes, restore points, packager, and advanced settings all carry over and work the way you expect. Projects are the same `.sb3` format, and TurboWarp projects open in MistWarp directly through **File then Load from your computer**.

This page focuses on what MistWarp adds on top of TurboWarp.

## Community platform and Rotur accounts

The biggest addition is a full community platform. The MistWarp editor and community site ship from one build, so publishing, profiles, and browsing projects are built into the same application.

- You sign in with a **Rotur account**. From the menu bar you can save a project straight to your account with **File then Save to MistWarp**, then open its project page.
- Signed in, you get a profile, notifications, and social features (following, comments, and posts).
- Your settings and themes sync across devices while you are signed in.

You do not need an account to build, run, package, or save projects locally, exactly as in TurboWarp. The account only adds the community side. See [Project management](/editor/project-management).

## Extra blocks and extensions

MistWarp includes additional blocks and extensions beyond TurboWarp's set. Browse them in [Extensions overview](/extensions/overview) and [MistWarp extras](/blocks/mistwarp-extras).

## Git version control

MistWarp can track a project in **git**. Once a repository exists for a project, the File menu gains commit, push, and pull actions for its remotes, so you can version your work and collaborate through a git host. See [Git](/editor/git).

## Live collaboration

MistWarp adds real-time collaboration: multiple people can edit the same project together and see each other's presence in the editor. See [Collaboration](/editor/collaboration).

## Debugger

MistWarp includes a debugger for inspecting a running project, stepping through execution, and watching state, which goes beyond TurboWarp's standard tooling. See [Debugger](/editor/debugger).

## Themes and addons

TurboWarp's addon and theme systems are present and extended. MistWarp ships its own themes (including custom color schemes) and its own selection of addons. See [Themes](/editor/themes) and [Addons](/editor/addons).

## What is the same

- The blocks, the compiler, and the runtime behavior. See [Blocks overview](/blocks/overview).
- Advanced settings such as [Custom FPS](/advanced/custom-fps), [Custom stage size](/advanced/custom-stage-size), [High quality pen](/advanced/high-quality-pen), [Interpolation](/advanced/interpolation), and [Remove limits](/advanced/remove-limits).
- The [Packager](/packager/overview) for building standalone versions of a project.
- URL parameters, embedding, and cloud variables. See [URL parameters](/advanced/url-parameters), [Embedding](/advanced/embedding), and [Cloud variables](/advanced/cloud-variables).

## See also

- [Introduction](/getting-started/introduction)
- [Editor tour](/getting-started/editor-tour)
- [Migrating from Scratch](/getting-started/migrating-from-scratch)

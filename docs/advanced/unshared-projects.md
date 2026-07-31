---
title: Unshared Projects
sidebar_position: 5
---

# Unshared Projects

Unshared projects on Scratch cannot be opened in MistWarp, the packager, or any other third-party site. This is a Scratch restriction, not a MistWarp one, and there is no way around it that keeps your account safe.

:::warning
Any website other than scratch.mit.edu that asks for your Scratch password is a scam, even if it claims to let you open your unshared projects. You will have your account stolen. There are no exceptions to this rule.
:::

## Why this happens

Downloading a project from the Scratch API requires a temporary "project token". For unshared projects, that token can only be obtained by the project's owner, and it expires after a few minutes. Even if you are signed in to Scratch in the same browser, MistWarp cannot read that token, so it cannot download the project data.

This was a deliberate change by the Scratch Team to make unshared projects actually private. Before it, "unshared" projects were effectively public to anyone who knew the ID, which was a real privacy problem given how many contain personal information. Securing them was the right call.

## What to do instead

**Testing your own project.** In the Scratch editor use File, then Save to your computer to download the `.sb3`, then open it in MistWarp with File, then Load from your computer. Many people work primarily in MistWarp and upload the finished `.sb3` back to Scratch. Keep backups when you do this.

**Collaborating.** Share the project on Scratch. It is fine to share unfinished work. If you want live editing with others, MistWarp also has built-in [collaboration](/editor/collaboration) that does not depend on Scratch at all.

**Embedding.** Share the project on Scratch, or download the `.sb3` and use the [MistWarp Packager](/packager/overview) to turn it into a standalone file you [can embed](/packager/embedding).

## For tool developers

This section is for people building their own Scratch-related tools. To download a shared project you first fetch its metadata to get a project token, then use that token to fetch the data:

1. `GET https://api.scratch.mit.edu/projects/<id>` and read the `project_token` field.
2. `GET https://projects.scratch.mit.edu/<id>?token=<token>` for the project JSON or SB3.

Browsers cannot call `api.scratch.mit.edu` directly because it does not send [CORS](/advanced/cors) headers, so browser-side code needs a CORS proxy; server-side code (Node.js) is not subject to CORS and can call it directly. For a ready-made downloader that handles all of this, see [sb-downloader](https://github.com/forkphorus/sb-downloader).

## See also

- [Collaboration](/editor/collaboration)
- [MistWarp Packager](/packager/overview)
- [CORS](/advanced/cors)

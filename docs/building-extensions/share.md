---
title: Sharing your extension
sidebar_position: 13
---

# Sharing your extension

To share an extension, you need somewhere to host it.

If you only want to use your own extensions in your own projects and distribute them with the [packager](/packager/overview), you do not need to host or submit anything. The packager always bundles and runs extensions unsandboxed as part of the exported project.

## Sandboxed extensions

A [sandboxed extension](/building-extensions/sandbox) can be hosted anywhere that serves static files over HTTPS. [GitHub Pages](https://pages.github.com/) is a common choice. Note that GitHub's `raw.githubusercontent.com` links do **not** work as extension URLs; use GitHub Pages (or another static host) instead.

Once it is at a public HTTPS URL, load it in the editor with "Add Extension", "Custom Extension", and the URL, or auto-load it with `?extension=<url>`.

## Unsandboxed extensions

An [unsandboxed extension](/building-extensions/unsandboxed) only runs unsandboxed automatically from a trusted origin (see the trusted prefixes on the [unsandboxed page](/building-extensions/unsandboxed)). Since you do not control those gallery domains, the practical options are:

- **Host it yourself and let users opt in.** Serve it at any public HTTPS URL as above. When someone loads that URL, MistWarp loads it sandboxed unless they explicitly choose to trust it, so document that step for your users.
- **Get it into the MistWarp extension gallery.** The gallery lives at [extensions.mistium.com](https://extensions.mistium.com); extensions served from that origin run unsandboxed automatically. Follow the submission instructions on the gallery site itself.

## Next steps

[Wrapping up](/building-extensions/wrapping-up).

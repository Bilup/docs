---
title: Offline Packager
sidebar_position: 6
slug: /packager/offline
---

# Offline packager

The [Bilup Packager](/packager/overview) runs entirely in your browser, and there are ways to run it with no internet connection, which helps when a network blocks `com.bilup.org` or when you are offline.

Large runtime assets (Electron, NW.js, and WKWebView executables used for native builds) are **not** bundled into the packager. They download separately when a given output format needs them, and the packager caches them after the first download, so you only fetch each once. These downloads usually still work even where `com.bilup.org` is blocked.

## Standalone HTML build

For fully offline use, download a standalone copy of the packager itself:

1. Go to [github.com/Bilup/packager/releases](https://github.com/Bilup/packager/releases).
2. Under the latest release's Assets, download the standalone HTML file (its name contains `standalone`).
3. Open that HTML file in your browser.

This file has no update checker, so check for newer releases yourself when you want updates.

## Installable web app

[packager.bilup.org](https://packager.bilup.org/) is a web app that tries to keep working offline after you load it once. This is experimental, so do not rely on it for anything important; prefer the standalone HTML build for guaranteed offline use.

## See also

- [Packager overview](/packager/overview)

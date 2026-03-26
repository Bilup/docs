---
slug: /packager/offline
hide_table_of_contents: true
sidebar_label: Offline Packager
---

# Offline Packager

There are ways to use the [Bilup Packager](https://packager.bilup.org/) offline which can be useful in various circumstances (for example, perhaps your school blocks editor.bilup.org).

We aim to update the offline packager about once a month.

Large assets such as Electron, NW.js, or WKWebView executables are *not* included in the offline packager and will be downloaded separately as needed. The packager will try to cache these files offline after you download them the first time, so they should only have to be downloaded once. Usually these downloads will still work even if your school blocks editor.bilup.org.

## Web-Based Packaging

Bilup's packager is available online at [packager.bilup.org](https://packager.bilup.org/) and works entirely in your browser.

Large assets such as runtime libraries are downloaded separately as needed. The packager will try to cache these files after you download them the first time, so they should only have to be downloaded once.

## Standalone HTML {#html}

For offline use, you can download standalone HTML versions from GitHub. Visit https://github.com/Bilup/packager/releases and download "bilup-packager-standalone-x.x.x.html" under "Assets" from the latest release. You can simply open the HTML file in your browser.

The HTML file does not include any update checker. You will have to check for and handle updates on your own.

## Web App {#pwa}

The https://packager.bilup.org/ is a web app that tries to function offline after loading it once. This is still experimental and we do not recommend relying on this.

---
title: CORS
sidebar_position: 6
---

# CORS: why your fetch block does not work

If you use a fetch, HTTP, or networking extension and a request just fails, even after you allow it, the cause is almost always **CORS**. This is a browser security feature, not a bug in MistWarp or the extension.

## What CORS is

CORS (Cross-Origin Resource Sharing) is how a website declares whether other websites are allowed to read its responses. The problem it solves is simple: some sites want to block access from other sites (imagine if any page you visited could read your bank while logged in as you), and some sites want to allow it.

By default, a site does **not** allow cross-origin access. A site has to opt in by sending an `Access-Control-Allow-Origin` header. Parts of Scratch's API opt in, which is how MistWarp can load projects from Scratch. When a site has not opted in, the browser blocks MistWarp from reading the response and you get a generic network error.

This is enforced by the browser itself. MistWarp cannot override it on the web.

## How to work around it

It depends on why you are fetching the URL.

- **Use a different URL.** If you are just hosting static files, move them to a host that supports direct downloads with CORS. If one API blocks CORS, check whether an alternative API allows it.
- **Use a CORS proxy.** A CORS proxy is a separate server that fetches the URL for you and re-sends the response with CORS headers. Public proxies exist but tend to be short-lived because they are expensive to run and heavily abused. MistWarp does not run one.
- **Run the project in a desktop or packaged build.** These are not subject to browser CORS rules (see below).

## Desktop and packaged projects

Projects packaged to Electron apps with the [MistWarp Packager](/packager/overview) bypass CORS by default, the same way a native app would, so fetch blocks can reach any URL.

Packaged projects that run as a plain HTML file in a browser are still subject to normal browser CORS rules, because they are still a website.

## If you run the server

If you control the server being fetched and you want websites to be able to read it, set the `Access-Control-Allow-Origin` header to `*` on the responses you want to make public. Searching your web server or framework's name followed by "cors" will turn up examples.

## See also

- [Pen extension](/extensions/pen) and other [extensions](/extensions/overview)
- [MistWarp Packager](/packager/overview)

---
title: Special Cloud Behaviors
sidebar_position: 5
slug: /packager/special-cloud-behaviors
---

# Special cloud behaviors

:::info
This is a [MistWarp Packager](/packager/overview) option.
:::

"Special cloud behaviors" is an option (off by default) that gives specially named [cloud variables](/advanced/cloud-variables) special powers, so a packaged project can interact with the page it runs on. It is based on the [same feature in HTMLifier](https://github.com/SheepTester/htmlifier/wiki/Special-cloud-behaviours), and you enable it in the packager's "Cloud variables" section.

To use one, create a normal cloud variable with the exact name listed below. For example, for `☁ url`, make a cloud variable named `url`.

Enabling special cloud behaviors overrides normal cloud handling for these names, so a variable like `☁ username` is never stored locally or synced to other players.

## Read-only

### ☁ url
Set to the page's current URL. Writing to it does nothing.

### ☁ pasted
When the user pastes text onto the page (for example with Ctrl+V), the pasted text is placed here.

## Actions

### ☁ redirect
Set it to a URL and the current tab navigates there.

### ☁ open link
Set it to a URL to open that URL in a new tab. Browser popup blockers may prevent this.

### ☁ username
Changing it changes the value returned by the `username` block in the Sensing category.

### ☁ set clipboard
Changing it tries to copy the text to the user's clipboard. Not always permitted by the browser.

### ☁ room id
Changing it changes the project ID used to sync cloud variables. If the original ID is `1234` and you set `☁ room id` to `xyz`, the sync ID becomes `1234-xyz`. Set it back to an empty string to restore the original. Only players sharing a room ID sync with each other, which makes it an easy server selector without extra variables. Reconnecting can take a few seconds. This does not affect locally stored cloud variables.

## Running code

### ☁ eval

:::warning
This requires the separate "Unsafe special cloud behaviors" option. Unsafe behaviors let the packaged project run arbitrary code outside the normal project sandbox. Depending on what you package for, that can give the project full control over the computer it runs on, including installing malware. Leave it off unless you trust the project and actually use this feature.
:::

Set `☁ eval` and its value is run as JavaScript. The result is written to `☁ eval output`, or the error to `☁ eval error`. If the code returns a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), the resolved value or rejection error is written to those variables when it settles. Setting `☁ eval` returns immediately, so the output variables may not update on the same frame.

## See also

- [Cloud variables](/advanced/cloud-variables)
- [Packager overview](/packager/overview)

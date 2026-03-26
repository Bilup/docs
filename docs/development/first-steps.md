---
title: First Steps
sidebar_position: 3
---

# Brand Configuration for Bilup

This guide outlines how to configure the branding for your Bilup mod, including renaming your application and customizing icons and links.

## Renaming Your Mod

To rename your mod, update the `APP_NAME` property in `src/lib/constants/brand.js` within your fork of the Scratch GUI repository:

```js
module.exports = {
    APP_NAME: 'YourModName',
    FEEDBACK_URL: 'https://scratch.mit.edu/users/m1stium#comments',
    GITHUB_URL: 'https://github.com/Bilup'
};
```

You can also update the `FEEDBACK_URL` and `GITHUB_URL` to point to your own feedback page or GitHub repository.
After making these changes, save the file and rebuild your project for them to take effect.

## Changing the Favicon

To update the favicon used by your mod:

1. Prepare your new favicon as an `.ico` file.
2. Navigate to the `static/` directory in your fork of the Scratch GUI.
3. Replace the existing `favicon.ico` file with your new icon.

Make sure the new file is named exactly `favicon.ico` so it will be picked up correctly.
After replacing the file, rebuild your project to apply the changes in the browser.

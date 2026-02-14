---
slug: /internals/themes
hide_table_of_contents: false
---

# Adding Themes

You can add themes to any mod of tw pretty easily, heres a list of files to look at and from that you should be able to figure it out on your own 👍

All theme files go in here:<br/>
https://github.com/MistWarp/scratch-gui/tree/develop/src/lib/themes/accent

## index.js
Insert the theme into here.<br/>
https://github.com/MistWarp/scratch-gui/blob/develop/src/lib/themes/index.js#L3C1-L9C47

Then Here<br/>
https://github.com/MistWarp/scratch-gui/blob/develop/src/lib/themes/index.js#L18C1-L34C3

And finally here<br/>
https://github.com/MistWarp/scratch-gui/blob/develop/src/lib/themes/index.js#L159C1-L165C18

## tw-theme-accent.jsx

Add the theme name in here<br/>
https://github.com/MistWarp/scratch-gui/blob/develop/src/components/menu-bar/tw-theme-accent.jsx#L10C1-L10C157

Finally add the theme into the "options" variable in the file above

You are done! Your theme is complete

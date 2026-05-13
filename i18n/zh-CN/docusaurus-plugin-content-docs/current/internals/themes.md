---
slug: /internals/themes
hide_table_of_contents: false
---

# 添加主题

您可以非常轻松地向任何 TW mod 添加主题，这里列出了需要查看的文件列表，从中您应该能够自己弄清楚如何操作 👍

所有主题文件都放在这里：<br/>
https://github.com/Bilup/scratch-gui/tree/develop/src/lib/themes/accent

## index.js
在这里插入主题。<br/>
https://github.com/Bilup/scratch-gui/blob/develop/src/lib/themes/index.js#L3C1-L9C47

然后在这里<br/>
https://github.com/Bilup/scratch-gui/blob/develop/src/lib/themes/index.js#L18C1-L34C3

最后在这里<br/>
https://github.com/Bilup/scratch-gui/blob/develop/src/lib/themes/index.js#L159C1-L165C18

## tw-theme-accent.jsx

在这里添加主题名称<br/>
https://github.com/Bilup/scratch-gui/blob/develop/src/components/menu-bar/tw-theme-accent.jsx#L10C1-L10C157

最后在上面的文件中将主题添加到 "options" 变量中

完成！您的主题已完成
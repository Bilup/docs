---
title: Add Tags
---

# Adding Tags to the Extension Library

To add a new tag to the extension library, follow these steps:

1. **Locate the Tags File**  
    Open the tags file at:  
    `src/lib/libraries/tw-extension-tags.js`
    In the `scratch-gui`

2. **Define the Tag Object**  
    Create an object with the following properties:
    - `tag`: A unique string identifier for the tag (e.g., `'scratch'`).
    - `intlLabel`: The display label for the tag. This can be a string or a variable (such as `APP_NAME`) referencing a label defined elsewhere.

3. **Insert the Tag into the Array**  
    Add your new tag object to the exported array in the tags file.

**Example:**
```js
{ tag: 'newtag', intlLabel: 'New Tag' }
```
or, if using a variable:
```js
{ tag: 'tw', intlLabel: APP_NAME }
```

> **Note:**  
> Since tags represent brand names, translation is not required for the `intlLabel` property.

**Sample tags file (`src/lib/libraries/tw-extension-tags.js`):**
```js
import {APP_NAME} from '../brand';

// Because these are all brand names, it is unnecessary for them to be translatable.
export default [
     {tag: 'scratch', intlLabel: 'Scratch'},
     {tag: 'tw', intlLabel: APP_NAME},
     {tag: 'mistium', intlLabel: 'Mistium'}
];
```

## Reference

For more information on how tags are used in the extension library UI, see `src/containers/extension-library.jsx` in the `scratch-gui`
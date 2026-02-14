---
title: Extension Library
---

# The extension library

The Extension Library is a React component that displays a list of available extensions for users to add to their Scratch project. It fetches extension metadata from multiple sources, processes and combines them, and presents them in a searchable, filterable UI.

## Features

- **Dynamic Extension Loading:** Fetches extension metadata from TurboWarp and Mistium extension repositories.
- **Internationalization:** Supports multiple languages for extension names and descriptions.
- **Credits and Documentation:** Displays credits for extension authors and links to documentation or sample projects if available.
- **Integration with Scratch VM:** Loads extensions into the Scratch VM when selected.
- **Error Handling:** Displays loading and error states if fetching extension data fails or takes too long.

## Data Flow

1. **Fetching Extensions:**  
   On mount, the component asynchronously fetches extension metadata from TurboWarp and Mistium endpoints. It processes and merges the results, caching them for future use.

2. **Displaying Extensions:**  
   The library combines built-in extensions with the fetched gallery extensions. Each extension is displayed with its icon, name, description, and credits.

3. **Selecting Extensions:**  
   When a user selects an extension:
   - If it's a special action (e.g., custom extension modal), the corresponding handler is called.
   - Otherwise, the extension is loaded into the VM, and the relevant category is activated.

## Customization

- **Adding New Sources:**  
  To add more extension sources, update the `fetchLibrary` function in `extension-library.jsx` to fetch and process additional endpoints.

- **UI Customization:**  
  The UI is rendered using the `LibraryComponent`, which can be customized for appearance or behavior.

## Related Files

- `/src/containers/extension-library.jsx` — Main implementation.
- `/src/lib/libraries/extensions/index.jsx` — Built-in extension definitions.
- `/src/components/library/library.jsx` — Library UI component.


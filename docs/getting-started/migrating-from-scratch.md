---
title: Migrating from Scratch
sidebar_position: 4
---

# Migrating from Scratch

Bilup can run most Scratch projects with enhanced performance and additional features.

## Project Compatibility

### Supported Features
- All standard Scratch blocks
- Custom blocks and procedures
- Most extensions
- Sprites, costumes, and sounds

### Enhanced Features
- Faster execution
- Additional extension APIs
- Custom stage sizes
- Developer tools integration

## Loading Scratch Projects

1. Download `.sb3` file from Scratch website
2. Open Bilup at [editor.bilup.org](https://editor.bilup.org/)
3. File → Load from your computer
4. Select the `.sb3` file

## Notable Differences

### Technical Changes
- Delete default sprite and variable.
- No cloud variables (local execution only)
- Enhanced JavaScript extension capabilities
- Modified virtual machine for better performance

### Developer Features
- Browser console access for debugging
- Extension development APIs
- Custom block creation
- Performance monitoring tools

## Troubleshooting

### Common Issues
- **Project won't load**: Check file format (must be `.sb3`)
- **Missing blocks**: Some custom extensions may not be available
- **Performance differences**: Turbo mode may change timing behavior

### Solutions
- Use "Load from Scratch website" for compatibility issues
- Check browser console for error messages
- Disable turbo mode if timing is critical

## Next Steps

- [GUI Internals](../gui-internals/home.md) - Understand Bilup's architecture
- [Development Guide](../development/home.md) - Contributing to Bilup

---
title: Getting Started
sidebar_position: 2
---

# Getting Started

MistWarp is a web-based application that runs directly in your browser. No installation is required!

## Accessing MistWarp

MistWarp is exclusively available as a web application and can be accessed at:

**🌐 [https://warp.mistium.com/](https://warp.mistium.com/)**

Simply open the link in any modern web browser and you're ready to start creating!

## System Requirements

MistWarp works in any modern web browser that supports JavaScript and WebGL:

### Supported Browsers
- **Chrome 80+** (recommended for best performance)
- **Firefox 78+**
- **Safari 14+** (macOS/iOS)
- **Edge 80+**

### Hardware Requirements
- **RAM**: 2GB minimum, 4GB+ recommended for complex projects
- **Internet**: Stable connection required for loading and saving projects
- **Storage**: Projects are saved to your browser's local storage or cloud storage

### Recommended Setup
- **RAM**: 4GB+ for large projects with many sprites and scripts
- **Processor**: Modern multi-core processor for smooth performance
- **Internet**: Broadband connection for faster project loading
- **Graphics**: WebGL 2.0 support for optimal rendering

## Browser Compatibility

| Browser | Minimum Version | Recommended |
|---------|----------------|-------------|
| Chrome | 80+ | Latest |
| Firefox | 78+ | Latest |
| Safari | 14+ | Latest |
| Edge | 80+ | Latest |

### Required Features
- ES2020 support
- WebGL 1.0 (WebGL 2.0 recommended)
- Web Audio API
- Local Storage
- WebAssembly (for optimal performance)

## First Time Setup

When you first visit MistWarp:

1. **Open your browser** and navigate to [warp.mistium.com](https://warp.mistium.com/)
2. **Allow JavaScript** if prompted (required for MistWarp to function)
3. **Accept camera/microphone permissions** if you plan to use sensing blocks
4. **Create an account** (optional) to save projects to the cloud

## Browser Configuration

### Enable Required Features

For the best MistWarp experience, ensure these browser features are enabled:

- **JavaScript**: Required for all functionality
- **WebGL**: Needed for stage rendering and effects
- **Local Storage**: Used for saving projects locally
- **Camera/Microphone**: Required for sensing blocks (optional)

### Performance Tips

- **Close unnecessary tabs** to free up RAM
- **Use hardware acceleration** if available in browser settings
- **Clear browser cache** occasionally if MistWarp becomes slow
- **Disable browser extensions** that might interfere with performance

## Development Setup

For developers who want to modify or contribute to MistWarp:

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Clone and Build

```bash
# Clone the repository
git clone https://github.com/MistWarp/scratch-gui.git
cd scratch-gui

# Install dependencies
npm ci

# Start development server
npm start
```

The development server will be available at `http://localhost:8601/`.

### Building Other Components

To work on the full MistWarp stack:

```bash
# Clone all repositories
git clone https://github.com/MistWarp/scratch-vm.git
git clone https://github.com/MistWarp/scratch-gui.git  
git clone https://github.com/MistWarp/scratch-render.git

# Link local packages (from each directory)
cd scratch-vm && npm link
cd ../scratch-render && npm link
cd ../scratch-gui && npm link scratch-vm scratch-render

# Start development
cd scratch-gui && npm start
```

## Troubleshooting

### Common Issues

**MistWarp won't load:**
1. Check your internet connection
2. Disable browser extensions temporarily
3. Clear browser cache and cookies
4. Try a different browser

**Poor performance:**
1. Close other browser tabs
2. Restart your browser
3. Check available RAM
4. Try using Chrome for best performance
5. Enable hardware acceleration in browser settings

**Projects won't save:**
1. Check browser local storage isn't full
2. Enable third-party cookies if using cloud saves
3. Create an account for cloud storage

**Blocks are missing or behave strangely:**
1. Refresh the page
2. Clear browser cache
3. Check for browser console errors

**Graphics/rendering issues:**
1. Update your graphics drivers
2. Enable WebGL in browser settings
3. Try a different browser

### Getting Help

If you encounter issues:
- Check the [Troubleshooting Guide](../user-guide/troubleshooting.md)
- Visit our [Community Forums](https://community.mistium.com/)
- Report bugs on [GitHub Issues](https://github.com/MistWarp/scratch-gui/issues)

## What's Next?

Now that you can access MistWarp:

1. **[Quick Start Guide](./quick-start.md)** - Create your first project
2. **[User Interface](../user-guide/interface.md)** - Learn the interface
3. **[Project Management](../user-guide/projects.md)** - Save and share projects
4. **[Migration Guide](./migrating-from-scratch.md)** - Import existing Scratch projects

*Continue to [Quick Start](./quick-start.md) to create your first project.*

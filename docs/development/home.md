---
slug: /development/
title: Development Overview
sidebar_position: 1
---

# MistWarp Development Guide

Welcome to the MistWarp development documentation! This comprehensive guide covers everything you need to know about developing with, for, and on MistWarp.

## Development Paths

### 🚀 [Getting Started](./getting-started.md)
Set up your development environment and understand the MistWarp project structure.

### 🏗️ [Project Structure](./project-structure.md)
Learn about the codebase organization and how different components work together.

### ⚙️ [Building & Running](./building-running.md)
Detailed instructions for building MistWarp from source and running development servers.

### 🧩 [Extension Development](../extensions/introduction.md)
Create custom blocks and extensions that integrate with Scratch's programming environment.

### 🌐 [Global Objects](./globals.md)
Understand the global objects and APIs available in the MistWarp environment.

### 🔧 [Testing](./testing.md)
Learn about testing strategies, tools, and best practices for MistWarp development.

### 🤝 [Contributing](./contributing.md)
Guidelines for contributing to MistWarp, including code standards and pull request processes.

## Quick Start for Developers

### Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** with npm
- **Git** for version control
- **Modern browser** (Chrome, Firefox, Safari, Edge)
- **Code editor** (VS Code recommended)

### Setup Development Environment

```bash
# Clone the main repository
git clone https://github.com/MistWarp/scratch-gui.git
cd scratch-gui

# Install dependencies
npm ci

# Start development server
npm start
```

Your development environment will be available at `http://localhost:8601/`.

### Development Workflow

1. **Fork and Clone** the repository you want to contribute to
2. **Create a branch** for your feature or bug fix
3. **Make changes** with proper testing
4. **Test thoroughly** using automated and manual testing
5. **Submit a pull request** following our guidelines

## MistWarp Architecture for Developers

### Repository Structure

MistWarp consists of several interconnected repositories:

```
MistWarp Ecosystem
├── scratch-gui/          # Main GUI application
├── scratch-vm/           # Virtual machine and runtime
├── scratch-render/       # Graphics rendering engine
├── scratch-blocks/       # Visual block editor
├── scratch-paint/        # Costume/backdrop editor
├── packager/             # Web-based project packager
└── docs/                 # Documentation (this site)
```

### Key Technologies

- **React 18** - User interface framework
- **Redux** - State management
- **Webpack 5** - Build system and bundling
- **Jest** - Testing framework
- **ESLint/Prettier** - Code quality tools
- **PostCSS** - CSS processing
- **Workbox** - Service worker and PWA features

### Development Stack

```
┌─────────────────────────────────────────┐
│            Development Tools            │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │  Hot Reload │ │   Source Maps       ││
│  │   DevServer │ │   Debugging Tools   ││
│  └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              Build Pipeline             │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │   Webpack   │ │      PostCSS        ││
│  │   Babel     │ │   Optimization      ││
│  └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│              Frontend Stack             │
│  ┌─────────────┐ ┌─────────────────────┐│
│  │    React    │ │       Redux         ││
│  │     JSX     │ │   State Management  ││
│  └─────────────┘ └─────────────────────┘│
└─────────────────────────────────────────┘
```

## Development Types

### 1. Core Development
Contributing to MistWarp's core functionality:

- **Bug fixes** in existing features
- **Performance improvements** and optimizations  
- **New features** for the core platform
- **Security enhancements** and vulnerability fixes

### 2. Extension Development
Creating custom blocks and functionality:

- **Custom blocks** for specific use cases
- **Hardware integrations** (sensors, motors, etc.)
- **API integrations** (web services, databases)
- **Educational extensions** for learning environments

### 3. Addon Development
Enhancing the MistWarp interface:

- **Editor enhancements** (new tools, improved workflows)
- **Visual modifications** (themes, layouts, styling)
- **Productivity tools** (shortcuts, automation, helpers)
- **Accessibility improvements** (screen readers, keyboard navigation)

### 4. Theme Development
Creating custom visual themes:

- **Color schemes** for different preferences
- **Layout modifications** for specific workflows
- **Accessibility themes** (high contrast, large text)
- **Branded themes** for organizations

## Development Environment Setup

### Recommended VS Code Extensions

```json
{
    "recommendations": [
        "esbenp.prettier-vscode",
        "dbaeumer.vscode-eslint",
        "bradlc.vscode-tailwindcss",
        "ms-vscode.vscode-json",
        "formulahendry.auto-rename-tag",
        "christian-kohler.path-intellisense"
    ]
}
```

### Environment Configuration

Create `.env.local` for development settings:

```bash
# Development environment variables
NODE_ENV=development
REACT_APP_DEBUG=true
REACT_APP_ENABLE_HOT_RELOAD=true
REACT_APP_ADDON_DEV_MODE=true

# Optional: Custom API endpoints
REACT_APP_CLOUD_HOST=wss://clouddata.turbowarp.org
REACT_APP_ASSET_HOST=https://assets.scratch.mit.edu
```

### Git Configuration

Set up Git hooks for code quality:

```bash
# Install pre-commit hooks
npm run prepare

# Configure Git user (if not already done)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

## Debugging and Development Tools

### Browser DevTools Integration

MistWarp provides enhanced debugging capabilities:

```javascript
// Available in browser console
window.vm          // Scratch VM instance
window.reduxStore  // Redux store
window.ScratchBlocks // Blockly instance
window.addons      // Addon system

// Debug helpers
window.debug = {
    vm: window.vm,
    store: window.reduxStore,
    enableVerboseLogging: () => { /* ... */ },
    dumpState: () => console.log(window.reduxStore.getState())
};
```

### Development Flags

Enable development features via URL parameters:

```
http://localhost:8601/?debug=true&logging=verbose&addon_dev=true
```

Available flags:
- `debug=true` - Enable debug mode
- `logging=verbose` - Verbose console logging
- `addon_dev=true` - Enable addon development tools
- `profiling=true` - Enable performance profiling

## Testing Strategy

### Test Types

1. **Unit Tests** - Individual component and function testing
2. **Integration Tests** - Component interaction testing  
3. **E2E Tests** - Full user workflow testing
4. **Visual Regression Tests** - UI consistency testing
5. **Performance Tests** - Load and execution time testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test files
npm test -- Button.test.js

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

## Code Quality Standards

### ESLint Configuration

MistWarp follows strict linting rules:

```json
{
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ],
    "rules": {
        "indent": ["error", 4],
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-unused-vars": "error",
        "react/prop-types": "error"
    }
}
```

### Code Formatting

Prettier configuration for consistent formatting:

```json
{
    "printWidth": 100,
    "tabWidth": 4,
    "useTabs": false,
    "semi": true,
    "singleQuote": true,
    "quoteProps": "as-needed",
    "trailingComma": "none"
}
```

## Performance Guidelines

### Bundle Size Management

- **Code splitting** for large components
- **Tree shaking** to eliminate dead code
- **Dynamic imports** for optional features
- **Asset optimization** for images and fonts

### Runtime Performance

- **React.memo** for expensive components
- **useMemo/useCallback** for expensive calculations
- **Virtual scrolling** for large lists
- **Debouncing** for high-frequency events

### Memory Management

- **Event listener cleanup** in useEffect cleanup
- **Subscription management** for Redux connections
- **Image loading optimization** with lazy loading
- **Garbage collection** awareness in long-running operations

## Security Considerations

### Input Validation

```javascript
// Always validate user inputs
const validateProjectData = (data) => {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid project data');
    }
    // Additional validation...
};
```

### Content Security Policy

Development environment CSP:

```javascript
const csp = {
    "default-src": ["'self'"],
    "script-src": ["'self'", "'unsafe-eval'"], // Required for VM
    "style-src": ["'self'", "'unsafe-inline'"], // Required for themes
    "img-src": ["'self'", "data:", "blob:"],
    "connect-src": ["'self'", "wss://clouddata.turbowarp.org"]
};
```

## Documentation Standards

### Code Documentation

```javascript
/**
 * Loads a project into the VM
 * @param {Object} projectData - The project data to load
 * @param {boolean} [showProgress=true] - Whether to show loading progress
 * @returns {Promise&lt;void&gt;} Promise that resolves when project is loaded
 * @throws {Error} When project data is invalid
 */
async function loadProject(projectData, showProgress = true) {
    // Implementation...
}
```

### Component Documentation

```jsx
/**
 * Button component with consistent styling
 * 
 * @component
 * @example
 * <Button onClick={handleClick} variant="primary">
 *   Click me
 * </Button>
 */
const Button = ({ 
    children, 
    onClick, 
    variant = 'default',
    disabled = false 
}) => {
    // Implementation...
};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.oneOf(['default', 'primary', 'secondary']),
    disabled: PropTypes.bool
};
```

## Community Development

### Open Source Contribution

MistWarp is open source and welcomes contributions:

1. **Issues** - Report bugs and request features
2. **Pull Requests** - Submit code improvements
3. **Discussions** - Share ideas and get help
4. **Documentation** - Improve guides and examples

### Code Review Process

1. **Automated checks** must pass (tests, linting, builds)
2. **Manual review** by maintainers
3. **Testing** on multiple browsers and devices
4. **Documentation** updates if needed
5. **Merge** after approval

### Release Process

1. **Feature freeze** before release
2. **Comprehensive testing** phase
3. **Release candidate** creation
4. **Community feedback** collection
5. **Final release** and distribution

Ready to start developing? Choose your path:

- **New to MistWarp?** Start with [Getting Started](./getting-started.md)
- **Want to create extensions?** Check out [Extension Development](../extensions/introduction.md)
- **Ready to contribute?** Read our [Contributing Guide](./contributing.md)

---

*For specific implementation details and advanced topics, explore the individual sections in this development guide.*

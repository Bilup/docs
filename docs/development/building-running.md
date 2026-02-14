---
title: Building and Running
sidebar_position: 4
---

# Building and Running MistWarp

This guide covers how to build MistWarp from source code and run it locally for development, testing, or contribution purposes.

## Prerequisites

### Required Software

#### Node.js and npm
- **Node.js**: Version 16.x or higher
- **npm**: Version 7.x or higher (comes with Node.js)
- **Check versions**:
```bash
node --version  # Should be v16.x.x or higher
npm --version   # Should be 7.x.x or higher
```

#### Git
- **Git**: For cloning repositories
- **Check version**:
```bash
git --version  # Any recent version
```

#### Optional Tools
- **Yarn**: Alternative package manager
- **Docker**: For containerized development
- **Visual Studio Code**: Recommended editor

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space for all repositories
- **CPU**: Modern multi-core processor recommended
- **OS**: Windows 10+, macOS 10.14+, or Linux

## Repository Setup

### Clone Repositories
MistWarp consists of multiple repositories that work together:

```bash
# Create main directory
mkdir mistwarp-dev
cd mistwarp-dev

# Clone main repositories
git clone https://github.com/MistWarp/scratch-gui.git
git clone https://github.com/MistWarp/scratch-vm.git
git clone https://github.com/MistWarp/scratch-blocks.git

# Optional: Clone additional repos
git clone https://github.com/MistWarp/packager.git
git clone https://github.com/MistWarp/docs.git
```

### Repository Structure
```
mistwarp-dev/
├── scratch-gui/        # Main interface
├── scratch-vm/         # Virtual machine
├── scratch-blocks/     # Block definitions
├── packager/          # Project packager
└── docs/              # Documentation
```

## Building Components

### Building scratch-vm (Virtual Machine)

```bash
cd scratch-vm

# Install dependencies
npm install

# Build for development
npm run build

# Build for production
npm run build:prod

# Watch mode (rebuilds on changes)
npm run watch
```

### Building scratch-blocks (Block Definitions)

```bash
cd scratch-blocks

# Install dependencies
npm install

# Build vertical blocks
npm run build:vertical

# Build horizontal blocks  
npm run build:horizontal

# Build both
npm run build

# Watch mode
npm run watch
```

### Building scratch-gui (Main Interface)

```bash
cd scratch-gui

# Install dependencies
npm install

# Link local dependencies (if using local scratch-vm/scratch-blocks)
npm link ../scratch-vm
npm link ../scratch-blocks

# Build for development
npm run build

# Build for production
npm run build:prod
```

## Development Workflow

### Running Development Server

#### Start GUI Development Server
```bash
cd scratch-gui

# Start development server
npm start

# Custom port
npm start -- --port 8602

# Enable hot reloading
npm run start:hot
```

#### Access Development Environment
- **URL**: http://localhost:8601 (default)
- **Hot Reload**: Changes apply automatically
- **Debug Mode**: Browser developer tools available

### Development Scripts

#### Common npm Scripts
```bash
# Install all dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Build for production
npm run build

# Analyze bundle size
npm run analyze
```

### Linking Local Dependencies

#### Using npm link
```bash
# In scratch-vm directory
npm link

# In scratch-gui directory
npm link scratch-vm
```

#### Using relative paths (package.json)
```json
{
  "dependencies": {
    "scratch-vm": "file:../scratch-vm",
    "scratch-blocks": "file:../scratch-blocks"
  }
}
```

## Building for Production

### Production Build Process

#### Build All Components
```bash
# Build scratch-vm
cd scratch-vm
npm run build:prod

# Build scratch-blocks
cd ../scratch-blocks
npm run build

# Build scratch-gui
cd ../scratch-gui
npm run build:prod
```

#### Optimization Options
```bash
# Enable source maps
BUILD_MODE=production GENERATE_SOURCEMAP=true npm run build

# Disable source maps (smaller files)
GENERATE_SOURCEMAP=false npm run build

# Analyze bundle
npm run analyze
```

### Static File Generation

#### Generate Static Files
```bash
# Build static files for hosting
npm run build

# Files generated in build/ directory
ls build/
# static/         # CSS, JS, and media files
# index.html      # Main HTML file
# manifest.json   # Web app manifest
```

#### Deployment Preparation
```bash
# Create deployment package
tar -czf mistwarp-build.tar.gz -C build .

# Or zip file
cd build && zip -r ../mistwarp-build.zip .
```

## Testing

### Running Tests

#### Unit Tests
```bash
# Run all tests
npm test

# Run specific test file
npm test -- --testNamePattern="sprite"

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Integration Tests
```bash
# Run integration tests
npm run test:integration

# Run specific integration test
npm run test:integration -- --grep "load project"
```

#### End-to-End Tests
```bash
# Install E2E dependencies
npm install -g cypress

# Run E2E tests
npm run test:e2e

# Open Cypress GUI
npm run cypress:open
```

### Test Configuration

#### Jest Configuration (jest.config.js)
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.js'],
  moduleNameMapping: {
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js'
  ]
};
```

#### Test Utilities
```javascript
// test/setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Global test utilities
global.vm = require('scratch-vm');
```

## Debugging

### Development Debugging

#### Browser Developer Tools
1. **F12**: Open developer tools
2. **Sources Tab**: Set breakpoints
3. **Console Tab**: View logs and errors
4. **Network Tab**: Monitor requests
5. **Performance Tab**: Profile performance

#### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug MistWarp",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/webpack-dev-server",
      "args": ["--config", "webpack.config.js"],
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

#### Debug Scripts
```bash
# Debug with Node.js inspector
node --inspect-brk ./node_modules/.bin/webpack-dev-server

# Debug tests
node --inspect-brk ./node_modules/.bin/jest --runInBand

# Debug specific test
node --inspect-brk ./node_modules/.bin/jest --runInBand test/specific-test.js
```

## Performance Optimization

### Development Performance

#### Build Speed Optimization
```javascript
// webpack.config.js modifications for faster builds
module.exports = {
  // Use cache for faster rebuilds
  cache: {
    type: 'filesystem'
  },
  
  // Optimize for development
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  
  // Reduce bundle checking
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  }
};
```

#### Memory Management
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max_old_space_size=4096"
npm start

# Or inline
NODE_OPTIONS="--max_old_space_size=4096" npm start
```

### Production Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run analyze

# Alternative analysis tool
npx webpack-bundle-analyzer build/static/js/*.js
```

#### Optimization Techniques
- **Code Splitting**: Split bundles for faster loading
- **Tree Shaking**: Remove unused code
- **Minification**: Compress JavaScript and CSS
- **Compression**: Enable gzip compression

## Troubleshooting

### Common Build Issues

#### Node Modules Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

#### Port Conflicts
```bash
# Find process using port
lsof -i :8601

# Kill process
kill -9 <PID>

# Use different port
npm start -- --port 8602
```

#### Memory Issues
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max_old_space_size=8192"

# Check memory usage
node -p "process.memoryUsage()"
```

### Build Errors

#### Missing Dependencies
```bash
# Check for missing peer dependencies
npm ls

# Install missing dependencies
npm install <missing-package>
```

#### TypeScript Errors
```bash
# Type check without building
npx tsc --noEmit

# Fix TypeScript configuration
# Edit tsconfig.json as needed
```

#### Webpack Errors
```bash
# Debug webpack configuration
npx webpack --mode development --verbose

# Clean webpack cache
rm -rf node_modules/.cache
```

## Continuous Integration

### GitHub Actions Setup
```yaml
# .github/workflows/build.yml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build project
      run: npm run build
```

### Local CI Simulation
```bash
# Run same steps as CI locally
npm ci           # Clean install
npm run lint     # Lint code
npm test         # Run tests
npm run build    # Build project
```

Building and running MistWarp locally gives you full control over the development environment and enables you to contribute effectively to the project. Follow these guidelines to set up a robust development workflow!

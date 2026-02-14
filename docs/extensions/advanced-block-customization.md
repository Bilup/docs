# Advanced Block Customization

This page covers advanced techniques for customizing block appearance and behavior beyond standard extension development.

## Visual Block Replacement

TurboWarp allows extensions to completely replace block visuals with custom content, including images, videos, and interactive elements. This technique involves manipulating the DOM after blocks are rendered.

### Basic Image Replacement

Here's how the Image Blocks extension replaces block content with custom SVG images:

```javascript
function injectCustomVisuals(categoryName) {
  document
    .querySelector('g.blocklyWorkspace')
    .querySelectorAll(`g[data-category="${categoryName}"]`)
    .forEach((g) => {
      // Get the block data to identify which block this is
      let block = vm.runtime.getEditingTarget().blocks.getBlock(g.dataset.id);
      
      if (block && !g.querySelector('svg#customIcon')) {
        if (block.opcode === 'myExtension_imageBlock') {
          // Replace the block's innerHTML with custom SVG
          g.innerHTML = `<svg id="customIcon" width="92" height="92" viewBox="0,0,92,92">
            <image href="https://example.com/image.png" height="92" width="92" />
          </svg><!--rotationCenter:46:46-->`;
        }
      }
    });
}
```

### Triggering Visual Updates

The visual replacement needs to be triggered whenever blocks are updated:

```javascript
// Hook into VM events to update visuals
vm.runtime.on('PROJECT_CHANGED', () => injectCustomVisuals('My Extension'));
vm.runtime.on('BLOCK_DRAG_UPDATE', () => injectCustomVisuals('My Extension'));
vm.runtime.on('BLOCK_DRAG_END', () => injectCustomVisuals('My Extension'));
```

### Advanced Content Types

#### Video Content
You can embed video content using `foreignObject`:

```javascript
g.innerHTML = `<svg width="300" height="200" viewBox="0,0,300,200">
  <foreignObject width="300" height="200">
    <video xmlns="http://www.w3.org/1999/xhtml" width="300" height="200" autoplay loop muted>
      <source src="https://example.com/video.mp4" type="video/mp4" />
    </video>
  </foreignObject>
</svg><!--rotationCenter:150:100-->`;
```

#### Interactive Content
Even interactive applications can be embedded:

```javascript
g.innerHTML = `<svg width="640" height="400" viewBox="0,0,640,400">
  <foreignObject width="640" height="400">
    <iframe width="640" height="400" src="data:text/html;base64,${encodedHTML}"></iframe>
  </foreignObject>
</svg><!--rotationCenter:320:200-->`;
```

### Empty Block Text

To create blocks that only show custom visuals, use an invisible character for the block text:

```javascript
{
  blockType: 'reporter',
  opcode: 'imageBlock',
  text: '‎', // Zero-width character (U+200E)
  disableReporter: true
}
```

## Reporter Value Customization

You can also customize how reporter values are displayed using runtime patching:

```javascript
// Patch the visual report system
patch(vm.runtime.constructor.prototype, {
  visualReport(original, blockId, value) {
    let block = vm.editingTarget?.blocks.getBlock(blockId) || 
                vm.runtime.flyoutBlocks.getBlock(blockId);
    
    // Call original first
    original(blockId, value);
    
    if (block) {
      setTimeout(() => {
        document.querySelectorAll('div.blocklyDropDownDiv').forEach((div) => {
          var reportBox = div.querySelector('div.valueReportBox');
          
          if (reportBox && block.opcode === 'myExtension_customReport') {
            // Customize the report display
            div.style.transform = 'translate(100px, 50px)';
            div.style.backgroundColor = '#ff0000';
          }
        });
      }, 25);
    }
  }
});
```

## Runtime Patching Utility

The Image Blocks extension includes a useful patching utility:

```javascript
const PATCHES_ID = '__patches_';

window.patch = (obj, functions) => {
  if (obj[PATCHES_ID]) return;
  obj[PATCHES_ID] = {};
  
  for (const name in functions) {
    const original = obj[name];
    obj[PATCHES_ID][name] = obj[name];
    
    if (original) {
      obj[name] = function (...args) {
        const callOriginal = (...args) => original.call(this, ...args);
        return functions[name].call(this, callOriginal, ...args);
      };
    } else {
      obj[name] = function (...args) {
        return functions[name].call(this, () => {}, ...args);
      };
    }
  }
};

window.unpatch = (obj) => {
  if (!obj[PATCHES_ID]) return;
  for (const name in obj[PATCHES_ID]) {
    obj[name] = obj[PATCHES_ID][name];
  }
  obj[PATCHES_ID] = null;
};
```

## Considerations and Limitations

### Performance
- Custom visuals are re-injected frequently, so keep DOM manipulation lightweight
- Use `setTimeout` with small delays (25ms) to avoid blocking the UI
- Cache DOM queries when possible

### Compatibility
- This technique manipulates Blockly's internal DOM structure
- Updates to TurboWarp or Blockly may break custom visuals
- Test across different browsers and screen sizes

### Accessibility
- Custom visuals may not be accessible to screen readers
- Consider providing alternative text or descriptions
- Ensure custom content doesn't interfere with keyboard navigation

### Security
- Be careful with user-generated content in custom visuals
- Validate and sanitize any external URLs or data
- Consider CORS restrictions for external resources

## Complete Example

Here's a simplified version of an image block extension:

```javascript
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Image blocks require unsandboxed mode');
  }
  
  function injectVisuals() {
    setTimeout(() => {
      document
        .querySelector('g.blocklyWorkspace')
        .querySelectorAll('g[data-category="Image Blocks"]')
        .forEach((g) => {
          let block = vm.runtime.getEditingTarget().blocks.getBlock(g.dataset.id);
          
          if (block && !g.querySelector('svg#custom')) {
            if (block.opcode === 'imageBlocks_cat') {
              g.innerHTML = `<svg id="custom" width="92" height="92" viewBox="0,0,92,92">
                <image href="https://example.com/cat.png" height="92" width="92" />
              </svg><!--rotationCenter:46:46-->`;
            }
          }
        });
    }, 25);
  }
  
  class ImageBlocks {
    getInfo() {
      return {
        id: 'imageBlocks',
        name: 'Image Blocks',
        blocks: [{
          blockType: 'reporter',
          opcode: 'cat',
          text: '‎', // Zero-width character
          disableReporter: true
        }]
      };
    }
    
    cat() {
      return 'Cat block clicked!';
    }
  }
  
  // Set up event listeners
  vm.runtime.on('PROJECT_CHANGED', injectVisuals);
  vm.runtime.on('BLOCK_DRAG_UPDATE', injectVisuals);
  vm.runtime.on('BLOCK_DRAG_END', injectVisuals);
  
  Scratch.extensions.register(new ImageBlocks());
})(Scratch);
```

This technique opens up possibilities for highly visual and interactive extensions that go far beyond traditional block appearance, enabling everything from image galleries to embedded applications within Scratch blocks.

## Runtime Introspection and Cross-Extension Communication

Extensions can inspect and interact with the Scratch runtime and other extensions through advanced introspection techniques. This enables powerful meta-programming capabilities and extension interoperability.

### Extension Manager Access

Access information about loaded extensions:

```javascript
// Get all loaded extensions
function getLoadedExtensions() {
    const extensionKeys = Array.from(vm.extensionManager._loadedExtensions.keys());
    return extensionKeys.filter(key => typeof key === 'string');
}

// Check if specific extension is loaded
function isExtensionLoaded(extensionId) {
    return vm.extensionManager._loadedExtensions.has(extensionId);
}

// Get extension instance
function getExtensionInstance(extensionId) {
    return vm.runtime[`ext_${extensionId}`];
}
```

### Dynamic Function Invocation

Call functions from other extensions dynamically:

```javascript
class ExtensionExposer {
    // Parse input arguments safely
    parseJSON(input) {
        if (Array.isArray(input)) return {};
        if (typeof input === 'object') return input;
        
        try {
            const parsed = JSON.parse(input);
            if (Array.isArray(parsed)) return {};
            if (typeof parsed === 'object') return parsed;
            return {};
        } catch {
            return {};
        }
    }
    
    // Dynamic function execution
    runFunction({ functionName, extensionId, input }, util, blockJSON) {
        extensionId = Cast.toString(extensionId);
        functionName = Cast.toString(functionName);
        
        // Try to find function in primitives (compiled blocks)
        const primitiveKey = `${extensionId}_${functionName}`;
        if (vm.runtime._primitives[primitiveKey]) {
            return vm.runtime._primitives[primitiveKey](
                this.parseJSON(Cast.toString(input)), 
                util, 
                blockJSON
            );
        }
        
        // Fallback to extension instance method
        const extension = vm.runtime[`ext_${extensionId}`];
        if (extension && typeof extension[functionName] === 'function') {
            return extension[functionName](
                this.parseJSON(Cast.toString(input)), 
                util, 
                blockJSON
            );
        }
        
        throw new Error(`Function ${functionName} not found in extension ${extensionId}`);
    }
}
```

### Extension Registry Patterns

Create extension registration and discovery systems:

```javascript
// Extension registry for cross-extension communication
class ExtensionRegistry {
    constructor() {
        this.extensions = new Map();
        this.apis = new Map();
        this.events = new EventTarget();
    }
    
    // Register extension with public API
    register(extensionId, instance, publicAPI = {}) {
        this.extensions.set(extensionId, instance);
        this.apis.set(extensionId, publicAPI);
        
        // Notify other extensions
        this.events.dispatchEvent(new CustomEvent('extensionRegistered', {
            detail: { extensionId, publicAPI }
        }));
    }
    
    // Get extension API
    getAPI(extensionId) {
        return this.apis.get(extensionId);
    }
    
    // Subscribe to extension events
    on(event, callback) {
        this.events.addEventListener(event, callback);
    }
    
    // Cross-extension method calls
    call(extensionId, method, ...args) {
        const api = this.apis.get(extensionId);
        if (api && typeof api[method] === 'function') {
            return api[method](...args);
        }
        throw new Error(`Method ${method} not found in ${extensionId}`);
    }
}

// Global registry
window.extensionRegistry = window.extensionRegistry || new ExtensionRegistry();

// Example usage in extension
class MyExtension {
    constructor() {
        // Register with public API
        window.extensionRegistry.register('myExtension', this, {
            getData: this.getData.bind(this),
            processData: this.processData.bind(this),
            onEvent: this.handleEvent.bind(this)
        });
        
        // Listen for other extensions
        window.extensionRegistry.on('extensionRegistered', (event) => {
            console.log('New extension:', event.detail.extensionId);
        });
    }
    
    getData() {
        return { value: 42, timestamp: Date.now() };
    }
    
    processData(input) {
        return input * 2;
    }
    
    // Call another extension
    useOtherExtension() {
        try {
            const result = window.extensionRegistry.call(
                'otherExtension', 
                'someMethod', 
                'argument'
            );
            return result;
        } catch (error) {
            console.warn('Could not call other extension:', error);
            return null;
        }
    }
}
```

### Runtime Primitive Inspection

Examine and work with Scratch's internal primitives:

```javascript
function inspectPrimitives() {
    const primitives = vm.runtime._primitives;
    const extensionPrimitives = {};
    
    // Group primitives by extension
    for (const [key, func] of Object.entries(primitives)) {
        const parts = key.split('_');
        if (parts.length >= 2) {
            const extensionId = parts[0];
            const blockName = parts.slice(1).join('_');
            
            if (!extensionPrimitives[extensionId]) {
                extensionPrimitives[extensionId] = [];
            }
            
            extensionPrimitives[extensionId].push({
                blockName,
                primitive: func,
                fullKey: key
            });
        }
    }
    
    return extensionPrimitives;
}

// Find all blocks that match a pattern
function findBlocksByPattern(pattern) {
    const primitives = vm.runtime._primitives;
    const regex = new RegExp(pattern);
    
    return Object.keys(primitives).filter(key => regex.test(key));
}

// Get block metadata
function getBlockMetadata(extensionId, blockName) {
    const extension = vm.runtime[`ext_${extensionId}`];
    if (!extension || !extension.getInfo) return null;
    
    const info = extension.getInfo();
    return info.blocks.find(block => block.opcode === blockName);
}
```

### Safe Cross-Extension Data Sharing

Implement safe data sharing between extensions:

```javascript
class ExtensionDataBus {
    constructor() {
        this.data = new Map();
        this.subscribers = new Map();
        this.permissions = new Map();
    }
    
    // Set data with access control
    setData(extensionId, key, value, permissions = {}) {
        const dataKey = `${extensionId}:${key}`;
        this.data.set(dataKey, value);
        this.permissions.set(dataKey, {
            read: permissions.read || [extensionId],
            write: permissions.write || [extensionId],
            ...permissions
        });
        
        // Notify subscribers
        this.notifySubscribers(dataKey, value);
    }
    
    // Get data with permission check
    getData(requestingExtension, extensionId, key) {
        const dataKey = `${extensionId}:${key}`;
        const permissions = this.permissions.get(dataKey);
        
        if (!permissions || !permissions.read.includes(requestingExtension)) {
            throw new Error('Access denied');
        }
        
        return this.data.get(dataKey);
    }
    
    // Subscribe to data changes
    subscribe(extensionId, dataKey, callback) {
        if (!this.subscribers.has(dataKey)) {
            this.subscribers.set(dataKey, new Set());
        }
        this.subscribers.get(dataKey).add({ extensionId, callback });
    }
    
    notifySubscribers(dataKey, value) {
        const subs = this.subscribers.get(dataKey);
        if (subs) {
            subs.forEach(({ callback }) => {
                try {
                    callback(value);
                } catch (error) {
                    console.warn('Subscriber callback error:', error);
                }
            });
        }
    }
}

// Global data bus
window.extensionDataBus = window.extensionDataBus || new ExtensionDataBus();
```

### Extension Communication Example

Complete example of extensions communicating:

```javascript
// Data provider extension
class DataProvider {
    constructor() {
        this.counter = 0;
        
        // Register API
        window.extensionRegistry.register('dataProvider', this, {
            getCounter: () => this.counter,
            incrementCounter: () => ++this.counter,
            resetCounter: () => this.counter = 0
        });
        
        // Share data via data bus
        setInterval(() => {
            window.extensionDataBus.setData(
                'dataProvider', 
                'counter', 
                this.counter,
                { read: ['dataConsumer', 'dataProvider'] }
            );
        }, 1000);
    }
    
    getInfo() {
        return {
            id: 'dataProvider',
            name: 'Data Provider',
            blocks: [{
                opcode: 'getCount',
                blockType: 'reporter',
                text: 'current count'
            }]
        };
    }
    
    getCount() {
        return this.counter;
    }
}

// Data consumer extension
class DataConsumer {
    constructor() {
        this.lastCount = 0;
        
        // Subscribe to data changes
        window.extensionDataBus.subscribe(
            'dataConsumer',
            'dataProvider:counter',
            (value) => {
                this.lastCount = value;
                console.log('Counter updated:', value);
            }
        );
        
        // Listen for provider registration
        window.extensionRegistry.on('extensionRegistered', (event) => {
            if (event.detail.extensionId === 'dataProvider') {
                console.log('Data provider is now available');
            }
        });
    }
    
    getInfo() {
        return {
            id: 'dataConsumer',
            name: 'Data Consumer',
            blocks: [{
                opcode: 'getLastCount',
                blockType: 'reporter',
                text: 'last received count'
            }, {
                opcode: 'incrementProviderCount',
                blockType: 'command',
                text: 'increment provider count'
            }]
        };
    }
    
    getLastCount() {
        return this.lastCount;
    }
    
    incrementProviderCount() {
        try {
            window.extensionRegistry.call('dataProvider', 'incrementCounter');
        } catch (error) {
            console.warn('Could not increment provider count:', error);
        }
    }
}
```

These runtime introspection techniques enable sophisticated extension ecosystems where extensions can discover, communicate with, and extend each other's functionality while maintaining proper security boundaries and error handling.

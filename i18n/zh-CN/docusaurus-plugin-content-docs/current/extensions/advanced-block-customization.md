# 高级积木自定义

本页涵盖了超出标准扩展开发的自定义积木外观和行为的高级技术。

## 可视化积木替换

TurboWarp 允许扩展用自定义内容(包括图像、视频和交互式元素)完全替换积木视觉效果。此技术涉及在积木渲染后操作 DOM。

### 基本图像替换

以下是图像积木扩展如何用自定义 SVG 图像替换积木内容：

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

### 触发视觉更新

每当积木更新时，需要触发视觉替换：

```javascript
// Hook into VM events to update visuals
vm.runtime.on('PROJECT_CHANGED', () => injectCustomVisuals('My Extension'));
vm.runtime.on('BLOCK_DRAG_UPDATE', () => injectCustomVisuals('My Extension'));
vm.runtime.on('BLOCK_DRAG_END', () => injectCustomVisuals('My Extension'));
```

### 高级内容类型

#### 视频内容

你可以使用 `foreignObject` 嵌入视频内容：

```javascript
g.innerHTML = `<svg width="300" height="200" viewBox="0,0,300,200">
  <foreignObject width="300" height="200">
    <video xmlns="http://www.w3.org/1999/xhtml" width="300" height="200" autoplay loop muted>
      <source src="https://example.com/video.mp4" type="video/mp4" />
    </video>
  </foreignObject>
</svg><!--rotationCenter:150:100-->`;
```

#### 交互式内容

甚至可以嵌入交互式应用程序：

```javascript
g.innerHTML = `<svg width="640" height="400" viewBox="0,0,640,400">
  <foreignObject width="640" height="400">
    <iframe width="640" height="400" src="data:text/html;base64,${encodedHTML}"></iframe>
  </foreignObject>
</svg><!--rotationCenter:320:200-->`;
```

### 空积木文本

要创建只显示自定义视觉效果的积木，请使用不可见字符作为积木文本：

```javascript
{
  blockType: 'reporter',
  opcode: 'imageBlock',
  text: '‎', // Zero-width character (U+200E)
  disableReporter: true
}
```

## 返回值(显示)自定义

你也可以使用运行时补丁来自定义返回值的显示方式：

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

## 运行时补丁工具

图像积木扩展包含一个有用的补丁工具：

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

## 注意事项和限制

### 性能
- 自定义视觉效果会频繁重新注入，因此请保持 DOM 操作轻量化
- 使用带有小延迟(25ms)的 `setTimeout` 以避免阻塞 UI
- 尽可能缓存 DOM 查询

### 兼容性
- 此技术操作 Blockly 的内部 DOM 结构
- TurboWarp 或 Blockly 的更新可能会破坏自定义视觉效果
- 在不同浏览器和屏幕尺寸上进行测试

### 可访问性
- 自定义视觉效果可能无法被屏幕阅读器访问
- 考虑提供替代文本或描述
- 确保自定义内容不会干扰键盘导航

### 安全性
- 对自定义视觉效果中的用户生成内容要小心
- 验证和清理任何外部 URL 或数据
- 考虑外部资源的 CORS 限制

## 完整示例

以下是图像积木扩展的简化版本：

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

此技术为高度视觉化和交互式扩展开辟了可能性，远远超出传统积木外观，支持从图像画廊到嵌入应用程序等各种功能。

## 运行时内省和跨扩展通信

扩展可以通过高级内省技术检查和与 Scratch 运行时及其他扩展交互。这实现了强大的元编程能力和扩展互操作性。

### 扩展管理器访问

访问有关已加载扩展的信息：

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

### 动态函数调用

动态调用其他扩展的函数：

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

### 扩展注册模式

创建扩展注册和发现系统：

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

### 运行时原语检查

检查和使用 Scratch 的内部原语：

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

### 安全的跨扩展数据共享

实现扩展之间的安全数据共享：

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

### 扩展通信示例

扩展通信的完整示例：

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

这些运行时内省技术支持复杂的扩展生态系统，其中扩展可以发现、通信并扩展彼此的功能，同时保持适当的安全边界和错误处理。
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
      // 获取积木数据以识别这是哪个积木
      let block = vm.runtime.getEditingTarget().blocks.getBlock(g.dataset.id);
      
      if (block && !g.querySelector('svg#customIcon')) {
        if (block.opcode === 'myExtension_imageBlock') {
          // 用自定义 SVG 替换积木的 innerHTML
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
// 挂钩到 VM 事件以更新视觉效果
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
  text: '‎', // 零宽度字符 (U+200E)
  disableReporter: true
}
```

## 返回值(显示)自定义

你也可以使用运行时补丁来自定义返回值的显示方式：

```javascript
// 补丁视觉返回系统
patch(vm.runtime.constructor.prototype, {
  visualReport(original, blockId, value) {
    let block = vm.editingTarget?.blocks.getBlock(blockId) || 
                vm.runtime.flyoutBlocks.getBlock(blockId);
    
    // 先调用原始方法
    original(blockId, value);
    
    if (block) {
      setTimeout(() => {
        document.querySelectorAll('div.blocklyDropDownDiv').forEach((div) => {
          var reportBox = div.querySelector('div.valueReportBox');
          
          if (reportBox && block.opcode === 'myExtension_customReport') {
            // 自定义返回显示
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
          text: '‎', // 零宽度字符
          disableReporter: true
        }]
      };
    }
    
    cat() {
      return 'Cat block clicked!';
    }
  }
  
  // 设置事件监听器
  vm.runtime.on('PROJECT_CHANGED', injectVisuals);
  vm.runtime.on('BLOCK_DRAG_UPDATE', injectVisuals);
  vm.runtime.on('BLOCK_DRAG_END', injectVisuals);
  
  Scratch.extensions.register(new ImageBlocks());
})(Scratch);
```

此技术为高度视觉化和交互式扩展开辟了可能性，远远超出传统积木外观，支持从图像画廊到嵌入应用程序等各种功能。

## 运行时自省和跨扩展通信

扩展可以通过高级自省技术检查和与 Scratch 运行时及其他扩展交互。这实现了强大的元编程能力和扩展互操作性。

### 扩展管理器访问

访问有关已加载扩展的信息：

```javascript
// 获取所有已加载的扩展
function getLoadedExtensions() {
    const extensionKeys = Array.from(vm.extensionManager._loadedExtensions.keys());
    return extensionKeys.filter(key => typeof key === 'string');
}

// 检查特定扩展是否已加载
function isExtensionLoaded(extensionId) {
    return vm.extensionManager._loadedExtensions.has(extensionId);
}

// 获取扩展实例
function getExtensionInstance(extensionId) {
    return vm.runtime[`ext_${extensionId}`];
}
```

### 动态函数调用

动态调用其他扩展的函数：

```javascript
class ExtensionExposer {
    // 安全解析输入参数
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
    
    // 动态函数执行
    runFunction({ functionName, extensionId, input }, util, blockJSON) {
        extensionId = Cast.toString(extensionId);
        functionName = Cast.toString(functionName);
        
        // 尝试在原语(编译积木)中查找函数
        const primitiveKey = `${extensionId}_${functionName}`;
        if (vm.runtime._primitives[primitiveKey]) {
            return vm.runtime._primitives[primitiveKey](
                this.parseJSON(Cast.toString(input)), 
                util, 
                blockJSON
            );
        }
        
        // 回退到扩展实例方法
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
// 扩展注册中心，用于跨扩展通信
class ExtensionRegistry {
    constructor() {
        this.extensions = new Map();
        this.apis = new Map();
        this.events = new EventTarget();
    }
    
    // 使用公共 API 注册扩展
    register(extensionId, instance, publicAPI = {}) {
        this.extensions.set(extensionId, instance);
        this.apis.set(extensionId, publicAPI);
        
        // 通知其他扩展
        this.events.dispatchEvent(new CustomEvent('extensionRegistered', {
            detail: { extensionId, publicAPI }
        }));
    }
    
    // 获取扩展 API
    getAPI(extensionId) {
        return this.apis.get(extensionId);
    }
    
    // 监听扩展事件
    on(event, callback) {
        this.events.addEventListener(event, callback);
    }
    
    // 跨扩展方法调用
    call(extensionId, method, ...args) {
        const api = this.apis.get(extensionId);
        if (api && typeof api[method] === 'function') {
            return api[method](...args);
        }
        throw new Error(`Method ${method} not found in ${extensionId}`);
    }
}

// 全局注册中心
window.extensionRegistry = window.extensionRegistry || new ExtensionRegistry();

// 扩展中的示例用法
class MyExtension {
    constructor() {
        // 使用公共 API 注册
        window.extensionRegistry.register('myExtension', this, {
            getData: this.getData.bind(this),
            processData: this.processData.bind(this),
            onEvent: this.handleEvent.bind(this)
        });
        
        // 监听其他扩展
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
    
    // 调用另一个扩展
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
    
    // 按扩展分组原语
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

// 查找所有匹配模式的积木
function findBlocksByPattern(pattern) {
    const primitives = vm.runtime._primitives;
    const regex = new RegExp(pattern);
    
    return Object.keys(primitives).filter(key => regex.test(key));
}

// 获取积木元数据
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
    
    // 使用访问控制设置数据
    setData(extensionId, key, value, permissions = {}) {
        const dataKey = `${extensionId}:${key}`;
        this.data.set(dataKey, value);
        this.permissions.set(dataKey, {
            read: permissions.read || [extensionId],
            write: permissions.write || [extensionId],
            ...permissions
        });
        
        // 通知监听者
        this.notifySubscribers(dataKey, value);
    }
    
    // 带权限检查获取数据
    getData(requestingExtension, extensionId, key) {
        const dataKey = `${extensionId}:${key}`;
        const permissions = this.permissions.get(dataKey);
        
        if (!permissions || !permissions.read.includes(requestingExtension)) {
            throw new Error('Access denied');
        }
        
        return this.data.get(dataKey);
    }
    
    // 监听数据变化
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

// 全局数据总线
window.extensionDataBus = window.extensionDataBus || new ExtensionDataBus();
```

### 扩展通信示例

扩展通信的完整示例：

```javascript
// 数据提供扩展
class DataProvider {
    constructor() {
        this.counter = 0;
        
        // 注册 API
        window.extensionRegistry.register('dataProvider', this, {
            getCounter: () => this.counter,
            incrementCounter: () => ++this.counter,
            resetCounter: () => this.counter = 0
        });
        
        // 通过数据总线共享数据
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

// 数据消费扩展
class DataConsumer {
    constructor() {
        this.lastCount = 0;
        
        // 监听数据变化
        window.extensionDataBus.subscribe(
            'dataConsumer',
            'dataProvider:counter',
            (value) => {
                this.lastCount = value;
                console.log('Counter updated:', value);
            }
        );
        
        // 监听提供者注册
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

这些运行时自省技术支持复杂的扩展生态系统，其中扩展可以发现、通信并扩展彼此的功能，同时保持适当的安全边界和错误处理。
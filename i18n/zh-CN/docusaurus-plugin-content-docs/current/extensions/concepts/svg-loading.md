---
title: SVG 加载模式
---

# SVG 加载模式

渲染器中的 SVG 造型异步加载。这意味着当您创建 SVG 造型时，图像可能不会立即准备好进行尺寸查询或渲染。

## 问题

```javascript
const skinId = renderer.createSVGSkin(svgData);
const skin = renderer._allSkins[skinId];

// 如果 SVG 尚未加载，这可能是 [0, 0]！
console.log(skin.size);
```

## 解决方案：等待 SVG 加载

使用此辅助函数等待 SVG 造型完成加载：

```javascript
/**
 * 等待 SVG 造型完成加载
 * @param {SVGSkin} svgSkin - 来自 renderer._allSkins 的 SVG 造型对象
 * @returns {Promise<void>} - SVG 加载完成时解析
 */
function svgSkinFinishedLoading(svgSkin) {
  return new Promise((resolve) => {
    if (svgSkin._svgImageLoaded) {
      // 已加载
      resolve();
    } else {
      // 等待加载或错误事件
      svgSkin._svgImage.addEventListener('load', () => {
        resolve();
      });
      svgSkin._svgImage.addEventListener('error', () => {
        resolve(); // 即使出错也解析以防止挂起
      });
    }
  });
}
```

## 用法示例

```javascript
class SVGExtension {
  async registerSVGSkin(args, util) {
    const renderer = util.runtime.renderer;
    const svgData = args.SVG_CODE;
    
    // 创建 SVG 造型
    const skinId = renderer.createSVGSkin(svgData);
    
    // 获取造型对象并等待加载
    const svgSkin = renderer._allSkins[skinId];
    await svgSkinFinishedLoading(svgSkin);
    
    // 现在可以安全查询尺寸
    const size = svgSkin.size;
    console.log(`SVG loaded: ${size[0]} x ${size[1]}`);
    
    return skinId;
  }
}
```

## SVG 造型属性

加载完成后，SVG 造型具有以下属性：

- `_svgImageLoaded` - 指示加载状态的布尔值
- `_svgImage` - 底层 SVG 图像元素
- `size` - 包含 SVG 尺寸的 [width, height] 数组

## 使用场景

在以下情况下需要等待 SVG 加载：
- 创建后立即查询造型尺寸
- 立即将造型应用于可绘制对象
- 执行依赖于 SVG 内容的操作

## 相关 API

- [createSVGSkin()](../apis/renderer/createSVGSkin.md)
- [updateSVGSkin()](../apis/renderer/updateSVGSkin.md)
- [内部属性](./internal-properties.md)
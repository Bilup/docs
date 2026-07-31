---
title: 杂项 API
sidebar_position: 12
---

# 杂项 API

既然您可以编写扩展，这里有 `getInfo()` 和 `Scratch` 对象上可用的更多选项。除非另有说明，这些在**沙箱和非沙箱**扩展中都有效，并且可以自由组合。

## 积木颜色

`color1`、`color2` 和 `color3` 分别设置积木颜色、输入颜色和菜单颜色。`color1` 应该最亮，`color3` 最暗。使用十六进制代码（[下载](/example-extensions/color.js)）：

```js
getInfo() {
  return {
    id: 'colorexample',
    name: 'Color Example',
    color1: '#ff0000',
    color2: '#00ff00',
    color3: '#0000ff',
    blocks: [ /* ... */ ]
  };
}
```

替代积木颜色模式（高对比度、深色和插件预设）会自动从这些值生成。

## docsURI

`docsURI` 在扩展积木列表的顶部添加一个打开文档页面的按钮：

```js
getInfo() {
  return {
    id: 'hellodocs',
    name: 'Hello Docs!',
    docsURI: 'https://example.com/my-extension-docs',
    blocks: [ /* ... */ ]
  };
}
```

## disableMonitor

Bilup 自动为任何无输入的 `REPORTER` 积木（并且与 Scratch 不同，`BOOLEAN` 积木也是）提供一个监视器复选框。在积木上设置 `disableMonitor: true` 来隐藏该复选框（[下载](/example-extensions/unmonitorable.js)）。注意这不会移除有人用扩展旧版本创建的监视器。

## Scratch.Cast

Scratch 有自己的类型转换和比较规则，带有许多怪癖。与其重新发明它们，不如使用 `Scratch.Cast`（[下载](/example-extensions/cast.js)）：

```js
toNumber({INPUT})   { return Scratch.Cast.toNumber(INPUT); }
castToString({INPUT}) { return Scratch.Cast.toString(INPUT); }
toBoolean({INPUT})  { return Scratch.Cast.toBoolean(INPUT); }

compare({A, B}) {
  const c = Scratch.Cast.compare(A, B);
  // 使用 < 0、> 0 或 === 0。不要使用 === 1 或 === -1。
  if (c === 0) return 'Equal';
  return c > 0 ? 'A is greater' : 'B is greater';
}
```

完整的参考在[实用 API 页面](/building-extensions/apis/utility-apis)。

## hideFromPalette

`hideFromPalette: true` 从积木区隐藏积木而不移除它，因此项目中已有的副本继续工作。这是[向后兼容更改](/building-extensions/compatibility)的主要工具。加载 [hidden-1.js](/example-extensions/hidden-1.js) 并保存一个使用其积木的项目，然后加载 [hidden-2.js](/example-extensions/hidden-2.js)（同一扩展，积木现在隐藏）并重新打开项目：现有积木仍然运行，但它从积木区消失了。

## filter

如果积木只在角色中有意义，或只在舞台中有意义，将 `filter` 设置为包含 `Scratch.TargetType.SPRITE` 或 `Scratch.TargetType.STAGE` 的数组（[下载](/example-extensions/filter.js)）：

```js
{
  opcode: 'sprites',
  blockType: Scratch.BlockType.COMMAND,
  text: 'available in ONLY sprites',
  filter: [Scratch.TargetType.SPRITE]
}
```

`filter` 只影响积木显示在哪个积木区。通过拖放或背包仍可能最终把积木放到"错误"的目标中，因此在重要时您的代码仍必须检查 `util.target.isStage`。要完全隐藏积木，使用 `hideFromPalette`，而不是 `filter: []`。

## 图标

有三种附加图像的方式：

- 扩展上的 `menuIconURI`：积木区中显示的图像。回退到 `blockIconURI`，然后是彩色圆圈。
- 扩展上的 `blockIconURI`：每个积木上的默认图标。
- 积木上的 `blockIconURI`：覆盖该积木的扩展图标。

每个都必须是 [data: URL](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Data_URLs)。首选 SVG；至少 64x64 的 PNG 或 JPG 也可以。保持正方形。请参阅 [icons.js](/example-extensions/icons.js)。

## 内联图像

通过添加类型为 `Scratch.ArgumentType.IMAGE` 且带 `dataURI` 的参数，将图像放入积木内部。设置 `flipRTL: true` 在从右到左的语言中镜像它。请参阅 [inline-images.js](/example-extensions/inline-images.js)。

## 分隔符

要在积木区中分隔积木组，请将字符串 `'---'` 放入 `blocks` 数组（[下载](/example-extensions/separators.js)）：

```js
blocks: [
  { opcode: 'block1', blockType: Scratch.BlockType.COMMAND, text: 'group 1' },
  '---',
  { opcode: 'block2', blockType: Scratch.BlockType.COMMAND, text: 'group 2' }
]
```

## 终止积木

`isTerminal: true` 阻止另一个积木连接到 `COMMAND` 积木的下面（[下载](/example-extensions/terminal.js)）。它看起来像"停止全部"，但它不会停止脚本；它只阻挡底部连接。循环末尾的终止积木不会自行停止循环。

## 下一步

接下来，[事件和帽子积木](/building-extensions/hats)（如果您跳过了），或[API 参考页面](/building-extensions/apis/scratch-api)了解 `Scratch` 对象、VM、渲染器和音频引擎的完整表面。

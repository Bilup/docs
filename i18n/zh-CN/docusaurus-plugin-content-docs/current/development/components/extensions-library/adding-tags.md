---
title: 添加标签
---

# 向扩展库添加标签

要向扩展库添加新标签，请按照以下步骤操作：

1. **定位标签文件**  
    打开标签文件：  
    `src/lib/libraries/tw-extension-tags.js`
    在 `scratch-gui` 中

2. **定义标签对象**  
    创建一个包含以下属性的对象：
    - `tag`: 标签的唯一字符串标识符(例如 `'scratch'`)。
    - `intlLabel`: 标签的显示标签。这可以是字符串或变量(例如 `APP_NAME`)，引用在其他地方定义的标签。

3. **将标签插入数组**  
    将新标签对象添加到标签文件中导出的数组中。

**示例：**
```javascript
{ tag: 'newtag', intlLabel: 'New Tag' }
```
或者，如果使用变量：
```javascript
{ tag: 'tw', intlLabel: APP_NAME }
```

> **注意：**  
> 由于标签代表品牌名称，`intlLabel` 属性不需要翻译。

**示例标签文件 (`src/lib/libraries/tw-extension-tags.js`)：**
```javascript
import {APP_NAME} from '../brand';

// 因为这些都是品牌名称，不需要翻译。
export default [
     {tag: 'scratch', intlLabel: 'Scratch'},
     {tag: 'tw', intlLabel: APP_NAME},
     {tag: 'mistium', intlLabel: 'Mistium'}
];
```
(上面的代码块不准确，仅供参考)

## 参考

有关标签在扩展库 UI 中如何使用的更多信息，请参见 `scratch-gui` 中的 `src/containers/extension-library.jsx`
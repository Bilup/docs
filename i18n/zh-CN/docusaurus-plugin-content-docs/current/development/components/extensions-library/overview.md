---
title: 扩展库
---

# 扩展库

扩展库是一个 React 组件，显示用户可以添加到其 Scratch 项目的可用扩展列表。它从多个来源获取扩展元数据，处理并合并它们，并以可搜索、可过滤的 UI 呈现。

## 功能

- **动态扩展加载：** 从 TurboWarp、Mistium、SharkPools、PenguinMod 和 Bilup 扩展仓库获取扩展元数据。
- **国际化：** 支持扩展名称和描述的多种语言。
- **信用和文档：** 显示扩展作者的信用信息，以及文档或示例项目的链接（如果可用）。
- **与 Scratch VM 集成：** 选中扩展时将其加载到 Scratch VM 中。
- **错误处理：** 如果获取扩展数据失败或耗时过长，显示加载和错误状态。

## 数据流

1. **获取扩展：**  
   挂载时，组件异步从 TurboWarp、Mistium、SharkPools、PenguinMod 和 Bilup 端点获取扩展元数据。它处理并合并结果，将它们缓存以供将来使用。

2. **显示扩展：**  
   库将内置扩展与获取的画廊扩展组合在一起。每个扩展都显示其图标、名称、描述和信用信息。

3. **选择扩展：**  
   当用户选择扩展时：
   - 如果是特殊操作（例如自定义扩展模态框），调用相应的处理程序。
   - 否则，扩展被加载到 VM 中，并激活相关类别。

## 自定义

- **添加新来源：**  
  要添加更多扩展来源，请更新 `extension-library.jsx` 中的 `fetchLibrary` 函数以获取和处理额外的端点。

- **UI 自定义：**  
  UI 使用 `LibraryComponent` 渲染，可以自定义外观或行为。

## 相关文件

- `/src/containers/extension-library.jsx` — 主实现。
- `/src/lib/libraries/extensions/index.jsx` — 内置扩展定义。
- `/src/components/library/library.jsx` — 库 UI 组件。
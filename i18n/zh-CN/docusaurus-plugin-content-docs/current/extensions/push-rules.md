---
hide_table_of_contents: true
---

# 提交扩展

如果您想将扩展提交到 [extensions.bilup.org](https://github.com/Bilup/extensions/)，您需要遵循以下规则：

::::info
除非它是一个**高质量**的扩展，否则我们不会为您修改文件。
::::

## 扩展封面图

每个扩展都需要一张封面图，存储在 `images/` 目录中。
此外，封面图名称必须与扩展文件名相同，尺寸为 600x300，格式为 `.svg`。

## 扩展文件

### 头部

扩展的头部部分必须包含以下内容：

```javascript
// Name: ExtensionName
// ID: extensionid
// Description: ExtensionDescription
// By: Name <your url>
// Original: TheOriginalAuthor <original url>
// License: MPL-2.0
```

您必须使用行注释；块注释 `/* */` 不会生效。这些字段是**必需的**：

- `Name` 出现在网站和画廊中。它应该与 getInfo() 返回的 `name` 相似。
- `ID` 必须与 getInfo() 返回的 `id` 完全相同，并且必须是**小写**。
- `Description` 出现在网站和画廊中。
- `License` 描述扩展代码使用的许可证。它必须是有效的 [SPDX 许可证](https://spdx.org/licenses/) 表达式。对于我们推荐的 Mozilla Public License 2.0，标识符是 `MPL-2.0`。
- `By` 用于署名作者。`Original` 用于基于他人作品的扩展。它们都使用相同的格式：`Name` 或 `Name <Url>`（URL 必须是**有效的**）。如果您想署名多个作者，只需再添加一条 `// By: ...` 或 `// Original: ...` 注释。

### 代码

提交前，请确保您的扩展代码**没有错误**。

我们建议检查以下内容：
- 检查您的扩展是否存在于 `extensions\extensions.json` 中
- 检查您的封面图是否存在于 `images/` 目录中
- 运行 `npm start` 或 `npm run build` 检查构建错误

### 国际化翻译

我们要求您的扩展包含**国际化翻译**（`zh-CN` 和 `en`；未来可能添加更多语言）。

国际化翻译文件存储在 `translations/` 目录中，其中 `translations\extension-metadata.json` 存储名称和描述的翻译，`translations\extension-runtime.json` 存储扩展代码的翻译。

每个翻译必须遵循此格式：
```json
"zh-CN": {
  "extensionID@translationsID": "value"
}
```
其中 `extensionID` 是您扩展的 ID，`translationsID` 是翻译键，`value` 是翻译后的文本。

在代码中使用国际化翻译时，您需要使用 `Scratch.translate()` 方法。
```javascript
Scratch.translate({ default: 'defaultValue', id: 'translationsID' });
```
通常，`defaultValue` 应包含英文翻译。

注意：`translationsID` 是您之前在 `translations\extension-runtime.json` 中定义的键。调用时**不要**使用 `extensionID@translationsID`。

我们建议以标准化的方式定义 `translationsID`，例如 `group.tools`、`block.settings` 等。

## 关于 **AI** 的声明

- 我们允许您使用 AI 编写代码，但我们建议您不要**过度依赖** AI。
如果您使用 AI 编写代码，请确保您能**理解** AI 生成的代码，并且能在没有 AI 的情况下修复问题。
- 我们**不建议**使用 AI 生成封面图。

## 提交您的扩展

我们建议以下提交方法：

- 直接将您的扩展提交到 `extensions` 仓库（这可能要求您拥有提交到 `extensions` 仓库的**权限**；我们不推荐此方法）
- 创建分支并提交到该分支（不推荐）
- 准备您的扩展并将其发送给我们的维护者（推荐）

有关提交扩展的更多详情，请**联系我们**（support@bilup.org）。

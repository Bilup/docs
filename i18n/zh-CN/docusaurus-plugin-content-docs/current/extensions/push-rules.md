---
hide_table_of_contents: true
---

# 提交拓展

如果你想提交一个扩展到 [extensions.bilup.org](https://github.com/Bilup/extensions/)，你需要遵循以下规则:

:::info
除非是**质量极高**的拓展，否则我们不会帮你修改文件。
:::

## 拓展封面

每个扩展都需要有一个封面图片，它们被存放在 `images/` 目录下。
另外，封面图片的名称必须与扩展的文件名称相同，大小为 600x300，且格式为 `.svg`。

## 拓展文件

### 开头

拓展的开头部分必须包含以下内容:

```javascript
// Name: ExtensionName
// ID: extensionid
// Description: ExtensionDescription
// By: Name <your url>
// Original: TheOriginalAuthor <original url>
// License: MPL-2.0
```

你必须使用行注释；块注释 `/* */` 不起作用。这些字段是**必填**的：

- `Name` 会出现在网站和库中。它应该类似于 getInfo() 返回的 `name`。
- `ID` 必须与 getInfo() 返回的 `id` 完全相同，且都是**小写**。
- `Description` 会出现在网站和库中。
- `License` 描述扩展代码所使用的许可证。它必须是有效的 [SPDX 许可证](https://spdx.org/licenses/) 表达式。对于我们推荐的 Mozilla 公共许可证 2.0 版本，标识符是 `MPL-2.0`。
- `By` 用来标注作者。`Original` 用于基于其他人作品的扩展。它们都使用相同的格式：`Name` 或 `Name <Url>`(Url里面的链接一定要**有效**)。如果你想标注多个作者，只需再添加一条 `// By: ...` 或 `// Original: ...` 注释即可。

### 代码

在提交之前，请确保你的拓展代码是**没有问题**的。

我们建议你通过以下内容来进行检查:
- 检查 `extensions\extensions.json` 中是否存在你的拓展
- 检查 `images/` 目录下是否存在你的封面图片
- 运行 `npm start` 或 `npm run build` 来检查代码是否存在构建错误

### 国际化翻译

我们要求你的拓展必须包含**国际化翻译**(`zh-CN`和 `en`, 未来可能会添加更多语言).

国际化翻译的文件存放在`translations/`目录下，其中`translations\extension-metadata.json`用来存放名称和描述的翻译，`translations\extension-runtime.json`用来存放扩展代码的翻译。

每一条翻译都需要遵守以下格式：
```json
"zh-CN": {
  "extensionID@translationsID": "value"
}
```
其中，`extensionID` 是你的拓展的 ID，`translationsID` 是翻译的键，`value` 是翻译的值。

在代码中使用国际化翻译时，你需要使用 `Scratch.translate()` 方法。
```javascript
Scratch.translate({ default: 'defaultValue', id: 'translationsID' });
```
一般情况下，`defaultValue` 用来写英文的翻译。

注意：`translationsID` 是你之前在 `translations\extension-runtime.json` 中定义的键，调用时**不要**写成 `extensionID@translationsID`。

我们建议你规范的定义 `translationsID`，例如 `group.tools`、`block.settings` 等。


## 关于**AI**的声明

- 我们允许你使用 AI 来编写代码，但是我们建议你不要**过度依赖** AI。
如果你使用 AI 来编写代码，请确保你能够**看懂** AI 生成的代码，并且能够在没有 AI 的时候修复问题
- 我们**不推荐**你使用 AI 来生成封面图

## 提交你的拓展

我们推荐你使用一下方式来进行提交:

- 将你的拓展直接提交 `extensions` 仓库下(这可能需要你**有权限**提交到 `extensions` 仓库，我们并不推荐使用这种方法)
- 创建分支并提交到该分支下(并不推荐)
- 整理好拓展，将其发送给我们的维护者(推荐)

有关更多提交拓展的详细信息，请**联系我们**(support@bilup.org)。
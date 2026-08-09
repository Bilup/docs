---
title: 提交擴充功能
hide_table_of_contents: true
---

# 提交擴充功能

如果您想將擴充功能提交到 [extensions.bilup.org](https://github.com/Bilup/extensions/)，您需要遵循以下規則：

::::info
除非它是一個**高質量**的擴充功能，否則我們不會為您修改檔案。
::::

## 擴充功能封面圖

每個擴充功能都需要一張封面圖，儲存在 `images/` 目錄中。
此外，封面圖名稱必須與擴充功能檔名相同，尺寸為 600x300，格式為 `.svg`。

## 擴充功能檔案

### 頭部

擴充功能的頭部部分必須包含以下內容：

```javascript
// Name: ExtensionName
// ID: extensionid
// Description: ExtensionDescription
// By: Name <your url>
// Original: TheOriginalAuthor <original url>
// License: MPL-2.0
```

您必須使用行註解；塊註解 `/* */` 不會生效。這些欄位是**必需的**：

- `Name` 出現在網站和畫廊中。它應該與 getInfo() 返回的 `name` 相似。
- `ID` 必須與 getInfo() 返回的 `id` 完全相同，並且必須是**小寫**。
- `Description` 出現在網站和畫廊中。
- `License` 描述擴充功能程式碼使用的授權。它必須是有效的 [SPDX 授權](https://spdx.org/licenses/) 表示式。對於我們推薦的 Mozilla Public License 2.0，識別符號是 `MPL-2.0`。
- `By` 用於署名作者。`Original` 用於基於他人作品的擴充功能。它們都使用相同的格式：`Name` 或 `Name <Url>`（URL 必須是**有效的**）。如果您想署名多個作者，只需再新增一條 `// By: ...` 或 `// Original: ...` 註解。

### 程式碼

提交前，請確保您的擴充功能程式碼**沒有錯誤**。

我們建議檢查以下內容：
- 檢查您的擴充功能是否存在於 `extensions\extensions.json` 中
- 檢查您的封面圖是否存在於 `images/` 目錄中
- 執行 `npm start` 或 `npm run build` 檢查建置錯誤

### 國際化翻譯

我們要求您的擴充功能包含**國際化翻譯**（`zh-CN` 和 `en`；未來可能新增更多語言）。

國際化翻譯檔案儲存在 `translations/` 目錄中，其中 `translations\extension-metadata.json` 儲存名稱和描述的翻譯，`translations\extension-runtime.json` 儲存擴充功能程式碼的翻譯。

每個翻譯必須遵循此格式：
```json
"zh-CN": {
  "extensionID@translationsID": "value"
}
```
其中 `extensionID` 是您擴充功能的 ID，`translationsID` 是翻譯鍵，`value` 是翻譯後的文本。

在程式碼中使用國際化翻譯時，您需要使用 `Scratch.translate()` 方法。
```javascript
Scratch.translate({ default: 'defaultValue', id: 'translationsID' });
```
通常，`defaultValue` 應包含英文翻譯。

注意：`translationsID` 是您之前在 `translations\extension-runtime.json` 中定義的鍵。呼叫時**不要**使用 `extensionID@translationsID`。

我們建議以標準化的方式定義 `translationsID`，例如 `group.tools`、`block.settings` 等。

## 關於 **AI** 的宣告

- 我們允許您使用 AI 編寫程式碼，但我們建議您不要**過度依賴** AI。
如果您使用 AI 編寫程式碼，請確保您能**理解** AI 生成的程式碼，並且能在沒有 AI 的情況下修復問題。
- 我們**不建議**使用 AI 生成封面圖。

## 提交您的擴充功能

我們建議以下提交方法：

- 直接將您的擴充功能提交到 `extensions` 倉庫（這可能要求您擁有提交到 `extensions` 倉庫的**許可權**；我們不推薦此方法）
- 建立分支並提交到該分支（不推薦）
- 準備您的擴充功能並將其傳送給我們的維護者（推薦）

有關提交擴充功能的更多詳情，請**聯絡我們**（support@bilup.org）。

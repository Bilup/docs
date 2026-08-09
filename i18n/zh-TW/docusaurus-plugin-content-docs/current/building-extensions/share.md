---
title: 分享您的擴充功能
sidebar_position: 13
---

# 分享您的擴充功能

要分享擴充功能，您需要有地方託管它。

如果您只想在自己的專案中使用自己的擴充功能，並與[打包器](/packager/overview)一起分發它們，您不需要託管或提交任何東西。打包器總是將擴充功能捆綁並作為匯出專案的一部分以非沙箱方式執行。

## 沙箱擴充功能

[沙箱擴充功能](/building-extensions/sandbox)可以託管在任何透過 HTTPS 提供靜態檔案的地方。[GitHub Pages](https://pages.github.com/) 是常見選擇。注意 GitHub 的 `raw.githubusercontent.com` 連結**不能**作為擴充功能 URL；請改用 GitHub Pages（或其他靜態主機）。

一旦它在公開的 HTTPS URL 上，就在編輯器中使用"新增擴充功能"、"自訂擴充功能"和該 URL 載入它，或用 `?extension=<url>` 自動載入。

## 非沙箱擴充功能

[非沙箱擴充功能](/building-extensions/unsandboxed)只從受信任的來源自動以非沙箱方式執行（請參閱[非沙箱頁面](/building-extensions/unsandboxed)上的受信任字首）。由於您不控制那些畫廊域名，實際可行的選項是：

- **自己託管並讓使用者選擇加入。** 像上面一樣在任何公開 HTTPS URL 上提供服務。當有人載入該 URL 時，Bilup 會以沙箱方式載入它，除非他們明確選擇信任它，因此請為您的使用者記錄該步驟。
- **將其放入 Bilup 擴充功能畫廊。** 畫廊位於 [extensions.bilup.org](https://extensions.bilup.org)；從該來源提供的擴充功能自動以非沙箱方式執行。請遵循畫廊網站上的提交說明。

## 下一步

[結束](/building-extensions/wrapping-up)。

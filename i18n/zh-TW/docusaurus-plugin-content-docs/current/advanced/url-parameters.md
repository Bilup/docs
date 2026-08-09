---
title: URL 引數
sidebar_position: 3
---

# URL 引數

您可以透過向 URL 新增引數來控制 Bilup 載入和執行專案的方式。這對於分享可復現的設定、嵌入具有特定選項的專案或自動化測試非常有用。

引數使用標準的查詢字串語法：URL 後加 `?`，然後是 `name=value` 對，用 `&` 連線。純開關引數不取值：

```
https://com.bilup.org/123456789?turbo&fps=60&username=alice
```

::::note
當您在編輯器中更改常用設定（渦輪模式、FPS、高質量畫筆、舞臺大小、插值）時，Bilup 會替您將它們儲存到 URL 中。下面的引數大多是您需要手動設定的"進階"引數，外加一些常用引數供參考。
::::

## 載入專案

| 引數 | 值 | 作用 |
|-----------|-------|--------------|
| (路徑) | 專案 ID | `com.bilup.org/123456789` 載入該專案 |
| `project_url` | 直接 URL | 從任意啟用 CORS 的 URL 載入 `.sb3`（或 `project.json`）。不要與專案 ID 組合使用。 |
| `clone` | git 倉庫 URL | 從 Bilup git 倉庫克隆專案（請參閱[Git 整合](/editor/git)）。 |

`project_url` 需要一個支援 [CORS](/advanced/cors)（`Access-Control-Allow-Origin: *`）的直接下載。省略協議時預設使用 `https://`；`http://` URL 通常無法工作。[GitHub Pages](https://pages.github.com/) 非常適合此項。

```
https://com.bilup.org/?project_url=https://example.com/project.sb3
```

## 效能與執行時

| 引數 | 值 | 作用 |
|-----------|-------|--------------|
| `fps` | 數字 | 設定[幀率](/advanced/custom-fps)。`0` 以顯示器重新整理率執行。 |
| `turbo` | 開關 | 啟用[渦輪模式](/advanced/warp-timer)（不限制每幀節流）。 |
| `interpolate` | 開關 | 啟用[插值](/advanced/interpolation)以獲得更平滑的運動。 |
| `hqpen` | 開關 | 啟用[高質量畫筆](/advanced/high-quality-pen)。 |
| `limitless` | 開關 | 移除[雜項限制](/advanced/remove-limits)。 |
| `offscreen` | 開關 | [移除圍欄](/advanced/remove-fencing)，讓角色可以離開舞臺。 |
| `clones` | 數字 | 設定最大克隆數（請參閱[無限克隆](/advanced/infinite-clones)）。 |
| `stuck` | 開關 | 啟用[防卡死計時器](/advanced/warp-timer)。也接受 `warp_timer`。 |
| `nocompile` | 開關 | [停用編譯器](/advanced/disable-compiler)。您幾乎永遠不會想用它。 |

## 顯示

| 引數 | 值 | 作用 |
|-----------|-------|--------------|
| `size` | `寬度x高度` | 設定[自訂舞臺大小](/advanced/custom-stage-size)，例如 `size=640x360`。 |
| `scale` | 數字 | 限制舞臺允許放大的程度。`scale=1` 保持其原生解析度。 |
| `fullscreen-background` | CSS 顏色 | 全屏時顯示的背景顏色。將 `#` 轉義為 `%23`，例如 `%23abc123`。 |

## 帳戶與雲 {#accounts-and-cloud}

| 引數 | 值 | 作用 |
|-----------|-------|--------------|
| `username` | 字串 | 設定 `使用者名稱` 積木返回的值，並用於[雲端變數](/advanced/cloud-variables)。以這種方式設定的使用者名稱不會儲存。 |
| `cloud_host` | `wss://...` URL | 將[雲端變數](/advanced/cloud-variables#cloud-host)指向不同的伺服器。預設為 `wss://clouddata.turbowarp.org`。 |

## 協作

| 引數 | 值 | 作用 |
|-----------|-------|--------------|
| `room` | 房間程式碼 | 設定使用者名稱後自動加入即時[協作](/editor/collaboration)房間。引數讀取後會被從 URL 中移除。 |

## 擴充功能 {#extension}

| 引數 | 值 | 作用 |
|-----------|-------|--------------|
| `extension` | URL | 載入自訂擴充功能。可以重複以載入多個。 |

```
https://com.bilup.org/?extension=https://example.com/a.js&extension=https://example.com/b.js
```

這些擴充功能的用法請參閱[建置擴充功能](/building-extensions/introduction)。

## 僅嵌入引數

以下引數僅適用於[嵌入播放器](/advanced/embedding)：

| 引數 | 值 | 作用 |
|-----------|-------|--------------|
| `autoplay` | 開關 | 專案載入後自動點選綠旗。 |
| `addons` | 逗號列表 | 在嵌入中啟用特定外掛，例如 `addons=pause,gamepad`。 |
| `settings-button` | 開關 | 在嵌入中顯示進階設定按鈕。 |

## 另請參閱

- [嵌入](/advanced/embedding)
- [雲端變數](/advanced/cloud-variables)
- [CORS](/advanced/cors)
- [編輯器設定](/editor/settings)

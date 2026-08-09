---
title: 內部概覽
sidebar_position: 1
---

# 內部

本節解釋 Bilup 編輯器是如何建置的：scratch-gui 的 React 和 Redux 架構、頂層元件如何組合、應用如何與虛擬機器對話、狀態如何管理、主題如何應用，以及外掛系統如何工作。

它是[貢獻](/contributing/overview)的配套。貢獻告訴您如何簽出、建置和更改程式碼。內部告訴您程式碼是如何組成的，讓那些更改有意義。

這是面向開發者的內容。如果您只想使用編輯器，您不需要這些。

## 範圍

這裡幾乎所有內容都是關於 **scratch-gui** 的，因為介面、Redux store、主題引擎和外掛框架都在那裡。執行時和編譯器位於 scratch-vm 中，在 [API 參考](/api-reference/overview)中單獨介紹。scratch-gui 與 VM 對話的邊界在[架構](/internals/architecture)中描述。

Bilup 是 TurboWarp 的分叉，TurboWarp 是 Scratch 的分叉。這裡的大量結構繼承自 Scratch 和 TurboWarp。各頁會指出 Bilup 在哪裡有分歧。

## 各頁

1. [架構](/internals/architecture) 涵蓋大局：React 加 Redux、`gui.jsx` 如何從高階元件組成，以及通往 VM 的橋樑。
2. [元件](/internals/components) 描述展示元件以及容器/元件拆分。
3. [容器](/internals/containers) 解釋將元件連線到 Redux 的容器模式。
4. [狀態管理](/internals/state) 列出 store 中的實際 reducer，以及選擇器、action creator 和中介軟體如何組合。
5. [主題](/internals/theming) 涵蓋主題如何變成文件上的 CSS 自訂屬性以及積木顏色如何應用。
6. [外掛系統](/internals/addons-system) 涵蓋外掛設定儲存和視窗系統。

## 另請參閱

- [貢獻概覽](/contributing/overview)
- [專案結構](/contributing/project-structure)
- [API 參考](/api-reference/overview)

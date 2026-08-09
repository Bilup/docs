---
title: 容器
sidebar_position: 4
---

# 容器模式

容器是將展示[元件](/internals/components)連線到 Redux store 和虛擬機器的層。容器選擇元件需要的狀態、繫結它應該分發的 action creator，並用那些作為 props 渲染元件。本頁描述該模式並展示一個真實容器是如何編寫的。

## 容器為什麼存在

展示元件把一切作為 props 接收，對 Redux 一無所知。這使它們可複用、可測試，但必須有東西給它們正確的 props。那個東西就是容器。它位於 `src/containers/`，每個連線的元件一個檔案，是使用 `react-redux` 的 `connect` 的地方。

這個拆分的回報：您可以更改狀態的儲存方式而不觸及元件，並且只需用不同的容器包裹或直接傳遞 props，就可以用不同的資料（編輯器、播放器、測試）渲染同一個元件。

## 最小容器

`src/containers/turbo-mode.jsx` 是一個簡潔的例子。它從 store 讀取渦輪狀態，暴露一個呼叫 VM 的切換，並將兩者交給其子元素：

```js
import {connect} from 'react-redux';

class TurboMode extends React.Component {
    // ...
    toggleTurboMode () {
        this.props.vm.setTurboMode(!this.props.turboMode);
    }
    render () {
        const {children, vm, ...props} = this.props;
        return this.props.children(this.toggleTurboMode, props);
    }
}

const mapStateToProps = state => ({
    vm: state.scratchGui.vm,
    turboMode: state.scratchGui.vmStatus.turbo
});

export default connect(
    mapStateToProps,
    () => ({}) // 省略 dispatch prop
)(TurboMode);
```

兩個要素：

- **`mapStateToProps`** 選擇狀態切片。編輯器狀態從 `state.scratchGui.<slice>` 讀取；這裡讀取 VM 實例和渦輪標誌。它在每次 store 更改時執行，元件在其選中的 props 更改時重新渲染。
- **`mapDispatchToProps`**（`connect` 的第二個引數）將 action creator 繫結到 `dispatch`。沒有要分發的東西時，它返回一個空物件，如上。

注意 VM 像任何其他值一樣從狀態讀取。它是儲存在 `vm` 切片中的穩定物件引用，因此容器用 `state.scratchGui.vm` 到達它，而不是匯入單例。

## 在更大的容器中選擇和分發

頂層容器 `src/containers/gui.jsx` 展示了完整形態。它的 `mapStateToProps` 從狀態派生許多 props，通常將巢狀切片展平為元件可以直接使用的簡單布林值：

```js
const mapStateToProps = state => ({
    activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
    blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
    costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
    isFullScreen: state.scratchGui.mode.isFullScreen || state.scratchGui.mode.isEmbedded,
    vm: state.scratchGui.vm
    // ...
});
```

它的 `mapDispatchToProps` 繫結從 reducer 匯入的 action creator：

```js
const mapDispatchToProps = dispatch => ({
    onSetStageSize: stageSize => dispatch(setStageSize(stageSize)),
    openSettingsModal: () => dispatch(openSettingsModal())
    // ...
});
```

模式總是一樣的：從它的 reducer 檔案匯入 action creator，包裹它使元件得到普通的回呼 prop。

## 選擇器與 reducer 共存

不是到處讀取原始狀態形狀，一些切片匯出選擇器函式，使派生邏輯存在於一個地方。例如 `gui.jsx` 從 `project-state` reducer 匯入 `getIsError` 和 `getIsShowingProject` 並在 `mapStateToProps` 內部使用它們。Action creator 以相同方式從擁有該切片的 reducer 匯出。reducer、action creator 和選擇器如何組織的詳情請參閱[狀態管理](/internals/state)。

## 作為高階元件的容器

一些容器不是 `connect` 包裝，而是新增行為並傳遞其餘部分的高階元件。編輯器的頂層元件是透過在連線的 `GUI` 周圍組合幾個這樣的元件（本地化、主題、VM 橋、專案獲取和儲存）建置的。該組合在[架構](/internals/architecture)中描述。上面的 `TurboMode` 是一個相關想法：一個渲染 prop 容器，為您給它的任何子函式提供回呼和狀態。

## 另請參閱

- [元件](/internals/components)
- [狀態管理](/internals/state)
- [架構](/internals/architecture)

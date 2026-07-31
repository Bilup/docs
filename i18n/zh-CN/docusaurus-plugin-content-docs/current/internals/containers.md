---
title: 容器
sidebar_position: 4
---

# 容器模式

容器是将展示[组件](/internals/components)连接到 Redux store 和虚拟机的层。容器选择组件需要的状态、绑定它应该分发的 action creator，并用那些作为 props 渲染组件。本页描述该模式并展示一个真实容器是如何编写的。

## 容器为什么存在

展示组件把一切作为 props 接收，对 Redux 一无所知。这使它们可复用、可测试，但必须有东西给它们正确的 props。那个东西就是容器。它位于 `src/containers/`，每个连接的组件一个文件，是使用 `react-redux` 的 `connect` 的地方。

这个拆分的回报：您可以更改状态的存储方式而不触及组件，并且只需用不同的容器包裹或直接传递 props，就可以用不同的数据（编辑器、播放器、测试）渲染同一个组件。

## 最小容器

`src/containers/turbo-mode.jsx` 是一个简洁的例子。它从 store 读取涡轮状态，暴露一个调用 VM 的切换，并将两者交给其子元素：

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

两个要素：

- **`mapStateToProps`** 选择状态切片。编辑器状态从 `state.scratchGui.<slice>` 读取；这里读取 VM 实例和涡轮标志。它在每次 store 更改时运行，组件在其选中的 props 更改时重新渲染。
- **`mapDispatchToProps`**（`connect` 的第二个参数）将 action creator 绑定到 `dispatch`。没有要分发的东西时，它返回一个空对象，如上。

注意 VM 像任何其他值一样从状态读取。它是保存在 `vm` 切片中的稳定对象引用，因此容器用 `state.scratchGui.vm` 到达它，而不是导入单例。

## 在更大的容器中选择和分发

顶层容器 `src/containers/gui.jsx` 展示了完整形态。它的 `mapStateToProps` 从状态派生许多 props，通常将嵌套切片展平为组件可以直接使用的简单布尔值：

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

它的 `mapDispatchToProps` 绑定从 reducer 导入的 action creator：

```js
const mapDispatchToProps = dispatch => ({
    onSetStageSize: stageSize => dispatch(setStageSize(stageSize)),
    openSettingsModal: () => dispatch(openSettingsModal())
    // ...
});
```

模式总是一样的：从它的 reducer 文件导入 action creator，包裹它使组件得到普通的回调 prop。

## 选择器与 reducer 共存

不是到处读取原始状态形状，一些切片导出选择器函数，使派生逻辑存在于一个地方。例如 `gui.jsx` 从 `project-state` reducer 导入 `getIsError` 和 `getIsShowingProject` 并在 `mapStateToProps` 内部使用它们。Action creator 以相同方式从拥有该切片的 reducer 导出。reducer、action creator 和选择器如何组织的详情请参阅[状态管理](/internals/state)。

## 作为高阶组件的容器

一些容器不是 `connect` 包装，而是添加行为并传递其余部分的高阶组件。编辑器的顶层组件是通过在连接的 `GUI` 周围组合几个这样的组件（本地化、主题、VM 桥、项目获取和保存）构建的。该组合在[架构](/internals/architecture)中描述。上面的 `TurboMode` 是一个相关想法：一个渲染 prop 容器，为您给它的任何子函数提供回调和状态。

## 另请参阅

- [组件](/internals/components)
- [状态管理](/internals/state)
- [架构](/internals/architecture)

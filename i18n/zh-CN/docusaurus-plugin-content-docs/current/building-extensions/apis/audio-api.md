---
title: 音频 API
sidebar_position: 4
---

# 音频 API

Bilup 通过 scratch-audio 引擎播放声音。[非沙箱扩展](/building-extensions/unsandboxed)在 `util.runtime.audioEngine` 访问它（等价于 `Scratch.vm.runtime.audioEngine`）。

引擎构建在浏览器的 [Web Audio API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API) 之上。在某些浏览器（特别是移动 Safari）上，音频上下文在用户与页面交互之前保持挂起状态。

```js
playSomething(args, util) {
  const audioEngine = util.runtime.audioEngine;
  if (!audioEngine) return; // 无头或未就绪
  // ...
}
```

## AudioEngine

| 成员 | 描述 |
|:--|:--|
| `audioEngine.currentTime` | 音频时间线中的当前位置（秒）。 |
| `audioEngine.inputNode` | 所有内容连接进去的主 `GainNode`。 |
| `audioEngine.EFFECT_NAMES` | 支持的效果名：`{ pitch: 'pitch', pan: 'pan' }`。 |
| `audioEngine.decodeSoundPlayer(sound)` | 将音频数据解码为 `SoundPlayer`。返回 Promise。`sound` 是 `{ data: ArrayBuffer }`。 |
| `audioEngine.createEffectChain()` | 创建用于音调/平衡处理的 `EffectChain`。 |
| `audioEngine.createBank()` | 创建 `SoundBank`（角色管理自己声音的方式）。 |
| `audioEngine.getLoudness()` | 当前麦克风响度，0 到 100。第一次调用请求麦克风权限。 |

## SoundPlayer

由 `decodeSoundPlayer` 创建。播放一个声音。

```js
const player = await audioEngine.decodeSoundPlayer({ data: arrayBuffer });
player.connect(audioEngine); // 路由到输出
player.play();
player.once('stop', () => { /* 完成 */ });
player.stop(); // 带短淡出停止
```

| 成员 | 描述 |
|:--|:--|
| `player.play()` | 开始播放。 |
| `player.stop()` | 带短淡出停止。 |
| `player.stopImmediately()` | 无淡出停止。 |
| `player.connect(target)` | 路由到引擎或效果链。 |
| `player.isPlaying` | 当前是否正在播放。 |
| `player.on('play' / 'stop', fn)` | 播放事件。 |
| `player.dispose()` | 完成后释放资源。 |

## EffectChain

对通过它的任何内容应用音调和平衡。只有两种效果；音量是声音播放器的属性，不是这里的效果。

```js
const chain = audioEngine.createEffectChain();
chain.set('pitch', 120); // +1 个八度（10 个单位 = 1 个半音）
chain.set('pan', -100);  // 完全左

player.connect(chain);
chain.connect(audioEngine);
```

| 成员 | 描述 |
|:--|:--|
| `chain.set('pitch', value)` | 音调，每个半音 10 个单位。 |
| `chain.set('pan', value)` | 平衡，从 -100（左）到 100（右）。 |
| `chain.clear()` | 重置效果。 |
| `chain.connect(target)` | 路由到引擎或另一个节点。 |
| `chain.dispose()` | 释放资源。 |

## 播放角色自己的声音

每个角色在 `util.target.sprite.soundBank` 有一个声音库，它以该角色的效果播放声音：

```js
playFirstSound(args, util) {
  const target = util.target;
  const sound = target.sprite.sounds[0];
  if (sound && target.sprite.soundBank) {
    target.sprite.soundBank.playSound(target, sound.soundId);
  }
}
```

## 麦克风响度

```js
getMic(args, util) {
  const audioEngine = util.runtime.audioEngine;
  try {
    return audioEngine.getLoudness(); // 0 到 100
  } catch (e) {
    return 0; // 权限被拒绝或没有麦克风
  }
}
```

## 另请参阅

- [VM API](/building-extensions/apis/vm-api)
- [Scratch 对象 API](/building-extensions/apis/scratch-api)

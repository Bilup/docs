---
title: 音訊 API
sidebar_position: 4
---

# 音訊 API

Bilup 透過 scratch-audio 引擎播放聲音。[非沙箱擴充功能](/building-extensions/unsandboxed)在 `util.runtime.audioEngine` 存取它（等價於 `Scratch.vm.runtime.audioEngine`）。

引擎建構在瀏覽器的 [Web Audio API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API) 之上。在某些瀏覽器（特別是移動 Safari）上，音訊上下文在使用者與頁面互動之前保持掛起狀態。

```js
playSomething(args, util) {
  const audioEngine = util.runtime.audioEngine;
  if (!audioEngine) return; // 無頭或未就緒
  // ...
}
```

## AudioEngine

| 成員 | 描述 |
|:--|:--|
| `audioEngine.currentTime` | 音訊時間線中的當前位置（秒）。 |
| `audioEngine.inputNode` | 所有內容連線進去的主 `GainNode`。 |
| `audioEngine.EFFECT_NAMES` | 支援的效果名：`{ pitch: 'pitch', pan: 'pan' }`。 |
| `audioEngine.decodeSoundPlayer(sound)` | 將音訊資料解碼為 `SoundPlayer`。返回 Promise。`sound` 是 `{ data: ArrayBuffer }`。 |
| `audioEngine.createEffectChain()` | 建立用於音調/平衡處理的 `EffectChain`。 |
| `audioEngine.createBank()` | 建立 `SoundBank`（角色管理自己聲音的方式）。 |
| `audioEngine.getLoudness()` | 當前麥克風響度，0 到 100。第一次呼叫請求麥克風許可權。 |

## SoundPlayer

由 `decodeSoundPlayer` 建立。播放一個聲音。

```js
const player = await audioEngine.decodeSoundPlayer({ data: arrayBuffer });
player.connect(audioEngine); // 路由到輸出
player.play();
player.once('stop', () => { /* 完成 */ });
player.stop(); // 帶短淡出停止
```

| 成員 | 描述 |
|:--|:--|
| `player.play()` | 開始播放。 |
| `player.stop()` | 帶短淡出停止。 |
| `player.stopImmediately()` | 無淡出停止。 |
| `player.connect(target)` | 路由到引擎或效果鏈。 |
| `player.isPlaying` | 當前是否正在播放。 |
| `player.on('play' / 'stop', fn)` | 播放事件。 |
| `player.dispose()` | 完成後釋放資源。 |

## EffectChain

對透過它的任何內容應用音調和平衡。只有兩種效果；音量是聲音播放器的屬性，不是這裡的效果。

```js
const chain = audioEngine.createEffectChain();
chain.set('pitch', 120); // +1 個八度（10 個單位 = 1 個半音）
chain.set('pan', -100);  // 完全左

player.connect(chain);
chain.connect(audioEngine);
```

| 成員 | 描述 |
|:--|:--|
| `chain.set('pitch', value)` | 音調，每個半音 10 個單位。 |
| `chain.set('pan', value)` | 平衡，從 -100（左）到 100（右）。 |
| `chain.clear()` | 重置效果。 |
| `chain.connect(target)` | 路由到引擎或另一個節點。 |
| `chain.dispose()` | 釋放資源。 |

## 播放角色自己的聲音

每個角色在 `util.target.sprite.soundBank` 有一個聲音庫，它以該角色的效果播放聲音：

```js
playFirstSound(args, util) {
  const target = util.target;
  const sound = target.sprite.sounds[0];
  if (sound && target.sprite.soundBank) {
    target.sprite.soundBank.playSound(target, sound.soundId);
  }
}
```

## 麥克風響度

```js
getMic(args, util) {
  const audioEngine = util.runtime.audioEngine;
  try {
    return audioEngine.getLoudness(); // 0 到 100
  } catch (e) {
    return 0; // 許可權被拒絕或沒有麥克風
  }
}
```

## 另請參閱

- [VM API](/building-extensions/apis/vm-api)
- [Scratch 物件 API](/building-extensions/apis/scratch-api)

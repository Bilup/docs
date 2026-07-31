---
title: Audio API
sidebar_position: 4
---

# Audio API

MistWarp plays sound through the scratch-audio engine. [Unsandboxed extensions](/building-extensions/unsandboxed) reach it at `util.runtime.audioEngine` (equivalently `Scratch.vm.runtime.audioEngine`).

The engine builds on the browser's [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API). On some browsers (notably mobile Safari) the audio context stays suspended until the user interacts with the page.

```js
playSomething(args, util) {
  const audioEngine = util.runtime.audioEngine;
  if (!audioEngine) return; // headless or not ready
  // ...
}
```

## AudioEngine

| Member | Description |
|:--|:--|
| `audioEngine.currentTime` | Current position in the audio timeline (seconds). |
| `audioEngine.inputNode` | The master `GainNode` everything connects into. |
| `audioEngine.EFFECT_NAMES` | The supported effect names: `{ pitch: 'pitch', pan: 'pan' }`. |
| `audioEngine.decodeSoundPlayer(sound)` | Decodes audio data into a `SoundPlayer`. Returns a Promise. `sound` is `{ data: ArrayBuffer }`. |
| `audioEngine.createEffectChain()` | Creates an `EffectChain` for pitch/pan processing. |
| `audioEngine.createBank()` | Creates a `SoundBank` (how a sprite manages its own sounds). |
| `audioEngine.getLoudness()` | Current microphone loudness, 0 to 100. The first call requests microphone permission. |

## SoundPlayer

Created by `decodeSoundPlayer`. Plays one sound.

```js
const player = await audioEngine.decodeSoundPlayer({ data: arrayBuffer });
player.connect(audioEngine); // route to output
player.play();
player.once('stop', () => { /* finished */ });
player.stop(); // stops with a short fade
```

| Member | Description |
|:--|:--|
| `player.play()` | Start playback. |
| `player.stop()` | Stop with a short fade-out. |
| `player.stopImmediately()` | Stop with no fade. |
| `player.connect(target)` | Route into the engine or an effect chain. |
| `player.isPlaying` | Whether it is currently playing. |
| `player.on('play' / 'stop', fn)` | Playback events. |
| `player.dispose()` | Release resources when done. |

## EffectChain

Applies pitch and pan to whatever routes through it. There are only two effects; volume is a property of the sound player, not an effect here.

```js
const chain = audioEngine.createEffectChain();
chain.set('pitch', 120); // +1 octave (10 units = 1 semitone)
chain.set('pan', -100);  // full left

player.connect(chain);
chain.connect(audioEngine);
```

| Member | Description |
|:--|:--|
| `chain.set('pitch', value)` | Pitch in units of 10 per semitone. |
| `chain.set('pan', value)` | Pan from -100 (left) to 100 (right). |
| `chain.clear()` | Reset effects. |
| `chain.connect(target)` | Route into the engine or another node. |
| `chain.dispose()` | Release resources. |

## Playing a sprite's own sound

Each sprite has a sound bank at `util.target.sprite.soundBank`, which plays sounds with that sprite's effects applied:

```js
playFirstSound(args, util) {
  const target = util.target;
  const sound = target.sprite.sounds[0];
  if (sound && target.sprite.soundBank) {
    target.sprite.soundBank.playSound(target, sound.soundId);
  }
}
```

## Microphone loudness

```js
getMic(args, util) {
  const audioEngine = util.runtime.audioEngine;
  try {
    return audioEngine.getLoudness(); // 0 to 100
  } catch (e) {
    return 0; // permission denied or no microphone
  }
}
```

## See also

- [VM API](/building-extensions/apis/vm-api)
- [Scratch object API](/building-extensions/apis/scratch-api)

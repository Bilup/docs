---
name: Audio
---

# 音频 API 参考

scratch-audio 库提供了一个强大的音频引擎，用于在 Scratch 扩展中播放声音、应用效果和管理音频。本参考涵盖开发扩展时可用的关键类和方法。

## 扩展开发者概述

创建具有音频功能的 Scratch 扩展时，你将使用：
- **AudioEngine** - 通过 `util.runtime.audioEngine` 访问
- **SoundPlayer** - 用于播放单个声音
- **SoundBank** - 用于管理角色特定的声音
- **EffectChain** - 用于应用音频效果

## 扩展音频系统架构

```
Extension Context
├── Runtime Audio Engine (util.runtime.audioEngine)
├── Target Sound Banks (util.target.sprite.soundBank)
├── Effect Chains (for audio processing)
└── Sound Players (for individual sound playback)
```

## 在扩展中访问音频

### 获取音频引擎

在扩展积木中，通过运行时访问音频引擎：

```javascript
playCustomSound(args, util) {
  const audioEngine = util.runtime.audioEngine;
  
  if (!audioEngine) {
    console.warn('Audio engine not available');
    return;
  }
  
  // 使用 audioEngine 进行音频操作
}
```

### 扩展声音加载模式

```javascript
class MyAudioExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.sounds = new Map(); // 扩展声音缓存
  }

  async loadSound(soundData, soundName) {
    const audioEngine = this.runtime.audioEngine;
    
    try {
      const soundPlayer = await audioEngine.decodeSoundPlayer({
        data: soundData // 音频文件的 ArrayBuffer
      });
      
      soundPlayer.connect(audioEngine);
      this.sounds.set(soundName, soundPlayer);
      return soundPlayer;
    } catch (error) {
      console.error('Failed to load sound:', error);
      return null;
    }
  }
}

## 核心类

### AudioEngine

处理全局功能的主音频引擎。

#### 构造函数

```javascript
const audioEngine = new AudioEngine(audioContext);
```

**参数：**
- `audioContext`（可选）- 自定义 AudioContext。如果未提供，将创建一个新的。

#### 关键属性

```javascript
// 音频时间线上的当前时间
audioEngine.currentTime // number

// 主音量控制节点
audioEngine.inputNode // GainNode

// Web Audio API 操作的音频上下文
audioEngine.audioContext // AudioContext

// 可用效果名称
## 扩展核心类

### AudioEngine

通过扩展积木中的 `util.runtime.audioEngine` 访问的主音频引擎。

#### 关键属性（只读）

```javascript
const audioEngine = util.runtime.audioEngine;

audioEngine.currentTime // number - 当前音频时间线位置
audioEngine.inputNode   // GainNode - 主音量控制
audioEngine.EFFECT_NAMES // { pitch: 'pitch', pan: 'pan' }
```

#### 扩展的关键方法

##### decodeSoundPlayer(sound)
解码音频数据并返回 SoundPlayer 以供立即使用。

```javascript
// 在扩展积木函数中
async loadExtensionSound(args, util) {
  const audioEngine = util.runtime.audioEngine;
  
  const soundData = {
    data: arrayBuffer // 你的音频文件作为 ArrayBuffer
  };

  try {
    const soundPlayer = await audioEngine.decodeSoundPlayer(soundData);
    soundPlayer.connect(audioEngine);
    return soundPlayer;
  } catch (error) {
    console.error('Failed to decode sound:', error);
    return null;
  }
}
```

##### createEffectChain()
创建用于处理音频的效果链。

```javascript
applyEffectsToSound(args, util) {
  const audioEngine = util.runtime.audioEngine;
  const effectChain = audioEngine.createEffectChain();
  
  effectChain.set('pitch', 10); // +1 半音
  effectChain.set('pan', -50);   // 向左平移
  effectChain.set('volume', 80); // 80% 音量
  
  effectChain.connect(audioEngine);
  return effectChain;
}
```

##### getLoudness()
获取当前麦克风音量（0-100）。

```javascript
getMicrophoneLevel(args, util) {
  const audioEngine = util.runtime.audioEngine;
  
  try {
    return audioEngine.getLoudness();
  } catch (error) {
    console.warn('Microphone not available:', error);
    return 0;
  }
}
```

### SoundPlayer

管理单个声音播放。通常通过 `audioEngine.decodeSoundPlayer()` 创建。

#### 关键属性

```javascript
soundPlayer.id           // string - 唯一标识符
soundPlayer.isPlaying    // boolean - 当前是否正在播放
soundPlayer.isStarting   // boolean - 是否正在启动
soundPlayer.buffer       // AudioBuffer - 音频数据
soundPlayer.playbackRate // number - 播放速度 (1.0 = 正常)
```

#### 关键方法

##### play()
开始播放声音。

```javascript
playExtensionSound(args, util) {
  const soundPlayer = this.getSoundPlayer(args.SOUND_NAME);
  if (soundPlayer) {
    soundPlayer.play();
    
    // 可选：监听事件
    soundPlayer.once('stop', () => {
      console.log('Sound finished playing');
    });
  }
}
```

##### stop()
停止播放并淡出。

```javascript
stopExtensionSound(args, util) {
  const soundPlayer = this.getSoundPlayer(args.SOUND_NAME);
  if (soundPlayer && soundPlayer.isPlaying) {
    soundPlayer.stop();
  }
}
```

##### connect(target)
连接到音频目标或效果链。

```javascript
// 直接连接到引擎
soundPlayer.connect(audioEngine);

// 通过效果连接
soundPlayer.connect(effectChain);
effectChain.connect(audioEngine);
```

### SoundBank（角色集成）

每个角色都有一个声音库，可通过 `util.target.sprite.soundBank` 访问。

#### 关键方法

##### playSound(target, soundId)
播放角色的声音并应用其效果。

```javascript
playSpriteSound(args, util) {
  const target = util.target;
  const soundIndex = parseInt(args.SOUND_INDEX);
  
  if (target.sprite.soundBank && target.sprite.sounds[soundIndex]) {
    const sound = target.sprite.sounds[soundIndex];
    target.sprite.soundBank.playSound(target, sound.soundId);
  }
}
```

## 音频效果

### 可用效果

1. **音调效果** - 通过改变播放速率来改变音调
2. **平移效果** - 在扬声器之间左右移动声音
3. **音量效果** - 控制振幅/音量

### 使用效果链

```javascript
const effectChain = audioEngine.createEffectChain();

// 设置绝对值
effectChain.set('pitch', 20);    // +2 半音
effectChain.set('pan', -100);    // 完全左移
effectChain.set('volume', 50);   // 50% 音量

// 相对于当前值改变
effectChain.change('pitch', 10); // 再增加 1 个半音
effectChain.change('volume', -10); // 减少 10% 音量

// 清除所有效果
effectChain.clear();

// 通过效果链连接声音
soundPlayer.connect(effectChain);
effectChain.connect(audioEngine);
```

### 效果值范围

```javascript
// 音调：每 10 个增量 = 1 个半音
// 典型范围 -1200 到 +1200（共 10 个八度）
effectChain.set('pitch', 120); // +1 个八度

// 平移：-100（完全左）到 +100（完全右）
effectChain.set('pan', 0); // 居中

// 音量：0（静音）到 100+（正常 = 100）
effectChain.set('volume', 100); // 正常音量
```

## 麦克风和音量检测

### 获取麦克风输入

```javascript
// 获取当前音量级别
const loudness = audioEngine.getLoudness(); // 返回 0-100

// 第一次调用会提示麦克风权限
// 后续调用立即返回当前级别
```

### 处理麦克风权限

```javascript
// 麦克风设置是自动的，但你可以检测错误
try {
  const loudness = audioEngine.getLoudness();
  if (loudness === 0) {
    console.log('No microphone input detected');
  }
} catch (error) {
  console.log('Microphone access denied or unavailable');
}
```

## React 集成模式

### 音频引擎自定义 Hook

```javascript
import { useEffect, useRef } from 'react';
const AudioEngine = require('scratch-audio');

export function useAudioEngine() {
  const audioEngineRef = useRef(null);
  
  useEffect(() => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = new AudioEngine();
    }
    
    return () => {
      // 如有需要进行清理
      if (audioEngineRef.current) {
        // 停止所有声音
        audioEngineRef.current.inputNode.disconnect();
      }
    };
  }, []);
  
  return audioEngineRef.current;
}
```

### 声音播放器组件

```javascript
import React, { useState, useEffect } from 'react';

function SoundPlayerComponent({ audioEngine, soundData }) {
  const [soundPlayer, setSoundPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  useEffect(() => {
    if (soundData && audioEngine) {
      audioEngine.decodeSoundPlayer(soundData)
        .then(player => {
          player.connect(audioEngine);
          setSoundPlayer(player);
          
          // 监听事件
          player.on('play', () => setIsPlaying(true));
          player.on('stop', () => setIsPlaying(false));
        });
    }
    
    return () => {
      if (soundPlayer) {
        soundPlayer.stop();
        soundPlayer.dispose();
      }
    };
  }, [soundData, audioEngine]);
  
  const handlePlay = () => {
    if (soundPlayer && !isPlaying) {
      soundPlayer.play();
    }
  };
  
  const handleStop = () => {
    if (soundPlayer && isPlaying) {
      soundPlayer.stop();
    }
  };
  
  return (
    <div className="sound-player">
      <button onClick={handlePlay} disabled={!soundPlayer || isPlaying}>
        Play
      </button>
      <button onClick={handleStop} disabled={!soundPlayer || !isPlaying}>
## 扩展中的音频效果

### 可用效果

1. **音调效果** - 通过改变播放速率来改变音调
2. **平移效果** - 在扬声器之间左右移动声音
3. **音量效果** - 控制振幅/音量

### 使用效果链

```javascript
class EffectExtension {
  applyEffects(args, util) {
    const audioEngine = util.runtime.audioEngine;
    const effectChain = audioEngine.createEffectChain();
    
    // 设置绝对值
    effectChain.set('pitch', 20);    // +2 半音
    effectChain.set('pan', -100);    // 完全左移
    effectChain.set('volume', 50);   // 50% 音量
    
    // 应用到声音
    const soundPlayer = this.getSoundPlayer(args.SOUND);
    if (soundPlayer) {
      soundPlayer.connect(effectChain);
      effectChain.connect(audioEngine);
    }
    
    return effectChain;
  }
  
  modifyEffect(args, util) {
    const effectChain = this.getEffectChain(args.CHAIN_ID);
    if (effectChain) {
      // 相对于当前值改变
      effectChain.change('pitch', 10); // 再增加 1 个半音
      effectChain.change('volume', -10); // 减少 10% 音量
    }
  }
  
  clearEffects(args, util) {
    const effectChain = this.getEffectChain(args.CHAIN_ID);
    if (effectChain) {
      effectChain.clear(); // 将所有效果重置为 0
    }
  }
}
```

### 效果值范围

```javascript
// 音调：每 10 个增量 = 1 个半音
// 范围：-1200 到 +1200（共 10 个八度）
effectChain.set('pitch', 120); // +1 个八度
effectChain.set('pitch', -120); // -1 个八度

// 平移：-100（完全左）到 +100（完全右）
effectChain.set('pan', 0);    // 居中
effectChain.set('pan', -100); // 完全左移
effectChain.set('pan', 100);  // 完全右移

// 音量：0（静音）到 100+（正常 = 100）
effectChain.set('volume', 100); // 正常音量
effectChain.set('volume', 200); // 双倍音量
effectChain.set('volume', 0);   // 静音
```

## 麦克风和音量检测

### 在扩展中获取麦克风输入

```javascript
class MicrophoneExtension {
  getLoudness(args, util) {
    const audioEngine = util.runtime.audioEngine;
    
    try {
      return audioEngine.getLoudness(); // 返回 0-100
    } catch (error) {
      console.warn('Microphone not available:', error);
      return 0;
    }
  }
  
  // 响应麦克风的扩展积木
  whenLoudEnough(args, util) {
    const threshold = parseFloat(args.THRESHOLD) || 50;
    const currentLoudness = this.getLoudness(args, util);
    
    return currentLoudness > threshold;
  }
  
  // 获取音量用于其他积木
  getLoudnessPercent(args, util) {
    return this.getLoudness(args, util);
  }
}
```

### 处理麦克风权限

```javascript
// 麦克风设置是自动的，但你可以处理错误
getMicrophoneLevel(args, util) {
  const audioEngine = util.runtime.audioEngine;
  
  try {
    const loudness = audioEngine.getLoudness();
    
    // 第一次调用会请求权限
    // 后续调用返回当前级别
    return loudness;
  } catch (error) {
    // 权限被拒绝或没有麦克风
    console.warn('Microphone access issue:', error);
    return 0;
  }
}
```

## 扩展开发模式

### 声音加载和缓存

```javascript
class SoundManagerExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.soundCache = new Map();
    this.effectChains = new Map();
  }
  
  async loadSoundFromUrl(args, util) {
    const url = args.URL;
    const soundName = args.NAME;
    const audioEngine = util.runtime.audioEngine;
    
    try {
      // 首先检查缓存
      if (this.soundCache.has(soundName)) {
        return soundName;
      }
      
      // 从 URL 加载
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      // 创建声音播放器
      const soundPlayer = await audioEngine.decodeSoundPlayer({
        data: { buffer: arrayBuffer }
      });
      
      soundPlayer.connect(audioEngine);
      this.soundCache.set(soundName, soundPlayer);
      
      return soundName;
    } catch (error) {
      console.error('Failed to load sound:', error);
      return '';
    }
  }
  
  playManagedSound(args, util) {
    const soundName = args.SOUND_NAME;
    const soundPlayer = this.soundCache.get(soundName);
    
    if (soundPlayer) {
      soundPlayer.play();
      return true;
    }
    
    return false;
  }
}
```

### 性能最佳实践

```javascript
class OptimizedAudioExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.sounds = new Map();
    this.activeSounds = new Set();
    this.maxConcurrentSounds = 8; // 性能限制
  }
  
  // 播放前检查限制
  canPlaySound() {
    return this.activeSounds.size < this.maxConcurrentSounds;
  }
  
  playOptimizedSound(args, util) {
    if (!this.canPlaySound()) {
      console.warn('Too many concurrent sounds');
      return false;
    }
    
    const soundName = args.SOUND_NAME;
    const soundPlayer = this.sounds.get(soundName);
    
    if (soundPlayer) {
      this.activeSounds.add(soundPlayer);
      
      // 完成后从活动集合中移除
      soundPlayer.once('stop', () => {
        this.activeSounds.delete(soundPlayer);
      });
      
      soundPlayer.play();
      return true;
    }
    
    return false;
  }
  
  // 项目停止时清理
  cleanup() {
    for (const soundPlayer of this.activeSounds) {
      soundPlayer.stop();
    }
    this.activeSounds.clear();
  }
}
```

## 扩展中的错误处理

### 常见错误场景

```javascript
class RobustAudioExtension {
  playSound(args, util) {
    try {
      const audioEngine = util.runtime.audioEngine;
      
      // 检查音频引擎是否可用
      if (!audioEngine) {
        console.warn('Audio engine not available');
        return false;
      }
      
      // 检查 Web Audio API 支持
      if (!audioEngine.audioContext) {
        console.warn('Web Audio API not supported');
        return false;
      }
      
      // 你的声音播放代码...
      return true;
      
    } catch (error) {
      console.error('Audio extension error:', error);
      return false;
    }
  }
  
  // 处理音频上下文状态
  ensureAudioContext(args, util) {
    const audioEngine = util.runtime.audioEngine;
    
    if (audioEngine.audioContext.state === 'suspended') {
      // 音频上下文已暂停 - 需要用户交互
      console.log('Audio context suspended, requires user interaction');
      return false;
    }
    
    return true;
  }
  
  // 安全的麦克风访问
  getSafeLoudness(args, util) {
    try {
      const audioEngine = util.runtime.audioEngine;
      return audioEngine.getLoudness();
    } catch (error) {
      // 麦克风权限被拒绝或不可用
      console.warn('Cannot access microphone:', error.message);
      return 0;
    }
}

## 测试扩展音频功能

### 测试音频扩展积木

```javascript
// 为测试模拟运行时和音频引擎
const mockRuntime = {
  audioEngine: {
    decodeSoundPlayer: jest.fn().mockResolvedValue({
      connect: jest.fn(),
      play: jest.fn(),
      stop: jest.fn(),
      isPlaying: false,
      on: jest.fn(),
      once: jest.fn()
    }),
    createEffectChain: jest.fn().mockReturnValue({
      set: jest.fn(),
      change: jest.fn(),
      connect: jest.fn(),
      clear: jest.fn()
    }),
    getLoudness: jest.fn().mockReturnValue(50)
  }
};

const mockUtil = {
  runtime: mockRuntime,
  target: {
    sprite: {
      soundBank: {
        playSound: jest.fn()
      },
      sounds: [
        { soundId: 'sound1', name: 'test-sound' }
      ]
    }
  }
};

// 测试扩展积木函数
test('playCustomSound block works correctly', async () => {
  const extension = new MyAudioExtension(mockRuntime);
  
  const result = await extension.playCustomSound(
    { SOUND_NAME: 'testSound' }, 
    mockUtil
  );
  
  expect(mockRuntime.audioEngine.decodeSoundPlayer).toHaveBeenCalled();
  expect(result).toBe(true);
});
```

### 测试麦克风功能

```javascript
test('microphone loudness detection', () => {
  const extension = new MicrophoneExtension(mockRuntime);
  
  // 测试正常操作
  const loudness = extension.getLoudness({}, mockUtil);
  expect(loudness).toBe(50);
  expect(mockRuntime.audioEngine.getLoudness).toHaveBeenCalled();
  
  // 测试错误处理
  mockRuntime.audioEngine.getLoudness.mockImplementation(() => {
    throw new Error('Microphone not available');
  });
  
  const errorLoudness = extension.getLoudness({}, mockUtil);
  expect(errorLoudness).toBe(0);
});
```

### 在真实环境中测试

```javascript
// 使用实际运行时测试扩展（用于集成测试）
test('extension audio integration', async () => {
  // 创建最小测试环境
  const vm = new VirtualMachine();
  await vm.start();
  
  const extension = new MyAudioExtension(vm.runtime);
  
  // 测试音频引擎是否可用
  expect(vm.runtime.audioEngine).toBeDefined();
  
  // 测试积木执行
  const util = {
    runtime: vm.runtime,
    target: vm.runtime.targets[0] // 舞台目标
  };
  
  const result = await extension.testAudioCapabilities({}, util);
  expect(typeof result).toBe('string');
  
  vm.quit();
});
```

## 扩展开发最佳实践

1. **始终检查音频引擎**：使用前验证 `util.runtime.audioEngine` 是否存在
2. **优雅处理错误**：将音频操作包装在 try-catch 块中
3. **尊重性能限制**：限制并发声音数并处理未使用的播放器
4. **提供用户反馈**：显示加载状态和错误消息
5. **跨浏览器测试**：在不同平台上验证功能
6. **缓存资源**：尽可能重用声音播放器和效果链
7. **正确清理**：项目停止时停止声音并释放资源

## 扩展的浏览器兼容性

- **现代浏览器**：完整的 Web Audio API 支持（Chrome 66+、Firefox 60+、Safari 14.1+）
- **Mobile Safari**：需要用户交互才能启动音频上下文
- **旧版浏览器**：可能需要对不支持的功能进行优雅降级
- **扩展上下文**：音频权限遵循与主应用相同的规则

scratch-audio 库会自动处理大多数浏览器兼容性问题，但扩展应该在不同环境中进行彻底测试。
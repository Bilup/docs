---
name: Audio
---

# Audio API Reference

The scratch-audio library provides a powerful audio engine for playing sounds, applying effects, and managing audio in Scratch extensions. This reference covers the key classes and methods available when developing extensions.

## Overview for Extension Developers

When creating Scratch extensions with audio capabilities, you'll work with:
- **AudioEngine** - Available via `util.runtime.audioEngine`
- **SoundPlayer** - For playing individual sounds
- **SoundBank** - For managing sprite-specific sounds
- **EffectChain** - For applying audio effects

## Extension Audio System Architecture

```
Extension Context
├── Runtime Audio Engine (util.runtime.audioEngine)
├── Target Sound Banks (util.target.sprite.soundBank)
├── Effect Chains (for audio processing)
└── Sound Players (for individual sound playback)
```

## Accessing Audio in Extensions

### Getting the Audio Engine

In extension blocks, the audio engine is accessed through the runtime:

```javascript
playCustomSound(args, util) {
  const audioEngine = util.runtime.audioEngine;
  
  if (!audioEngine) {
    console.warn('Audio engine not available');
    return;
  }
  
  // Use audioEngine for audio operations
}
```

### Extension Sound Loading Pattern

```javascript
class MyAudioExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.sounds = new Map(); // Cache for extension sounds
  }

  async loadSound(soundData, soundName) {
    const audioEngine = this.runtime.audioEngine;
    
    try {
      const soundPlayer = await audioEngine.decodeSoundPlayer({
        data: soundData // ArrayBuffer of audio file
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

## Core Classes

### AudioEngine

The main audio engine that handles global functionality.

#### Constructor

```javascript
const audioEngine = new AudioEngine(audioContext);
```

**Parameters:**
- `audioContext` (optional) - Custom AudioContext. If not provided, creates a new one.

#### Key Properties

```javascript
// Current time in the audio timeline
audioEngine.currentTime // number

// Master volume control node
audioEngine.inputNode // GainNode

// Audio context for Web Audio API operations
audioEngine.audioContext // AudioContext

// Available effect names
## Core Classes for Extensions

### AudioEngine

The main audio engine available via `util.runtime.audioEngine` in extension blocks.

#### Key Properties (Read-Only)

```javascript
const audioEngine = util.runtime.audioEngine;

audioEngine.currentTime // number - Current audio timeline position
audioEngine.inputNode   // GainNode - Master volume control
audioEngine.EFFECT_NAMES // { pitch: 'pitch', pan: 'pan' }
```

#### Key Methods for Extensions

##### decodeSoundPlayer(sound)
Decodes audio data and returns a SoundPlayer for immediate use.

```javascript
// In an extension block function
async loadExtensionSound(args, util) {
  const audioEngine = util.runtime.audioEngine;
  
  const soundData = {
    data: arrayBuffer // Your audio file as ArrayBuffer
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
Creates an effect chain for processing audio.

```javascript
applyEffectsToSound(args, util) {
  const audioEngine = util.runtime.audioEngine;
  const effectChain = audioEngine.createEffectChain();
  
  effectChain.set('pitch', 10); // +1 semitone
  effectChain.set('pan', -50);   // Pan left
  effectChain.set('volume', 80); // 80% volume
  
  effectChain.connect(audioEngine);
  return effectChain;
}
```

##### getLoudness()
Gets the current microphone loudness (0-100).

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

Manages individual sound playback. Usually created via `audioEngine.decodeSoundPlayer()`.

#### Key Properties

```javascript
soundPlayer.id           // string - Unique identifier
soundPlayer.isPlaying    // boolean - Currently playing
soundPlayer.isStarting   // boolean - Starting up
soundPlayer.buffer       // AudioBuffer - Audio data
soundPlayer.playbackRate // number - Speed (1.0 = normal)
```

#### Key Methods

##### play()
Starts playing the sound.

```javascript
playExtensionSound(args, util) {
  const soundPlayer = this.getSoundPlayer(args.SOUND_NAME);
  if (soundPlayer) {
    soundPlayer.play();
    
    // Optional: Listen for events
    soundPlayer.once('stop', () => {
      console.log('Sound finished playing');
    });
  }
}
```

##### stop()
Stops playing with fade-out.

```javascript
stopExtensionSound(args, util) {
  const soundPlayer = this.getSoundPlayer(args.SOUND_NAME);
  if (soundPlayer && soundPlayer.isPlaying) {
    soundPlayer.stop();
  }
}
```

##### connect(target)
Connects to audio destination or effect chain.

```javascript
// Connect directly to engine
soundPlayer.connect(audioEngine);

// Connect through effects
soundPlayer.connect(effectChain);
effectChain.connect(audioEngine);
```

### SoundBank (Sprite Integration)

Each sprite has a sound bank accessible via `util.target.sprite.soundBank`.

#### Key Methods

##### playSound(target, soundId)
Plays a sprite's sound with its effects applied.

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

## Audio Effects

### Available Effects

1. **Pitch Effect** - Changes playback rate to alter pitch
2. **Pan Effect** - Moves sound left/right between speakers  
3. **Volume Effect** - Controls amplitude/loudness

### Using Effects with Effect Chains

```javascript
const effectChain = audioEngine.createEffectChain();

// Set absolute values
effectChain.set('pitch', 20);    // +2 semitones
effectChain.set('pan', -100);    // Full left
effectChain.set('volume', 50);   // 50% volume

// Change relative to current values
effectChain.change('pitch', 10); // +1 more semitone
effectChain.change('volume', -10); // -10% volume

// Clear all effects
effectChain.clear();

// Connect sound through the effect chain
soundPlayer.connect(effectChain);
effectChain.connect(audioEngine);
```

### Effect Value Ranges

```javascript
// Pitch: Changes in increments of 10 = 1 semitone
// -1200 to +1200 typical range (10 octaves total)
effectChain.set('pitch', 120); // +1 octave

// Pan: -100 (full left) to +100 (full right)
effectChain.set('pan', 0); // Center

// Volume: 0 (silent) to 100+ (normal = 100)
effectChain.set('volume', 100); // Normal volume
```

## Microphone and Loudness

### Getting Microphone Input

```javascript
// Get current loudness level
const loudness = audioEngine.getLoudness(); // Returns 0-100

// The first call will prompt for microphone permission
// Subsequent calls return the current level immediately
```

### Handling Microphone Permissions

```javascript
// The microphone setup is automatic, but you can detect errors
try {
  const loudness = audioEngine.getLoudness();
  if (loudness === 0) {
    console.log('No microphone input detected');
  }
} catch (error) {
  console.log('Microphone access denied or unavailable');
}
```

## React Integration Patterns

### Custom Hook for Audio Engine

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
      // Cleanup if needed
      if (audioEngineRef.current) {
        // Stop all sounds
        audioEngineRef.current.inputNode.disconnect();
      }
    };
  }, []);
  
  return audioEngineRef.current;
}
```

### Sound Player Component

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
          
          // Listen for events
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
## Audio Effects in Extensions

### Available Effects

1. **Pitch Effect** - Changes playback rate to alter pitch
2. **Pan Effect** - Moves sound left/right between speakers
3. **Volume Effect** - Controls amplitude/loudness

### Working with Effect Chains

```javascript
class EffectExtension {
  applyEffects(args, util) {
    const audioEngine = util.runtime.audioEngine;
    const effectChain = audioEngine.createEffectChain();
    
    // Set absolute values
    effectChain.set('pitch', 20);    // +2 semitones
    effectChain.set('pan', -100);    // Full left
    effectChain.set('volume', 50);   // 50% volume
    
    // Apply to a sound
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
      // Change relative to current values
      effectChain.change('pitch', 10); // +1 more semitone
      effectChain.change('volume', -10); // -10% volume
    }
  }
  
  clearEffects(args, util) {
    const effectChain = this.getEffectChain(args.CHAIN_ID);
    if (effectChain) {
      effectChain.clear(); // Reset all effects to 0
    }
  }
}
```

### Effect Value Ranges

```javascript
// Pitch: Changes in increments of 10 = 1 semitone
// Range: -1200 to +1200 (10 octaves total)
effectChain.set('pitch', 120); // +1 octave
effectChain.set('pitch', -120); // -1 octave

// Pan: -100 (full left) to +100 (full right)
effectChain.set('pan', 0);    // Center
effectChain.set('pan', -100); // Full left
effectChain.set('pan', 100);  // Full right

// Volume: 0 (silent) to 100+ (normal = 100)
effectChain.set('volume', 100); // Normal volume
effectChain.set('volume', 200); // Double volume
effectChain.set('volume', 0);   // Silent
```

## Microphone and Loudness Detection

### Getting Microphone Input in Extensions

```javascript
class MicrophoneExtension {
  getLoudness(args, util) {
    const audioEngine = util.runtime.audioEngine;
    
    try {
      return audioEngine.getLoudness(); // Returns 0-100
    } catch (error) {
      console.warn('Microphone not available:', error);
      return 0;
    }
  }
  
  // Extension block that responds to microphone
  whenLoudEnough(args, util) {
    const threshold = parseFloat(args.THRESHOLD) || 50;
    const currentLoudness = this.getLoudness(args, util);
    
    return currentLoudness > threshold;
  }
  
  // Get loudness for use in other blocks
  getLoudnessPercent(args, util) {
    return this.getLoudness(args, util);
  }
}
```

### Handling Microphone Permissions

```javascript
// The microphone setup is automatic, but you can handle errors
getMicrophoneLevel(args, util) {
  const audioEngine = util.runtime.audioEngine;
  
  try {
    const loudness = audioEngine.getLoudness();
    
    // First call will request permission
    // Subsequent calls return current level
    return loudness;
  } catch (error) {
    // Permission denied or no microphone
    console.warn('Microphone access issue:', error);
    return 0;
  }
}
```

## Extension Development Patterns

### Sound Loading and Caching

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
      // Check cache first
      if (this.soundCache.has(soundName)) {
        return soundName;
      }
      
      // Load from URL
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      
      // Create sound player
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

### Performance Best Practices

```javascript
class OptimizedAudioExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.sounds = new Map();
    this.activeSounds = new Set();
    this.maxConcurrentSounds = 8; // Limit for performance
  }
  
  // Check limits before playing
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
      
      // Remove from active set when done
      soundPlayer.once('stop', () => {
        this.activeSounds.delete(soundPlayer);
      });
      
      soundPlayer.play();
      return true;
    }
    
    return false;
  }
  
  // Cleanup on project stop
  cleanup() {
    for (const soundPlayer of this.activeSounds) {
      soundPlayer.stop();
    }
    this.activeSounds.clear();
  }
}
```

## Error Handling in Extensions

### Common Error Scenarios

```javascript
class RobustAudioExtension {
  playSound(args, util) {
    try {
      const audioEngine = util.runtime.audioEngine;
      
      // Check if audio engine is available
      if (!audioEngine) {
        console.warn('Audio engine not available');
        return false;
      }
      
      // Check Web Audio API support
      if (!audioEngine.audioContext) {
        console.warn('Web Audio API not supported');
        return false;
      }
      
      // Your sound playing code here...
      return true;
      
    } catch (error) {
      console.error('Audio extension error:', error);
      return false;
    }
  }
  
  // Handle audio context state
  ensureAudioContext(args, util) {
    const audioEngine = util.runtime.audioEngine;
    
    if (audioEngine.audioContext.state === 'suspended') {
      // Audio context suspended - needs user interaction
      console.log('Audio context suspended, requires user interaction');
      return false;
    }
    
    return true;
  }
  
  // Safe microphone access
  getSafeLoudness(args, util) {
    try {
      const audioEngine = util.runtime.audioEngine;
      return audioEngine.getLoudness();
    } catch (error) {
      // Microphone permission denied or not available
      console.warn('Cannot access microphone:', error.message);
      return 0;
    }
}

## Testing Extension Audio Features

### Testing Audio Extension Blocks

```javascript
// Mock the runtime and audio engine for testing
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

// Test extension block function
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

### Testing Microphone Features

```javascript
test('microphone loudness detection', () => {
  const extension = new MicrophoneExtension(mockRuntime);
  
  // Test normal operation
  const loudness = extension.getLoudness({}, mockUtil);
  expect(loudness).toBe(50);
  expect(mockRuntime.audioEngine.getLoudness).toHaveBeenCalled();
  
  // Test error handling
  mockRuntime.audioEngine.getLoudness.mockImplementation(() => {
    throw new Error('Microphone not available');
  });
  
  const errorLoudness = extension.getLoudness({}, mockUtil);
  expect(errorLoudness).toBe(0);
});
```

### Testing in Real Environment

```javascript
// Test extension with actual runtime (for integration tests)
test('extension audio integration', async () => {
  // Create a minimal test environment
  const vm = new VirtualMachine();
  await vm.start();
  
  const extension = new MyAudioExtension(vm.runtime);
  
  // Test that audio engine is available
  expect(vm.runtime.audioEngine).toBeDefined();
  
  // Test block execution
  const util = {
    runtime: vm.runtime,
    target: vm.runtime.targets[0] // Stage target
  };
  
  const result = await extension.testAudioCapabilities({}, util);
  expect(typeof result).toBe('string');
  
  vm.quit();
});
```

## Extension Development Best Practices

1. **Always Check Audio Engine**: Verify `util.runtime.audioEngine` exists before use
2. **Handle Errors Gracefully**: Wrap audio operations in try-catch blocks
3. **Respect Performance Limits**: Limit concurrent sounds and dispose unused players
4. **Provide User Feedback**: Show loading states and error messages
5. **Test Across Browsers**: Verify functionality on different platforms
6. **Cache Resources**: Reuse sound players and effect chains when possible
7. **Clean Up Properly**: Stop sounds and dispose resources on project stop

## Browser Compatibility for Extensions

- **Modern Browsers**: Full Web Audio API support (Chrome 66+, Firefox 60+, Safari 14.1+)
- **Mobile Safari**: Requires user interaction to start audio context
- **Older Browsers**: May need graceful degradation for unsupported features
- **Extension Context**: Audio permissions follow same rules as main application

The scratch-audio library handles most browser compatibility issues automatically, but extensions should test thoroughly across different environments.
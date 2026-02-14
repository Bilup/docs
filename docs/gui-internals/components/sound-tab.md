# Sound Management Components

The sound management system in MistWarp consists of containers and components that handle audio assets for sprites and the stage.

## Overview

The sound management system enables users to:
- View and manage sounds for the current sprite/stage
- Add sounds from the library or upload audio files
- Record new sounds using the microphone
- Edit sound properties and playback settings

## Container Architecture

```
SoundTab (Container)
  └── AssetPanel (Component)
      ├── Selector (for sound list)
      │   └── SortableAsset (for each sound)
      ├── ActionMenu (add/record/upload)
      └── SoundEditor (when editing)
```
      │   ├── AddSound
      │   ├── UploadSound
      │   └── RecordSound
      └── SoundEditor (when editing)
```

## Key Features

### Sound Management
- Display sound waveforms and names
- Play/pause sound previews
- Reorder sounds via drag and drop
- Delete and duplicate sounds
- Trim sound length

### Audio Format Support
MistWarp supports multiple audio formats:
- **WAV**: Uncompressed audio (highest quality)
- **MP3**: Compressed audio (smaller file size)
- **OGG**: Open source compressed format
- **M4A**: Apple compressed format

## Props Interface

```typescript
interface SoundTabProps {
  sounds: Array&lt;SoundData&gt;;
  selectedSoundId: string;
  onSelectSound: (soundId: string) => void;
  onNewSound: () => void;
  onDeleteSound: (soundId: string) => void;
  onPlaySound: (soundId: string) => void;
  onStopSound: () => void;
  vm: VirtualMachine;
}
```

## State Management

Connects to Redux for sound state:

```javascript
const mapStateToProps = state => ({
  sounds: state.targets.editingTarget?.sounds || [],
  selectedSoundId: state.targets.editingTarget?.currentSound,
  editingTarget: state.targets.editingTarget,
  playingSound: state.audio.playingSound
});

const mapDispatchToProps = dispatch => ({
  onSelectSound: id => dispatch(setActiveSound(id)),
  onDeleteSound: id => dispatch(deleteSound(id)),
  onPlaySound: id => dispatch(playSound(id)),
  // ... other actions
});
```

## Sound Operations

### Adding Sounds

Multiple methods to add sounds:

1. **From Library**: Choose from built-in sound collection
2. **Upload**: Load audio files from computer
3. **Record**: Capture audio using microphone
4. **Generate**: Create simple tones and effects

### Recording Interface

MistWarp includes a built-in sound recorder:

```javascript
const SoundRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  
  const startRecording = () => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();
        setIsRecording(true);
        
        mediaRecorder.ondataavailable = event => {
          setAudioBlob(event.data);
        };
      });
  };
  
  return (
    <div className="sound-recorder">
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Recording'}
      </button>
    </div>
  );
};
```

## Audio Engine Integration

### Web Audio API
MistWarp uses the Web Audio API for audio processing:

```javascript
class AudioEngine {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
  }
  
  playSound(soundData) {
    const source = this.context.createBufferSource();
    source.buffer = soundData.audioBuffer;
    source.connect(this.gainNode);
    source.start();
    return source;
  }
}
```

### Sound Effects
Built-in audio effects available:
- **Pitch**: Adjust sound frequency
- **Echo**: Add reverberation
- **Robot**: Robotic voice effect
- **Louder/Quieter**: Volume control

## Waveform Visualization

Sounds are displayed with visual waveforms:

```javascript
const WaveformVisualization = ({ soundData }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current && soundData.audioBuffer) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const audioBuffer = soundData.audioBuffer;
      
      // Draw waveform
      drawWaveform(ctx, audioBuffer, canvas.width, canvas.height);
    }
  }, [soundData]);
  
  return <canvas ref={canvasRef} width={200} height={50} />;
};
```

## Sound Editing Features

### Trimming
Users can trim sounds to specific lengths:

```javascript
const trimSound = (soundData, startTime, endTime) => {
  const originalBuffer = soundData.audioBuffer;
  const sampleRate = originalBuffer.sampleRate;
  const startSample = Math.floor(startTime * sampleRate);
  const endSample = Math.floor(endTime * sampleRate);
  
  const trimmedBuffer = audioContext.createBuffer(
    originalBuffer.numberOfChannels,
    endSample - startSample,
    sampleRate
  );
  
  // Copy trimmed audio data
  for (let channel = 0; channel < originalBuffer.numberOfChannels; channel++) {
    const originalData = originalBuffer.getChannelData(channel);
    const trimmedData = trimmedBuffer.getChannelData(channel);
    
    for (let i = 0; i < trimmedData.length; i++) {
      trimmedData[i] = originalData[startSample + i];
    }
  }
  
  return trimmedBuffer;
};
```

### Volume Normalization
Automatically normalize audio levels:

```javascript
const normalizeAudio = (audioBuffer) => {
  let maxValue = 0;
  
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const data = audioBuffer.getChannelData(channel);
    for (let i = 0; i < data.length; i++) {
      maxValue = Math.max(maxValue, Math.abs(data[i]));
    }
  }
  
  const normalizedBuffer = audioContext.createBuffer(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
    audioBuffer.sampleRate
  );
  
  const scaleFactor = 0.95 / maxValue;
  
  for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
    const originalData = audioBuffer.getChannelData(channel);
    const normalizedData = normalizedBuffer.getChannelData(channel);
    
    for (let i = 0; i < originalData.length; i++) {
      normalizedData[i] = originalData[i] * scaleFactor;
    }
  }
  
  return normalizedBuffer;
};
```

## Performance Considerations

- Lazy loading of audio data
- Audio buffer caching
- Efficient waveform rendering
- Background audio processing

## Accessibility

- Keyboard controls for playback
- Screen reader sound descriptions
- Visual indicators for audio playback
- Alternative text for waveforms

## Testing

```javascript
describe('SoundTab', () => {
  it('should display sounds for current sprite', () => {
    const sounds = [mockSound1, mockSound2];
    const wrapper = mount(
      <SoundTab sounds={sounds} selectedSoundId="sound1" />
    );
    expect(wrapper.find('SoundListItem')).toHaveLength(2);
  });

  it('should play sound when play button clicked', () => {
    const onPlaySound = jest.fn();
    const wrapper = mount(
      <SoundTab sounds={[mockSound1]} onPlaySound={onPlaySound} />
    );
    wrapper.find('.play-button').first().simulate('click');
    expect(onPlaySound).toHaveBeenCalledWith('sound1');
  });
});
```

## MistWarp Enhancements

### Enhanced Sound Library
- Expanded collection of built-in sounds
- High-quality audio samples
- Categorized sound organization

### Advanced Recording
- Multiple input device support
- Real-time audio monitoring
- Automatic noise reduction

## Related Components

- [Costume Tab](costume-tab)
- [Sprite Selector](sprite-selector)
- [Container Architecture](../containers/overview)

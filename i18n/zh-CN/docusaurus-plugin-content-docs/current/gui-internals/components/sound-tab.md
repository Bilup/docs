---
title: 声音标签页组件
sidebar_position: 6
---

# 声音管理组件

Bilup 中的声音管理系统由容器和组件组成，用于处理角色和舞台的音频资源。

## 概述

声音管理系统使用户能够：
- 查看和管理当前角色/舞台的声音
- 从库中添加声音或上传音频文件
- 使用麦克风录制新声音
- 编辑声音属性和播放设置

## 容器架构

```
SoundTab (Container)
  └── AssetPanel (Component)
      ├── Selector (用于声音列表)
      │   └── SortableAsset (用于每个声音)
      ├── ActionMenu (添加/录制/上传)
      └── SoundEditor (编辑时)
          ├── AddSound
          ├── UploadSound
          └── RecordSound
      └── SoundEditor (编辑时)
```

## 主要功能

### 声音管理
- 显示声音波形和名称
- 播放/暂停声音预览
- 通过拖放重新排序声音
- 删除和复制声音
- 修剪声音长度

### 音频格式支持
Bilup 支持多种音频格式：
- **WAV**：无压缩音频(最高质量)
- **MP3**：压缩音频(文件更小)
- **OGG**：开源压缩格式
- **M4A**：Apple 压缩格式

## Props 接口

```typescript
interface SoundTabProps {
  sounds: Array<SoundData>;
  selectedSoundId: string;
  onSelectSound: (soundId: string) => void;
  onNewSound: () => void;
  onDeleteSound: (soundId: string) => void;
  onPlaySound: (soundId: string) => void;
  onStopSound: () => void;
  vm: VirtualMachine;
}
```

## 状态管理

连接到 Redux 以获取声音状态：

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
  // ... 其他操作
});
```

## 声音操作

### 添加声音

添加声音有多种方法：

1. **从库中添加**：从内置声音集合中选择
2. **上传**：从计算机加载音频文件
3. **录制**：使用麦克风捕获音频
4. **生成**：创建简单的音调和效果

### 录制界面

Bilup 包含内置的声音录制器：

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

## 音频引擎集成

### Web Audio API
Bilup 使用 Web Audio API 进行音频处理：

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

### 声音效果
内置音频效果：
- **音调**：调整声音频率
- **回声**：添加混响
- **机器人**：机器人语音效果
- **音量控制**：增大/减小音量

## 波形可视化

声音以可视化波形显示：

```javascript
const WaveformVisualization = ({ soundData }) => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current && soundData.audioBuffer) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const audioBuffer = soundData.audioBuffer;
      
      // 绘制波形
      drawWaveform(ctx, audioBuffer, canvas.width, canvas.height);
    }
  }, [soundData]);
  
  return <canvas ref={canvasRef} width={200} height={50} />;
};
```

## 声音编辑功能

### 修剪
用户可以将声音修剪到特定长度：

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
  
  // 复制修剪后的音频数据
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

### 音量归一化
自动归一化音频电平：

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

## 性能考虑

- 音频数据懒加载
- 音频缓冲区缓存
- 高效的波形渲染
- 后台音频处理

## 可访问性

- 播放的键盘控制
- 屏幕阅读器声音描述
- 音频播放的视觉指示器
- 波形的替代文本

## 测试

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

## Bilup 增强功能

### 增强的声音库
- 扩展的内置声音集合
- 高质量音频样本
- 分类声音组织

### 高级录制
- 多输入设备支持
- 实时音频监控
- 自动降噪

## 相关组件

- [造型选项卡](costume-tab)
- [角色选择器](sprite-selector)
- [容器架构](../containers/overview)
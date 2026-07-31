---
title: Music
sidebar_position: 5
---

# Music

The **Music** extension plays instrument notes and drum sounds using a built-in synthesised sound set. It is built in, works offline, and is compatible with Scratch. It is the same Music extension found in Scratch.

Load it from **Add Extension** and choose **Music**.

## Blocks

### play drum `[drum]` for `[beats]` beats

```scratch
play drum (1) v) for (0.25) beats
```

Plays one of 18 percussion sounds (Snare Drum, Bass Drum, Side Stick, Crash Cymbal, Open and Closed Hi-Hat, Tambourine, Hand Clap, Claves, Wood Block, Cowbell, Triangle, Bongo, Conga, Cabasa, Guiro, Vibraslap, Cuica) for the given number of beats, then continues.

### rest for `[beats]` beats

```scratch
rest for (0.25) beats
```

Waits for the given number of beats without playing anything.

### play note `[note]` for `[beats]` beats

```scratch
play note (60) for (0.25) beats
```

Plays a note (as a MIDI note number, chosen with the piano-key picker) on the current instrument for the given number of beats.

### set instrument to `[instrument]`

```scratch
set instrument to (1) v)
```

Chooses the instrument used by *play note* for this sprite. There are 21 instruments, including Piano, Electric Piano, Organ, Guitar, Electric Guitar, Bass, Pizzicato, Cello, Trombone, Clarinet, Saxophone, Flute, Wooden Flute, Bassoon, Choir, Vibraphone, Music Box, Steel Drum, Marimba, Synth Lead, and Synth Pad.

### set tempo to `[tempo]`

```scratch
set tempo to (60)
```

Sets the tempo in beats per minute. Higher tempo means notes and drums play faster.

### change tempo by `[tempo]`

```scratch
change tempo by (20)
```

Adds to the current tempo.

### tempo

```scratch
(tempo)
```

Reporter for the current tempo in beats per minute.

## Tips

- A "beat" is defined by the tempo, so the same *for beats* value plays for different real-time lengths depending on the tempo.
- Instrument and tempo are per-sprite, so different sprites can play different instruments at the same time.
- No internet or hardware is needed. All sounds are generated locally.

## See also

- [Sound blocks](/blocks/sound)
- [Extensions Overview](/extensions/overview)

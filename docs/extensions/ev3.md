---
title: LEGO MINDSTORMS EV3
sidebar_position: 13
---

# LEGO MINDSTORMS EV3

The **LEGO MINDSTORMS EV3** extension drives motors and reads sensors on a LEGO MINDSTORMS EV3 brick. It is built in and compatible with Scratch.

Load it from **Add Extension** and choose **LEGO MINDSTORMS EV3**.

## Requirements

The EV3 connects over Bluetooth, so you need:

- A computer with Bluetooth and a supported browser.
- **Scratch Link** running to bridge Bluetooth to the browser.
- The EV3 brick paired with your computer.

Adding the extension opens a connection window to pair the brick. Motors and sensors are addressed by the port they are plugged into.

## Blocks

### motor `[port]` turn this way for `[time]` seconds

Runs the motor on the given port in one direction for a number of seconds.

### motor `[port]` turn that way for `[time]` seconds

Runs the motor in the opposite direction for a number of seconds.

### motor `[port]` set power `[power]` %

Sets how hard a motor drives, from 0 to 100 percent.

### motor `[port]` position

A reporter for the motor's current rotation position.

### when button `[port]` pressed

A hat block that runs when a touch sensor on the given port is pressed.

### when distance < `[distance]` / when brightness < `[distance]`

Hat blocks that run when the distance or light sensor reading falls below a value.

### button `[port]` pressed?

A boolean for whether a touch sensor is currently pressed.

### distance / brightness

Reporters for the current distance and light sensor readings.

### beep note `[note]` for `[time]` secs

Plays a tone on the brick's speaker.

## See also

- [Extensions overview](/extensions/overview)

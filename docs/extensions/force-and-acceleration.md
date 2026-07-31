---
title: Go Direct Force and Acceleration
sidebar_position: 16
---

# Go Direct Force and Acceleration

The **Go Direct Force and Acceleration** extension reads a Vernier Go Direct Force and Acceleration sensor, which measures push and pull force, acceleration, spin, and orientation. It is built in and compatible with Scratch.

Load it from **Add Extension** and choose **Go Direct Force and Acceleration**.

## Requirements

The sensor connects over Bluetooth, so you need:

- A computer with Bluetooth and a supported browser.
- **Scratch Link** running to bridge Bluetooth to the browser.
- The Go Direct sensor paired with your computer.

Adding the extension opens a connection window to pair the sensor.

## Blocks

### when `[gesture]`

A hat block that runs on a gesture such as **pushed**, **pulled**, **shaken**, **started falling**, or turned face up or down.

### when force sensor `[push or pull]`

A hat block that runs when the sensor is pushed or pulled.

### force

A reporter for the current force reading.

### when tilted `[direction]` / tilted `[direction]`? / tilt angle `[direction]`

React to tilting the sensor, check its tilt as a boolean, or read the tilt angle.

### falling?

A boolean that reports whether the sensor is in free fall.

### spin speed `[direction]`

A reporter for how fast the sensor is rotating around an axis.

### acceleration `[direction]`

A reporter for acceleration along an axis.

## See also

- [Extensions overview](/extensions/overview)

---
title: Pen
sidebar_position: 6
---

# Pen

The **Pen** extension lets sprites draw on the stage. A sprite leaves a trail as it moves, stamps its costume, or prints text. It is built in, works offline, and is compatible with Scratch. MistWarp adds a few extra pen blocks on top of the Scratch set (triangle drawing and text printing).

Load it from **Add Extension** and choose **Pen**.

:::note
When the Stage is selected, the palette shows fewer pen blocks, because some pen actions only make sense for a movable sprite.
:::

## Drawing blocks

### erase all

```scratch
erase all
```

Clears everything drawn or stamped by the pen from the stage.

### stamp

```scratch
stamp
```

Draws a copy of the sprite's current costume onto the stage at its position.

### pen down / pen up

```scratch
pen down
pen up
```

*pen down* starts leaving a trail as the sprite moves. *pen up* stops it.

## Color and size

### set pen color to `[color]`

```scratch
set pen color to [#ff0000]
```

Sets the pen color using the color picker.

### change pen `[param]` by `[value]` / set pen `[param]` to `[value]`

```scratch
change pen (color v) by (10)
set pen (brightness v) to (50)
```

Adjust one component of the pen color. The dropdown offers **color** (hue), **saturation**, **brightness**, and **transparency**.

### change pen size by `[size]` / set pen size to `[size]`

```scratch
change pen size by (1)
set pen size to (10)
```

Controls the thickness of the pen line.

### Legacy shade and hue blocks

```scratch
set pen shade to (50)
change pen shade by (10)
set pen color to (0)
change pen color by (10)
```

These older *shade* and numeric *hue* blocks are kept for compatibility with projects made before the newer color-parameter blocks existed. Prefer the *set pen color* and *set pen ... to* blocks in new projects.

## Extra drawing blocks (MistWarp)

### draw triangle between `[x0] [y0]`, `[x1] [y1]` and `[x2] [y2]`

```scratch
draw triangle between (0) (0), (50) (0) and (25) (50)
```

Draws (and fills) a triangle between three stage coordinates using the current pen color.

### Printing text

```scratch
set print font to [Sans Serif v]
set print font size to (20)
set print font color to [#000000]
set print font stroke color to [#ffffff]
set print font stroke width to (0)
set print font weight to (400)
set print font italic (off v)
print [Hello] at x: (0) y: (0)
```

These blocks configure a font and then draw text onto the stage at a given position. The stroke settings add an outline around the text, and *weight* controls boldness.

## Tips

- Pen drawings live on the stage's pen layer, separate from the sprites. *erase all* is the only way to clear them (besides redrawing).
- For crisp lines at high resolution, enable the High Quality Pen addon. See [High Quality Pen](/advanced/high-quality-pen).

## See also

- [High Quality Pen](/advanced/high-quality-pen)
- [Extensions Overview](/extensions/overview)

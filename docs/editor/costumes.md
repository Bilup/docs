---
title: Costumes and the paint editor
sidebar_position: 5
---

Every sprite has one or more **costumes**: the images it shows on the [stage](/editor/stage). The stage itself has **backdrops**, which are the same thing under a different name. The **Costumes** tab (called **Backdrops** when the stage is selected) lists them and opens the built-in paint editor for drawing and editing.

## The costume list

The costume list runs down the left of the Costumes tab. Each entry shows a thumbnail, the costume name, and its size in stage units. Click a costume to select it and show it on the stage; the sprite's current costume is the one highlighted.

Right-click a costume for **duplicate**, **export** (saves the image to your computer as `.svg` or `.png`), and **delete**. You cannot delete the last remaining costume of a sprite. Drag costumes to reorder them; the order is what the `next costume` block steps through.

## Adding a costume

The round add button at the bottom of the list offers:

- **Choose a Costume** / **Choose a Backdrop**: pick from the built-in library.
- **Upload Costume** / **Upload Backdrop**: load an image from your computer. Accepted types are `.svg`, `.png`, `.bmp`, `.jpg`, `.jpeg`, `.jfif`, `.webp`, and `.gif`. You can select several files at once, and each becomes a costume.
- **Surprise**: add a random costume from the library.
- **Paint**: create a blank costume and start drawing.
- **Search**: browse the library by name.

You can also drag costumes in from the [backpack](/editor/backpack).

## Bitmap and vector

The paint editor works in two modes, and every costume is one or the other:

- **Vector** costumes are made of shapes (paths, ovals, rectangles, text). They stay crisp at any size and are the default for new costumes. Scratch's own art is vector.
- **Bitmap** costumes are a grid of pixels, like a photo or a `.png`. They are right for pixel art and imported photos, but they blur when scaled up.

A button at the bottom of the canvas switches between them: **Convert to Bitmap** or **Convert to Vector**. Converting rasterises or traces the artwork, so a round trip is not always lossless.

## Vector tools

When a vector costume is open, the tools down the left of the canvas are:

- **Select**: move, resize, rotate, and group shapes.
- **Reshape**: drag the individual points and curve handles of a path.
- **Brush** and **Line**: draw freehand strokes and straight lines.
- **Eraser**: rub out parts of shapes.
- **Fill**: flood an area with a colour or gradient.
- **Text**: add editable text.
- **Circle** and **Rectangle** (including a rounded rectangle): draw filled or outlined shapes.

Across the top are the fill and outline colour pickers (each supporting a solid colour or a gradient), the stroke width, and actions to group/ungroup, bring shapes forward or back, flip horizontally or vertically, and copy/paste.

## Bitmap tools

When a bitmap costume is open the toolset changes to pixel equivalents: **Brush**, **Line**, **Circle**, **Rectangle**, **Text**, **Fill** (paint bucket), **Eraser**, and **Select**. Fill supports solid colours and gradients here too.

## The costume canvas

- The crosshair in the centre of the canvas marks the sprite's **rotation centre**, the point it rotates around and the point placed at its `x`/`y` position. Drag it, or use the centring control, to change how the costume pivots.
- **Zoom** controls sit at the bottom-right corner of the canvas.
- **Undo** and **Redo** are at the top of the editor, and the usual `Ctrl+Z` / `Ctrl+Shift+Z` shortcuts work while the canvas is focused.

## See also

- [Sprites](/editor/sprites)
- [Sounds](/editor/sounds)
- [Looks blocks](/blocks/looks) for switching and changing costumes at runtime
- [The backpack](/editor/backpack)

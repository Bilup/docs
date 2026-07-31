---
title: Utilities
sidebar_position: 9
---

`scratch-vm/src/util/` holds small helper modules the engine uses everywhere. Extension authors
most often need `Cast`; the rest are handy when you work with the VM directly. `Cast` is exposed
to extensions as `Scratch.Cast` (see the [Extension API](/api-reference/extension-api)).

## Cast

`util/cast.js` converts values the way Scratch blocks do. Scratch is loosely typed, so a block
that expects a number must accept `"5"`, `true`, or `"apple"` and behave predictably. Always
coerce inputs with `Cast` rather than raw JavaScript conversions, so your blocks match Scratch's
rules exactly.

- `Cast.toNumber(value)`: to a number, treating non-numeric input as `0` (and `NaN` as `0`).
- `Cast.toBoolean(value)`: to a boolean using Scratch's rules (the strings `""`, `"0"`, and
  `"false"` are false).
- `Cast.toString(value)`: to a string.
- `Cast.compare(v1, v2)`: Scratch's comparison. Returns a negative number, `0`, or a positive
  number, comparing numerically when both look like numbers and case-insensitively otherwise.
- `Cast.toListIndex(index, length, acceptAll)`: turn a Scratch list index (including `"last"`,
  `"random"`, `"all"`) into a real index, or an out-of-range marker.
- `Cast.toRgbColorList(value)` / `Cast.toRgbColorObject(value)`: parse a color (a `#rrggbb` string
  or a decimal) into `[r, g, b]` or `{r, g, b, a}`.
- `Cast.isInt(value)`: whether the value is an integer (or an integer-valued string).
- `Cast.isWhiteSpace(value)`: whether the value is `null`, empty, or only whitespace.

## Color

`util/color.js` converts between color representations. Values are `{r, g, b}` objects (0 to 255),
`#rrggbb` hex strings, HSV objects (`{h, s, v}`), or 24-bit decimals.

`Color.decimalToHex`, `Color.decimalToRgb`, `Color.hexToRgb`, `Color.rgbToHex`,
`Color.rgbToDecimal`, `Color.hexToDecimal`, `Color.hsvToRgb`, `Color.rgbToHsv`, and
`Color.mixRgb(rgb0, rgb1, fraction1)` to blend two colors.

## MathUtil

`util/math-util.js`:

- `MathUtil.degToRad(deg)` / `MathUtil.radToDeg(rad)`.
- `MathUtil.clamp(n, min, max)`: constrain to a range.
- `MathUtil.wrapClamp(n, min, max)`: wrap around a range (like direction).
- `MathUtil.tan(angle)`: tangent in degrees, returning `Infinity` at the poles instead of a huge
  float.
- `MathUtil.scale(i, iMin, iMax, oMin, oMax)`: remap a number from one range to another.
- `MathUtil.inclusiveRandIntWithout(lower, upper, excluded)`: a random integer in a range, skipping
  one value.

## Other helpers

- `util/string-util.js` (`StringUtil`): string helpers, including `StringUtil.unusedName(name,
  existing)` for de-duplicating names.
- `util/uid.js`: generate unique IDs for blocks, variables, and targets.
- `util/base64-util.js` (`Base64Util`): convert between base64 and byte arrays for assets.
- `util/timer.js` (`Timer`): the millisecond timer the sequencer and blocks use.
- `util/clone.js` (`Clone`): shallow/deep copy helpers.
- `util/log.js`: the VM's logger.

## See also

- [Extension API](/api-reference/extension-api) for `Scratch.Cast`
- [VM API](/api-reference/vm-api)
- [Block registration](/api-reference/block-registration)

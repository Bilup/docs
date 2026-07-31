---
title: Operators blocks
sidebar_position: 8
---

Operators do maths, compare values, combine logic, and manipulate text. They are all reporters or booleans, so they plug into the slots of other blocks rather than standing on their own.

## Maths

- **`( )` + `( )`**, **`-`**, **`*`**, **`/`** are addition, subtraction, multiplication, and division.
- **pick random `1` to `10`** returns a random number in the range. If both inputs are whole numbers it returns an integer, otherwise a decimal.
- **`( )` mod `( )`** returns the remainder (using floored division, so the result matches the sign of the divisor).
- **round `( )`** rounds to the nearest whole number.
- **`abs` / `floor` / `ceiling` / `sqrt` / `sin` / `cos` / `tan` / `asin` / `acos` / `atan` / `ln` / `log` / `e ^` / `10 ^` of `( )`** applies a maths function chosen from the menu.

## Comparison and logic

- **`( )` < `( )`**, **`( )` = `( )`**, **`( )` > `( )`** compare two values.
- **`< >` and `< >`**, **`< >` or `< >`** combine two booleans.
- **not `< >`** inverts a boolean.

## Text

- **join `apple` `banana`** joins two values into one string.
- **letter `1` of `apple`** returns a single character by position.
- **length of `apple`** returns the number of characters.
- **`apple` contains `a` ?** reports whether the text contains a substring (case-insensitive).

## MistWarp and TurboWarp extras

These operators are not in stock Scratch:

- **letters `1` to `3` of `apple`** returns a substring between two positions.
- **`item` in `apple`** (`index_of`) returns the position of a substring, or 0 if not found (case-insensitive).
- **replace `a` with `-` in `apple`** replaces every occurrence of a substring (case-insensitive).
- **`ab` repeated `3` times** repeats a string a number of times.
- **`upper` / `lower` case of `Apple`** changes the case of text.
- **trim `  apple  `** removes leading and trailing whitespace.
- **clamp `5` between `0` and `10`** limits a number to a range.
- **min of `( )` and `( )`** / **max of `( )` and `( )`** return the smaller or larger value (these accept more than two operands).
- **pi** reports the constant 3.14159..., handy for circle maths.
- **newline** reports a line-break character, for building multi-line strings.

See [MistWarp extras](/blocks/mistwarp-extras) for the full list.

## See also

- [Variables and lists](/blocks/variables)
- [Sensing blocks](/blocks/sensing)
- [MistWarp extras](/blocks/mistwarp-extras)

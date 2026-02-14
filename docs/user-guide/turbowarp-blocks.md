---
title: TurboWarp Blocks
sidebar_position: 9
---

# TurboWarp Blocks

MistWarp includes all the enhanced blocks from TurboWarp, providing additional functionality beyond standard Scratch blocks. These blocks enable more powerful programming capabilities and better performance.

## Sensing Blocks

### Advanced Mouse Blocks

#### Mouse X/Y on Sprite
Get mouse coordinates relative to a specific sprite:
```scratch
(mouse x on [Sprite1 v])
(mouse y on [Sprite1 v])
```

#### Mouse Down Detection
Check if mouse button is currently pressed:
```scratch
<mouse down?>
```

### Key Detection Enhancements

#### Any Key Pressed
Detect if any key is currently pressed:
```scratch
<any key pressed?>
```

#### Key Pressed Block
More flexible key detection:
```scratch
<key [space v] pressed?>
<key [any v] pressed?>
```

### Stage Sensing

#### Stage Width/Height
Get current stage dimensions:
```scratch
(stage width)
(stage height)
```

#### Sprite Touch Detection
Check if sprites are touching specific points:
```scratch
<touching x: (100) y: (50)?>
```

## Motion Blocks

### Advanced Movement

#### Move to Random Position
Move to a random position on stage:
```scratch
go to [random position v]
```

#### Move Steps in Direction
Move a specific distance in any direction:
```scratch
move (10) steps in direction (45)
```

### Rotation Enhancements

#### Turn to Face Position
Turn to face specific coordinates:
```scratch
point towards x: (100) y: (50)
```

#### Set Rotation Style Advanced
More rotation style options:
```scratch
set rotation style [all around v]
set rotation style [left-right v]
set rotation style [don't rotate v]
set rotation style [all around (smooth) v] // TurboWarp extension
```

## Looks Blocks

### Costume Management

#### Costume Number by Name
Get costume number by name:
```scratch
(costume [costume1 v])
```

#### Backdrop Management
Enhanced backdrop control:
```scratch
switch backdrop to [backdrop1 v] and wait
```

### Visual Effects

#### Set Effect to Value
More precise effect control:
```scratch
set [ghost v] effect to (50)
set [brightness v] effect to (25)
set [color v] effect to (15)
```

#### Clear Individual Effects
Clear specific effects instead of all:
```scratch
clear [ghost v] effect
```

## Sound Blocks

### Audio Control

#### Set Volume Precisely
More precise volume control:
```scratch
set volume to (75) %
```

#### Sound Information
Get information about sounds:
```scratch
(sound [meow v] duration)
(sound [meow v] length)
```

## Control Blocks

### Advanced Loops

#### Repeat Until
Loop until a condition becomes true:
```scratch
repeat until <(timer) > (10)>
  // Code here
end
```

#### For Loop
Traditional for loop structure:
```scratch
for [i v] from (1) to (10)
  say (i) for (0.5) seconds
end
```

### Conditional Enhancements

#### Multiple Conditions
More complex conditional logic:
```scratch
if <<(score) > (100)> and <(lives) > (0)>> then
  // Code here
end
```

## Variable Blocks

### List Enhancements

#### List Operations
Advanced list manipulation:
```scratch
(item (random v) of [my list v])
(length of [my list v])
<[my list v] contains [apple]?>
```

#### List Transformations
Transform list data:
```scratch
set [my list v] to (join [my list v] [other list v])
```

### Variable Operations

#### Mathematical Operations
Perform complex calculations:
```scratch
set [result v] to ((x) + (y))
set [result v] to (sqrt of (number))
set [result v] to (abs of (number))
```

## Operators

### Mathematical Functions

#### Advanced Math
Additional mathematical operations:
```scratch
(sqrt of (9))        // Square root: 3
(abs of (-5))        // Absolute value: 5
(ln of (2.718))      // Natural logarithm
(log of (100))       // Base-10 logarithm
(e ^ (2))           // e to the power
(10 ^ (3))          // 10 to the power
```

#### Trigonometric Functions
```scratch
(sin of (90))        // Sine
(cos of (0))         // Cosine
(tan of (45))        // Tangent
(asin of (1))        // Arcsine
(acos of (0))        // Arccosine
(atan of (1))        // Arctangent
```

### Text Operations

#### Advanced String Functions
```scratch
(letters (1) to (5) of [hello world])    // Substring: "hello"
(item (1) of (split [a,b,c] by [,]))     // Split string: "a"
<[hello] contains [ell]?>                 // Contains check: true
```

#### Regular Expressions
```scratch
<[hello123] matches [^[a-z]+[0-9]+$]?>   // Regex matching
(replace [hello world] with [hi] for [hello])  // Replace text
```

### Comparison Operators

#### String Comparison
```scratch
<[apple] < [banana]?>    // Alphabetical comparison
<[10] = [10]?>           // String equality
```

#### Number Comparison
```scratch
<(x) ≈ (y)?>            // Approximately equal
<(x) ≠ (y)?>            // Not equal
```

## Data Structures

### Dictionaries/Objects
Work with key-value pairs:
```scratch
set [data v] to {key: "value", number: 42}
set [value v] to (get [key] from [data v])
set [data v] to (set [newKey] to [newValue] in [data v])
```

### JSON Operations
Handle JSON data:
```scratch
set [json v] to ({"name": "Alice", "score": 100})
set [name v] to (get [name] from json [json v])
set [json v] to (set [score] to (200) in json [json v])
```

## Performance Blocks

### Compilation Hints

#### Warp Mode
Faster execution for specific scripts:
```scratch
run without screen refresh [
  repeat (1000)
    change [x v] by (1)
  end
] // Runs at maximum speed
```

#### Atomic Operations
Ensure operations complete without interruption:
```scratch
atomic [
  set [x v] to (100)
  set [y v] to (200)
] // Both operations complete together
```

## Debugging Blocks

### Console Output
Output debug information:
```scratch
log [Debug message] to console
log [Variable value:] (score) to console
```

### Breakpoints
Pause execution for debugging:
```scratch
breakpoint // Pauses execution here
```

### Performance Monitoring
Monitor script performance:
```scratch
start timer [operation]
// Code to measure
log timer [operation] to console
```

## Custom Block Enhancements

### Parameter Types
Define custom blocks with specific parameter types:
```scratch
define move sprite [SPRITE] to x: [X] y: [Y]
// SPRITE parameter accepts sprite names
// X and Y parameters accept numbers
```

### Return Values
Custom blocks can return values:
```scratch
define calculate distance from [X1] [Y1] to [X2] [Y2]
set [result v] to (sqrt of (((X2) - (X1)) * ((X2) - (X1)) + ((Y2) - (Y1)) * ((Y2) - (Y1))))
return (result)
```

## Block Limitations

### Compatibility Notes
- Some TurboWarp blocks may not work in standard Scratch
- Export to Scratch may lose TurboWarp-specific functionality
- Test projects in both environments if compatibility is needed

### Performance Considerations
- Advanced blocks may use more CPU/memory
- Some operations are optimized for TurboWarp's compiler
- Monitor performance with complex operations

## Migration from Scratch

### Converting Projects
When loading Scratch projects in MistWarp:
1. All standard blocks work unchanged
2. Additional TurboWarp blocks become available
3. Performance may improve automatically
4. Consider upgrading to TurboWarp-specific blocks for better performance

### Best Practices
- Use TurboWarp blocks for performance-critical code
- Keep standard Scratch blocks for compatibility
- Test thoroughly when using advanced features
- Document TurboWarp-specific functionality

TurboWarp blocks in MistWarp provide significant enhancements over standard Scratch, enabling more sophisticated programming and better performance. Use these blocks to create more powerful and efficient projects!

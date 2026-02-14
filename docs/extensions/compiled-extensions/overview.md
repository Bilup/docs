---
slug: /development/compiled-extensions/
title: Compiled Extensions Overview
sidebar_position: 1
---

# Compiled Extensions

Compiled extensions are advanced Scratch extensions that integrate directly with MistWarp's JavaScript compiler to provide optimized performance. Unlike regular extensions that run through the VM interpreter, compiled extensions inject their code directly into the compiled output, enabling native JavaScript performance.

## What Are Compiled Extensions?

Compiled extensions modify MistWarp's internal compilation process by patching the compiler's code generation phases. When a project uses a compiled extension, the extension's blocks are transformed into optimized JavaScript code that runs at native speed rather than through Scratch's virtual machine.

## Key Differences from Regular Extensions

### Regular Extensions
- Run through Scratch's VM interpreter
- Each block call goes through multiple abstraction layers
- Slower execution due to runtime interpretation
- Easier to develop and debug
- Compatible with all Scratch environments

### Compiled Extensions
- Generate direct JavaScript code during compilation
- Bypass VM interpretation entirely
- Near-native JavaScript performance
- More complex development process
- Only work in environments with compilation support (like MistWarp)

## How Compilation Works

When MistWarp compiles a project, it goes through several phases:

1. **Script Tree Generation**: Converts block structures into an intermediate representation
2. **IR Generation**: Transforms the tree into an intermediate representation (IR)
3. **JavaScript Generation**: Converts IR into executable JavaScript code

Compiled extensions hook into these phases using a patching system to inject custom behavior at each stage.

## Performance Benefits

Compiled extensions can be dramatically faster than regular extensions. For example:

- **Regular Math Extension**: Each mathematical operation requires VM calls, type checking, and interpretation overhead
- **Compiled Math Extension**: Generates direct JavaScript like `Math.pow(a, b)` with minimal overhead

This difference becomes especially pronounced in loops or performance-critical code where operations might be called thousands of times per frame.

## Requirements for Development

Creating compiled extensions requires:

1. **Deep JavaScript Knowledge**: Understanding of advanced JavaScript concepts, closures, and code generation
2. **MistWarp Internals Understanding**: Familiarity with the compiler architecture and internal APIs
3. **Unsandboxed Environment**: Extensions must run unsandboxed to access compiler internals
4. **Testing Infrastructure**: Proper testing setups since debugging is more complex

## When to Use Compiled Extensions

Consider compiled extensions when:

- **Performance is Critical**: Mathematical calculations, data processing, or real-time operations
- **Heavy Computation**: Operations that run frequently in tight loops
- **Native JavaScript Features**: Accessing JavaScript features not available through regular extension APIs
- **Optimization Requirements**: When VM overhead significantly impacts user experience

Avoid compiled extensions when:
- Simple functionality that doesn't require optimization
- Prototyping or experimental features
- Compatibility with other Scratch environments is important
- Development time and complexity outweigh performance benefits

## Architecture Overview

Compiled extensions work by patching three main compiler components:

### JSGenerator
Handles the final JavaScript code generation phase. Extensions define how their blocks should be converted into JavaScript code.

### IRGenerator  
Manages the intermediate representation phase, where block logic is translated into a structured format before JavaScript generation.

### ScriptTreeGenerator
Processes the initial block tree structure, identifying extension blocks and preparing them for compilation.

## Safety and Limitations

Compiled extensions have significant power but also limitations:

### Capabilities
- Direct JavaScript code injection
- Access to browser APIs and features
- Performance optimization opportunities
- Custom compilation behavior

### Limitations
- Only work in compilation environments
- More complex debugging process
- Potential security implications with code injection
- Compatibility limited to specific MistWarp versions

## Getting Started

To begin developing compiled extensions, you should:

1. Understand regular Scratch extension development first
2. Learn MistWarp's internal architecture and APIs
3. Study existing compiled extensions like Mist's Utils
4. Set up a proper development and testing environment
5. Start with simple blocks before attempting complex functionality

The following sections will guide you through the technical details of creating your own compiled extensions, from basic setup to advanced optimization techniques.

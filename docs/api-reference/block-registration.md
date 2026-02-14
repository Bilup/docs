# Block Registration API

This guide explains how to add new blocks to Scratch's built-in block palette.

## Overview

Adding new blocks to Scratch involves several components working together:

1. **Block Definitions** (scratch-blocks) - Define the visual appearance and structure
2. **Block Implementation** (scratch-vm) - Define the runtime behavior 
3. **Compiler Support** (scratch-vm) - Support for compiled mode
4. **Palette Registration** (scratch-gui) - Make blocks visible in the toolbox
5. **Localization** (scratch-blocks) - Text strings for different languages

## Step 1: Define Block Structure (scratch-blocks)

Block definitions determine how blocks look and behave in the editor. They need to be added to both vertical and horizontal layout files.

### Vertical Layout
File: `scratch-blocks/blocks_vertical/control.js`

```javascript
Blockly.Blocks['control_switch'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONTROL_SWITCH,
      "message1": "%1", // Statement
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
  }
};
```

### Horizontal Layout
File: `scratch-blocks/blocks_horizontal/control.js`

The horizontal layout includes additional styling for icons and layout:

```javascript
Blockly.Blocks['control_switch'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONTROL_SWITCH,
      "message1": "%1",
      "message2": "%1", // Icon
      "lastDummyAlign2": "RIGHT",
      "args0": [
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "args1": [
        {
          "type": "input_statement",
          "name": "SUBSTACK"
        }
      ],
      "args2": [
        {
          "type": "field_image",
          "src": Blockly.mainWorkspace.options.pathToMedia + "repeat.svg",
          "width": 24,
          "height": 24,
          "alt": "*",
          "flip_rtl": true
        }
      ],
      "category": Blockly.Categories.control,
      "extensions": ["colours_control", "shape_statement"]
    });
  }
};
```

## Step 2: Implement Block Behavior (scratch-vm)

Block runtime behavior is implemented in scratch-vm's block packages.

### Register Block Primitives
File: `scratch-vm/src/blocks/scratch3_control.js`

```javascript
getPrimitives() {
    return {
        // ... existing blocks
        control_switch: this.switch,
        control_case: this.case,
        control_default: this.default,
        control_break: this.break
    };
}
```

### Implement Block Methods

```javascript
switch(args, util) {
    // Get the switch value
    const switchValue = args.VALUE;
    
    // Store in stack frame for case blocks to access
    if (!util.stackFrame.switchValue) {
        util.stackFrame.switchValue = switchValue;
        util.stackFrame.switchMatched = false;
        util.stackFrame.isBreakable = true;
    }
    
    // Execute the substack containing case blocks
    util.startBranch(1, false);
}

case(args, util) {
    const caseValue = args.VALUE;
    const stackFrame = util.stackFrame;
    
    // Find the parent switch frame
    const parentFrame = this.getParentSwitchFrame(util.thread);
    if (!parentFrame) return;
    
    // Check if this case matches the switch value
    if (parentFrame.switchValue === caseValue || parentFrame.switchMatched) {
        parentFrame.switchMatched = true;
        util.startBranch(1, false);
    }
}

break(args, util) {
    // Find the nearest breakable frame and exit
    const thread = util.thread;
    for (let i = thread.stackFrames.length - 1; i >= 0; i--) {
        const frame = thread.stackFrames[i];
        if (frame.isBreakable || frame.isLoop) {
            // Clear the stack back to this frame
            thread.stackFrames.length = i;
            return;
        }
    }
}
```

## Step 3: Add Compiler Support

For blocks to work in compiled mode, add support to the compiler's intermediate representation (IR) and JavaScript generators.

### IR Generation
File: `scratch-vm/src/compiler/irgen.js`

```javascript
case 'control_switch':
    return {
        kind: 'control.switch',
        value: this.descendInput(block, 'VALUE'),
        stack: this.descendSubstack(block, 'SUBSTACK')
    };

case 'control_case':
    return {
        kind: 'control.case', 
        value: this.descendInput(block, 'VALUE'),
        stack: this.descendSubstack(block, 'SUBSTACK')
    };

case 'control_break':
    return {
        kind: 'control.break'
    };
```

### JavaScript Generation
File: `scratch-vm/src/compiler/jsgen.js`

```javascript
case 'control.switch': {
    const switchValue = this.localVariables.next();
    this.source += `var ${switchValue} = ${this.descendInput(node.value).asUnknown()};\n`;
    this.source += `switch (${switchValue}) {\n`;
    
    const switchFrame = new Frame(false);
    switchFrame.isBreakable = true;
    
    this.descendStack(node.stack, switchFrame);
    this.source += `}\n`;
    break;
}

case 'control.case': {
    this.source += `case ${this.descendInput(node.value).asUnknown()}: {\n`;
    
    const caseFrame = new Frame(false);
    caseFrame.isBreakable = true;
    
    this.descendStack(node.stack, caseFrame);
    this.source += `}\n`;
    break;
}

case 'control.break': {
    let foundBreakable = false;
    for (let i = this.frames.length - 1; i >= 0; i--) {
        const frame = this.frames[i];
        if (frame.isLoop || frame.isBreakable) {
            foundBreakable = true;
            break;
        }
    }
    if (foundBreakable) {
        this.source += `break;\n`;
    }
    break;
}
```

## Step 4: Add to Block Palette (scratch-gui)

To make blocks visible in the toolbox, add them to the toolbox XML generation.

File: `scratch-gui/src/lib/make-toolbox-xml.js`

```javascript
const control = function (isInitialSetup, isStage, targetId, colors) {
    return `
    <category
        name="%{BKY_CATEGORY_CONTROL}"
        id="control"
        colour="${colors.primary}"
        secondaryColour="${colors.tertiary}">
        
        <!-- Existing blocks -->
        
        ${blockSeparator}
        <block type="control_switch">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">value</field>
                </shadow>
            </value>
        </block>
        <block type="control_case">
            <value name="VALUE">
                <shadow type="text">
                    <field name="TEXT">case</field>
                </shadow>
            </value>
        </block>
        <block type="control_default"/>
        <block type="control_break"/>
        
    </category>
    `;
};
```

## Step 5: Add Localization

Add text strings for the new blocks to support multiple languages.

### Message Definitions
File: `scratch-blocks/msg/messages.js`

```javascript
Blockly.Msg.CONTROL_SWITCH = 'switch %1';
Blockly.Msg.CONTROL_CASE = 'case %1'; 
Blockly.Msg.CONTROL_DEFAULT = 'default';
Blockly.Msg.CONTROL_BREAK = 'break';
```

### English Localization  
File: `scratch-blocks/msg/js/en.js`

```javascript
Blockly.Msg["CONTROL_SWITCH"] = "switch %1";
Blockly.Msg["CONTROL_CASE"] = "case %1";
Blockly.Msg["CONTROL_DEFAULT"] = "default";
Blockly.Msg["CONTROL_BREAK"] = "break";
```

## Block Types and Properties

### Block Types
- `BlockType.COMMAND` - Statements that execute actions
- `BlockType.REPORTER` - Blocks that return values  
- `BlockType.BOOLEAN` - Blocks that return true/false
- `BlockType.HAT` - Event blocks that start scripts
- `BlockType.CONDITIONAL` - Blocks with conditional branches

### Input Types
- `input_value` - Accepts reporter blocks
- `input_statement` - Accepts command blocks (substack)
- `field_dropdown` - Dropdown menu
- `field_variable` - Variable picker

### Extensions
- `colours_control` - Apply control category colors
- `shape_statement` - Standard command block shape
- `shape_hat` - Hat block shape
- `output_string` - String reporter shape

## Advanced Features

### Stack Frame Management
For blocks that need to maintain state across yields:

```javascript
someBlock(args, util) {
    // Initialize on first run
    if (typeof util.stackFrame.counter === 'undefined') {
        util.stackFrame.counter = 0;
    }
    
    // Use the state
    util.stackFrame.counter++;
    
    if (util.stackFrame.counter < 10) {
        util.startBranch(1, true); // Loop
    }
}
```

### Reporter Blocks
For blocks that return values:

```javascript
getPrimitives() {
    return {
        my_reporter: this.myReporter
    };
}

myReporter(args, util) {
    return "some value";
}
```

### Thread Management
For blocks that control script execution:

```javascript
stopScript(args, util) {
    util.thread.status = Thread.STATUS_DONE;
}
```

## Example: Switch/Case Implementation

The switch/case blocks demonstrate a complete implementation:

1. **Switch block** - Stores the switch value in stack frame
2. **Case blocks** - Compare their value to the switch value  
3. **Default block** - Executes when no cases match
4. **Break block** - Exits the switch statement

This creates a familiar programming construct within Scratch's visual environment.

## Testing

After implementing new blocks:

1. Test in both interpreted and compiled modes
2. Verify blocks appear in the correct category
3. Test edge cases and error conditions
4. Ensure proper cleanup of stack frames
5. Test with different project types and targets

## Best Practices

- Follow existing naming conventions (`category_blockname`)
- Use appropriate block shapes for the block's purpose
- Implement proper error handling
- Add meaningful documentation comments
- Consider performance implications
- Test with real projects, not just isolated cases

---
title: 积木注册 API
sidebar_position: 8
---

# 积木注册 API

本指南解释如何向 Scratch 的内置积木面板添加新积木。

## 概述

向 Scratch 添加新积木涉及多个组件协同工作：

1. **积木定义** (scratch-blocks) - 定义视觉外观和结构
2. **积木实现** (scratch-vm) - 定义运行时行为 
3. **编译器支持** (scratch-vm) - 支持编译模式
4. **面板注册** (scratch-gui) - 使积木在工具箱中可见
5. **本地化** (scratch-blocks) - 不同语言的文本字符串

## 步骤 1：定义积木结构 (scratch-blocks)

积木定义决定积木在编辑器中的外观和行为。需要添加到垂直和水平布局文件中。

### 垂直布局
文件：`scratch-blocks/blocks_vertical/control.js`

```javascript
Blockly.Blocks['control_switch'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONTROL_SWITCH,
      "message1": "%1", // 语句
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

### 水平布局
文件：`scratch-blocks/blocks_horizontal/control.js`

水平布局包括图标的额外样式和布局：

```javascript
Blockly.Blocks['control_switch'] = {
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONTROL_SWITCH,
      "message1": "%1",
      "message2": "%1", // 图标
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

## 步骤 2：实现积木行为 (scratch-vm)

积木运行时行为在 scratch-vm 的积木包中实现。

### 注册积木原语
文件：`scratch-vm/src/blocks/scratch3_control.js`

```javascript
getPrimitives() {
    return {
        // ... 现有积木
        control_switch: this.switch,
        control_case: this.case,
        control_default: this.default,
        control_break: this.break
    };
}
```

### 实现积木方法

```javascript
switch(args, util) {
    // 获取 switch 值
    const switchValue = args.VALUE;
    
    // 存储在栈帧中供 case 积木访问
    if (!util.stackFrame.switchValue) {
        util.stackFrame.switchValue = switchValue;
        util.stackFrame.switchMatched = false;
        util.stackFrame.isBreakable = true;
    }
    
    // 执行包含 case 积木的子栈
    util.startBranch(1, false);
}

case(args, util) {
    const caseValue = args.VALUE;
    const stackFrame = util.stackFrame;
    
    // 找到父 switch 帧
    const parentFrame = this.getParentSwitchFrame(util.thread);
    if (!parentFrame) return;
    
    // 检查此 case 是否匹配 switch 值
    if (parentFrame.switchValue === caseValue || parentFrame.switchMatched) {
        parentFrame.switchMatched = true;
        util.startBranch(1, false);
    }
}

break(args, util) {
    // 找到最近的可中断帧并退出
    const thread = util.thread;
    for (let i = thread.stackFrames.length - 1; i >= 0; i--) {
        const frame = thread.stackFrames[i];
        if (frame.isBreakable || frame.isLoop) {
            // 将栈清除回此帧
            thread.stackFrames.length = i;
            return;
        }
    }
}
```

## 步骤 3：添加编译器支持

为了积木能在编译模式下工作，需要向编译器的中间表示（IR）和 JavaScript 生成器添加支持。

### IR 生成
文件：`scratch-vm/src/compiler/irgen.js`

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

### JavaScript 生成
文件：`scratch-vm/src/compiler/jsgen.js`

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

## 步骤 4：添加到积木面板 (scratch-gui)

要使积木在工具箱中可见，将它们添加到工具箱 XML 生成中。

文件：`scratch-gui/src/lib/make-toolbox-xml.js`

```javascript
const control = function (isInitialSetup, isStage, targetId, colors) {
    return `
    <category
        name="%{BKY_CATEGORY_CONTROL}"
        id="control"
        colour="${colors.primary}"
        secondaryColour="${colors.tertiary}">
        
        <!-- 现有积木 -->
        
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

## 步骤 5：添加本地化

为新积木添加文本字符串以支持多种语言。

### 消息定义
文件：`scratch-blocks/msg/messages.js`

```javascript
Blockly.Msg.CONTROL_SWITCH = 'switch %1';
Blockly.Msg.CONTROL_CASE = 'case %1'; 
Blockly.Msg.CONTROL_DEFAULT = 'default';
Blockly.Msg.CONTROL_BREAK = 'break';
```

### 英文本地化  
文件：`scratch-blocks/msg/js/en.js`

```javascript
Blockly.Msg["CONTROL_SWITCH"] = "switch %1";
Blockly.Msg["CONTROL_CASE"] = "case %1";
Blockly.Msg["CONTROL_DEFAULT"] = "default";
Blockly.Msg["CONTROL_BREAK"] = "break";
```

## 积木类型和属性

### 积木类型
- `BlockType.COMMAND` - 执行动作的语句
- `BlockType.REPORTER` - 返回值的积木  
- `BlockType.BOOLEAN` - 返回 true/false 的积木
- `BlockType.HAT` - 启动脚本的事件积木
- `BlockType.CONDITIONAL` - 带条件分支的积木

### 输入类型
- `input_value` - 接受 reporter 积木
- `input_statement` - 接受命令积木（子栈）
- `field_dropdown` - 下拉菜单
- `field_variable` - 变量选择器

### 扩展
- `colours_control` - 应用控制类别颜色
- `shape_statement` - 标准命令积木形状
- `shape_hat` - 帽子积木形状
- `output_string` - 字符串 reporter 形状

## 高级功能

### 栈帧管理
对于需要在 yield 之间维护状态的积木：

```javascript
someBlock(args, util) {
    // 首次运行时初始化
    if (typeof util.stackFrame.counter === 'undefined') {
        util.stackFrame.counter = 0;
    }
    
    // 使用状态
    util.stackFrame.counter++;
    
    if (util.stackFrame.counter < 10) {
        util.startBranch(1, true); // 循环
    }
}
```

### Reporter 积木
对于返回值的积木：

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

### 线程管理
对于控制脚本执行的积木：

```javascript
stopScript(args, util) {
    util.thread.status = Thread.STATUS_DONE;
}
```

## 示例：Switch/Case 实现

Switch/case 积木演示了完整的实现：

1. **Switch 积木** - 将 switch 值存储在栈帧中
2. **Case 积木** - 将其值与 switch 值比较  
3. **Default 积木** - 当没有 case 匹配时执行
4. **Break 积木** - 退出 switch 语句

这在 Scratch 的可视化环境中创建了一个熟悉的编程结构。

## 测试

实现新积木后：

1. 在解释模式和编译模式下测试
2. 验证积木出现在正确的类别中
3. 测试边缘情况和错误条件
4. 确保栈帧的正确清理
5. 使用不同的项目类型和目标测试

## 最佳实践

- 遵循现有命名约定（`category_blockname`）
- 为积木的用途使用适当的积木形状
- 实现适当的错误处理
- 添加有意义的文档注释
- 考虑性能影响
- 使用真实项目测试，而不仅仅是孤立的案例
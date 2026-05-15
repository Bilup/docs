---
title: Bilup 积木
sidebar_position: 9
---

# Bilup 积木

Bilup 包含来自 TurboWarp 的所有增强积木，提供超越标准 Scratch 积木的额外功能。这些积木实现了更强大的编程能力和更好的性能。

## 侦测积木

### 高级鼠标积木

#### 角色上的鼠标 X/Y
获取相对于特定角色的鼠标坐标：
```scratch
(mouse x on [Sprite1 v])
(mouse y on [Sprite1 v])
```

#### 鼠标按下检测
检查鼠标按钮当前是否按下：
```scratch
<mouse down?>
```

### 按键检测增强

#### 任意键按下
检测是否按下任意键：
```scratch
<any key pressed?>
```

#### 按键按下积木
更灵活的按键检测：
```scratch
<key [space v] pressed?>
<key [any v] pressed?>
```

### 舞台侦测

#### 舞台宽度/高度
获取当前舞台尺寸：
```scratch
(stage width)
(stage height)
```

#### 角色触摸检测
检查角色是否触摸特定点：
```scratch
<touching x: (100) y: (50)?>
```

## 运动积木

### 高级移动

#### 移动到随机位置
移动到舞台上的随机位置：
```scratch
go to [random position v]
```

#### 向指定方向移动步数
向任意方向移动特定距离：
```scratch
move (10) steps in direction (45)
```

### 旋转增强

#### 面向指定位置
转向面向特定坐标：
```scratch
point towards x: (100) y: (50)
```

#### 设置旋转样式（高级）
更多旋转样式选项：
```scratch
set rotation style [all around v]
set rotation style [left-right v]
set rotation style [don't rotate v]
set rotation style [all around (smooth) v] // Bilup 扩展
```

## 外观积木

### 造型管理

#### 按名称获取造型编号
按名称获取造型编号：
```scratch
(costume [costume1 v])
```

#### 背景管理
增强的背景控制：
```scratch
switch backdrop to [backdrop1 v] and wait
```

### 视觉效果

#### 设置效果值
更精确的效果控制：
```scratch
set [ghost v] effect to (50)
set [brightness v] effect to (25)
set [color v] effect to (15)
```

#### 清除单个效果
清除特定效果而不是全部：
```scratch
clear [ghost v] effect
```

## 声音积木

### 音频控制

#### 精确设置音量
更精确的音量控制：
```scratch
set volume to (75) %
```

#### 声音信息
获取声音信息：
```scratch
(sound [meow v] duration)
(sound [meow v] length)
```

## 控制积木

### 高级循环

#### 重复直到
循环直到条件变为真：
```scratch
repeat until <(timer) > (10)>
  // Code here
end
```

#### For 循环
传统的 for 循环结构：
```scratch
for [i v] from (1) to (10)
  say (i) for (0.5) seconds
end
```

### 条件增强

#### 多条件
更复杂的条件逻辑：
```scratch
if <<(score) > (100)> and <(lives) > (0)>> then
  // Code here
end
```

## 变量积木

### 列表增强

#### 列表操作
高级列表操作：
```scratch
(item (random v) of [my list v])
(length of [my list v])
<[my list v] contains [apple]?>
```

#### 列表转换
转换列表数据：
```scratch
set [my list v] to (join [my list v] [other list v])
```

### 变量操作

#### 数学运算
执行复杂计算：
```scratch
set [result v] to ((x) + (y))
set [result v] to (sqrt of (number))
set [result v] to (abs of (number))
```

## 运算符

### 数学函数

#### 高级数学
额外的数学运算：
```scratch
(sqrt of (9))        // 平方根：3
(abs of (-5))        // 绝对值：5
(ln of (2.718))      // 自然对数
(log of (100))       // 常用对数
(e ^ (2))           // e 的幂
(10 ^ (3))          // 10 的幂
```

#### 三角函数
```scratch
(sin of (90))        // 正弦
(cos of (0))         // 余弦
(tan of (45))        // 正切
(asin of (1))        // 反正弦
(acos of (0))        // 反余弦
(atan of (1))        // 反正切
```

### 文本操作

#### 高级字符串函数
```scratch
(letters (1) to (5) of [hello world])    // 子字符串："hello"
(item (1) of (split [a,b,c] by [,]))     // 分割字符串："a"
<[hello] contains [ell]?>                 // 包含检查：true
```

#### 正则表达式
```scratch
<[hello123] matches [^[a-z]+[0-9]+$]?>   // 正则匹配
(replace [hello world] with [hi] for [hello])  // 替换文本
```

### 比较运算符

#### 字符串比较
```scratch
<[apple] < [banana]?>    // 字母顺序比较
<[10] = [10]?>           // 字符串相等
```

#### 数字比较
```scratch
<(x) ≈ (y)?>            // 约等于
<(x) ≠ (y)?>            // 不等于
```

## 数据结构

### 字典/对象
使用键值对：
```scratch
set [data v] to {key: "value", number: 42}
set [value v] to (get [key] from [data v])
set [data v] to (set [newKey] to [newValue] in [data v])
```

### JSON 操作
处理 JSON 数据：
```scratch
set [json v] to ({"name": "Alice", "score": 100})
set [name v] to (get [name] from json [json v])
set [json v] to (set [score] to (200) in json [json v])
```

## 性能积木

### 编译提示

#### Warp 模式
加速特定脚本的执行：
```scratch
run without screen refresh [
  repeat (1000)
    change [x v] by (1)
  end
] // 以最大速度运行
```

#### 原子操作
确保操作不被中断地完成：
```scratch
atomic [
  set [x v] to (100)
  set [y v] to (200)
] // 两个操作一起完成
```

## 调试积木

### 控制台输出
输出调试信息：
```scratch
log [调试消息] to console
log [变量值:] (score) to console
```

### 断点
暂停执行以便调试：
```scratch
breakpoint // 在此处暂停执行
```

### 性能监控
监控脚本性能：
```scratch
start timer [operation]
// 要测量的代码
log timer [operation] to console
```

## 自定义积木增强

### 参数类型
使用特定参数类型定义自定义积木：
```scratch
define move sprite [SPRITE] to x: [X] y: [Y]
// SPRITE 参数接受角色名称
// X 和 Y 参数接受数字
```

### 返回值
自定义积木可以返回值：
```scratch
define calculate distance from [X1] [Y1] to [X2] [Y2]
set [result v] to (sqrt of (((X2) - (X1)) * ((X2) - (X1)) + ((Y2) - (Y1)) * ((Y2) - (Y1))))
return (result)
```

## 积木限制

### 兼容性说明
- 某些 TurboWarp 积木可能在标准 Scratch 中不起作用
- 导出到 Scratch 可能会丢失 TurboWarp 特定功能
- 如果需要兼容性，请在两种环境中测试项目

### 性能注意事项
- 高级积木可能使用更多 CPU/内存
- 某些操作针对 TurboWarp 的编译器进行了优化
- 使用复杂操作时监控性能

## 从 Scratch 迁移

### 转换项目
在 Bilup 中加载 Scratch 项目时：
1. 所有标准积木工作方式不变
2. 额外的 TurboWarp 积木变得可用
3. 性能可能会自动提升
4. 考虑升级到 TurboWarp 特定积木以获得更好性能

### 最佳实践
- 对性能关键代码使用 TurboWarp 积木
- 为兼容性保留标准 Scratch 积木
- 使用高级功能时彻底测试
- 记录 TurboWarp 特定功能

Bilup 中的 TurboWarp 积木相比标准 Scratch 提供了显著的增强，实现了更复杂的编程和更好的性能。使用这些积木创建更强大和高效的项目！
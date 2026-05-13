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
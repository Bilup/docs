---
title: 云变量
sidebar_position: 7
---

# 云变量

Bilup 中的云变量提供共享数据存储，并在用户之间实现实时协作。Bilup 使用与 Scratch 协议兼容的云服务器。

## 了解云变量

### 什么是云变量？
云变量是特殊的变量，它们可以：
- **同步**：在实时共享不同用户之间的数据
- **全局**：可被项目的所有活动实例访问
- **服务器支持**：在用户连接时存储在云服务器上

### 限制
- **仅数字**：云变量只能存储数字
- **长度限制**：最多 100,000 个字符
- **缓冲**：更新可能会被批处理和重新排序；每秒发送超过约 10 次更新是多余的

## 创建云变量

### 在 Bilup 编辑器中

#### 基本创建
1. 转到积木面板中的 **变量** 类别
2. 点击 **新建变量**
3. 输入变量名称
4. 勾选 **☁ 云变量** 复选框
5. 点击 **确定**

#### 命名约定
- 使用描述性名称：`☁ high_score`、`☁ player_data`
- 避免使用空格：改用下划线
- 保持名称简短但有意义
- 考虑数据类型：`☁ json_data`、`☁ user_count`

### 云变量积木

#### 设置云变量
```scratch
将 [☁ high_score v] 设为 (1000)
```

#### 读取云变量
```scratch
说 (☁ high_score) (2) 秒
```

#### 更改云变量
```scratch
将 [☁ user_count v] 增加 (1)
```

## 数据格式

### 简单值
存储简单的文本和数字：
```scratch
将 [☁ high_score v] 设为 (1000)
将 [☁ player_name v] 设为 [Alice]
将 [☁ game_state v] 设为 [playing]
```

### 结构化数据
使用分隔符处理复杂数据：
```scratch
// 逗号分隔的值
将 [☁ player_stats v] 设为 (连接 (用户名) (连接 [,] (连接 (得分) (连接 [,] (等级)))))

// 类似 JSON 的格式
将 [☁ game_data v] 设为 [{"score":1000,"level":5,"lives":3}]
```

### 列表模拟
使用云变量模拟列表：
```scratch
// 向列表添加项
将 [☁ item_list v] 设为 (连接 (☁ item_list) (连接 [|] (连接 (new_item))))

// 从列表获取项
将 [item v] 设为 (第 (1) 项于 (分割 (☁ item_list) 按 [|]))
```

## 实时功能

### 实时同步
云变量在所有连接的用户之间实时更新：

```scratch
// 用户计数器系统
当绿旗被点击
将 [☁ user_count v] 增加 (1)

当我收到 [user_left v]
将 [☁ user_count v] 增加 (-1)
```

### 事件广播
使用云变量创建实时事件：

```scratch
// 事件触发器
当绿旗被点击
永远
  如果 <(☁ global_event) = [start_game]> 那么
    广播 [game_started v]
    将 [☁ global_event v] 设为 [none]
  end
end

// 事件发送者
当按下 [space v] 键
将 [☁ global_event v] 设为 [start_game]
```

## 高级模式

### 聊天系统
使用云变量实现基本聊天：

```scratch
// 发送消息
当按下 [enter v] 键
将 [☁ chat_log v] 设为 (连接 (☁ chat_log) (连接 [|] (连接 (用户名) (连接 [:] (消息)))))

// 显示消息
当绿旗被点击
永远
  将 [messages v] 设为 (分割 (☁ chat_log) 按 [|])
  // 在此显示逻辑
end
```

### 多人游戏状态
同步玩家位置：

```scratch
// 更新玩家位置
当绿旗被点击
永远
  将 [☁ player_data v] 设为 (连接 (用户名) (连接 [,] (连接 (x 位置) (连接 [,] (y 位置)))))
  等待 (0.1) 秒
end

// 读取其他玩家
当绿旗被点击
永远
  将 [other_players v] 设为 (分割 (☁ all_players) 按 [|])
  // 处理其他玩家数据
end
```

### 排行榜系统
创建持久的排行榜：

```scratch
// 提交分数
当我收到 [game over v]
如果 <(得分) > (☁ high_score)> 那么
  将 [☁ high_score v] 设为 (得分)
  将 [☁ high_score_player v] 设为 (用户名)
end

// 显示排行榜
当绿旗被点击
永远
  说 (连接 [High Score: ] (连接 (☁ high_score) (连接 [ by ] (☁ high_score_player)))) (2) 秒
end
```

## 服务器配置

### 自定义云主机
使用 URL 参数覆盖云服务器：
```
https://editor.bilup.org/?cloud_host=wss://clouddata.bilup.org
```

Bilup 默认使用 `wss://`。在不安全的 `ws://` 主机中，在 HTTPS 环境中可能无法使用。

## 最佳实践

### 数据管理

#### 最小化更新
- 批处理多个更改
- 仅在必要时更新
- 使用本地变量存储临时数据

#### 高效地构建数据
```scratch
// 好：结构化格式
将 [☁ player_data v] 设为 [alice,100,5,active]

// 更好：类似 JSON 的格式
将 [☁ player_data v] 设为 [{"name":"alice","score":100,"level":5,"status":"active"}]
```

#### 处理大型数据
```scratch
// 将大数据分割到多个变量
将 [☁ data_part_1 v] 设为 (第 (1) 至 (50000) 个字符于 (large_data))
将 [☁ data_part_2 v] 设为 (第 (50001) 至 (100000) 个字符于 (large_data))
```

### 错误处理

#### 网络问题
```scratch
// 检查云变量是否正常工作
如果 <(☁ test_variable) = []> 那么
  说 [云变量不可用] (2) 秒
否则
  说 [云变量正常工作] (2) 秒
end
```

#### 数据验证
```scratch
// 验证云数据
如果 <(☁ player_data) 的长度 > (0)> 那么
  // 处理数据
否则
  // 使用默认值
end
```

### 性能优化

#### 降低更新频率
```scratch
// 每 5 秒更新一次，而不是持续更新
当绿旗被点击
永远
  // 更新云变量
  等待 (5) 秒
end
```

#### 使用本地缓存
```scratch
// 在本地缓存云数据
将 [cached_data v] 设为 (☁ remote_data)
// 使用 cached_data 进行频繁读取
```

## 故障排除

### 常见问题

#### 变量不同步
- 检查网络连接
- 确认项目已分享
- 确保变量名以 ☁ 开头
- 避免过于频繁的更新

#### 数据丢失
- 实施定期备份
- 使用多个变量进行冗余
- 保存前验证数据

#### 性能问题
- 降低更新频率
- 最小化数据大小
- 使用高效的数据结构

### 调试工具

#### 云变量监控
```scratch
// 监控云变量变化
当绿旗被点击
永远
  如果 <<不 (☁ debug_var) = (last_value)>> 那么
    说 (连接 [Changed: ] (☁ debug_var)) (1) 秒
    将 [last_value v] 设为 (☁ debug_var)
  end
end
```

#### 连接状态
```scratch
// 测试云连接
将 [☁ test_ping v] 设为 (timer)
等待 (1) 秒
如果 <(☁ test_ping) = (timer)> 那么
  说 [云变量离线] (2) 秒
否则
  说 [云变量在线] (2) 秒
end
```

云变量在 Bilup 中解锁了强大的协作和持久化功能。使用它们创建多人游戏、共享体验和跨会话持久的数据驱动项目！

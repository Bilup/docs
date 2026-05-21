---
title: 故障排除
sidebar_position: 11
---

# 故障排除

这份全面的故障排除指南帮助你解决使用 Bilup 时遇到的常见问题。从项目加载问题到性能问题，找到解决方案以快速恢复创作。

## 项目加载问题

### 项目无法加载

#### 症状
- 加载项目时出现空白屏幕
- "项目加载失败"错误消息
- 无限加载旋转图标

#### 常见原因与解决方案

**无效的项目 ID**
```
❌ 问题：项目 ID 不存在或为私有
✅ 解决方案：验证项目 ID 并确保它是公开共享的
```

**网络连接**
```bash
# 测试连接性
ping editor.bilup.org

# 检查浏览器控制台中的网络错误
# F12 → 控制台标签 → 查找红色错误
```

**浏览器兼容性**
```
❌ 问题：浏览器版本过时
✅ 解决方案：更新到最新版本的 Chrome、Firefox、Safari 或 Edge
最低版本：Chrome 80+、Firefox 74+、Safari 13+
```

**损坏的项目文件**
```
❌ 问题：项目文件已损坏
✅ 解决方案：
1. 尝试加载备份版本
2. 从原始来源重新下载
3. 使用项目修复工具
```

### 项目加载缓慢

#### 优化步骤

**启用 Turbo 模式**
```
https://editor.bilup.org/123456789?turbo
```

**减小项目大小**
- 删除未使用的角色和声音
- 导入前压缩大图像
- 优化声音文件(使用 MP3 而不是 WAV)

**清除浏览器缓存**
```bash
# Chrome: Ctrl+Shift+Delete
# Firefox: Ctrl+Shift+Delete
# Safari: Cmd+Option+E
```

## 性能问题

### 低帧率

#### 诊断
在 Bilup 中检查当前 FPS：
```scratch
when green flag clicked
forever
  say (join [FPS: ] (fps)) for (0.1) seconds
end
```

#### 解决方案

**启用性能功能**
```
https://editor.bilup.org/?turbo&fps=60
```

**优化项目代码**
```scratch
// ❌ 低效
forever
  if <touching [Sprite1 v]?> then
    // 每帧复杂计算
  end
end

// ✅ 高效
forever
  if <touching [Sprite1 v]?> then
    // 将复杂代码移到单独的脚本
    broadcast [collision detected v]
  end
end
```

**降低视觉复杂度**
- 限制可见角色的数量
- 使用更简单的造型
- 降低画笔绘制复杂度
- 禁用不必要的视觉效果

### 内存问题

#### 症状
- 浏览器变得无响应
- "内存不足"错误
- 性能逐渐下降

#### 解决方案

**监控内存使用**
```javascript
// 在浏览器控制台中检查内存
console.log(performance.memory);
```

**优化资源使用**
- 删除未使用的造型和声音
- 使用适当的图像格式(PNG 用于透明，JPEG 用于照片)
- 限制声音文件大小

**代码优化**
```scratch
// ❌ 内存泄漏 - 列表无限增长
forever
  add [item] to [my list v]
end

// ✅ 适当清理
forever
  add [item] to [my list v]
  if <(length of [my list v]) > (100)> then
    delete (1) of [my list v]
  end
end
```

## 界面问题

### 界面元素缺失

#### 空白屏幕
```
❌ 问题：界面无法加载
✅ 解决方案：
1. 禁用浏览器扩展
2. 清除 cookies 和缓存
3. 尝试无痕/私密模式
4. 检查控制台中的 JavaScript 错误
```

#### 控件无响应
```
❌ 问题：按钮不起作用
✅ 解决方案：
1. 刷新页面(F5)
2. 检查是否启用了 JavaScript
3. 尝试不同的浏览器
4. 暂时禁用广告拦截器
```

### 主题和显示问题

#### 主题无法加载
```
❌ 问题：主题显示损坏或默认
✅ 解决方案：
1. 清除浏览器缓存
2. 使用设置菜单更改主题
3. 重置主题设置
4. 检查控制台中的 CSS 加载错误
```

#### 自定义舞台尺寸问题
```
❌ 问题：舞台尺寸错误
✅ 解决方案：
1. 使用有效的尺寸格式：?size=800x600
2. 检查浏览器缩放级别(应为 100%)
3. 使用播放器标题中的全屏控件
4. 更改尺寸后刷新页面
```

## 音频问题

### 没有声音

#### 检查音频设置
```javascript
// 在浏览器控制台中测试音频
new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmkcBj2b3O/AcyMFLInA7d+5nF0XKWm+79+QRAoUYK/+6qtSDAvSq+vtwmMlBs+R2vPmbiMFLXPN8d2NQwoKH0+z/+6iUQwGWrzz77aZdE4YFQobqeu1xmMjBy2F+fTflUQHbKz5/d9HYfTAaJWkLo2Gx8k=').play();
```

#### 常见解决方案
1. **检查浏览器音频**：确保浏览器音频未静音
2. **检查系统音量**：验证系统音量已调高
3. **音频上下文**：某些浏览器需要首先进行用户交互
4. **音频格式**：尝试不同的音频格式(MP3、WAV)

### 音频失真
```
❌ 问题：音频听起来不对或失真
✅ 解决方案：
1. 检查音频采样率(建议 22050 Hz)
2. 尝试不同的音频格式
3. 减小音频文件大小
4. 检查与其他标签页的音频冲突
```

## 插件问题

### 插件不工作

#### 启用插件
```
1. 点击设置齿轮图标
2. 进入"插件"标签页
3. 启用所需的插件
4. 如有需要刷新页面
```

#### 插件冲突
```
❌ 问题：插件相互干扰
✅ 解决方案：
1. 一次禁用一个插件以识别冲突
2. 检查插件兼容性列表
3. 向插件开发者报告冲突
4. 使用替代插件
```

### 自定义插件问题
```javascript
// 调试插件加载
console.log(vm.runtime.extensionManager.allExtensions);

// 检查插件错误
window.addEventListener('error', (e) => {
  console.log('Addon error:', e);
});
```

## 云变量问题

### 云变量不同步

#### 检查连接
```scratch
// 测试云变量连接
set [☁ test v] to (timer)
wait (1) seconds
if <(☁ test) = (timer)> then
  say [Cloud variables working] for (2) seconds
else
  say [Cloud variables offline] for (2) seconds
end
```

#### 常见解决方案
1. **网络连接**：检查网络连接
2. **项目共享**：确保项目是公开共享的
3. **速率限制**：避免更新太频繁
4. **用户名**：在项目或 URL 中设置用户名：`?username=alice`

### 数据不持久化
```
❌ 问题：云变量重置
✅ 解决方案：
1. 检查变量名是否有 ☁ 前缀
2. 验证数据大小限制(每个变量 100KB)
3. 检查数据中的特殊字符
4. 确保变量类型正确(仅限云变量)
```

## 扩展和 JavaScript 问题

### JavaScript 不工作

#### 启用 JavaScript
```
https://editor.bilup.org/?unsafe
```

#### 安全警告
```
❌ 问题：出现"不安全脚本"警告
✅ 解决方案：
1. 仅对可信项目启用
2. 仔细审查 JavaScript 代码
3. 尽可能使用沙盒化扩展
4. 报告可疑脚本
```

#### 常见 JavaScript 错误
```javascript
// ❌ 常见错误
vm.runtime.targets[0].variables.myVar.value = 100;

// ✅ 正确方法
const stage = vm.runtime.getTargetForStage();
const variable = stage.lookupVariableByNameAndType('myVar', '');
if (variable) variable.value = 100;
```

## 浏览器特定问题

### Chrome 问题
```
常见问题：
- 硬件加速冲突
- 扩展干扰
- 内存限制

解决方案：
- 在 Chrome 设置中禁用硬件加速
- 尝试无痕模式
- 清除 Chrome 缓存和 cookies
```

### Firefox 问题
```
常见问题：
- WebGL 兼容性
- 音频上下文限制
- 安全限制

解决方案：
- 在 Firefox 设置中启用 WebGL
- 允许音频自动播放
- 检查增强跟踪保护设置
```

### Safari 问题
```
常见问题：
- WebGL 支持有限
- 音频限制
- 缓存问题

解决方案：
- 在 Safari 偏好设置中启用 WebGL
- 允许网站音频自动播放
- 清除 Safari 缓存
```

## 移动设备问题

### 触摸控制
```
❌ 问题：触摸不能正常工作
✅ 解决方案：
1. 使用针对移动设备优化的项目
2. 在设置中启用触摸控制
3. 检查触摸事件冲突
4. 尝试不同的移动浏览器
```

### 移动设备上的性能
```
❌ 问题：移动设备上性能缓慢
✅ 解决方案：
1. 降低项目复杂性
2. 降低帧率：?fps=30
3. 禁用高质量画笔
4. 关闭其他移动应用
```

## 网络和连接

### 加载超时
```
❌ 问题：项目在加载时超时
✅ 解决方案：
1. 检查网络速度
2. 尝试不同的网络
3. 使用移动数据作为备份
4. 如果持续出现问题请联系网络服务商
```

### 防火墙问题
```
❌ 问题：企业防火墙阻止 Bilup
✅ 解决方案：
1. 联系 IT 部门
2. 使用备用网络
3. 尝试不同的浏览器
4. 请求将 editor.bilup.org列入白名单
```

## 获取帮助

### 调试信息
报告问题时，请包含：
```
- 浏览器版本和操作系统
- 项目 ID(如适用)
- 控制台中的错误消息(F12)
- 重现步骤
- 预期与实际行为
```

### 控制台调试
```javascript
// 获取 Bilup 版本
console.log(vm.runtime.platform);

// 检查错误
console.log(vm.runtime.getLastError());

// 导出调试信息
console.log({
  userAgent: navigator.userAgent,
  performance: performance.memory,
  extensions: vm.runtime.extensionManager.allExtensions
});
```

### 社区支持
- **GitHub Issues**：报告错误和功能请求
- **社区论坛**：从其他用户获取帮助
- **Discord/聊天**：实时社区支持
- **文档**：查看最新文档更新

### 专业支持
对于商业或教育用途：
- **优先支持**：更快的响应时间
- **定制解决方案**：针对性的故障排除
- **培训**：全面的用户培训
- **集成帮助**：嵌入和 API 支持

记住：大多数问题可以通过基本的故障排除快速解决。在进行更复杂的调试之前，先从刷新页面或清除缓存等简单解决方案开始！
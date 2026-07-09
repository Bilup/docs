---
title: 开始使用
sidebar_position: 2
---

# 开始使用

Bilup 是一个基于网页的应用，可以直接在浏览器中运行。无需安装!

## 访问 Bilup

Bilup 仅作为网页应用提供，可以访问：

**🌐 [https://editor.bilup.org/](https://editor.bilup.org/)**

只需在任何浏览器(版本不要过低)中打开链接，就可以开始创作了!

## 系统要求


### 支持的浏览器
- **Chrome 80+**(推荐，以获得最佳性能)
- **Firefox 78+**
- **Safari 14+**(macOS/iOS)
- **Edge 80+**

### 硬件要求
- **内存**：最低 4GB，推荐 8GB+ 用于复杂项目
- **网络**：加载和保存项目需要稳定的网络连接
- **存储**：项目保存到浏览器的本地存储或云存储

### 推荐配置
- **内存**：大型项目(包含多个角色和脚本)推荐 8GB+
- **处理器**：现代多核处理器以获得流畅性能
- **网络**：宽带连接以加快项目加载速度
- **显卡**：WebGL 2.0 支持以获得最佳渲染效果

## 浏览器兼容性

| 浏览器 | 最低版本 | 推荐版本 |
|---------|----------------|-------------|
| Chrome | 80+ | 最新版 |
| Firefox | 78+ | 最新版 |
| Safari | 14+ | 最新版 |
| Edge | 80+ | 最新版 |

### 必需功能
- ES2020 支持
- WebGL 1.0(推荐 WebGL 2.0)
- Web Audio API
- 本地存储
- WebAssembly(用于最佳性能)

## 首次设置

当你首次访问 Bilup 时：

1. **打开浏览器**并访问 [editor.bilup.org](https://editor.bilup.org/)
2. **如果提示，允许 JavaScript**(Bilup 运行所必需)
3. **如果计划使用感知积木，允许摄像头/麦克风权限**
4. **创建账户**(可选)以便将项目保存到云端

## 浏览器配置

### 启用必需功能

为获得最佳 Bilup 体验，请确保这些浏览器功能已启用：

- **JavaScript**：所有功能所必需
- **WebGL**：舞台渲染和效果所必需
- **本地存储**：用于本地保存项目
- **摄像头/麦克风**：感知积木所需(可选)

### 性能提示

- **关闭不必要的标签页**以释放内存
- **如果浏览器设置中有硬件加速选项，请启用**
- **如果 Bilup 变慢，偶尔清除浏览器缓存**
- **禁用可能影响性能的浏览器扩展**

## 开发设置

对于想要修改或为 Bilup 做贡献的开发者：

### 前置要求
- Node.js 18+
- npm 或 yarn
- Git

### 克隆和构建

```bash
# 克隆仓库
git clone https://github.com/Bilup/scratch-gui.git
cd scratch-gui

# 安装依赖(这一步可能很慢，耐心等待)
npm ci

# 启动开发服务器
npm start
```

开发服务器将在 `http://localhost:8601/` 可用。

### 构建其他组件

要开发完整的 Bilup 技术栈：

```bash
# 克隆所有仓库
git clone https://github.com/Bilup/scratch-vm.git
git clone https://github.com/Bilup/scratch-gui.git
git clone https://github.com/Bilup/scratch-render.git

# 链接本地包(从各个目录)
cd scratch-vm && npm link
cd ../scratch-render && npm link
cd ../scratch-gui && npm link scratch-vm scratch-render

# 开始开发
cd scratch-gui && npm start
```

## 故障排除

### 常见问题

**Bilup 无法加载：**
1. 检查网络连接
2. 暂时禁用浏览器扩展
3. 清除浏览器缓存和 Cookie
4. 尝试使用其他浏览器

**性能不佳：**
1. 关闭其他浏览器标签页
2. 重启浏览器
3. 检查可用内存
4. 尝试使用 Chrome 以获得最佳性能
5. 在浏览器设置中启用硬件加速

**项目无法保存：**
1. 检查浏览器本地存储是否已满
2. 如果使用云端保存，请启用第三方 Cookie
3. 创建账户以使用云存储

**积木缺失或行为异常：**
1. 刷新页面
2. 清除浏览器缓存
3. 检查浏览器控制台错误

**图形/渲染问题：**
1. 更新显卡驱动程序
2. 在浏览器设置中启用 WebGL
3. 尝试其他浏览器

### 获取帮助

如果你遇到问题：
- 查看 [故障排除指南](../user-guide/troubleshooting.md)
<!-- - 访问我们的 [社区论坛]() -->
- 在 [GitHub Issues](https://github.com/Bilup/scratch-gui/issues) 上报告漏洞

## 下一步是什么?

现在你可以访问 Bilup 了：

1. **[快速入门指南](./quick-start.md)** - 创建你的第一个项目
2. **[用户界面](../user-guide/interface.md)** - 学习界面
3. **[项目管理](../user-guide/projects.md)** - 保存和分享项目
4. **[迁移指南](./migrating-from-scratch.md)** - 导入现有的 Scratch 项目

*继续阅读 [快速入门](./quick-start.md) 来创建你的第一个项目。*

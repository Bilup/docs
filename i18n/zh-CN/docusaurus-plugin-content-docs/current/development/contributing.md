---
title: 贡献
sidebar_position: 6
---

# 为 Bilup 贡献

Bilup 是一个开源项目，欢迎所有技能水平的开发者贡献。无论你是修复 bug、添加功能、改进文档还是帮助翻译，你的贡献都有助于使 Bilup 对每个人都更好。

## 入门指南

### 前提条件
贡献前，请确保你拥有：
- **Git**：用于版本控制
- **Node.js 16+**：用于构建和运行 Bilup
- **GitHub 账户**：用于提交贡献
- **代码编辑器**：推荐 VS Code 及其扩展

### 设置开发环境
```bash
# 在 GitHub 上 fork 仓库
# 克隆你的 fork
git clone https://github.com/YOUR_USERNAME/scratch-gui.git
cd scratch-gui

# 添加上游远程仓库
git remote add upstream https://github.com/Bilup/scratch-gui.git

# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 贡献类型

### Bug 报告
通过报告 bug 帮助改进 Bilup：

#### 报告前
1. **搜索现有问题**以避免重复
2. **更新到最新版本**以确保 bug 仍然存在
3. **在不同浏览器中测试**以确认可重现性
4. **从浏览器控制台收集调试信息**

#### Bug 报告模板
```markdown
**描述 Bug**
清晰描述 bug 是什么。

**复现步骤**
1. 转到 '...'
2. 点击 '...'
3. 向下滚动到 '...'
4. 看到错误

**预期行为**
你期望发生什么。

**实际行为**
实际发生了什么。

**环境**
- 浏览器：[例如 Chrome 91, Firefox 89]
- 操作系统：[例如 Windows 10, macOS 11]
- Bilup 版本：[例如 1.5.0]

**附加信息**
- 控制台错误
- 截图/视频
- 项目文件（如适用）
```

### 功能请求
建议新功能或改进：

#### 功能请求指南
- **具体**：清晰描述提议的功能
- **解释用例**：为什么需要这个功能？
- **考虑范围**：这是主要还是次要添加？
- **检查现有请求**：避免重复请求

#### 功能请求模板
```markdown
**功能描述**
清晰描述提议的功能。

**用例**
为什么需要这个功能？它解决了什么问题？

**提议的实现**
这个功能应该如何工作？

**考虑的替代方案**
你考虑过哪些其他解决方案？

**附加信息**
- 模型/线框图
- 相关问题
- 实现说明
```

### 代码贡献

#### 开发工作流程
```bash
# 1. 更新你的 fork
git fetch upstream
git checkout main
git merge upstream/main

# 2. 创建功能分支
git checkout -b feature/my-new-feature

# 3. 进行更改并提交
git add .
git commit -m "Add: new feature description"

# 4. 推送到你的 fork
git push origin feature/my-new-feature

# 5. 在 GitHub 上创建 Pull Request
```

#### 提交指南
遵循约定式提交格式：
```bash
# 格式：type(scope): description

# 类型：
feat: 新功能
fix: bug 修复
docs: 文档更改
style: 代码风格更改（格式化等）
refactor: 代码重构
test: 添加或更新测试
chore: 维护任务

# 示例：
feat(blocks): 添加鼠标滚轮的新侦测积木
fix(vm): 解决角色碰撞检测 bug
docs(api): 更新扩展开发指南
style(gui): 修复角色选择器中的 linting 错误
```

### 文档

#### 文档类型
- **用户指南**：帮助用户理解功能
- **开发者文档**：技术实现细节
- **API 文档**：开发者参考
- **教程**：循序渐进的学习内容

#### 文档标准
```markdown
# 遵循这些标准：

## 清晰的标题
使用描述性的、层次化的标题。

## 代码示例
提供工作代码示例：

```javascript
// 好：完整、可工作的示例
const extension = {
  getInfo() {
    return {
      id: 'example',
      name: 'Example Extension',
      blocks: [
        {
          opcode: 'sayHello',
          blockType: BlockType.COMMAND,
          text: 'say hello to [NAME]',
          arguments: {
            NAME: {
              type: ArgumentType.STRING,
              defaultValue: 'world'
            }
          }
        }
      ]
    };
  },
  
  sayHello(args) {
    alert(`Hello, ${args.NAME}!`);
  }
};
```

## 截图
包含相关截图和注释。

## 交叉引用
链接到相关文档部分。
```
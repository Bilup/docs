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
- 项目文件(如适用)
```

### 功能请求
建议新功能或改进：

#### 功能请求指南
- **具体**：清晰描述提议的功能
- **解释需求**：为什么需要这个功能?
- **考虑范围**：这是主要还是次要添加?
- **检查现有请求**：避免重复请求

#### 功能请求模板
```markdown
**功能描述**
清晰描述提议的功能。

**需求**
为什么需要这个功能?它解决了什么问题?

**提议的实现**
这个功能应该如何工作?

**考虑的替代方案**
你考虑过哪些其他解决方案?

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
遵循规则提交格式：
```bash
# 格式：type(scope): description

# 类型：
feat: 新功能
fix: bug 修复
docs: 文档更改
style: 代码风格更改(格式化等)
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

## 代码标准

### JavaScript/TypeScript 样式

#### ESLint 配置
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'indent': ['error', 4],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'no-unused-vars': 'error',
    'no-console': 'warn'
  }
};
```

#### 代码格式化
```javascript
// 使用一致的格式化：

// 好
const myFunction = (parameter1, parameter2) => {
    if (parameter1 && parameter2) {
        return doSomething(parameter1, parameter2);
    }
    return null;
};

// 不好
const myFunction=(parameter1,parameter2)=>{
if(parameter1&&parameter2){
return doSomething(parameter1,parameter2);}
return null};
```

### React 组件指南

#### 组件结构
```jsx
// 良好的组件结构
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './my-component.css';

const MyComponent = ({
    title,
    isActive,
    onAction,
    className,
    ...props
}) => {
    const [localState, setLocalState] = useState(false);
    
    useEffect(() => {
        // 副作用逻辑
    }, []);
    
    const handleClick = () => {
        setLocalState(!localState);
        onAction();
    };
    
    return (
        <div
            className={classNames(
                styles.component,
                {
                    [styles.active]: isActive
                },
                className
            )}
            onClick={handleClick}
            {...props}
        >
            <h2>{title}</h2>
        </div>
    );
};

MyComponent.propTypes = {
    title: PropTypes.string.isRequired,
    isActive: PropTypes.bool,
    onAction: PropTypes.func,
    className: PropTypes.string
};

MyComponent.defaultProps = {
    isActive: false,
    onAction: () => {},
    className: ''
};

export default MyComponent;
```

### 测试要求

#### 测试覆盖率
所有贡献应包含适当的测试：
```javascript
// 组件测试示例
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MyComponent from '../my-component';

describe('MyComponent', () => {
    test('使用必需的属性渲染', () => {
        render(<MyComponent title="测试标题" />);
        expect(screen.getByText('测试标题')).toBeInTheDocument();
    });
    
    test('点击时调用 onAction', () => {
        const onAction = jest.fn();
        render(
            <MyComponent 
                title="测试" 
                onAction={onAction} 
            />
        );
        
        fireEvent.click(screen.getByText('测试'));
        expect(onAction).toHaveBeenCalledTimes(1);
    });
    
    test('当 isActive 为 true 时应用激活样式', () => {
        const { container } = render(
            <MyComponent 
                title="测试" 
                isActive={true} 
            />
        );
        
        expect(container.firstChild).toHaveClass('active');
    });
});
```

## Pull Request 流程

### PR 检查清单
提交 Pull Request 之前：

- [ ] **代码符合样式指南**
- [ ] **已完成代码自检**
- [ ] **为复杂逻辑添加了注释**
- [ ] **为新功能编写了测试**
- [ ] **所有测试在本地通过**
- [ ] **已更新文档**
- [ ] **没有合并冲突**
- [ ] **PR 描述解释了更改内容**

### PR 模板
```markdown
## 描述
简要描述更改内容和动机。

## 更改类型
- [ ] Bug 修复(修复问题的非破坏性更改)
- [ ] 新功能(添加功能的非破坏性更改)
- [ ] 破坏性更改(破坏现有功能的修复或功能)
- [ ] 文档更新

## 测试
- [ ] 已添加/更新单元测试
- [ ] 已添加/更新集成测试
- [ ] 已完成手动测试
- [ ] 所有测试通过

## 截图/视频
(如果适用)

## 检查清单
- [ ] 代码符合样式指南
- [ ] 已完成自检
- [ ] 需要时添加了注释
- [ ] 已更新文档
- [ ] 已添加测试并通过
```

### 审核流程

#### 对于贡献者
1. **及时响应**：及时处理审核反馈
2. **开放心态**：接受建设性批评
3. **解释决策**：阐明实现选择的原因
4. **保持 PR 专注**：每个 PR 一个功能/修复

#### 对于审核者
1. **建设性**：提供有用的反馈
2. **具体明确**：指出具体问题并建议解决方案
3. **及时**：在合理时间内审核 PR
4. **全面**：检查代码、测试和文档

## 社区准则

### 行为准则
所有贡献者必须遵守我们的行为准则：

#### 我们的承诺
我们承诺让 Bilup 的参与成为每个人的无骚扰体验，无论年龄、体型、残疾、种族、性别认同和表达、经验水平、国籍、外貌、种族、宗教或性取向。

#### 期望行为
- 使用热情和包容性语言
- 尊重不同的观点和经历
- 接受建设性批评
- 专注于对社区最有利的事情
- 对社区成员表示同情

#### 不可接受的行为
- 骚扰、歧视或虐待
- 挑拨、侮辱性评论或人身攻击
- 公开或私人骚扰
- 未经许可发布他人私人信息
- 在专业环境中其他不适当的行为

### 沟通渠道

#### GitHub 讨论
- **功能讨论**：提议和讨论新功能
- **帮助与支持**：获取开发问题帮助
- **一般讨论**：社区公告和讨论

#### Discord/Slack
- **实时聊天**：快速问题和讨论
- **开发协调**：协调开发工作
- **社区活动**：公告和协调

## 贡献认可

### 贡献者
所有贡献者都会在以下地方获得认可：
- **贡献者文件**：GitHub 贡献者列表
- **发布说明**：对特定贡献的致谢
- **文档**：适当的作者署名
- **社区亮点**：精选贡献

### 维护者路线
活跃贡献者可能会被邀请成为维护者：
1. **持续贡献**：定期、高质量的贡献
2. **社区参与**：积极参与讨论和审核
3. **技术专长**：展示对代码库的理解
4. **领导能力**：帮助指导项目方向

## 获取帮助

### 资源
- **文档**：全面的指南和参考
- **示例项目**：示例代码和实现
- **视频教程**：分步学习内容
- **常见问题**：常见问题和答案

### 支持渠道
- **GitHub Issues**：技术问题和 bug 报告
- **讨论区**：功能想法和一般问题
- **Discord**：实时社区支持
- **电子邮件**：敏感问题的直接联系

### 指导
新贡献者可以申请指导：
- **引导入门**：帮助开始
- **代码审核**：对贡献的详细反馈
- **结对编程**：实时协作
- **职业指导**：开源贡献建议

为 Bilup 贡献是一种在提高平台的同时学习和成长为开发者的有意义方式。我们欢迎所有背景和技能水平的贡献者!
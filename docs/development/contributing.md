---
title: Contributing
sidebar_position: 6
---

# Contributing to MistWarp

MistWarp is an open-source project that welcomes contributions from developers of all skill levels. Whether you're fixing bugs, adding features, improving documentation, or helping with translations, your contributions help make MistWarp better for everyone.

## Getting Started

### Prerequisites
Before contributing, ensure you have:
- **Git**: For version control
- **Node.js 16+**: For building and running MistWarp
- **GitHub Account**: For submitting contributions
- **Code Editor**: VS Code recommended with extensions

### Setting Up Development Environment
```bash
# Fork the repository on GitHub
# Clone your fork
git clone https://github.com/YOUR_USERNAME/scratch-gui.git
cd scratch-gui

# Add upstream remote
git remote add upstream https://github.com/MistWarp/scratch-gui.git

# Install dependencies
npm install

# Start development server
npm start
```

## Types of Contributions

### Bug Reports
Help improve MistWarp by reporting bugs:

#### Before Reporting
1. **Search existing issues** to avoid duplicates
2. **Update to latest version** to ensure bug still exists
3. **Test in different browsers** to confirm reproducibility
4. **Gather debug information** from browser console

#### Bug Report Template
```markdown
**Describe the Bug**
Clear description of what the bug is.

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected Behavior**
What you expected to happen.

**Actual Behavior**
What actually happened.

**Environment**
- Browser: [e.g. Chrome 91, Firefox 89]
- OS: [e.g. Windows 10, macOS 11]
- MistWarp Version: [e.g. 1.5.0]

**Additional Context**
- Console errors
- Screenshots/videos
- Project file (if applicable)
```

### Feature Requests
Suggest new features or improvements:

#### Feature Request Guidelines
- **Be specific**: Clearly describe the proposed feature
- **Explain use case**: Why is this feature needed?
- **Consider scope**: Is this a major or minor addition?
- **Check existing requests**: Avoid duplicating requests

#### Feature Request Template
```markdown
**Feature Description**
Clear description of the proposed feature.

**Use Case**
Why is this feature needed? What problem does it solve?

**Proposed Implementation**
How should this feature work?

**Alternatives Considered**
What other solutions have you considered?

**Additional Context**
- Mockups/wireframes
- Related issues
- Implementation notes
```

### Code Contributions

#### Development Workflow
```bash
# 1. Update your fork
git fetch upstream
git checkout main
git merge upstream/main

# 2. Create feature branch
git checkout -b feature/my-new-feature

# 3. Make changes and commit
git add .
git commit -m "Add: new feature description"

# 4. Push to your fork
git push origin feature/my-new-feature

# 5. Create Pull Request on GitHub
```

#### Commit Guidelines
Follow conventional commit format:
```bash
# Format: type(scope): description

# Types:
feat: new feature
fix: bug fix
docs: documentation changes
style: code style changes (formatting, etc.)
refactor: code refactoring
test: adding or updating tests
chore: maintenance tasks

# Examples:
feat(blocks): add new sensing block for mouse wheel
fix(vm): resolve sprite collision detection bug
docs(api): update extension development guide
style(gui): fix linting errors in sprite selector
```

### Documentation

#### Types of Documentation
- **User guides**: Help users understand features
- **Developer docs**: Technical implementation details
- **API documentation**: Reference for developers
- **Tutorials**: Step-by-step learning content

#### Documentation Standards
```markdown
# Follow these standards:

## Clear Headings
Use descriptive, hierarchical headings.

## Code Examples
Provide working code examples:

```javascript
// Good: Complete, working example
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

## Screenshots
Include relevant screenshots with annotations.

## Cross-references
Link to related documentation sections.
```

## Code Standards

### JavaScript/TypeScript Style

#### ESLint Configuration
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

#### Code Formatting
```javascript
// Use consistent formatting:

// Good
const myFunction = (parameter1, parameter2) => {
    if (parameter1 && parameter2) {
        return doSomething(parameter1, parameter2);
    }
    return null;
};

// Bad
const myFunction=(parameter1,parameter2)=>{
if(parameter1&&parameter2){
return doSomething(parameter1,parameter2);}
return null};
```

### React Component Guidelines

#### Component Structure
```jsx
// Good component structure
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
        // Effect logic
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

### Testing Requirements

#### Test Coverage
All contributions should include appropriate tests:
```javascript
// Component test example
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import MyComponent from '../my-component';

describe('MyComponent', () => {
    test('renders with required props', () => {
        render(<MyComponent title="Test Title" />);
        expect(screen.getByText('Test Title')).toBeInTheDocument();
    });
    
    test('calls onAction when clicked', () => {
        const onAction = jest.fn();
        render(
            <MyComponent 
                title="Test" 
                onAction={onAction} 
            />
        );
        
        fireEvent.click(screen.getByText('Test'));
        expect(onAction).toHaveBeenCalledTimes(1);
    });
    
    test('applies active styling when isActive is true', () => {
        const { container } = render(
            <MyComponent 
                title="Test" 
                isActive={true} 
            />
        );
        
        expect(container.firstChild).toHaveClass('active');
    });
});
```

## Pull Request Process

### PR Checklist
Before submitting a pull request:

- [ ] **Code follows style guidelines**
- [ ] **Self-review of code completed**
- [ ] **Comments added for complex logic**
- [ ] **Tests written for new functionality**
- [ ] **All tests pass locally**
- [ ] **Documentation updated**
- [ ] **No merge conflicts**
- [ ] **PR description explains changes**

### PR Template
```markdown
## Description
Brief description of changes and motivation.

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that breaks existing functionality)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots/Videos
(If applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added where needed
- [ ] Documentation updated
- [ ] Tests added and passing
```

### Review Process

#### For Contributors
1. **Be responsive**: Address review feedback promptly
2. **Be open**: Accept constructive criticism
3. **Explain decisions**: Clarify reasoning for implementation choices
4. **Keep PRs focused**: One feature/fix per PR

#### For Reviewers
1. **Be constructive**: Provide helpful feedback
2. **Be specific**: Point out exact issues and suggest solutions
3. **Be timely**: Review PRs within reasonable timeframe
4. **Be thorough**: Check code, tests, and documentation

## Community Guidelines

### Code of Conduct
All contributors must follow our Code of Conduct:

#### Our Pledge
We pledge to make participation in MistWarp a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

#### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

#### Unacceptable Behavior
- Harassment, discrimination, or abuse
- Trolling, insulting comments, or personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct inappropriate in a professional setting

### Communication Channels

#### GitHub Discussions
- **Feature discussions**: Propose and discuss new features
- **Help & Support**: Get help with development issues
- **General**: Community announcements and discussions

#### Discord/Slack
- **Real-time chat**: Quick questions and discussions
- **Development coordination**: Coordinate development efforts
- **Community events**: Announcements and coordination

## Recognition

### Contributors
All contributors are recognized in:
- **Contributors file**: GitHub contributors list
- **Release notes**: Credit for specific contributions
- **Documentation**: Author attribution where appropriate
- **Community highlights**: Featured contributions

### Maintainer Path
Active contributors may be invited to become maintainers:
1. **Consistent contributions**: Regular, quality contributions
2. **Community involvement**: Active in discussions and reviews
3. **Technical expertise**: Demonstrated understanding of codebase
4. **Leadership**: Helps guide project direction

## Getting Help

### Resources
- **Documentation**: Comprehensive guides and references
- **Example projects**: Sample code and implementations
- **Video tutorials**: Step-by-step learning content
- **FAQ**: Common questions and answers

### Support Channels
- **GitHub Issues**: Technical questions and bug reports
- **Discussions**: Feature ideas and general questions
- **Discord**: Real-time community support
- **Email**: Direct contact for sensitive issues

### Mentorship
New contributors can request mentorship:
- **Guided onboarding**: Help getting started
- **Code reviews**: Detailed feedback on contributions
- **Pair programming**: Real-time collaboration
- **Career guidance**: Advice on open source contribution

Contributing to MistWarp is a rewarding way to improve the platform while learning and growing as a developer. We welcome contributors of all backgrounds and skill levels!

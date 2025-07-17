# 🤝 Contributing to DevConnect

Thank you for your interest in contributing to DevConnect! This document provides guidelines and information for contributors.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)

## 📜 Code of Conduct

### Our Pledge
We are committed to making participation in DevConnect a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards
**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Harassment, trolling, or discriminatory comments
- Publishing others' private information without permission
- Any conduct that could reasonably be considered inappropriate

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git
- Code editor (VS Code recommended)

### Development Setup
1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/devconnect.git
   cd devconnect
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 🔄 Development Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/update-description` - Documentation updates
- `refactor/component-name` - Code refactoring
- `test/test-description` - Adding tests

### Example Workflow
```bash
# Create and switch to feature branch
git checkout -b feature/user-search

# Make your changes
# ... code changes ...

# Stage and commit changes
git add .
git commit -m "feat: add user search functionality"

# Push to your fork
git push origin feature/user-search

# Create pull request on GitHub
```

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Message Format
```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples
```bash
feat: add user profile editing functionality
fix: resolve login form validation issue
docs: update API documentation
style: format code according to prettier rules
refactor: optimize database queries
test: add unit tests for auth service
chore: update dependencies
```

### Detailed Commit Messages
For complex changes, include a body:
```
feat: implement real-time notifications

- Add WebSocket connection for live updates
- Create notification component with toast system
- Integrate with backend notification service
- Add notification preferences in user settings

Closes #123
```

## 🔍 Pull Request Process

### Before Submitting
- [ ] Code follows project coding standards
- [ ] All tests pass locally
- [ ] Documentation updated if needed
- [ ] No console errors or warnings
- [ ] Responsive design tested
- [ ] Accessibility considerations addressed

### PR Title Format
Use the same format as commit messages:
```
feat: add user search functionality
fix: resolve mobile navigation issue
```

### PR Description Template
```markdown
## 📋 Description
Brief description of changes made.

## 🔄 Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## 🧪 Testing
- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## 📱 Screenshots (if applicable)
Add screenshots for UI changes.

## ✅ Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Code commented where necessary
- [ ] Documentation updated
- [ ] No new warnings introduced
```

### Review Process
1. **Automated Checks**: All CI checks must pass
2. **Code Review**: At least one maintainer review required
3. **Testing**: Manual testing by reviewer
4. **Approval**: PR approved by maintainer
5. **Merge**: Squash and merge to main branch

## 💻 Coding Standards

### JavaScript/TypeScript
```javascript
// ✅ Good
const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// ❌ Bad
const getUser = (id) => User.findById(id);
```

### React Components
```jsx
// ✅ Good
const UserCard = ({ user, onFollow }) => {
  const [isFollowing, setIsFollowing] = useState(false);
  
  const handleFollow = useCallback(async () => {
    try {
      await onFollow(user.id);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Follow error:', error);
    }
  }, [user.id, isFollowing, onFollow]);

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold">{user.name}</h3>
      <button onClick={handleFollow}>
        {isFollowing ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
};
```

### CSS/Tailwind
```jsx
// ✅ Good - Responsive and accessible
<button className="
  px-4 py-2 
  bg-blue-600 hover:bg-blue-700 
  text-white font-medium 
  rounded-md 
  focus:outline-none focus:ring-2 focus:ring-blue-500 
  disabled:opacity-50 disabled:cursor-not-allowed
  transition-colors duration-200
">
  Submit
</button>

// ❌ Bad - Not responsive or accessible
<button className="bg-blue-600 text-white p-2">
  Submit
</button>
```

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Helper functions
├── contexts/           # React contexts
└── types/              # TypeScript definitions
```

## 🧪 Testing Guidelines

### Unit Tests
```javascript
// Example test for utility function
describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2023-01-01');
    const formatted = formatDate(date);
    expect(formatted).toBe('Jan 1, 2023');
  });
});
```

### Component Tests
```javascript
// Example React component test
describe('UserCard', () => {
  it('should render user information', () => {
    const user = { id: '1', name: 'John Doe', username: 'johndoe' };
    render(<UserCard user={user} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('@johndoe')).toBeInTheDocument();
  });
});
```

### API Tests
```javascript
// Example API endpoint test
describe('POST /api/auth/login', () => {
  it('should return token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

## 🐛 Bug Reports

### Bug Report Template
```markdown
## 🐛 Bug Description
Clear description of the bug.

## 🔄 Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## 💭 Expected Behavior
What you expected to happen.

## 📱 Environment
- OS: [e.g. iOS, Windows, macOS]
- Browser: [e.g. Chrome, Safari, Firefox]
- Version: [e.g. 22]
- Device: [e.g. iPhone 12, Desktop]

## 📎 Additional Context
Screenshots, logs, or other relevant information.
```

## 💡 Feature Requests

### Feature Request Template
```markdown
## 🚀 Feature Description
Clear description of the feature you'd like to see.

## 💭 Motivation
Why is this feature needed? What problem does it solve?

## 📋 Detailed Description
Detailed explanation of how the feature should work.

## 🎨 Mockups/Examples
Visual examples or mockups if applicable.

## 🔧 Implementation Ideas
Any ideas on how this could be implemented.
```

## 📞 Getting Help

- **Documentation**: Check README.md and docs/
- **Issues**: Search existing issues before creating new ones
- **Discussions**: Use GitHub Discussions for questions
- **Discord**: Join our community Discord server

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Special contributor badge in Discord

## 📄 License

By contributing to DevConnect, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to DevConnect! 🎉**

Your contributions help make DevConnect better for the entire developer community.
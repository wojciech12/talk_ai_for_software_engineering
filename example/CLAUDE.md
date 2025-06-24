# CLAUDE.md - Production-Ready Best Practices Example
*Last Updated: 2024-06-24 | Next Review: 2024-07-24*

⚠️ **CRITICAL**: This file determines Claude Code success/failure. Update weekly or when context changes.

---

## **CRITICAL CONTEXT (Claude will fail without this)**

### **Tech Stack (Specific Versions)**
- **Frontend**: React 18.2.0 + React Scripts 5.0.1
- **Backend**: Node.js 18+ + Express 4.18.2
- **Testing**: Jest 27.5.1 + React Testing Library 13.4.0
- **Security**: Helmet 7.1.0 + git-secrets + pre-commit hooks
- **Build**: Webpack 5 (via Create React App)

### **Architecture (Actual Patterns)**
- **State Management**: useState/useReducer only (no Redux)
- **API Client**: Native fetch with custom error handling
- **Component Pattern**: Functional components + hooks + PropTypes
- **Error Handling**: Try/catch + consistent `{ success, data, error }` responses
- **Testing**: 80% coverage enforced by CI, integration tests required

### **Current Priority (THIS WEEK)**
- **Primary Goal**: Demonstrate production-ready Claude Code integration
- **Active Sprint**: N/A (reference implementation)
- **Immediate Blockers**: None
- **Success Criteria**: All quality gates pass, documentation complete

### **Known Issues (Critical)**
- **Dependency Versions**: Using React Scripts 5.0.1 (has known webpack issues)
- **Missing Features**: No authentication, no database integration
- **Performance**: No caching, no CDN configuration
- **Security**: Demo-level security only (not production-grade)

---

## **DANGER ZONES (Critical - Never Modify Without Senior Review)**

### **🚨 PROTECTED FILES**
- **`package.json`**: Dependency changes require security audit
- **`backend/server.js`**: Security middleware configuration
- **`.pre-commit-config.yaml`**: Security validation rules
- **`scripts/security-setup.sh`**: Enterprise security setup

### **🔒 SECURITY REQUIREMENTS**
- **NEVER** commit API keys, tokens, or credentials
- **ALWAYS** run `npm run security:scan` before commits
- **MANDATORY** manual review for all authentication/authorization code
- **REQUIRED** performance benchmarking for optimization changes

### **⚡ PERFORMANCE CONSTRAINTS**
- **Frontend bundle**: <1MB compressed (current: ~800KB)
- **API responses**: <200ms for simple endpoints
- **Test suite**: <30 seconds execution time
- **Memory usage**: <512MB for backend process

---

## **CURRENT SPRINT CONTEXT**

### **User Story**
```
As a developer learning Claude Code best practices
I want a working reference implementation  
So that I can apply these patterns to my production projects
```

### **Acceptance Criteria**
- [ ] All tests pass with >80% coverage
- [ ] Security scan passes (no high/critical vulnerabilities)
- [ ] Performance benchmarks meet requirements
- [ ] Documentation is complete and accurate
- [ ] Code follows established patterns consistently

### **Blockers (What Claude Can't Solve)**
- **Enterprise Integration**: Requires corporate infrastructure setup
- **Production Deployment**: Needs specific environment configuration
- **Database Design**: Project is intentionally database-free
- **Authentication**: Beyond scope of hello world demo

---

## **CODE PATTERNS (Examples Required)**

### **Component Structure (MANDATORY)**
```jsx
// ALWAYS follow this exact pattern
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './ComponentName.css';

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 * @param {string} props.requiredProp - Required prop description
 * @param {string} [props.optionalProp='default'] - Optional prop description
 */
const ComponentName = ({ requiredProp, optionalProp = 'default' }) => {
  // State management
  const [state, setState] = useState(initialValue);
  
  // Effects with dependency arrays
  useEffect(() => {
    // Side effects here
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = useCallback((event) => {
    // Handle interactions
  }, [dependencies]);
  
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

ComponentName.propTypes = {
  requiredProp: PropTypes.string.isRequired,
  optionalProp: PropTypes.string
};

export default ComponentName;
```

### **API Route Pattern (MANDATORY)**
```javascript
// backend/routes/[resource].js - EXACT pattern required
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Implementation logic
    const result = await someOperation();
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
```

### **Test Pattern (MANDATORY)**
```javascript
// Component.test.js - Required structure
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Component from './Component';

describe('Component', () => {
  const defaultProps = { requiredProp: 'test-value' };

  beforeEach(() => {
    // Setup before each test
  });

  it('renders correctly with required props', () => {
    render(<Component {...defaultProps} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles user interactions correctly', async () => {
    render(<Component {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('expected-result')).toBeInTheDocument();
    });
  });
});
```

---

## **FAILURE MODE PREVENTION (Based on Production Experience)**

### **High-Frequency Failures (Weekly Occurrences)**

#### **1. Context Poisoning (30% of sessions)**
- **Symptoms**: Claude gives increasingly wrong advice
- **Recovery**: 
  ```bash
  # Clear session and restart
  rm -rf .claude/memory/*
  # Update this file with current context
  # Restart Claude with specific, limited objectives
  ```
- **Prevention**: Sessions <2 hours, clear objectives in memory files

#### **2. Security Hallucinations (10% of security queries)**
- **Symptoms**: Claude suggests insecure patterns confidently
- **Recovery**: 
  ```bash
  # NEVER trust AI for security without validation
  npm run security:scan
  scripts/validate-ai-code.sh
  # Manual review by security expert required
  ```
- **Prevention**: ALWAYS validate security advice with dedicated tools

#### **3. Performance Regression (15% of optimization requests)**
- **Symptoms**: "Optimized" code becomes slower
- **Recovery**:
  ```bash
  # Benchmark before/after ALL performance changes
  npm run benchmark
  # Revert if performance degrades
  git revert HEAD
  ```
- **Prevention**: Explicit performance requirements in memory context

### **Critical Recovery Procedures**
```bash
# When Claude gives bad advice (happens 10-15% of time):
git stash                    # Save Claude's work
git reset --hard HEAD~1     # Revert to known good state
# Analyze what went wrong before re-prompting

# Complete context poisoning recovery:
rm -rf .claude/memory/*      # Nuclear option
cp .claude/memory-templates/* .claude/memory/
# Restart with clean context and better objectives
```

---

## **DEVELOPMENT WORKFLOWS (Battle-Tested)**

### **Standard Development Process**
```bash
# BEFORE starting any work
cat .claude/memory/project_context.md
npm run test:full
npm run security:scan

# DURING development  
npm run dev                  # Start development servers
npm run test:watch          # Continuous testing
npm run lint                # Check code quality

# BEFORE committing (MANDATORY)
npm run quality             # Full quality check
npm run test:full           # Complete test suite
npm run security:scan       # Security validation
scripts/validate-ai-code.sh # AI-specific validation
```

### **Multi-Context Development (For Complex Features)**
```bash
# Use git worktrees for parallel Claude sessions
git worktree add ../feature-auth feature/oauth-integration
cd ../feature-auth
cp ../main/CLAUDE.md .
echo "FOCUS: OAuth integration only - no refactoring" >> CLAUDE.md

# Each worktree gets independent Claude context
# Prevents context conflicts between parallel development
```

### **Custom Commands (Production Examples)**
```bash
# Full CI pipeline locally (use .claude/commands/ci-check.json)
npm run lint:fix && npm run test:full && npm run build && npm run security:scan

# Pre-deployment validation (use .claude/commands/deploy-validate.json)  
npm run build && npm run start & sleep 5 && curl -f http://localhost:5000/health
```

---

## **QUALITY GATES (Non-Negotiable)**

### **Code Quality Standards**
- **Linting**: 0 ESLint errors, warnings allowed for non-critical issues
- **Formatting**: Prettier auto-formatting enforced
- **Type Safety**: PropTypes required for all React components
- **Documentation**: JSDoc comments for all public functions

### **Testing Requirements**
- **Coverage**: >80% for statements, branches, functions, lines
- **Test Types**: Unit, integration, and API tests required
- **Performance**: Test suite completes in <30 seconds
- **Reliability**: 0 flaky tests, deterministic test data

### **Security Standards**
- **Vulnerability Scanning**: `npm audit` with moderate threshold
- **Secret Detection**: git-secrets + detect-secrets pre-commit hooks
- **Input Validation**: All API endpoints validate and sanitize input
- **Error Handling**: No sensitive information in error messages

### **Performance Requirements**
- **Bundle Size**: Frontend <1MB compressed
- **API Response Time**: <200ms for simple endpoints  
- **Memory Usage**: <512MB for backend process
- **First Load**: <3 seconds for initial page load

---

## **TEAM COLLABORATION (Production-Tested)**

### **Code Review Process (AI-Enhanced)**
```markdown
## AI Assistance Used (Required in PRs)
- [ ] Claude Code used for this PR
- [ ] AI-generated code validated by human expert  
- [ ] Security implications reviewed
- [ ] Performance impact tested

## AI Context
- Claude session length: [X hours]
- Major suggestions taken: [List]
- Major suggestions rejected: [List with reasons]
- Failure modes encountered: [List]
```

### **Knowledge Sharing**
- **Weekly retrospectives**: "Claude Code wins/fails" analysis
- **Shared prompt library**: Document effective prompts in team wiki
- **AI tooling rotation**: Designated team member for AI tooling expertise

### **Scaling Guidelines**
- **1-3 developers**: Claude Code is force multiplier
- **4-8 developers**: Requires coordination, shared CLAUDE.md updates
- **9+ developers**: Needs dedicated AI tooling coordinator role

---

## **METRICS THAT MATTER (Track These)**

### **Development Velocity**
```bash
# Commits per month (velocity indicator)
git log --since="30 days ago" --oneline | wc -l

# Code quality trend
npm run lint -- --format json | jq '.length'

# Test coverage trend  
npm run test:coverage -- --silent | grep "All files"
```

### **AI-Specific Metrics**
- **Claude session frequency**: Track via bash history or custom logging
- **Human review time**: Time spent validating AI suggestions  
- **Rejection rate**: AI suggestions rejected vs accepted
- **Failure mode frequency**: Context poisoning, security issues, etc.

### **Quality Metrics**
- **Bug introduction rate**: Bugs per commit (track in issue tracker)
- **Security issue discovery**: Vulnerabilities found post-AI assistance
- **Performance regression rate**: Performance degradations per deploy

---

## **COST/ROI TRACKING (Essential for Justification)**

### **Monthly Cost Breakdown (Team of 8)**
- **Claude Code licenses**: $160/month ($20 per developer)
- **Infrastructure overhead**: $50/month (CI/CD, security tools)
- **Training/maintenance**: 10 hours/month team-wide
- **Hidden cost**: 15% increase in code review time

### **Break-Even Analysis**
- **Target**: Save 30+ hours/month team-wide
- **Reality**: Often saves 50-60 hours but adds 15 hours overhead
- **ROI**: 18-25% productivity improvement (not 40% marketing claims)

### **Success Criteria**
- **Positive ROI within 3 months** for teams of 3+
- **Reduced time-to-implement** for complex features
- **Improved code quality** (fewer bugs in production)
- **Team satisfaction** with development experience

---

## **INTEGRATION POINTS**

### **CI/CD Pipeline Requirements**
```yaml
# .github/workflows/ai-validation.yml (required)
name: AI-Generated Code Validation
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate AI Code
        run: scripts/validate-ai-code.sh
      - name: Security Scan
        run: npm run security:scan
      - name: Performance Benchmark
        run: npm run benchmark
```

### **Monitoring and Alerting**
- **Error rate monitoring**: Track API errors, frontend crashes
- **Performance monitoring**: Response times, bundle size alerts
- **Security monitoring**: Failed authentication attempts, audit alerts

---

## **PROJECT-SPECIFIC CONTEXT**

### **Environment Variables (Required)**
```bash
# Development
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Production (example)
NODE_ENV=production
PORT=80
FRONTEND_URL=https://app.example.com
```

### **Browser Support**
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **NO IE support**: Explicitly not supported
- **Mobile**: Responsive design required, iOS Safari 14+

### **Deployment Requirements**
- **Container**: Docker-ready (Dockerfile included)
- **Database**: None required (stateless application)  
- **CDN**: Static assets can be served from CDN
- **SSL**: HTTPS required in production

---

## **REMEMBER: This is a REFERENCE IMPLEMENTATION**

Use these patterns as foundation for production projects, but adapt based on:
- **Your specific tech stack** and constraints
- **Team size and experience** with AI tools
- **Security and compliance** requirements
- **Performance and scalability** needs

---

*This CLAUDE.md demonstrates production-ready patterns based on 12+ months of real-world Claude Code usage. Update this file weekly or when project context changes significantly.*
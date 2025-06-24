# Workflow Templates - Standardized Processes

## New Feature Development Workflow

### Prerequisites
- [ ] Read current project context in `project_context.md`
- [ ] Verify development environment is set up
- [ ] Check that all tests are currently passing
- [ ] Review existing code patterns in relevant areas

### Development Process
1. **Planning Phase**
   - Define feature requirements clearly
   - Identify affected components/files
   - Plan test coverage strategy
   - Expected outcome: Clear implementation plan

2. **Implementation Phase**
   - Create feature branch: `git checkout -b feature/[description]`
   - Implement frontend components first (if applicable)
   - Add backend endpoints (if applicable)
   - Expected outcome: Working feature implementation

3. **Testing Phase**
   - Write unit tests for new functionality
   - Run test suite: `npm test`
   - Verify manual testing scenarios
   - Expected outcome: 100% test coverage for new code

4. **Quality Assurance**
   - Run linter: `npm run lint`
   - Fix any formatting issues: `npm run lint:fix`
   - Run type checking: `npm run type-check`
   - Expected outcome: Zero linting errors

### Validation Checklist
- [ ] Feature works as specified
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] Manual testing completed
- [ ] Documentation updated if needed

---

## Bug Fix Workflow

### Investigation Process
1. **Reproduce the Issue**
   - Create minimal reproduction case
   - Document steps to reproduce
   - Identify affected browsers/environments
   - Expected outcome: Clear problem definition

2. **Root Cause Analysis**
   - Check recent git commits for related changes
   - Review error logs and stack traces
   - Test with different data/inputs
   - Expected outcome: Understanding of underlying cause

3. **Solution Development**
   - Implement targeted fix (avoid over-engineering)
   - Add regression test to prevent recurrence
   - Verify fix doesn't break existing functionality
   - Expected outcome: Minimal, effective solution

### Testing Requirements
- [ ] Original issue is resolved
- [ ] Regression test added to test suite
- [ ] Existing tests still pass
- [ ] Manual verification completed

---

## Component Creation Template

### File Structure Setup
```bash
# For new React component
touch src/components/[ComponentName].jsx
touch src/components/[ComponentName].test.js
touch src/components/[ComponentName].module.css  # if needed
```

### Component Implementation Pattern
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * [Brief description of component purpose]
 * @param {Object} props - Component props
 * @param {string} props.requiredProp - Description
 * @param {number} [props.optionalProp] - Description
 */
const ComponentName = ({ requiredProp, optionalProp = defaultValue }) => {
  // State management
  const [localState, setLocalState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Side effects here
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = (event) => {
    // Handle user interactions
  };
  
  // Render logic
  return (
    <div className="component-name">
      {/* JSX content */}
    </div>
  );
};

ComponentName.propTypes = {
  requiredProp: PropTypes.string.isRequired,
  optionalProp: PropTypes.number
};

export default ComponentName;
```

### Test Template
```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from './ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    requiredProp: 'test-value'
  };

  it('renders correctly with required props', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByRole('[appropriate-role]')).toBeInTheDocument();
  });

  it('handles user interactions correctly', () => {
    render(<ComponentName {...defaultProps} />);
    // Test interactions
  });
});
```

---

## API Endpoint Creation Template

### Backend Route Pattern
```javascript
// backend/routes/[resourceName].js
const express = require('express');
const router = express.Router();

/**
 * GET /api/[resource] - Description of endpoint
 */
router.get('/', async (req, res) => {
  try {
    // Implementation logic
    const result = await someAsyncOperation();
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

/**
 * POST /api/[resource] - Description of endpoint
 */
router.post('/', async (req, res) => {
  try {
    // Validate input
    const { requiredField } = req.body;
    if (!requiredField) {
      return res.status(400).json({
        success: false,
        error: 'Required field missing'
      });
    }
    
    // Process request
    const result = await processData(req.body);
    res.status(201).json({
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

### Integration Steps
1. Create route file in `backend/routes/`
2. Add route to main server file
3. Create corresponding frontend API client
4. Add integration tests
5. Update API documentation

---

## Code Review Checklist

### Code Quality
- [ ] Code follows established patterns in codebase
- [ ] Variable and function names are descriptive
- [ ] Comments explain "why" not "what"
- [ ] No hardcoded values or magic numbers
- [ ] Error handling is comprehensive

### React-Specific
- [ ] Functional components used consistently
- [ ] Hooks used correctly (dependency arrays, etc.)
- [ ] PropTypes defined for all components
- [ ] No direct DOM manipulation
- [ ] State updates are immutable

### Node.js/Express-Specific
- [ ] Async/await used consistently
- [ ] Error middleware handles all cases
- [ ] Input validation on all endpoints
- [ ] Appropriate HTTP status codes used
- [ ] No blocking operations in request handlers

### Testing
- [ ] Test coverage for new functionality
- [ ] Edge cases covered in tests
- [ ] Tests are isolated and deterministic
- [ ] Meaningful test descriptions
- [ ] No skipped or disabled tests without reason

---

## Deployment Preparation Workflow

### Pre-Deployment Checklist
- [ ] All tests pass in CI/CD pipeline
- [ ] Performance benchmarks meet requirements
- [ ] Security audit completed (`npm audit`)
- [ ] Environment variables configured
- [ ] Database migrations ready (if applicable)

### Deployment Steps
1. Create production build: `npm run build`
2. Run final test suite: `npm run test:full`
3. Verify build artifacts
4. Deploy to staging environment
5. Smoke test critical functionality
6. Deploy to production
7. Monitor logs and metrics

### Post-Deployment
- [ ] Verify application is responding
- [ ] Check error logs for issues
- [ ] Monitor performance metrics
- [ ] Update project context with deployment notes

---

**Template Usage Notes:**
- Adapt templates to specific project needs
- Update templates as patterns evolve
- Reference these templates in CLAUDE.md for consistency
- Review and refresh templates monthly
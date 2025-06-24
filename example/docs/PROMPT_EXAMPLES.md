# Prompt Engineering Examples for This Project

This document provides **concrete examples** of how to apply PROMPTS.md principles when working with this hello world project using Claude Code.

## Context: Working with This Codebase

**Scenario**: You're a developer working with this example project and want to add new features, fix bugs, or optimize performance. These examples show optimal prompt patterns.

---

## 🎯 Feature Development Prompts

### Example 1: Adding a New Component (Confidence: 94%)

**❌ Ineffective Prompt**:
> "Create a new component for user profiles"

**✅ Optimized Prompt (CLEAR Framework)**:
```
**Context**: This React project uses functional components with hooks, PropTypes validation, and follows the patterns in src/components/HelloWorld.jsx.

**Limitations**: 
- Must use functional components only (no class components)
- Required: PropTypes for all props
- Must include comprehensive tests
- Follow the component template in .claude/memory/workflow_templates.md

**Examples**: See HelloWorld.jsx for proper structure, HelloWorld.test.js for testing patterns

**Action**: Create a UserProfile component that:
- Accepts props: { userId: string, showEmail: boolean }
- Fetches user data from /api/users/{userId}
- Handles loading/error states like HelloWorld component
- Displays user info with avatar, name, email (if showEmail=true)

**Result**: Return the component file, test file, and CSS file ready to commit
```

### Example 2: API Endpoint Development (Confidence: 91%)

**❌ Vague Request**:
> "Add an API for managing users"

**✅ Constraint-Stacked Prompt**:
```
Looking at backend/routes/hello.js for patterns, create a new API route that:

**Technical Requirements**:
- File: backend/routes/users.js
- Follow the exact response format: { success: boolean, data: any, error?: string }
- Use async/await throughout (no raw promises)
- Include comprehensive error handling with try/catch
- Validate all inputs using the patterns from hello.js POST endpoint

**API Endpoints**:
- GET /api/users/{id} - Fetch user by ID
- POST /api/users - Create new user
- PUT /api/users/{id} - Update user
- DELETE /api/users/{id} - Delete user

**Validation Rules**:
- Email must be valid format and unique
- Name required, 2-50 characters
- Age optional, 13-120 range
- Sanitize all string inputs like in hello.js

**Security**:
- Rate limiting on POST/PUT/DELETE
- Input sanitization matching hello.js patterns
- Proper HTTP status codes (200, 201, 400, 404, 500)

**Testing**:
- Create tests/users.test.js following api.test.js structure
- Test all endpoints, validation rules, error cases
- Mock any external dependencies

Return all files ready for integration with existing server.js
```

---

## 🐛 Debugging and Problem-Solving Prompts

### Example 3: Performance Optimization (Confidence: 89%)

**❌ General Request**:
> "This component is slow, make it faster"

**✅ Diagnostic-Driven Prompt**:
```
**Problem Analysis**: The HelloWorld component in src/components/HelloWorld.jsx re-renders excessively when props change.

**Current Behavior**: 
- Re-fetches API on every prop change
- Recalculates button states unnecessarily  
- No memoization for expensive operations

**Debugging Context**:
- React DevTools shows 50+ renders per user interaction
- Network tab shows duplicate API calls
- Target: <5 renders per interaction, <200ms response time

**Optimization Strategy**:
1. Add React.memo with custom comparison function
2. Use useMemo for expensive calculations
3. Implement useCallback for event handlers
4. Add dependency arrays to useEffect

**Constraints**:
- Maintain existing PropTypes and API contract
- Don't break existing tests in HelloWorld.test.js
- Follow React hooks best practices
- Preserve all current functionality

**Validation Plan**:
After optimization:
1. Run existing tests (must pass)
2. Verify <5 renders in React DevTools
3. Confirm API calls only when necessary
4. Test with rapid prop changes

Provide optimized component with performance comments explaining each optimization.
```

### Example 4: Error Investigation (Confidence: 87%)

**❌ Unclear Problem**:
> "The API isn't working"

**✅ Systematic Debugging Prompt**:
```
**Error Investigation**: API endpoint /api/hello returns 500 errors intermittently

**Observed Symptoms**:
- Frontend shows "API Error: Internal server error" 
- Occurs ~20% of requests
- Backend logs show: "TypeError: Cannot read property 'message' of undefined"
- Error happens in backend/routes/hello.js around line 25

**Investigation Steps Required**:
1. **Analyze** backend/routes/hello.js line-by-line for undefined access
2. **Check** error handling patterns vs. working routes
3. **Identify** race conditions or async issues
4. **Review** recent changes in git log affecting hello.js

**Context for Analysis**:
- Current error handling: try/catch with res.status(500).json()
- Expected response format: { success: true, data: { message, timestamp, source, greeting_id } }
- Greetings array should always have valid entries

**Debugging Methodology**:
1. Add console.log statements to isolate the undefined access
2. Check array bounds and async timing
3. Verify error originates from hello.js vs. middleware
4. Test fix with the existing tests in tests/api.test.js

**Expected Output**:
- Root cause identification with specific line numbers
- Fixed code with improved error handling
- Additional tests to prevent regression
- Updated error logging for future debugging
```

---

## 🔧 Code Review and Quality Prompts

### Example 5: Code Review Request (Confidence: 92%)

**❌ Generic Review**:
> "Please review this code"

**✅ Structured Review Prompt**:
```
**Code Review Request**: New API endpoint in backend/routes/auth.js

**Review Criteria** (following quality standards in package.json):
1. **Security**: Input validation, sanitization, authentication
2. **Performance**: Response time <200ms, efficient database queries  
3. **Consistency**: Matches patterns in hello.js and server.js
4. **Error Handling**: Comprehensive try/catch, proper status codes
5. **Testing**: Coverage >80%, edge cases handled

**Specific Focus Areas**:
- Password hashing implementation (vs. plain text storage)
- JWT token generation and validation
- Rate limiting for login attempts
- SQL injection prevention
- CORS configuration alignment

**Project Standards Check**:
- Follows response format: { success, data, error }
- Uses async/await consistently
- Includes PropTypes equivalent (input validation)
- Error messages don't leak sensitive information

**Deliverable Format**:
- Line-by-line feedback with specific improvement suggestions
- Security vulnerabilities ranked by severity (Critical/High/Medium/Low)
- Performance optimization opportunities
- Code style violations (ESLint rules)
- Test coverage gaps with suggested test cases

Rate overall code quality (1-10) with justification.
```

### Example 6: Refactoring Guidance (Confidence: 85%)

**❌ Broad Refactoring**:
> "Refactor this to be better"

**✅ Goal-Oriented Refactoring Prompt**:
```
**Refactoring Goal**: Extract reusable API client logic from HelloWorld component

**Current Problem**:
- Fetch logic duplicated across components
- Error handling inconsistent
- No centralized request/response processing
- Hard to add global features (auth, caching, retries)

**Target Architecture**:
- Create src/utils/apiClient.js with standardized methods
- Implement custom hook useApi() for components
- Centralize error handling and loading states
- Support for request interceptors and response formatting

**Design Constraints**:
- Must work with existing API response format: { success, data, error }
- Maintain current component interfaces (no breaking changes)
- Follow patterns in src/utils/ (if any existing utilities)
- Include TypeScript-style JSDoc comments for documentation

**Refactoring Steps**:
1. Create apiClient.js with methods: get(), post(), put(), delete()
2. Create useApi() hook wrapping useState + useEffect patterns
3. Refactor HelloWorld.jsx to use new hook
4. Update tests to mock the new abstraction layer
5. Add error boundaries for unhandled API errors

**Success Criteria**:
- Reduce component code by >30%
- All existing tests pass without modification
- New API client has >90% test coverage
- Documentation includes usage examples

Provide implementation plan with file-by-file changes.
```

---

## 🧪 Testing and Validation Prompts

### Example 7: Test Development (Confidence: 90%)

**❌ Basic Test Request**:
> "Write tests for this component"

**✅ Comprehensive Testing Prompt**:
```
**Test Development**: Complete test suite for UserProfile component

**Testing Requirements** (following patterns in HelloWorld.test.js):
- React Testing Library for component testing
- Jest for test runner and assertions  
- Mock all API calls with fetch.mockResolvedValue()
- Test coverage >90% (statements, branches, functions)

**Test Categories Required**:

1. **Rendering Tests**:
   - Component renders with required props
   - Shows loading state initially
   - Displays user data when API succeeds
   - Handles missing optional props gracefully

2. **API Integration Tests**:
   - Successful API response renders correctly
   - HTTP error responses trigger error states
   - Network failures show fallback message
   - Malformed API responses handled gracefully

3. **User Interaction Tests**:
   - Email toggle shows/hides email address
   - Refresh button re-fetches user data
   - Edit button opens edit mode (if implemented)
   - All buttons disabled during loading

4. **Edge Case Tests**:
   - Very long names don't break layout
   - Missing avatar URL shows default image
   - Special characters in name display correctly
   - Component unmounts cleanly (no memory leaks)

5. **Accessibility Tests**:
   - Proper ARIA labels and roles
   - Screen reader compatibility
   - Keyboard navigation support
   - Color contrast compliance

**Mock Strategy**:
- Mock fetch for all API calls
- Mock Image loading for avatar tests
- Mock console.error for error boundary tests
- Provide realistic test data matching API schema

**File Structure**:
- Main test file: UserProfile.test.js
- Test utilities: __tests__/utils/testHelpers.js (if needed)
- Mock data: __tests__/fixtures/userData.js

Organize tests with clear describe blocks and meaningful test descriptions.
```

---

## 📊 Performance and Monitoring Prompts

### Example 8: Performance Analysis (Confidence: 88%)

**❌ Vague Performance Request**:
> "Check if this is fast enough"

**✅ Metrics-Driven Performance Prompt**:
```
**Performance Analysis**: Full-stack performance audit for production readiness

**Current Performance Baseline**:
- Frontend bundle size: Unknown
- API response times: Unknown  
- Lighthouse scores: Unknown
- Test suite execution time: Unknown

**Performance Targets** (from CLAUDE.md requirements):
- Frontend bundle <1MB compressed
- API responses <200ms for simple endpoints
- Lighthouse Performance score >90
- Test suite completes <30 seconds

**Analysis Methodology**:

1. **Frontend Performance**:
   - Run npm run build and analyze bundle size
   - Use webpack-bundle-analyzer for bundle composition
   - Lighthouse audit on production build
   - Measure Time to First Byte (TTFB) and Largest Contentful Paint (LCP)

2. **Backend Performance**:
   - Profile API endpoints with curl -w timing
   - Monitor memory usage during load testing
   - Check for N+1 queries or inefficient operations
   - Validate response time distribution (not just averages)

3. **Full-Stack Integration**:
   - End-to-end response times from browser
   - Network waterfall analysis
   - Critical render path optimization opportunities

**Deliverable Format**:
- Current vs. target performance metrics table
- Specific bottlenecks with line number references
- Optimization recommendations ranked by impact/effort
- Implementation plan for top 3 optimizations
- Monitoring setup to track improvements

Include before/after benchmarks for any optimizations implemented.
```

---

## 💡 Advanced Prompt Patterns

### Chain-of-Thought Activation
```
**Step-by-step analysis required**:

Think through this systematically:
1. **Analyze** the current implementation in HelloWorld.jsx
2. **Identify** specific performance bottlenecks
3. **Design** optimization strategy considering React patterns
4. **Implement** changes with backward compatibility
5. **Validate** improvements with measurements

For each step, explain your reasoning and show your work.
```

### Few-Shot Learning Examples
```
**Pattern Examples** (follow these formats):

**API Response Pattern**:
```javascript
// Success response
{ success: true, data: { message: "Hello!", timestamp: "..." } }

// Error response  
{ success: false, error: "Validation failed: name required" }
```

**Component Pattern**:
```javascript
const ComponentName = ({ requiredProp, optionalProp = "default" }) => {
  const [state, setState] = useState(initialValue);
  // implementation
  return <div>{content}</div>;
};
```

Now create a similar pattern for [your specific requirement].
```

### Self-Validation Prompts
```
**Implementation with Self-Check**:

After completing the implementation:
1. **Verify** it follows the component template in workflow_templates.md
2. **Check** all PropTypes are defined correctly  
3. **Confirm** tests cover all edge cases identified
4. **Validate** it matches existing code patterns
5. **Rate** the implementation quality (1-10) with specific areas for improvement

If any checks fail, revise the implementation before presenting the final version.
```

---

## 📈 Success Metrics for These Prompts

**Effective prompts should result in**:
- **High first-attempt success rate** (>80% of code works without iteration)
- **Consistent code quality** (matches project patterns automatically)  
- **Comprehensive solutions** (includes tests, documentation, error handling)
- **Reduced clarification rounds** (<2 follow-up questions needed)
- **Production-ready output** (passes all quality gates immediately)

**Metrics to track**:
- Time from prompt to working implementation
- Number of revision cycles required
- Code review feedback volume
- Test coverage achieved
- Alignment with project standards

---

*These examples demonstrate the principles from PROMPTS.md applied to concrete development scenarios. Adapt the patterns to your specific use cases and technology stack.*
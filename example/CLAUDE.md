# CLAUDE.md - Hello World Best Practices Example

This file provides guidance to Claude Code when working with this example project that demonstrates AI development best practices.

## Repository Overview

This is a **demonstration project** showing optimal Claude instruction patterns. It contains a full-stack "Hello World" application (Node.js backend + React frontend) structured to showcase:
- Proper Claude instruction architecture
- Memory management patterns  
- Prompt engineering integration
- Tool configuration best practices

**IMPORTANT**: This is a reference implementation. ALWAYS follow the patterns established here when working on similar projects.

## Repository Structure

```
example/
├── CLAUDE.md                 # This file - behavioral instructions
├── .claude/
│   ├── memory/              # Persistent context files
│   │   ├── project_context.md    # Current project state
│   │   ├── workflow_templates.md # Standard processes
│   │   └── decisions.md           # Architecture decisions
│   └── commands/            # Custom command definitions
├── src/                     # Frontend React application
│   ├── components/          # Reusable UI components
│   │   └── HelloWorld.jsx   # Main demo component
│   ├── utils/              # Shared utilities
│   └── App.js              # Application entry point
├── backend/                 # Node.js API server
│   ├── server.js           # Express server setup
│   └── routes/             # API route handlers
├── tests/                   # Test suites
├── docs/                    # Project documentation
└── package.json            # Dependencies and scripts
```

## Working Instructions

### Frontend Development (React)
When working with `src/` files:
- **MUST** use functional components with hooks
- **ALWAYS** create components in `src/components/`
- **NEVER** modify `App.js` without reviewing dependencies first
- **BEFORE** adding new components, check existing patterns in `src/components/`

### Backend Development (Node.js)
When working with `backend/` files:
- **MUST** follow RESTful conventions for routes
- **ALWAYS** add error handling to route handlers
- **ONLY** use middleware defined in `server.js`
- **BEFORE** adding routes, check `backend/routes/` structure

### Testing Requirements
For ALL code changes:
- **MUST** run `npm test` before considering task complete
- **ALWAYS** add tests for new functionality in `tests/`
- **NEVER** commit failing tests
- Use the command: `npm run test:watch` for development

### Development Workflow
**IMPORTANT**: Follow this sequence EXACTLY:

1. **BEFORE starting**: Read `.claude/memory/project_context.md`
2. **For new features**: 
   - Check `.claude/memory/workflow_templates.md`
   - Create branch: `git checkout -b feature/[description]`
   - Implement with tests
   - Run full test suite: `npm run test:full`
3. **BEFORE committing**: 
   - Run linter: `npm run lint`
   - Run type check: `npm run type-check` 
   - Update `.claude/memory/decisions.md` if architecture changed

## Important Commands/Scripts

### Development Commands
```bash
# Start development environment
npm run dev          # Starts both frontend and backend
npm run dev:frontend # React dev server only
npm run dev:backend  # Node.js server only

# Testing and Quality
npm test            # Run test suite
npm run test:watch  # Watch mode for development  
npm run test:full   # Full test suite with coverage
npm run lint        # ESLint code quality check
npm run lint:fix    # Auto-fix linting issues
npm run type-check  # TypeScript type validation
```

### Build and Deployment
```bash
npm run build       # Production build
npm run start       # Start production server
npm run preview     # Preview production build
```

## Context-Specific Guidance

### Code Style Requirements
- **JavaScript/JSX**: Use ES6+ syntax, destructuring, arrow functions
- **Imports**: Absolute imports from `src/`, relative for local files
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Files**: Use `.jsx` for React components, `.js` for utilities

### Error Handling Patterns
```javascript
// Frontend - Component error handling
const [error, setError] = useState(null);
if (error) return <ErrorComponent message={error} />;

// Backend - Route error handling  
app.get('/api/route', async (req, res) => {
  try {
    // logic here
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Component Structure Template
```jsx
// ALWAYS follow this pattern for new components
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2 }) => {
  // State and effects here
  
  return (
    <div className="component-name">
      {/* JSX here */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number
};

export default ComponentName;
```

### API Integration Standards
- **ALWAYS** use async/await, not promises directly
- **MUST** handle loading states in components
- **NEVER** put API calls directly in components - use custom hooks
- **BEFORE** adding new endpoints, check existing patterns

### Memory Management Instructions
- **Update** `.claude/memory/project_context.md` when changing focus
- **Document** major decisions in `.claude/memory/decisions.md`
- **Reference** workflow templates for standard processes
- **NEVER** let memory files become stale - refresh weekly

### Debugging Guidelines
When investigating issues:
1. **Check console** for JavaScript errors first
2. **Verify API responses** using browser dev tools
3. **Review recent changes** in git log
4. **Check tests** for related functionality
5. **Update documentation** after resolving

## Tool Configuration

### Required Tools
- Node.js 18+ for backend development
- npm 8+ for package management  
- ESLint for code quality
- Prettier for code formatting
- Jest for testing

### IDE Integration
- VS Code settings in `.vscode/settings.json`
- ESLint and Prettier extensions required
- Recommended: ES7+ React/Redux/React-Native snippets

## Project-Specific Constraints

### Performance Requirements
- **Frontend bundle** must be < 1MB compressed
- **API responses** must be < 200ms for simple endpoints
- **Tests** must complete in < 30 seconds

### Security Considerations  
- **NEVER** commit API keys or secrets
- **ALWAYS** validate user input on backend
- **MUST** use HTTPS in production
- **BEFORE** deployment, run security audit: `npm audit`

### Browser Support
- **Modern browsers** (Chrome 90+, Firefox 88+, Safari 14+)
- **NO IE support** required
- **Mobile responsive** design mandatory

---

**This CLAUDE.md demonstrates the instruction patterns from INSTRUCTIONS.md applied to a concrete project. Use this as a template for similar full-stack applications.**
# Project Context - Hello World Best Practices Demo

## Active Project: Hello World Full-Stack Demo
**Purpose**: Demonstrate Claude instruction best practices with concrete implementation
**Status**: Initial development phase
**Priority**: High (reference implementation)

## Current Session Focus
- **Primary Goal**: Create working hello world app showing best practices
- **Active Components**: React frontend + Node.js backend
- **Immediate Tasks**: Basic functionality, proper structure, documentation

## Key Files and Their Purposes

### Configuration Files
- `CLAUDE.md` - Main behavioral instructions (✅ Complete)
- `package.json` - Dependencies and scripts (⏳ Pending)
- `.claudeignore` - File exclusion patterns (⏳ Pending)

### Application Files  
- `src/App.js` - React application entry point (⏳ Pending)
- `src/components/HelloWorld.jsx` - Main demo component (⏳ Pending)
- `backend/server.js` - Express server setup (⏳ Pending)
- `backend/routes/hello.js` - Hello world API endpoint (⏳ Pending)

### Supporting Files
- `tests/` - Test suites for both frontend and backend (⏳ Pending)
- `docs/` - Additional documentation (⏳ Pending)

## Architecture Decisions Made

### Technology Stack
- **Frontend**: React 18 with hooks (functional components only)
- **Backend**: Node.js with Express
- **Testing**: Jest with React Testing Library
- **Linting**: ESLint with Prettier
- **Build**: Webpack via Create React App

### Project Structure Rationale
- Separate `src/` and `backend/` for clear separation of concerns
- `.claude/` directory for persistent context and commands
- `tests/` at root level for comprehensive test coverage
- Component-based architecture for scalability

### Code Style Decisions
- ES6+ syntax throughout
- Functional components with hooks
- Async/await for asynchronous operations
- PropTypes for component validation
- Absolute imports from `src/` directory

## Recent Context Changes
- **2024-06-24**: Project initialized with directory structure
- **2024-06-24**: CLAUDE.md created with comprehensive instructions
- **2024-06-24**: Memory management system established

## Dependencies and Constraints

### External Dependencies
- Node.js 18+ (required for modern JavaScript features)
- npm 8+ (for package management)
- Modern browser support (no IE compatibility needed)

### Performance Constraints
- Frontend bundle < 1MB compressed
- API responses < 200ms
- Test suite < 30 seconds execution time

### Security Requirements
- No hardcoded secrets or API keys
- Input validation on all backend endpoints
- HTTPS in production deployment

## Integration Points

### Development Workflow
1. Code changes in `src/` or `backend/`
2. Automatic linting and formatting
3. Test execution before commits
4. Memory updates for significant changes

### Communication Patterns
- Frontend communicates with backend via REST API
- Error handling at both application and component levels
- Loading states managed in React components
- API responses follow consistent JSON structure

## Success Metrics

### Completion Criteria
- [ ] Application runs successfully with `npm run dev`
- [ ] All tests pass with `npm test`
- [ ] Linting passes with `npm run lint`
- [ ] Hello world message displays correctly
- [ ] API endpoints respond as expected

### Quality Standards
- Code coverage > 80%
- No linting errors or warnings
- All components have proper PropTypes
- Error handling implemented throughout
- Documentation complete and accurate

---

**Last Updated**: 2024-06-24
**Next Review**: Weekly (or when architecture changes)
**Maintained By**: Claude Code assistant following INSTRUCTIONS.md patterns
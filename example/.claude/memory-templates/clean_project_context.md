# Clean Project Context Template
*Use this to recover from context poisoning or start fresh sessions*

## Active Project: Hello World Best Practices Demo
**Purpose**: Reference implementation for Claude Code best practices
**Status**: [UPDATE: Current development phase]
**Priority**: [UPDATE: Current priority level]

## Current Session Focus
- **Primary Goal**: [UPDATE: Specific current objective]
- **Active Components**: [UPDATE: What you're working on]
- **Immediate Tasks**: [UPDATE: Next 1-3 tasks]
- **Context Limit**: [UPDATE: Session scope - keep narrow to prevent poisoning]

## Key Files and Their Purposes

### Recently Modified Files
- [UPDATE: List files changed in last session]
- [UPDATE: Purpose of each change]

### Critical Files (Don't Touch Without Review)
- `CLAUDE.md` - Behavioral instructions
- `package.json` - Dependencies and scripts  
- `backend/server.js` - Security middleware config
- `.pre-commit-config.yaml` - Security validation

### Working Files (Safe to Modify)
- `src/components/` - React components
- `backend/routes/` - API endpoints
- `tests/` - Test files
- `docs/` - Documentation

## Architecture Constraints (This Session)
- **No breaking changes** to existing APIs
- **Maintain test coverage** >80%
- **Follow security patterns** in existing code
- **Preserve performance** requirements

## Session Success Criteria
- [ ] [UPDATE: Specific deliverable 1]
- [ ] [UPDATE: Specific deliverable 2]  
- [ ] [UPDATE: Specific deliverable 3]
- [ ] All tests pass
- [ ] No security vulnerabilities introduced

## Failure Mode Prevention
- **Session length**: <2 hours to prevent context poisoning
- **Scope limit**: Single feature or bug fix only
- **Validation**: Run tests after each significant change
- **Recovery plan**: `git stash && git reset --hard HEAD~1` if needed

---

**Last Updated**: [UPDATE: Current timestamp]
**Session Start**: [UPDATE: When this session began]
**Expected End**: [UPDATE: When to wrap up]

**Instructions for Use**:
1. Copy this to `.claude/memory/project_context.md`
2. Update ALL bracketed placeholders with current values
3. Keep focused on single objective to prevent context drift
4. Refresh every 2 hours or when changing focus areas
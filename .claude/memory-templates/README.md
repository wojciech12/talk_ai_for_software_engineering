# Claude Code Memory Templates

This directory contains memory templates for team collaboration and onboarding.

## Usage

### New Team Member Setup
```bash
# Copy onboarding template to active memory
cp .claude/memory-templates/onboarding/* .claude/memory/

# Start Claude Code with team context
claude
```

### Weekly Memory Refresh (Optional)
```bash
# Clear stale memory and restart with clean team context
rm -rf .claude/memory/*
cp .claude/memory-templates/onboarding/* .claude/memory/
```

## Template Structure

### `/onboarding/`
**Purpose**: Bootstrap new team members with project context
- `project_context.md` - Overall project understanding
- `common_tasks.md` - Frequent operations and patterns  
- `setup_checklist.md` - Onboarding validation steps

### Adding New Templates
```bash
# Create specialized memory for different workflows
mkdir .claude/memory-templates/presentation-updates
mkdir .claude/memory-templates/documentation-review

# Export current memory state after completing representative tasks
cp -r .claude/memory/* .claude/memory-templates/your-workflow/
```

## Best Practices

### Do This ✅
- Copy templates to bootstrap new team members
- Update templates when project patterns change
- Use templates for consistent onboarding experience
- Version control templates (safe to commit)

### Don't Do This ❌
- Don't version control active `.claude/memory/` (contains session state)
- Don't share memory files directly between developers  
- Don't rely on memory templates for critical project information (use CLAUDE.md)
- Don't let templates become stale (review monthly)

## Memory vs Documentation

**Memory Templates**: Session bootstrapping, workflow patterns
**CLAUDE.md**: Authoritative project context and instructions
**README files**: Human-readable project documentation

Memory templates supplement but never replace proper project documentation.
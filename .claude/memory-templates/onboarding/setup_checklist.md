# Setup Checklist - Memory Template

## New Team Member Onboarding

### Day 1: Environment Setup
- [ ] Clone repository
- [ ] Install Claude Code: `npm install -g @anthropic-ai/claude-code`
- [ ] Verify Prettier: `npx prettier --version`
- [ ] Test Marp: `npx @marp-team/marp-cli@latest --version`
- [ ] Copy memory template: `cp .claude/memory-templates/onboarding/* .claude/memory/`

### Day 1: Project Understanding
- [ ] Read CLAUDE.md (project context)
- [ ] Review README.md (casual overview)
- [ ] Review README.claude.md (expert analysis)
- [ ] Understand file structure and purpose
- [ ] Test custom commands: `/format` and `/format:fix`

### Week 1: Contributing
- [ ] Make test documentation change
- [ ] Run formatting commands
- [ ] Compile slides to PDF
- [ ] Review MCP configuration
- [ ] Understand .claudeignore patterns

## Environment Validation

### Required Tools
```bash
# Verify installations
node --version          # Node.js for npm packages
npm --version           # Package manager
npx prettier --version  # Code formatting
npx @marp-team/marp-cli@latest --version  # Slide compilation
claude --version        # Claude Code CLI
```

### Project-Specific Setup
```bash
# Test custom commands
cd /path/to/project
claude                  # Start Claude Code
/format                 # Should run prettier check
/format:fix            # Should run prettier write

# Test slide compilation
cd slides
npx @marp-team/marp-cli@latest slides.md -o test.pdf
rm test.pdf            # Cleanup test file
```

### Memory Template Usage
```bash
# Copy team memory (one-time setup)
cp .claude/memory-templates/onboarding/* .claude/memory/

# Weekly memory refresh (optional)
rm -rf .claude/memory/*
cp .claude/memory-templates/onboarding/* .claude/memory/
# Let Claude Code rebuild from clean state
```

## Troubleshooting

### Common Issues
1. **Prettier not found**: Install with `npm install -g prettier`
2. **Marp compilation fails**: Check Node.js version (>= 16)
3. **Claude Code proxy issues**: Configure corporate proxy in environment
4. **Memory template conflicts**: Clear `.claude/memory/` and restart

### Project-Specific Issues
1. **Slides don't compile**: Check Marp YAML frontmatter syntax
2. **Format commands fail**: Verify file permissions and paths
3. **MCP not working**: Check `.mcp.json` configuration
4. **Git conflicts in .claude/**: Ensure `.claude/memory/*` in .gitignore

## Success Criteria

### You're ready to contribute when:
- [ ] Can run all custom commands successfully
- [ ] Understand the difference between README.md and README.claude.md
- [ ] Can compile slides from Markdown to PDF
- [ ] Know when to use each documentation format
- [ ] Understand the project's "brutal honesty" approach to AI tool recommendations

### Advanced Setup (Optional)
- [ ] Configure MCP servers for enhanced Claude Code functionality
- [ ] Set up pre-commit hooks for quality assurance
- [ ] Customize .claudeignore for your workflow
- [ ] Create personal workflow commands in .claude/commands/
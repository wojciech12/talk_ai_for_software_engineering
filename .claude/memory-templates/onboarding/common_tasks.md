# Common Tasks - Memory Template

## Frequent Operations

### Documentation Updates
```bash
# Edit main documentation
vim README.md                   # Casual notes format
vim README.claude.md           # Expert engineering guide

# Format documentation  
/format:fix                    # Apply Prettier formatting
```

### Presentation Management
```bash
# Update slides
vim slides/slides.md           # Edit Marp presentation

# Compile presentation
cd slides
npx @marp-team/marp-cli@latest slides.md -o slides.pdf

# Or use custom command (if available)
# /create_slides.md
```

### Quality Assurance
```bash
# Check formatting
/format                        # Prettier check only

# Full quality check
npx prettier . --check         # Format validation
git status                     # Check for changes
```

## Content Patterns

### When Adding Tool Recommendations
1. **Include confidence levels** (60-95%)
2. **Provide cost analysis** (monthly costs, ROI timeline)
3. **Document failure modes** (what goes wrong, how to recover)
4. **Add enterprise context** (team scaling, security requirements)

### When Updating Slides
- Use Marp YAML frontmatter for configuration
- Maintain Gaia theme consistency
- Include practical examples over theory
- Add speaker notes for complex topics

### When Reviewing AI Tool Advice
- Validate against production experience
- Include both benefits AND drawbacks
- Provide measurable metrics where possible
- Consider team size and experience level

## Project-Specific Conventions

### File Organization
- Keep README.md casual/accessible
- Keep README.claude.md technical/detailed  
- Slides focus on key takeaways
- Use CLAUDE.md for project-specific context

### Quality Standards
- All recommendations must include confidence levels
- Cost analysis required for tool suggestions
- Security considerations mandatory
- Failure mode documentation preferred

### Team Handoff
- New contributors should read CLAUDE.md first
- Review both README files for different perspectives
- Test custom commands after setup
- Validate MCP configuration if needed
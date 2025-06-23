# AI Tools for Software Engineering - Project Memory Template

## Project Overview
- **Type**: Presentation/Documentation project
- **Purpose**: Best practices for AI tools in software development
- **Target Audience**: Software engineers, technical teams
- **Format**: Marp presentation + documentation

## Key Files Structure
```
/
├── CLAUDE.md                    # Project instructions for Claude Code
├── README.md                    # Main documentation (notes format)
├── README.claude.md             # Expert engineering recommendations
├── notes.md                     # Simple VS Code Copilot reference
├── slides/
│   ├── slides.md               # Marp presentation source
│   └── slides.pdf              # Compiled presentation
├── .claude/
│   ├── commands/               # Custom Claude Code commands
│   │   ├── format              # Prettier check
│   │   ├── format:fix          # Prettier fix
│   │   └── create_slides.md    # Marp compilation
│   └── memory-templates/       # Team memory templates
├── .claudeignore               # AI context filtering
├── .gitignore                  # Version control exclusions
└── .mcp.json                   # Model Context Protocol config
```

## Content Focus Areas
1. **Claude Code** - Primary AI coding assistant
2. **GitHub Copilot** - IDE integration and completion
3. **MCP (Model Context Protocol)** - Server integrations
4. **Best Practices** - Production-ready workflows
5. **Security** - AI tool security considerations

## Workflows
- **Presentation updates**: Edit slides.md → compile to PDF
- **Documentation**: Maintain both casual (README.md) and expert (README.claude.md) versions
- **Code quality**: Use format/format:fix commands for consistency

## Current State
- Documentation-focused project (not code-heavy)
- Presentation slides use Marp with Gaia theme
- Contains both beginner and expert-level recommendations
- MCP integration configured but minimal usage

## Team Context
- Project maintainer has senior Anthropic engineering perspective
- Focus on honest, production-ready advice vs marketing material
- Emphasis on cost/benefit analysis and failure modes
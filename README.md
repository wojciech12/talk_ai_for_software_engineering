# Best Practices for Using AI in Software Development - Notes

Tools / IDE:

- Claude Code
- Github Copilot
- Cline/Roo/Kilo

Out of scope:

- Cursor and Windsurf
- Cline/Roo/Kilo
- Zed
- Jetbrains AI/Junie (out of scope)

MCP:

- xyz

Communities:

- reddit :D

## Resources

Antropic - great to know:

- modes (shift-tab) - plan, edit...
- `PLAN.md`
- Getting started:
  - https://docs.anthropic.com/en/docs/claude-code/memory
  - https://docs.anthropic.com/en/docs/claude-code/common-workflows
  - https://www.anthropic.com/engineering/claude-code-best-practices

Github Copilot:

- Ask Github to create the instructions, etc.
- You can link, e.g., your CLAUDE.md to your github copilot configs
- ALWAYS use agentic mode
- https://code.visualstudio.com/docs/copilot/copilot-customization

Cline (WIP):

- https://docs.cline.bot/prompting/cline-memory-bank

Model selection:

- https://docs.cline.bot/getting-started/model-selection-guide (a good summary)

Instructions/rules:

- Instructions should reflect your project phase, e.g., at the begining - one file, minimum tests,... the more mature project, the more strict the instructions
- Code examples, concrete, ...
- Example: https://raw.githubusercontent.com/modelcontextprotocol/python-sdk/refs/heads/main/CLAUDE.md

Prompts:

- deep thinking modes (for example, [claude](https://docs.anthropic.com/en/docs/claude-code/common-workflows#use-extended-thinking))
- magic formulas: "be consise, focus on clarity", "you are senior XYZ", ...
- https://docs.github.com/en/copilot/using-github-copilot/copilot-chat/prompt-engineering-for-copilot-chat (good start)
- https://docs.anthropic.com/en/resources/prompt-library/library

Reducing Hallucinations:

- cut the space (specify library, give an example)
- TBA
- https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/reduce-hallucinations

Security:

- ignore file - every tool has its own, for example, `.claudeignore` for Claude Code

## Parking lot

- gradio_api

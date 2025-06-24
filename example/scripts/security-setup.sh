#!/bin/bash
# Production-grade security setup for Claude Code projects
# Based on README.claude.md enterprise requirements

set -e

echo "🔒 Setting up enterprise-grade security..."

# Install git-secrets (catch AWS keys, API tokens, etc.)
if ! command -v git-secrets &> /dev/null; then
    echo "Installing git-secrets..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install git-secrets
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Build from source on Linux
        git clone https://github.com/awslabs/git-secrets.git /tmp/git-secrets
        cd /tmp/git-secrets && make install
    fi
fi

# Configure git-secrets for this repo
echo "Configuring git-secrets..."
git secrets --install
git secrets --register-aws
git secrets --register-azure
git secrets --register-gcp

# Add custom patterns for this project
git secrets --add 'claude_api_key.*["\s]sk-[a-zA-Z0-9]+'
git secrets --add 'ANTHROPIC_API_KEY.*["\s][a-zA-Z0-9-]+'
git secrets --add 'password.*["\s][^"\s]{8,}'
git secrets --add 'secret.*["\s][^"\s]{16,}'

# Install pre-commit hooks (mandatory for production)
echo "Installing pre-commit hooks..."
if ! command -v pre-commit &> /dev/null; then
    pip install pre-commit
fi

# Create pre-commit configuration
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-json
      - id: check-added-large-files
        args: ['--maxkb=1000']
      - id: detect-private-key
      - id: detect-aws-credentials

  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  - repo: local
    hooks:
      - id: git-secrets
        name: git-secrets
        entry: git-secrets --pre_commit_hook --
        language: system
        pass_filenames: false

      - id: npm-audit
        name: npm-audit
        entry: npm audit --audit-level moderate
        language: system
        pass_filenames: false

      - id: claude-generated-code-review
        name: claude-generated-code-review
        entry: scripts/validate-ai-code.sh
        language: system
        files: '\.(js|jsx|ts|tsx)$'
EOF

# Install pre-commit hooks
pre-commit install

# Create secrets baseline (for detect-secrets)
detect-secrets scan --baseline .secrets.baseline

# Set up NPM security scanning
echo "Configuring npm security scanning..."
npm install -D audit-ci
npm audit --audit-level moderate

# Create validation script for AI-generated code
cat > scripts/validate-ai-code.sh << 'EOF'
#!/bin/bash
# Validate AI-generated code before commit
# Based on README.claude.md failure mode prevention

echo "🤖 Validating AI-generated code..."

# Check for common AI hallucinations
if grep -r "TODO.*Claude" src/ backend/ 2>/dev/null; then
    echo "❌ Found unresolved Claude TODOs"
    exit 1
fi

# Check for security anti-patterns
if grep -r "eval\|innerHTML\|dangerouslySetInnerHTML" src/ 2>/dev/null; then
    echo "⚠️  Potential security risk detected - manual review required"
    echo "AI-generated code contains potentially dangerous patterns"
fi

# Check for performance anti-patterns
if grep -r "useEffect.*\[\].*fetch\|while.*true\|for.*in.*array" src/ 2>/dev/null; then
    echo "⚠️  Potential performance issue detected - benchmark required"
fi

# Validate test coverage for new files
if git diff --cached --name-only | grep -E '\.(js|jsx)$' | grep -v test; then
    echo "📊 Checking test coverage for modified files..."
    npm run test:coverage -- --silent --passWithNoTests
fi

echo "✅ AI code validation complete"
EOF

chmod +x scripts/validate-ai-code.sh

echo "🔒 Security setup complete!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run security:scan' before each commit"
echo "2. Review scripts/validate-ai-code.sh for project-specific rules"
echo "3. Update .secrets.baseline when adding legitimate secrets (encrypted)"
echo "4. Test pre-commit hooks: git commit --allow-empty -m 'test hooks'"
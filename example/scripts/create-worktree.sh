#!/bin/bash
# Git Worktree Management for Claude Code
# Prevents context conflicts during parallel development

set -e

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Error: Not in a git repository"
    exit 1
fi

# Get current directory name for base path
CURRENT_DIR=$(basename "$(pwd)")
BASE_DIR="../"

# Function to show usage
show_usage() {
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  create <branch-name> <focus>  - Create new worktree for isolated Claude session"
    echo "  list                          - List all active worktrees"
    echo "  remove <branch-name>          - Remove worktree and branch"
    echo "  switch <branch-name>          - Switch to existing worktree"
    echo ""
    echo "Examples:"
    echo "  $0 create feature-auth 'OAuth integration only'"
    echo "  $0 create hotfix-security 'Security fix - no refactoring'"
    echo "  $0 list"
    echo "  $0 remove feature-auth"
    echo ""
}

# Function to create a new worktree
create_worktree() {
    local branch_name="$1"
    local focus="$2"
    
    if [ -z "$branch_name" ] || [ -z "$focus" ]; then
        echo "❌ Error: Branch name and focus description required"
        show_usage
        exit 1
    fi
    
    local worktree_path="${BASE_DIR}${CURRENT_DIR}-${branch_name}"
    
    echo "🌿 Creating worktree for isolated Claude session..."
    echo "  Branch: $branch_name"
    echo "  Path: $worktree_path"
    echo "  Focus: $focus"
    echo ""
    
    # Create the worktree and branch
    git worktree add "$worktree_path" -b "$branch_name"
    
    # Navigate to the new worktree
    cd "$worktree_path"
    
    # Copy base CLAUDE.md configuration
    cp "../${CURRENT_DIR}/CLAUDE.md" .
    
    # Create focused CLAUDE.md context
    cat >> CLAUDE.md << EOF

---

## **WORKTREE ISOLATION CONTEXT**

### **This Session Focus (MANDATORY)**
- **Isolated Objective**: $focus
- **Branch**: $branch_name
- **Worktree**: $worktree_path
- **Created**: $(date)

### **CRITICAL ISOLATION RULES**
- **ONLY work on**: $focus
- **DO NOT**: Refactor unrelated code
- **DO NOT**: Change shared dependencies
- **DO NOT**: Modify build configuration
- **DO NOT**: Update documentation unrelated to this focus

### **Merge Strategy**
- Keep changes minimal and focused
- Test thoroughly before merging
- Coordinate with main development branch
- Document all changes in commit messages

### **Context Management**
- This worktree has independent Claude context
- Memory files are isolated from main development
- Use this for focused, time-limited development
- Merge back to main when objective complete

---
EOF
    
    # Create isolated memory context
    mkdir -p .claude/memory
    
    # Copy memory templates
    if [ -d "../${CURRENT_DIR}/.claude/memory-templates" ]; then
        cp -r "../${CURRENT_DIR}/.claude/memory-templates" .claude/
    fi
    
    # Create focused project context
    cat > .claude/memory/project_context.md << EOF
# Isolated Project Context - $branch_name
*Created: $(date)*

## Current Session Focus
- **Primary Goal**: $focus
- **Branch**: $branch_name
- **Isolation Level**: High (independent from main development)
- **Time Limit**: 2 hours maximum to prevent context poisoning

## Key Constraints
- Work ONLY on: $focus
- No refactoring outside scope
- No dependency changes
- Merge back when complete

## Success Criteria
- [ ] $focus is implemented correctly
- [ ] All tests pass
- [ ] No unrelated changes introduced
- [ ] Ready for merge to main

## Files in Scope
- [List specific files you'll modify]

## Files OUT OF SCOPE
- Build configuration
- Shared dependencies
- Unrelated features
- Documentation outside this feature

---
**Remember**: This is an isolated Claude session. Stay focused on single objective.
EOF
    
    echo "✅ Worktree created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. cd $worktree_path"
    echo "2. Start Claude Code in isolated environment"
    echo "3. Work only on: $focus"
    echo "4. When complete: git push origin $branch_name"
    echo "5. Create PR from $branch_name to main"
    echo "6. Run: ./scripts/create-worktree.sh remove $branch_name"
    echo ""
    echo "🔒 Isolation benefits:"
    echo "   - Independent Claude context (no poisoning)"
    echo "   - Parallel development without conflicts"
    echo "   - Focused scope prevents feature creep"
    echo "   - Easy cleanup when done"
}

# Function to list worktrees
list_worktrees() {
    echo "📝 Active worktrees:"
    git worktree list
    echo ""
    
    # Show Claude-specific worktree info
    git worktree list --porcelain | while read line; do
        if [[ $line == worktree* ]]; then
            worktree_path=$(echo "$line" | cut -d' ' -f2)
            if [ -f "$worktree_path/CLAUDE.md" ] && grep -q "WORKTREE ISOLATION" "$worktree_path/CLAUDE.md" 2>/dev/null; then
                echo "🤖 Claude-managed worktree: $worktree_path"
                if [ -f "$worktree_path/.claude/memory/project_context.md" ]; then
                    focus=$(grep "Primary Goal" "$worktree_path/.claude/memory/project_context.md" | cut -d':' -f2- | xargs)
                    echo "   Focus: $focus"
                fi
            fi
        fi
    done
}

# Function to remove worktree
remove_worktree() {
    local branch_name="$1"
    
    if [ -z "$branch_name" ]; then
        echo "❌ Error: Branch name required"
        show_usage
        exit 1
    fi
    
    local worktree_path="${BASE_DIR}${CURRENT_DIR}-${branch_name}"
    
    echo "🗑️  Removing worktree: $branch_name"
    
    # Check if worktree exists
    if ! git worktree list | grep -q "$worktree_path"; then
        echo "❌ Error: Worktree $worktree_path not found"
        exit 1
    fi
    
    # Check for uncommitted changes
    cd "$worktree_path"
    if ! git diff --quiet || ! git diff --cached --quiet; then
        echo "⚠️  Warning: Uncommitted changes detected"
        echo "   Current changes:"
        git status --porcelain
        echo ""
        read -p "Continue with removal? (y/N): " confirm
        if [[ $confirm != [yY] ]]; then
            echo "Removal cancelled"
            exit 0
        fi
    fi
    
    # Return to main directory
    cd "../${CURRENT_DIR}"
    
    # Remove the worktree
    git worktree remove "$worktree_path"
    
    # Ask about branch removal
    echo ""
    read -p "Delete branch $branch_name? (y/N): " delete_branch
    if [[ $delete_branch == [yY] ]]; then
        git branch -D "$branch_name"
        echo "✅ Branch $branch_name deleted"
    fi
    
    echo "✅ Worktree removed successfully"
}

# Function to switch to worktree
switch_worktree() {
    local branch_name="$1"
    
    if [ -z "$branch_name" ]; then
        echo "❌ Error: Branch name required"
        show_usage
        exit 1
    fi
    
    local worktree_path="${BASE_DIR}${CURRENT_DIR}-${branch_name}"
    
    if [ ! -d "$worktree_path" ]; then
        echo "❌ Error: Worktree $worktree_path not found"
        echo "Available worktrees:"
        list_worktrees
        exit 1
    fi
    
    echo "🔄 Switching to worktree: $branch_name"
    echo "   Path: $worktree_path"
    
    if [ -f "$worktree_path/.claude/memory/project_context.md" ]; then
        echo "   Focus: $(grep "Primary Goal" "$worktree_path/.claude/memory/project_context.md" | cut -d':' -f2- | xargs)"
    fi
    
    echo ""
    echo "Run: cd $worktree_path"
}

# Main command dispatcher
case "$1" in
    "create")
        create_worktree "$2" "$3"
        ;;
    "list")
        list_worktrees
        ;;
    "remove")
        remove_worktree "$2"
        ;;
    "switch")
        switch_worktree "$2"
        ;;
    *)
        show_usage
        exit 1
        ;;
esac